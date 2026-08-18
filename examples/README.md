# NeoMundi Measurement Interoperability — Examples

This directory contains real signed NeoMundi Measurement Interoperability Contract examples produced by the NeoMundi runtime measurement infrastructure.

Each example follows the same contract structure and responsibility boundary.

The difference lies in the **measured state** and the **advisory signal** returned to the consuming infrastructure.

---

## Examples

### `within-bounds-no-review.json`

Example of a runtime observation classified as:

```json
"observation_class": "within_bounds"
```

with:

```json
"review_recommendation": "not_indicated"
```

The contract still preserves the same governance boundary:

```json
"execution_permission_changed": false
```

The receiving infrastructure remains responsible for interpretation, policy and action.

---

### `flagged-review-required.json`

Example of a runtime observation classified as:

```json
"observation_class": "flagged"
```

with:

```json
"review_recommendation": "required"
```

The contract includes review triggers and recommended review types, while preserving the same invariant:

```json
"execution_permission_changed": false
```

NeoMundi provides the measurement and advisory signal.

The receiving infrastructure decides what action, if any, should follow.

---

## Same contract, different measured state

```text
within_bounds
      ↓
review not indicated
      ↓
consumer remains in control


flagged
      ↓
review required
      ↓
consumer remains in control
```

The contract format does not change according to the operational policy of the receiving system.

**NeoMundi measures. Your infrastructure decides.**

---

For the full specification, see the repository [README](../README.md).
