# NeoMundi Measurement Interoperability

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [NeoMundi](https://neomundi.io) · [API](https://api.neomundi.io)

> **Public interoperability specification for transporting signed, versioned and verifiable NeoMundi runtime measurement signals across independent systems.**

---

## Principle

NeoMundi provides a **runtime measurement signal** and its **verifiable trace**.

The infrastructure receiving that signal retains full control over:

* interpretation;
* policy;
* decision;
* action.

**NeoMundi measures. Your infrastructure decides.**

---

## Why this contract exists

An AI system can be measured by NeoMundi without requiring the infrastructure consuming that measurement to depend on NeoMundi's internal code.

The **NeoMundi Measurement Interoperability Contract** provides a JSON representation that is:

* structured;
* versioned;
* cryptographically signed;
* independently verifiable;
* machine-consumable by third-party systems.

It enables an external infrastructure to:

* validate the contract structure;
* verify its integrity;
* verify its cryptographic signature;
* correlate the observation across systems;
* read measurement signals and their limitations;
* apply its own governance rules;
* retain an auditable proof record.

---

## Architecture

```text
AI system
    ↓
NeoMundi runtime measurement
    ↓
Signed interoperability contract
    ↓
Third-party infrastructure
    ↓
Interpretation
    ↓
Policy
    ↓
Decision / Action
```

The contract transports the **measurement**.

It does not transfer control of the system to NeoMundi.

---

# 1. What the contract carries

The contract is organized around five main sections:

```text
identity
provenance
observation
governance
integrity
```

## `identity`

Used to identify and correlate the observation across multiple systems.

The model is represented in pseudonymized form or as:

```text
local
```

Raw provider model identifiers are not transported.

---

## `provenance`

Describes the origin and technical context of the measurement without exposing the raw content processed by the AI system.

---

## `observation`

Contains the signals produced by the NeoMundi measurement layer.

This section may include:

* measured values;
* known limitations;
* the measurement boundary;
* information required to interpret the signal.

A NeoMundi observation is a **measurement signal**, not a universal verdict on the observed system.

---

## `governance`

Contains non-binding information that may be used as an input by the consuming infrastructure.

A recommendation or review signal:

* is not an execution authorization;
* does not replace the consumer's policy;
* does not automatically trigger an action imposed by NeoMundi.

---

## `integrity`

Contains the elements required for independent verification of the contract:

* SHA-256 payload fingerprint;
* Ed25519/JWS cryptographic signature;
* `key_id`.

---

# 2. Responsibility boundary

One of the fundamental invariants of the contract is:

```json
{
  "execution_permission_changed": false
}
```

This value is enforced by the schema.

A contract claiming that NeoMundi silently modified execution permission is invalid.

The boundary is therefore explicit:

```text
NeoMundi
    ↓
measurement
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

---

# 3. Data sovereignty

The interoperability contract is designed to avoid transporting raw content.

It does not contain:

* raw user prompts;
* raw model responses;
* raw provider model identifiers.

The consumer can verify these constraints before storing or using the contract.

This property separates:

**the measurement**
from
**the business or conversational data that produced the measurement**.

---

# 4. Public endpoints

## JSON Schema

The versioned contract schema is publicly available:

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

It allows a consumer to automatically verify that a contract complies with the expected structure.

---

## Public verification keys

The public keys required for cryptographic verification are exposed through JWKS:

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

The field:

```text
integrity.key_id
```

identifies the public key corresponding to the contract signature.

Retrieving the schema and public verification keys does not require a NeoMundi API key.

---

# 5. Obtain a contract

From an existing NeoMundi observation:

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

NeoMundi then returns a contract that is:

* JSON-based;
* versioned;
* integrity-fingerprinted;
* cryptographically signed.

---

# 6. Consumer workflow

A standard integration follows five steps.

```text
1. Receive
2. Validate
3. Verify
4. Interpret
5. Apply your own policy
```

## Step 1 — Receive

The consumer receives the JSON contract produced from a NeoMundi observation.

---

## Step 2 — Validate

The contract is validated against the public JSON Schema corresponding to its version.

A payload that does not comply with the schema should be rejected before use.

---

## Step 3 — Verify

The consumer independently verifies:

* the SHA-256 fingerprint;
* the Ed25519/JWS signature;
* the signing key used for the contract.

---

## Step 4 — Interpret

The infrastructure reads the measurement signals, limitations and any advisory information carried by the contract.

Their operational meaning depends on the consumer's own context.

---

## Step 5 — Apply your own policy

The consumer determines the appropriate action.

Example:

```text
review_recommendation = required
            ↓
       pause workflow
            ↓
       human review
```

This is only an **example consumer policy**.

It is not imposed by NeoMundi.

Another infrastructure could instead choose:

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
routing to another system
```

The contract remains the same.

The policy belongs to the consumer.

---

# 7. Reference consumer

NeoMundi provides a reference implementation showing how an independent system can process a contract.

The reference flow is:

```text
contract
    ↓
JSON Schema validation
    ↓
SHA-256 verification
    ↓
Ed25519/JWS verification
    ↓
sovereignty constraint checks
    ↓
consumer-defined policy
    ↓
auditable receipt
```

This implementation is deliberately independent from NeoMundi's producer code.

It does not require importing the internal components that generated the measurement.

---

## Offline demonstration

The reference consumer can be executed without a live NeoMundi server.

From the `consumer-reference/` directory:

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

The offline demonstration uses:

* two real signed NeoMundi contracts from `../examples/`;
* the public contract schema from `../schema/contract-v0.1.schema.json`;
* the public NeoMundi JWKS stored locally in `rgc_consumer_demo/fixtures/public_jwks.json`.

No NeoMundi API key is required.

No private signing key is included.

The local JWKS contains only the public key required to independently verify the Ed25519/JWS signatures of the published example contracts.

Expected result for both contracts:

```text
hash_match=True
signature_valid=True
```

See the full [Reference Consumer documentation](./consumer-reference/README.md).

---

## Consume a real contract

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

The consumer may also use a previously retrieved or cached schema and JWKS to avoid making a network request for every contract.

---

# 8. Standards used

NeoMundi reuses established standards rather than creating proprietary equivalents.

## JSON Schema

The contract uses:

**JSON Schema Draft 2020-12**

The schema enables automatic and versioned payload validation.

---

## W3C Trace Context

Cross-system correlation relies on a trace identifier compatible with the shape defined by **W3C Trace Context**.

This makes it possible to correlate a NeoMundi observation with other technical traces without replacing the consumer's own tracing mechanisms.

---

## SHA-256

A canonical JSON representation is used to calculate a SHA-256 fingerprint of the payload.

The fingerprint allows modification of the content to be detected.

It must not be confused with a cryptographic signature.

---

## JWS / Ed25519

The contract uses:

* **JSON Web Signature — RFC 7515**;
* **Ed25519**;
* public key representation in **JWK** format.

The signature allows the consumer to cryptographically verify the origin and integrity of the contract.

---

## CloudEvents

The structure reuses some general CloudEvents principles related to:

* identity;
* source;
* time;
* event type.

The contract nevertheless keeps its own NeoMundi-specific field names.

**NeoMundi does not claim full compliance with the CloudEvents envelope.**

---

# 9. Integrity model

A valid contract requires both:

```text
SHA-256 fingerprint
+
Ed25519/JWS signature
```

There is no valid hash-only fallback mode.

If the cryptographic signature cannot be produced, a valid signed contract must not be emitted.

---

# 10. Versioning

The contract format is explicitly versioned.

Current pilot version:

```text
v0.1
```

A consumer should verify the schema version before automatically processing a contract.

Future versions may evolve the format while keeping those changes explicit for infrastructures that have already integrated it.

---

# 11. What this contract does not do

The NeoMundi Measurement Interoperability Contract does not:

* grant execution authorization;
* replace the consumer's policy engine;
* decide on behalf of a third-party infrastructure;
* certify third-party data;
* require access to NeoMundi's internal code;
* transport raw prompts or responses;
* impose a single routing rule;
* turn a measurement signal into a universal operational truth.

It is a **verifiable interface between measurement and the systems that consume that measurement**.

---

# 12. Integration example

The same contract can be used differently depending on the infrastructure receiving it.

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
     analysis         action         evidence
```

The measurement layer remains the same.

Applications can be multiple.

---

# 13. Status

The contract is currently:

```text
Pilot version — v0.1
```

The format may still evolve.

Any evolution intended for automated consumption should remain explicitly versioned.

---

## NeoMundi

**Fundamental runtime measurement layer for AI systems.**

One measurement layer. Multiple applications. Multiple infrastructures.

**NeoMundi provides the signal. You retain control.**

---

© 2026 NeoMundi / Louis M Sàrl — All rights reserved.

Open-source licensing is planned for a future release.
