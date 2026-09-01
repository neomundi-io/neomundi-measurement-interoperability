# NeoMundi Measurement Interoperability

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [NeoMundi](https://neomundi.io) · [Live Demo](https://interop.neomundi.org/) · [API](https://api.neomundi.io)

> **Public interoperability specification for transporting signed, versioned and independently verifiable NeoMundi runtime measurement signals across independent systems.**

---

**What is it?**
A public contract for transporting a NeoMundi AI runtime measurement from one system to another in a signed, versioned and verifiable JSON format.

**What is it for?**
It allows an independent infrastructure to receive a NeoMundi measurement, verify its integrity and provenance, understand its measurement boundary, and decide what to do with it according to its own policy.

**Who is it for?**
Cloud platforms, AI systems, agents, governance tools, observability systems, audit infrastructures, monitoring platforms and any system that needs to consume NeoMundi measurements without depending on NeoMundi's internal measurement engine.

**How do I use it?**
Generate or receive a NeoMundi measurement contract, validate it against the schema version it declares, independently verify its cryptographic integrity, then apply your own interpretation and policy.

**This contract is not being developed in isolation. It is being challenged, tested and strengthened through independent contributors and pilot infrastructures — see [Contributors & Collective Development](./CONTRIBUTORS.md).**

```text
AI system
    ↓
NeoMundi measures
    ↓
signed interoperability contract
    ↓
your system verifies it
    ↓
your system interprets it
    ↓
your system decides what to do
```

**NeoMundi measures. Your infrastructure decides.**

[Examples](./examples/) · [Reference Consumer](./consumer-reference/)

---

# Principle

NeoMundi provides a **runtime measurement signal** and its **verifiable trace**.

The infrastructure receiving that signal retains control over:

* interpretation;
* policy;
* decision;
* action.

The interoperability contract standardizes the **interface between measurement and consumption**.

It does not standardize, disclose or prescribe:

* NeoMundi's internal measurement implementation;
* the consumer's policy engine;
* the consumer's thresholds;
* the consumer's enforcement mechanisms;
* partner-specific internal architecture.

**Public interoperability does not mean public implementation.**

```text
NeoMundi
measurement
    ↓
PUBLIC INTEROPERABILITY LAYER
signed contract
schema
validation
verification
    ↓
────────────────────────────
consumer boundary
────────────────────────────
    ↓
PRIVATE / PARTNER-SPECIFIC LAYER
interpretation
policy
thresholds
decision
action
```

**Open interface ≠ open implementation.**

---

# 1. Why this contract exists

An AI system can be measured by NeoMundi without requiring the receiving infrastructure to depend on NeoMundi's internal code.

The **NeoMundi Measurement Interoperability Contract** provides a representation that is:

* structured;
* versioned;
* cryptographically signed;
* independently verifiable;
* machine-consumable;
* explicit about its measurement boundary.

It enables an external infrastructure to:

* validate the contract structure;
* verify the schema version;
* verify payload integrity;
* verify the cryptographic signature;
* correlate an observation across systems;
* consume the measurement signals;
* understand measurement limitations;
* distinguish measured from unmeasured dimensions;
* apply its own governance rules;
* retain an auditable proof record.

The contract defines **what the signal means and how it may be safely consumed**.

It does not require reconstruction of the internal NeoMundi measurement engine.

---

# 2. Contract structure

The contract contains five main sections:

```text
identity
provenance
observation
governance
integrity
```

---

## `identity`

Used to identify and correlate the observation across systems.

It includes information such as:

* schema version;
* request identifier;
* trace identifier;
* timestamp;
* system identifier;
* pseudonymized model identifier;
* runtime mode.

The model must be pseudonymized or represented as:

```text
local
```

Raw provider/model identifiers are not transported.

---

## `provenance`

Describes the technical provenance of the measurement.

It may include:

* measurement version;
* normalizer version;
* number of checks emitted;
* source batch identifier;
* canonicalization method.

This provenance layer does not expose the raw conversational or business content processed by the AI system.

---

## `observation`

Contains the runtime measurement observation.

It includes:

* measurement status;
* measurement coverage;
* measured signal values;
* per-signal measurement status;
* observation classification;
* confidence;
* limitations;
* measurement boundary;
* runtime scope.

A NeoMundi observation is a **bounded measurement signal**.

It is not a universal verdict on the observed system.

---

## `governance`

Contains non-binding advisory information that a consumer may choose to use as an input to its own policy.

A recommendation or review signal:

* is not an execution authorization;
* does not replace the consumer's policy;
* does not automatically trigger an action imposed by NeoMundi.

The receiving infrastructure decides what operational meaning, if any, it assigns to the signal.

---

## `integrity`

Contains the elements required for independent verification:

* SHA-256 payload fingerprint;
* canonicalization information;
* Ed25519/JWS cryptographic signature;
* signer identity;
* `key_id`.

---

# 3. Epistemic boundary — RGC v0.2

RGC v0.2 introduces explicit rules preventing a measurement from saying more than was actually observed.

The central principle is:

> **Absence of evidence is only meaningful over the measured domain.**

A contract must distinguish between:

```text
MEASURED + NO SIGNAL
```

and:

```text
NOT MEASURED
INSUFFICIENT COVERAGE
```

An unmeasured signal must never be represented by an invented reassuring value.

---

## Per-signal measurement status

RGC v0.2 introduces explicit states for each measured signal:

```text
measured
not_measured
insufficient_coverage
```

If a signal is:

```text
measured
```

its value must be numeric.

If a signal is:

```text
not_measured
```

or:

```text
insufficient_coverage
```

its value must be:

```json
null
```

`null` must never be interpreted as:

```text
0.0
safe
normal
within_bounds
no risk
```

---

# 4. Measurement coverage

RGC v0.2 makes the relationship between observation status and measurement coverage normative.

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

A partially covered observation cannot be represented as complete.

Measurement coverage refers to the fraction of the **declared measurement boundary** that was covered.

It must not automatically be interpreted as the percentage of individual signal fields that were measured.

---

# 5. Meaning of `within_bounds`

Under RGC v0.2:

```text
observation_class = within_bounds
```

means:

> No applicable threshold-crossing signal was detected within the measured domain.

It does **not** mean:

* every possible dimension was measured;
* the system is globally safe;
* unmeasured dimensions contain no issue;
* unmeasured signals equal zero;
* the observation constitutes a safety certification.

The meaning is explicitly bounded by the measurement domain.

---

# 6. Meaning of `flagged`

A partially covered observation may legitimately be:

```text
observation_class = flagged
```

when a signal actually measured within the covered domain supports that classification.

Partial measurement therefore limits the **scope of inference**, not the ability to report evidence that was actually observed.

---

# 7. `not_assessed`

RGC v0.2 also supports:

```text
observation_class = not_assessed
```

when the available measured evidence is insufficient to support either:

```text
within_bounds
```

or:

```text
flagged
```

This prevents insufficient measurement from being silently converted into a reassuring classification.

---

# 8. Temporal boundary

A contract with:

```text
runtime_scope = single_request
```

describes one runtime observation.

A single observation cannot by itself establish:

* frequency;
* persistence;
* recurrence;
* trend;
* drift.

These properties require comparison across a series of observations.

A `single_request` record must therefore never be interpreted as evidence of temporal behavior that it does not measure.

---

# 9. Responsibility boundary

One of the fundamental invariants of the contract is:

```json
{
  "execution_permission_changed": false
}
```

A NeoMundi measurement does not silently grant, remove or modify execution permission.

The separation is explicit:

```text
NeoMundi
    ↓
runtime measurement
    ↓
verifiable signal
    ↓
────────────────────────────
system boundary
────────────────────────────
    ↓
consumer interpretation
    ↓
consumer policy
    ↓
consumer decision
    ↓
consumer action
```

NeoMundi does not need access to the consumer's proprietary:

* policy engine;
* thresholds;
* routing logic;
* decision system;
* enforcement architecture.

The consumer retains those components under its own governance and security model.

---

# 10. Data sovereignty

The interoperability contract is designed to avoid transporting raw conversational or business content.

It does not contain:

* raw user prompts;
* raw model responses;
* raw provider/model identifiers.

The consumer can independently verify these constraints before storing or acting upon a contract.

The contract also does not require disclosure of:

* proprietary policies;
* private thresholds;
* decision rules;
* enforcement mechanisms;
* partner-specific governance architecture;
* confidential implementation details.

The public contract therefore concerns the **shared interface**, not the private internal logic of participating systems.

---

# 11. Public endpoints

## JSON Schema

The public contract schema can be retrieved through:

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

The repository also contains versioned schema files, including:

```text
schema/contract-v0.1.schema.json
schema/contract-v0.2.schema.json
```

A consumer must validate a contract against the exact schema version declared by:

```text
identity.schema_version
```

A consumer must never silently process a v0.2 contract under v0.1 semantics, or vice versa.

The exact API mechanism for retrieving multiple historical schema versions should be treated as a versioned API contract and must not be assumed unless explicitly published.

---

## Public verification keys

Public keys required for cryptographic verification are exposed through JWKS:

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

The field:

```text
integrity.key_id
```

identifies the key used for verification.

Retrieving the schema and public verification keys does not require access to NeoMundi's internal measurement engine.

---

# 12. Obtain a contract

From an existing NeoMundi observation:

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

A production contract is expected to be:

* JSON-based;
* versioned;
* integrity-fingerprinted;
* cryptographically signed.

---

# 13. Consumer workflow

A standard integration follows these steps:

```text
1. Receive
2. Match schema version
3. Validate
4. Check sovereignty boundaries
5. Verify integrity
6. Interpret
7. Apply consumer policy
8. Retain receipt
```

---

## Step 1 — Receive

The consumer receives a JSON interoperability contract corresponding to a NeoMundi observation.

---

## Step 2 — Match schema version

The consumer verifies:

```text
contract.identity.schema_version == schema.version
```

A version mismatch should cause rejection before interpretation.

---

## Step 3 — Validate

The contract is validated against the corresponding JSON Schema.

Under v0.2, validation can enforce:

* `complete` ↔ full coverage consistency;
* `partial` ↔ incomplete coverage consistency;
* per-signal measurement status;
* numeric values only for measured signals;
* `null` for unmeasured or insufficiently covered signals.

---

## Step 4 — Check sovereignty constraints

The consumer independently checks that prohibited raw content and unauthorized execution semantics are absent.

---

## Step 5 — Verify integrity

The consumer independently verifies:

* SHA-256 fingerprint;
* Ed25519/JWS signature;
* verification key;
* signed metadata claims.

The reference verifier checks the signed claim set:

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

The JWS `kid`, when present, must correspond to:

```text
integrity.key_id
```

---

## Step 6 — Interpret

The infrastructure reads:

* the measured values;
* signal measurement status;
* measurement coverage;
* limitations;
* measurement boundary;
* advisory information.

Interpretation must remain bounded by the actual measured domain.

---

## Step 7 — Apply consumer policy

The consumer determines the appropriate action.

For example:

```text
review_recommendation = required
            ↓
       pause workflow
            ↓
        human review
```

This is a **consumer-defined policy example**.

It is not imposed by NeoMundi.

Another infrastructure may choose:

```text
signal
    ↓
logging only
```

or:

```text
signal
    ↓
increased monitoring
```

or:

```text
signal
    ↓
rerouting
```

The contract remains the measurement interface.

The policy belongs to the consumer.

---

## Step 8 — Retain an auditable receipt

A consumer may retain:

* request ID;
* schema version;
* payload hash;
* verification key;
* integrity verification result;
* signature verification result;
* consumer routing decision;
* decision rationale;
* processing timestamp;
* complete received contract.

This preserves a versioned audit trail.

---

# 14. Reference consumer

NeoMundi provides an independent reference consumer demonstrating how a third-party system can process a contract.

The reference flow is:

```text
contract
    ↓
schema-version check
    ↓
JSON Schema validation
    ↓
sovereignty checks
    ↓
SHA-256 verification
    ↓
Ed25519/JWS + signed-claims verification
    ↓
consumer-defined policy
    ↓
auditable receipt
```

The reference implementation is independent from NeoMundi's producer code.

It does not reproduce the internal measurement engine.

It demonstrates only a generic interoperability pattern.

A partner may keep entirely private:

* interpretation logic;
* policy engine;
* thresholds;
* decision logic;
* routing mechanisms;
* enforcement mechanisms;
* governance architecture;
* intellectual property.

See:

[Reference Consumer](./consumer-reference/README.md)

---

# 15. Historical v0.1 offline demonstration

The existing offline demonstration uses the original signed RGC v0.1 observations.

From:

```text
consumer-reference/
```

run:

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

The historical demonstration uses:

* two signed v0.1 contracts from `../examples/`;
* `../schema/contract-v0.1.schema.json`;
* the local public JWKS fixture.

Expected historical result:

```text
hash_match=True
signature_valid=True
```

The signed v0.1 examples are retained unchanged for reproducibility.

They must not be retrospectively rewritten to comply with v0.2 because modifying them would invalidate their original payload hashes and signatures.

---

# 16. RGC v0.2 fixtures

Illustrative v0.2 fixtures are stored in:

```text
examples/fixtures/
```

They demonstrate corrected semantics such as:

```text
partial measurement
+
measured signals
+
not_measured signals
+
insufficient_coverage
```

and:

```text
partial measurement
+
flagged evidence within measured domain
```

These fixtures illustrate the schema and semantics.

Unless explicitly generated and signed by the canonical NeoMundi producer, they must not be represented as live cryptographically valid NeoMundi observations.

Production-valid v0.2 observations must be generated, hashed and signed by the canonical producer.

---

# 17. Standards used

NeoMundi reuses established standards where appropriate.

---

## JSON Schema

The contract uses:

**JSON Schema Draft 2020-12**

The schema provides machine-readable structural and semantic validation.

---

## W3C Trace Context

Cross-system correlation uses a trace identifier compatible with the shape defined by **W3C Trace Context**.

This allows correlation with external tracing systems without replacing their internal tracing mechanisms.

---

## SHA-256

A canonical JSON representation is used to calculate a SHA-256 fingerprint of the payload.

The fingerprint detects modification.

It must not be confused with the signature itself.

---

## JWS / Ed25519

The contract uses:

* **JSON Web Signature — RFC 7515**;
* **Ed25519**;
* public key representation in **JWK** format.

The signature enables independent verification of origin and integrity.

---

## CloudEvents

The structure reuses some general CloudEvents principles around:

* identity;
* source;
* time;
* event type.

The contract keeps NeoMundi-specific field names.

**NeoMundi does not claim full compliance with the CloudEvents envelope.**

---

# 18. Integrity model

A valid production contract requires both:

```text
SHA-256 fingerprint
+
Ed25519/JWS signature
```

There is no valid hash-only fallback mode.

If the required cryptographic signature cannot be produced, a valid signed production contract must not be emitted.

The signed metadata includes:

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

A consumer should verify both cryptographic validity and consistency between these claims and the contract received.

---

# 19. Versioning

The contract format is explicitly versioned.

## RGC v0.1

RGC v0.1 remains available for:

* historical reproducibility;
* verification of existing signed observations;
* compatibility with existing pilot artifacts.

Signed v0.1 observations remain unchanged.

Their original semantics are preserved as historical facts.

---

## RGC v0.2

RGC v0.2 introduces corrected semantics for:

* partial measurement;
* per-signal measurement state;
* nullable unmeasured signals;
* measured-domain interpretation;
* consistency between coverage and measurement status;
* explicit temporal limits for `single_request`.

Core invariant:

> **Absence of evidence is only meaningful over the measured domain.**

RGC v0.2 is introduced as a new version instead of silently rewriting v0.1.

This preserves:

* historical reproducibility;
* falsifiability;
* cryptographic integrity;
* explicit protocol evolution.

---

# 20. What this contract does not do

The NeoMundi Measurement Interoperability Contract does not:

* grant execution authorization;
* revoke execution authorization;
* replace the consumer's policy engine;
* decide on behalf of a third-party infrastructure;
* certify third-party data;
* certify an AI system as globally safe;
* make claims beyond the measured domain;
* convert unmeasured evidence into reassuring values;
* infer drift from a single observation;
* require access to NeoMundi's internal code;
* disclose internal measurement formulas;
* transport raw prompts or responses;
* impose one universal routing policy;
* require disclosure of partner policy;
* require disclosure of partner thresholds;
* require publication of decision or enforcement logic;
* transfer control or ownership of partner intellectual property.

It is a **verifiable interface between runtime measurement and the systems that consume that measurement**.

---

# 21. Integration pattern

The same measurement primitive can be used by multiple infrastructures:

```text
                    NeoMundi
                       ↓
               runtime measurement
                       ↓
             interoperable contract
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 Observability     Governance        Audit
        ↓              ↓              ↓
     logging          policy        retention
        ↓              ↓              ↓
     analysis         action        evidence
```

The measurement layer remains the same.

Applications can differ.

Each consuming infrastructure retains its own downstream implementation.

---

# 22. Public interface, private implementation

NeoMundi deliberately separates **interoperability** from **implementation disclosure**.

The public layer may include:

* contract structure;
* field semantics;
* versioning rules;
* validation rules;
* verification mechanisms;
* public verification keys;
* approved examples;
* illustrative fixtures;
* generic reference-consumer behavior.

The private layer may include:

* internal NeoMundi measurement implementation;
* proprietary governance logic;
* consumer policy engines;
* thresholds;
* decision rules;
* routing strategies;
* enforcement mechanisms;
* confidential partner architecture;
* unpublished intellectual property.

This enables independent systems to interoperate without requiring either side to expose its internal machinery.

**Open interface. Independent implementation.**

---

# 23. Status

The interoperability contract currently contains:

```text
RGC v0.1 — historical signed pilot contract
RGC v0.2 — corrected versioned interoperability semantics
```

The format may continue to evolve.

Any change intended for automated consumption should remain explicitly versioned.

Historical signed artifacts must remain immutable.

---

## NeoMundi

**Fundamental runtime measurement layer for AI systems.**

One measurement primitive. Multiple applications. Multiple infrastructures.

**NeoMundi provides the signal. You retain control.**

---

© 2026 NeoMundi / Louis M Sàrl — All rights reserved.

Open-source licensing is planned for a future release.
