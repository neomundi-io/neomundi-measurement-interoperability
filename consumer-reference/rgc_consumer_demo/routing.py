"""Consumer reference — one worked example of a consumer-defined routing policy.

Reference implementation of an example consumer-defined routing policy:
"route to human review according to a consumer-declared rule (e.g.
review_recommendation = required -> pause + escalate)."

This is an EXAMPLE of the CONSUMER's own business rule — theirs to define.
NeoMundi measures; it does not decide what a consumer does with the
measurement, and does not mandate this policy.

This module demonstrates that the interoperability contract carries enough
information for a consumer-defined action policy to be implemented without
granting NeoMundi execution authority.

Epistemic boundary:

- a routing decision is not a statement that the AI system is safe;
- `not_indicated` means only that this consumer policy does not indicate
  review for this observation;
- it does not mean that every possible dimension was measured;
- it does not turn absence of evidence outside the measured domain into
  evidence of absence;
- temporal properties such as persistence, recurrence, trend or drift cannot
  be inferred from a single_request record alone.

Crucially, this function reads only `governance.advisory`, which is a
non-binding recommendation. It never changes or derives execution authority
from `governance.governance_boundary.execution_permission_changed`.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum
from typing import Any


class RoutingAction(str, Enum):
    PROCEED = "proceed"
    FLAG_FOR_REVIEW = "flag_for_review"
    PAUSE_AND_ESCALATE = "pause_and_escalate"


@dataclass
class RoutingDecision:
    action: RoutingAction
    reason: str
    review_recommendation: str
    review_trigger: list[str] = field(default_factory=list)


def route(contract: dict[str, Any]) -> RoutingDecision:
    """Apply one example consumer-defined routing policy.

    This function intentionally does not reinterpret NeoMundi measurement
    scores or create new measurement conclusions.

    It consumes only the advisory recommendation already present in the
    contract and maps that recommendation to an example consumer action.

    The resulting action must not be interpreted as a NeoMundi authorization
    decision, certification, safety determination, or statement about
    unmeasured dimensions.
    """
    advisory = contract["governance"]["advisory"]
    recommendation = advisory["review_recommendation"]
    trigger = advisory.get("review_trigger", [])

    if recommendation == "required":
        return RoutingDecision(
            action=RoutingAction.PAUSE_AND_ESCALATE,
            reason=(
                "review_recommendation=required -> pausing pending human "
                "review under this example consumer-defined policy. "
                "This action does not alter NeoMundi's measurement boundary "
                "or constitute a NeoMundi execution decision."
            ),
            review_recommendation=recommendation,
            review_trigger=trigger,
        )

    if recommendation == "recommended":
        return RoutingDecision(
            action=RoutingAction.FLAG_FOR_REVIEW,
            reason=(
                "review_recommendation=recommended -> flagged for "
                "asynchronous review under this example consumer-defined "
                "policy; execution continues. This does not imply any "
                "conclusion beyond the measured domain."
            ),
            review_recommendation=recommendation,
            review_trigger=trigger,
        )

    return RoutingDecision(
        action=RoutingAction.PROCEED,
        reason=(
            "review_recommendation=not_indicated -> this example consumer "
            "policy does not indicate review for this observation, so it "
            "proceeds. This is not a safety certification, does not imply "
            "complete measurement, and makes no claim about unmeasured "
            "dimensions."
        ),
        review_recommendation=recommendation,
        review_trigger=trigger,
    )
