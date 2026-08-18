"""RGC consumer reference — validate a contract against the published JSON Schema."""

from __future__ import annotations

from typing import Any

import httpx
import jsonschema


def fetch_schema(base_url: str, *, timeout: float = 10.0) -> dict[str, Any]:
    resp = httpx.get(f"{base_url.rstrip('/')}/v1/rgc/schema", timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def validate_contract(contract: dict[str, Any], schema: dict[str, Any]) -> list[str]:
    """Returns a list of human-readable error strings (empty = valid)."""
    validator_cls = jsonschema.validators.validator_for(schema)
    validator_cls.check_schema(schema)
    validator = validator_cls(schema)

    errors = []
    for err in sorted(validator.iter_errors(contract), key=lambda e: list(e.path)):
        location = "/".join(str(p) for p in err.path) or "<root>"
        errors.append(f"{location}: {err.message}")
    return errors
