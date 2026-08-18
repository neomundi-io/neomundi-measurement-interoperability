"""Consumer reference — sovereignty check.

Independently confirms a received contract carries no raw prompt/response
text and no unpseudonymized provider identity — the two hard guarantees of
the published contract specification's "data explicitly forbidden in the
contract" clause. NeoMundi already enforces this server-side (schema
pattern on `identity.model`, no `llm_prompt`/`llm_response` fields ever
declared) — a real consumer would still run this as defense-in-depth
before trusting or storing a contract, which is exactly what this module
demonstrates.
"""

from __future__ import annotations

import json
import re
from typing import Any

_RAW_TEXT_PATTERN = re.compile(r'"(llm_prompt|llm_response)"\s*:\s*"')
_PSEUDONYMIZED_MODEL_PATTERN = re.compile(r"^(local|model-[0-9a-f]{12})$")


def check_sovereignty(contract: dict[str, Any]) -> list[str]:
    """Returns a list of violations (empty = compliant)."""
    violations: list[str] = []
    serialized = json.dumps(contract)

    if _RAW_TEXT_PATTERN.search(serialized):
        violations.append("Raw llm_prompt/llm_response text found in contract.")

    model = contract.get("identity", {}).get("model", "")
    if not _PSEUDONYMIZED_MODEL_PATTERN.match(model):
        violations.append(f"identity.model is not pseudonymized/local: {model!r}")

    execution_changed = (
        contract.get("governance", {})
        .get("governance_boundary", {})
        .get("execution_permission_changed")
    )
    if execution_changed is not False:
        violations.append(
            f"governance_boundary.execution_permission_changed is not False: {execution_changed!r}"
        )

    return violations
