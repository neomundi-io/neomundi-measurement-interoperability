# NeoMundi Measurement Interoperability — Examples

This directory contains versioned examples for the NeoMundi Measurement Interoperability Contract.

Two distinct categories are intentionally preserved:

1. **historical signed RGC v0.1 observations**, produced by the NeoMundi runtime measurement infrastructure;
2. **illustrative RGC v0.2 fixtures**, used to demonstrate the corrected semantics of partial measurement and epistemic boundaries.

These two categories must not be confused.

---

# RGC v0.1 — Historical signed observations

The following files are real signed NeoMundi Measurement Interoperability Contract observations:

* `within-bounds-no-review.json`
* `flagged-review-required.json`

They were produced under:

```text
schema_version = 0.1.0
```

and include:

* a canonical SHA-256 payload hash;
* an Ed25519/JWS signature;
* a NeoMundi signer identity;
* a NeoMundi key identifier.

These files are retained **unchanged** for historical reproducibility.

Changing their contents would invalidate their payload hashes and cryptographic signatures.

RGC v0.2 therefore does not rewrite these observations retrospectively.

---

## `within-bounds-no-review.json`

This historical v0.1 observation contains:

```json
"observation_class": "within_bounds"
```

with:

```json
"review_recommendation": "not_indicated"
```

and preserves:

```json
"execution_permission_changed": false
```

The receiving infrastructure remains responsible for interpretation, policy and action.

### Historical limitation

This v0.1 record also demonstrates one of the semantic ambiguities that motivated RGC v0.2.

It contains:

```text
measurement_status = complete
measurement_coverage = 0.6
```

while all observed signals still contain numeric values.

Under the corrected v0.2 semantics, this combination would no longer be valid.

The original signed record is nevertheless retained exactly as produced.

It is evidence of the historical v0.1 contract state, not a representation of the corrected v0.2 semantics.

---

## `flagged-review-required.json`

This historical v0.1 observation contains:

```json
"observation_class": "flagged"
```

with:

```json
"review_recommendation": "required"
```

The contract includes review triggers and recommended review types while preserving:

```json
"execution_permission_changed": false
```

NeoMundi provides the measurement and advisory signal.

The receiving infrastructure decides what action, if any, should follow.

This record is also retained unchanged as a signed historical v0.1 artifact.

---

# RGC v0.2 — Illustrative fixtures

RGC v0.2 introduces corrected semantics for partial measurements and explicit epistemic boundaries.

Illustrative fixtures are stored under:

```text
fixtures/
```

These files are intended to demonstrate how a v0.2 contract should represent situations that could be ambiguous under v0.1.

They are **not live signed NeoMundi observations** unless explicitly stated otherwise.

Their integrity fields are illustrative placeholders and must not be interpreted as cryptographic evidence.

Production-valid v0.2 observations must be generated, hashed and signed by the canonical NeoMundi producer.

---

## Core epistemic invariant

RGC v0.2 is governed by the principle:

> **Absence of evidence is only meaningful over the measured domain.**

The contract must therefore distinguish between:

```text
MEASURED + NO SIGNAL
```

and:

```text
NOT MEASURED
INSUFFICIENT COVERAGE
```

An unmeasured signal must never be represented by an invented numeric value.

---

## Per-signal status

RGC v0.2 introduces explicit per-signal measurement states:

```text
measured
not_measured
insufficient_coverage
```

A signal with:

```text
status = measured
```

must contain a valid numeric value.

A signal with:

```text
status = not_measured
```

or:

```text
status = insufficient_coverage
```

must use:

```json
null
```

for its numeric value.

`null` must never be interpreted as:

```text
0.0
safe
normal
within_bounds
no risk
```

---

## Observation-level coverage

RGC v0.2 makes the relationship between measurement status and measurement coverage normative.

```text
measurement_status = complete
```

requires:

```text
measurement_coverage = 1.0
```

while:

```text
measurement_status = partial
```

requires:

```text
measurement_coverage < 1.0
```

A partially covered observation therefore cannot be represented as complete.

---

## Meaning of `within_bounds`

Under RGC v0.2:

```text
observation_class = within_bounds
```

means only:

> No threshold-crossing signal was detected within the measured domain.

It does not mean:

* all possible dimensions were measured;
* the system is globally safe;
* unmeasured signals are equivalent to zero;
* no issue exists outside the declared measurement boundary.

---

## Meaning of `flagged`

A partially covered observation may still legitimately be:

```text
observation_class = flagged
```

when a signal actually measured within the covered domain crosses an applicable threshold.

Partial coverage therefore does not prevent a positive finding.

It only limits the domain over which conclusions may be drawn.

---

## `fixtures/within-bounds-partial-measurement-v0.2.json`

This fixture demonstrates a partial observation with:

```text
measurement_status = partial
measurement_coverage = 0.6
```

It includes:

* measured signals;
* a `not_measured` signal;
* an `insufficient_coverage` signal;
* `null` values where no valid measurement exists;
* an observation classified as `within_bounds` only over the measured domain.

The fixture explicitly demonstrates that an absence of detected signal cannot be extended to unmeasured dimensions.

---

## `fixtures/flagged-partial-measurement-v0.2.json`

This fixture demonstrates that a partially covered observation may still legitimately contain:

```text
observation_class = flagged
```

when measured evidence supports that classification.

The fixture preserves the measured values from the historical observation while making explicit that:

* measurement coverage is partial;
* the flagged conclusion applies only to the measured domain;
* no conclusion is made about unmeasured dimensions.

---

# Temporal boundary

RGC v0.2 also makes the temporal scope explicit.

When:

```text
runtime_scope = single_request
```

the record describes one observation only.

A single observation cannot by itself establish:

* frequency;
* persistence;
* recurrence;
* trend;
* drift.

Those properties require comparison across a series of observations.

---

# Governance boundary

All versions preserve the same fundamental separation:

```text
NeoMundi measurement
        ↓
verifiable contract
        ↓
────────────────────────
    consumer boundary
────────────────────────
        ↓
consumer interpretation
        ↓
consumer policy
        ↓
consumer decision
        ↓
consumer action
```

The contract never grants or removes execution authority.

The invariant remains:

```json
{
  "execution_permission_changed": false
}
```

NeoMundi provides the measurement signal and its verifiable trace.

**The consuming infrastructure retains interpretation, policy, decision and action.**

---

# Versioning principle

RGC v0.2 is introduced as a new schema version rather than as a silent correction of RGC v0.1.

This preserves:

* falsifiability;
* historical reproducibility;
* cryptographic integrity;
* compatibility with existing signed artifacts;
* explicit evolution of the interoperability contract.

Historical artifacts remain historical artifacts.

New semantics are introduced through a new version.

---

For the full specification, see the repository [README](../README.md).

For the independent consumer implementation, see [consumer-reference](../consumer-reference/README.md).
