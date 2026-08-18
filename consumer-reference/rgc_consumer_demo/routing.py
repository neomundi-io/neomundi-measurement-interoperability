"""Consumer reference — one worked example of a consumer-defined routing policy.

Reference implementation of an example consumer-defined routing policy:
"route to human review according to a consumer-declared rule (e.g.
review_recommendation = required -> pause + escalate)."

This is an EXAMPLE of the CONSUMER's own business rule — theirs to define.
NeoMundi measures; it does not decide what a consumer does with the
measurement, and does not mandate this policy. This module is a worked
example proving the contract carries enough information for such a rule to
be written — not a rule NeoMundi imposes on every consumer.

Crucially: this function only ever reads `governance.advisory` (a
recommendation) — it never touches, and cannot touch,
`governance_boundary.execution_permission_changed`.
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
    """Example consumer policy only — not a rule imposed by NeoMundi.

    A real consumer is free to implement any policy of their own; this one
    is provided purely to demonstrate that the contract carries enough
    information to support such a decision.
    """
    advisory = contract["governance"]["advisory"]
    recommendation = advisory["review_recommendation"]
    trigger = advisory.get("review_trigger", [])

    if recommendation == "required":
        return RoutingDecision(
            action=RoutingAction.PAUSE_AND_ESCALATE,
            reason="review_recommendation=required -> pausing pending human review, per example consumer policy.",
            review_recommendation=recommendation,
            review_trigger=trigger,
        )
    if recommendation == "recommended":
        return RoutingDecision(
            action=RoutingAction.FLAG_FOR_REVIEW,
            reason="review_recommendation=recommended -> flagged for asynchronous review, execution continues.",
            review_recommendation=recommendation,
            review_trigger=trigger,
        )
    return RoutingDecision(
        action=RoutingAction.PROCEED,
        reason="review_recommendation=not_indicated -> no review signal, proceeding.",
        review_recommendation=recommendation,
        review_trigger=trigger,
    )
