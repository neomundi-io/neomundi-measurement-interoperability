"""Consumer reference — orchestrates validate -> sovereignty -> verify -> route -> store.

This is the single entry point a third-party consumer would call for every
contract it receives (via webhook, API pull, file drop — the transport is
out of scope, this module starts from an already-received `dict`). Uses
ONLY public endpoints (GET /v1/rgc/schema, GET /v1/rgc/jwks) — no NeoMundi
API key required, matching how a real external consumer operates.

`schema`/`jwks` can be passed in directly (already fetched/cached, or
loaded from a local file for a fully offline run) — `base_url` is only
needed as a fallback to fetch them live.
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from typing import Any, Optional

from .routing import RoutingDecision, route
from .sovereignty import check_sovereignty
from .storage import ConsumerReceipt, ReceiptStore
from .validate import fetch_schema, validate_contract
from .verify import fetch_jwks, verify_contract


class ContractRejected(Exception):
    """Raised when a contract fails schema validation, sovereignty check, or
    integrity verification. A consumer should NEVER act on a rejected
    contract — reject, log, and move on."""


@dataclass
class ProcessResult:
    receipt: ConsumerReceipt
    routing: RoutingDecision


def process_contract(
    contract: dict[str, Any],
    *,
    base_url: Optional[str] = None,
    schema: Optional[dict[str, Any]] = None,
    jwks: Optional[dict[str, Any]] = None,
    store: Optional[ReceiptStore] = None,
) -> ProcessResult:
    if schema is None:
        if base_url is None:
            raise ValueError("Provide either `schema` or `base_url`.")
        schema = fetch_schema(base_url)
    if jwks is None:
        if base_url is None:
            raise ValueError("Provide either `jwks` or `base_url`.")
        jwks = fetch_jwks(base_url)

    schema_errors = validate_contract(contract, schema)
    if schema_errors:
        raise ContractRejected(f"Schema validation failed: {schema_errors}")

    sovereignty_violations = check_sovereignty(contract)
    if sovereignty_violations:
        raise ContractRejected(f"Sovereignty check failed: {sovereignty_violations}")

    verification = verify_contract(contract, jwks)
    if not verification.valid:
        raise ContractRejected(
            f"Integrity verification failed: hash_match={verification.hash_match}, "
            f"signature_valid={verification.signature_valid}"
        )

    routing_decision = route(contract)

    receipt = ConsumerReceipt(
        request_id=contract["identity"]["request_id"],
        schema_version=contract["identity"]["schema_version"],
        payload_hash=contract["integrity"]["payload_hash"],
        key_id=contract["integrity"]["key_id"],
        hash_match=verification.hash_match,
        signature_valid=verification.signature_valid,
        routing_action=routing_decision.action.value,
        routing_reason=routing_decision.reason,
        received_at=time.time(),
        contract_json=json.dumps(contract),
    )
    if store is not None:
        store.save(receipt)

    return ProcessResult(receipt=receipt, routing=routing_decision)
