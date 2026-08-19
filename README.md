# NeoMundi Measurement Interoperability

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [NeoMundi](https://neomundi.io) · [API](https://api.neomundi.io)

> **Public interoperability specification for transporting signed, versioned and verifiable NeoMundi runtime measurement signals across independent systems.**

---

**What is it?**  
A simple way to move a NeoMundi AI measurement from one system to another in a signed, verifiable JSON format.

**What is it for?**  
It lets your infrastructure receive a NeoMundi measurement, check that it is authentic, understand the signal, and decide what to do with it.

**Who is it for?**  
Cloud platforms, AI systems, agents, governance tools, audit systems, monitoring platforms, and any infrastructure that wants to consume NeoMundi measurements without depending on NeoMundi’s internal code.

**How do I activate it?**  
Generate a NeoMundi measurement, retrieve its interoperability contract, then validate and verify it with the public schema and public key.

**This contract is not being built in isolation: it is being challenged, tested and strengthened by an evolving circle of independent contributors and pilot infrastructures — follow the story in [Contributors & Collective Development](./CONTRIBUTORS.md).**

```text
AI system
    ↓
NeoMundi measures
    ↓
signed JSON contract
    ↓
your system verifies it
    ↓
your system decides what to do
```

**NeoMundi measures. Your infrastructure decides.**

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [Examples](./examples/) · [Reference Consumer](./consumer-reference/)

---

## Principle

NeoMundi provides a **runtime measurement signal** and its **verifiable trace**.

The infrastructure receiving that signal retains full control over:

- interpretation;
- policy;
- decision;
- action.

**NeoMundi measures. Your infrastructure decides.**

Public interoperability does **not** mean public implementation.

A consuming infrastructure may keep its internal interpretation logic, policy rules, thresholds, decision mechanisms, governance architecture and enforcement mechanisms entirely private, proprietary or confidential.

---

## Why this contract exists

An AI system can be measured by NeoMundi without requiring the infrastructure consuming that measurement to depend on NeoMundi's internal code.

The **NeoMundi Measurement Interoperability Contract** provides a JSON representation that is:

- structured;
- versioned;
- cryptographically signed;
- independently verifiable;
- machine-consumable by third-party systems.

It enables an external infrastructure to:

- validate the contract structure;
- verify its integrity;
- verify its cryptographic signature;
- correlate the observation across systems;
- read measurement signals and their limitations;
- apply its own governance rules;
- retain an auditable proof record.

The contract standardizes the **interface between measurement and consumption**. It does not standardize, disclose or prescribe the consumer's internal implementation.

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

It also does not require the consuming infrastructure to expose the proprietary logic it applies after receiving the measurement.

A useful boundary is:

```text
NeoMundi
measurement
    ↓
PUBLIC INTEROPERABILITY LAYER
signed contract
validation
verification
    ↓
────────────────────────────────
consumer boundary
────────────────────────────────
    ↓
PRIVATE / PARTNER-SPECIFIC LAYER
interpretation
policy
thresholds
decision
enforcement
```

**Open interface ≠ open implementation.**

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

- measured values;
- known limitations;
- the measurement boundary;
- information required to interpret the signal.

A NeoMundi observation is a **measurement signal**, not a universal verdict on the observed system.

---

## `governance`

Contains non-binding information that may be used as an input by the consuming infrastructure.

A recommendation or review signal:

- is not an execution authorization;
- does not replace the consumer's policy;
- does not automatically trigger an action imposed by NeoMundi.

The receiving infrastructure remains responsible for determining what operational meaning, if any, it assigns to that information.

Its internal governance logic does not need to be disclosed to NeoMundi or made public.

---

## `integrity`

Contains the elements required for independent verification of the contract:

- SHA-256 payload fingerprint;
- Ed25519/JWS cryptographic signature;
- `key_id`.

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

NeoMundi does not need access to the consumer's proprietary policy engine, decision logic or enforcement architecture.

The consumer may implement those elements privately, under its own governance and security model.

---

# 3. Data sovereignty

The interoperability contract is designed to avoid transporting raw content.

It does not contain:

- raw user prompts;
- raw model responses;
- raw provider model identifiers.

The consumer can verify these constraints before storing or using the contract.

This property separates:

**the measurement**

from

**the business or conversational data that produced the measurement**.

The contract also does not require disclosure of:

- proprietary consumer policies;
- internal thresholds;
- decision rules;
- enforcement mechanisms;
- partner-specific governance architecture;
- confidential implementation details.

Public interoperability therefore concerns the **shared interface**, not the private internal logic of participating systems.

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

- JSON-based;
- versioned;
- integrity-fingerprinted;
- cryptographically signed.

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

- the SHA-256 fingerprint;
- the Ed25519/JWS signature;
- the signing key used for the contract.

---

## Step 4 — Interpret

The infrastructure reads the measurement signals, limitations and any advisory information carried by the contract.

Their operational meaning depends on the consumer's own context.

NeoMundi does not prescribe how the consumer must interpret a valid measurement signal.

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

The exact policy, thresholds, routing logic and enforcement mechanisms may remain entirely proprietary and confidential.

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

The reference consumer demonstrates only a **generic example** of how a receiving infrastructure may validate, verify and consume a NeoMundi contract.

It does **not** define, reproduce or require disclosure of any partner's proprietary:

- interpretation logic;
- policy engine;
- thresholds;
- decision logic;
- governance architecture;
- routing mechanisms;
- enforcement mechanisms.

A partner may therefore use the public interoperability contract while keeping its implementation entirely private.

### Interoperability boundary

```text
PUBLIC
NeoMundi contract
schema
verification rules
public keys
generic consumption pattern

PRIVATE / OPTIONAL DISCLOSURE
partner policy
partner thresholds
partner decision logic
partner enforcement
partner architecture
partner IP
```

The public reference consumer is an interoperability example, **not a template requiring partners to reveal how their systems govern or act**.

---

## Offline demonstration

The reference consumer can be executed without a live NeoMundi server.

From the `consumer-reference/` directory:

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

The offline demonstration uses:

- two real signed NeoMundi contracts from `../examples/`;
- the public contract schema from `../schema/contract-v0.1.schema.json`;
- the public NeoMundi JWKS stored locally in `rgc_consumer_demo/fixtures/public_jwks.json`.

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

- **JSON Web Signature — RFC 7515**;
- **Ed25519**;
- public key representation in **JWK** format.

The signature allows the consumer to cryptographically verify the origin and integrity of the contract.

---

## CloudEvents

The structure reuses some general CloudEvents principles related to:

- identity;
- source;
- time;
- event type.

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

- grant execution authorization;
- replace the consumer's policy engine;
- decide on behalf of a third-party infrastructure;
- certify third-party data;
- require access to NeoMundi's internal code;
- transport raw prompts or responses;
- impose a single routing rule;
- turn a measurement signal into a universal operational truth;
- require disclosure of a partner's proprietary implementation;
- require disclosure of internal thresholds or policy rules;
- require publication of decision or enforcement logic;
- transfer ownership or control of partner intellectual property.

It is a **verifiable interface between measurement and the systems that consume that measurement**.

The interface may be public while implementations on either side remain private.

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
     analysis         action        evidence
```

The measurement layer remains the same.

Applications can be multiple.

Each consuming infrastructure remains free to implement its own downstream logic without exposing that logic publicly.

---

# 13. Public interface, private implementation

NeoMundi deliberately separates **interoperability** from **implementation disclosure**.

The public layer may include:

- contract structure;
- field semantics;
- versioning rules;
- validation rules;
- verification mechanisms;
- public verification keys;
- synthetic or approved example payloads;
- generic reference-consumer behavior.

The private layer may include:

- proprietary governance logic;
- internal policy engines;
- thresholds;
- decision rules;
- routing strategies;
- enforcement mechanisms;
- confidential architecture;
- partner-specific integrations;
- unpublished intellectual property.

This separation allows independent systems to interoperate without requiring either NeoMundi or its partners to expose their internal machinery.

**Open interface. Independent implementation.**

---

# 14. Status

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
