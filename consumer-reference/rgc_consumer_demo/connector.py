"""Consumer reference — orchestrates validate -> sovereignty -> verify -> route -> store.

This is the single entry point a third-party consumer would call for every
contract it receives (via webhook, API pull, file drop — the transport is
out of scope, this module starts from an already-received `dict`).

Uses only public interoperability material:

- the published RGC JSON Schema;
- the published NeoMundi JWKS.

No NeoMundi API key is required, matching how a real external consumer
operates.

`schema` and `jwks` can be passed directly (already fetched/cached, or
loaded from local files for a fully offline run). `base_url` is only needed
as a fallback to fetch them live.

Version boundary
----------------

A contract MUST be validated against the schema version it explicitly
declares.

A consumer must never silently validate a contract produced under one
schema version against another schema version. This becomes especially
important from RGC v0.2 onward because the schema carries normative
epistemic constraints for partial measurements and unmeasured signals.

Epistemic boundary
------------------

Successful processing means only that:

1. the contract conforms to its declared interoperability schema;
2. the sovereignty boundary is respected;
3. its cryptographic integrity is valid;
4. the example consumer policy has produced a routing decision.

It does NOT mean that the AI system is safe, that every dimension was
measured, or that any conclusion extends beyond the declared measurement
boundary.
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
    """Raised when a contract cannot be safely consumed.

    Rejection may result from:

    - schema-version mismatch;
    - schema validation failure;
    - sovereignty-boundary violation;
    - integrity-verification failure.

    A consumer should NEVER act on a rejected contract.
    Reject it, log the reason, and stop processing that record.
    """


@dataclass
class ProcessResult:
    receipt: ConsumerReceipt
    routing: RoutingDecision


def _assert_schema_version_matches(
    contract: dict[str, Any],
    schema: dict[str, Any],
) -> None:
    """Reject a contract if its declared schema version does not match.

    The contract declares its interoperability version at:

        identity.schema_version

    The published schema declares its version at:

        version

    These values must be identical.

    This prevents a consumer from accidentally validating, interpreting,
    or routing a v0.2 contract using v0.1 semantics, or vice versa.
    """
    try:
        contract_version = contract["identity"]["schema_version"]
    except (KeyError, TypeError):
        raise ContractRejected(
            "Schema version check failed: "
            "contract.identity.schema_version is missing."
        )

    schema_version = schema.get("version")
    if schema_version is None:
        raise ContractRejected(
            "Schema version check failed: "
            "the supplied schema does not declare a top-level `version`."
        )

    if contract_version != schema_version:
        raise ContractRejected(
            "Schema version mismatch: "
            f"contract declares {contract_version!r}, "
            f"but supplied schema is {schema_version!r}."
        )


def process_contract(
    contract: dict[str, Any],
    *,
    base_url: Optional[str] = None,
    schema: Optional[dict[str, Any]] = None,
    jwks: Optional[dict[str, Any]] = None,
    store: Optional[ReceiptStore] = None,
) -> ProcessResult:
    """Validate, verify, interpret and optionally store one RGC contract.

    Processing order is intentionally strict:

        schema acquisition
        -> schema-version match
        -> schema validation
        -> sovereignty check
        -> cryptographic verification
        -> consumer-defined routing
        -> consumer receipt

    No routing decision is produced before all interoperability and
    integrity checks have passed.
    """

    if schema is None:
        if base_url is None:
            raise ValueError("Provide either `schema` or `base_url`.")
        schema = fetch_schema(base_url)

    if jwks is None:
        if base_url is None:
            raise ValueError("Provide either `jwks` or `base_url`.")
        jwks = fetch_jwks(base_url)

    # A contract must always be interpreted under the exact schema version
    # it declares. Never silently cross-validate schema versions.
    _assert_schema_version_matches(contract, schema)

    schema_errors = validate_contract(contract, schema)
    if schema_errors:
        raise ContractRejected(
            f"Schema validation failed: {schema_errors}"
        )

    sovereignty_violations = check_sovereignty(contract)
    if sovereignty_violations:
        raise ContractRejected(
            f"Sovereignty check failed: {sovereignty_violations}"
        )

    verification = verify_contract(contract, jwks)
    if not verification.valid:
        raise ContractRejected(
            "Integrity verification failed: "
            f"hash_match={verification.hash_match}, "
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

    return ProcessResult(
        receipt=receipt,
        routing=routing_decision,
    )
