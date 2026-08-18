# Contributors & Collective Development — V0.0

[🇬🇧 English](./CONTRIBUTORS.md) · [🇫🇷 Français](./CONTRIBUTORS_FR.md) · [Main README](./README.md)

> **This document is an evolving record of the people and infrastructures that have contributed technical feedback, architectural perspectives, interoperability testing, implementation work, pilot activity or critical review to NeoMundi Measurement Interoperability.**

This is **V0.0**.

It is intentionally incomplete.

The record will evolve as additional technical reviews, pilots, independent implementations and validation work are documented.

---

# Project origin

The **NeoMundi Measurement Interoperability Contract** is developed and maintained by NeoMundi as a public interoperability layer for transporting runtime measurement signals between independent infrastructures.

Its purpose is simple:

```text
measure
   ↓
transport a verifiable signal
   ↓
allow another infrastructure to verify it
   ↓
let that infrastructure retain
interpretation, policy, authority and action
```

The initial architecture was developed by NeoMundi and then exposed to a first circle of external practitioners, researchers, infrastructure builders and governance specialists for critical review.

Their feedback has challenged assumptions, clarified responsibility boundaries and helped strengthen the interoperability model.

A second circle is now emerging through **implementation and pilot work**, where independent infrastructures test how these principles behave when systems actually connect.

---

# 1. Initial design reflection

The following people contributed independent technical or architectural feedback during the early design phase.

This section records **contribution to reflection and review**.

Being listed here does not imply:

* ownership of the NeoMundi contract;
* authorship of the final implementation;
* endorsement of every NeoMundi design choice;
* responsibility for the NeoMundi implementation.

---

## Evelyne-Claudia Yantony

**Contribution focus:** governance boundaries, correctability, review handoff and separation between observation and authority.

Key themes raised:

* an observation must not become an authorization;
* governance reassessment should remain distinct from execution authority;
* review requirements and authority boundaries should be explicit;
* `execution_permission_changed` should remain visible and unambiguous;
* limitations and incomplete measurement should travel with the observation;
* the contract should preserve the sequence:

```text
Observation
→ Governance reassessment
→ Authority
→ Correctability / Action
```

Her feedback strongly reinforced the explicit separation between **measurement signal, governance interpretation and execution authority**.

---

## William Zade

**Contribution focus:** minimal operational core, event correlation, privacy-preserving auditability and implementation discipline.

Key themes raised:

* keep the contract minimal, stable and operationally interpretable;
* preserve event and workflow correlation;
* distinguish declared model identity from resolved runtime identity where possible;
* keep stability, coherence and factual validation separate;
* expose limitations and missing measurement explicitly;
* prefer a small mandatory core with optional extensions.

His feedback reinforced the principle that interoperability succeeds through **consistent implementation of a small common core**, not through maximal schema complexity.

---

## Darz' Morris

**Contribution focus:** evidence continuity, state transitions, provenance and reconstructability.

Key themes raised:

* interoperability needs a shared evidence and state-transition language;
* identity, provenance and runtime context should remain reconstructable;
* the contract should capture more than the final answer;
* integrity and replayability are central to audit;
* different systems should be able to disagree while preserving enough shared structure to understand why;
* avoid overengineering and purely post-hoc governance artifacts.

His contribution emphasized **state-transition continuity and reconstructable evidence**.

---

## James Moore

**Contribution focus:** legitimacy, authority, delegation and execution-time governance.

Key themes raised:

* authority should remain attributable;
* jurisdiction and delegation boundaries may matter downstream;
* escalation paths and override states should remain explicit where applicable;
* traceability alone does not establish legitimate authority;
* interoperability should not silently imply permission to act.

His feedback strengthened the distinction between **technical interoperability and legitimate execution authority**.

---

## Ramon Loya

**Contribution focus:** sovereign claims, field ownership, evidence-by-reference and audit separation.

Key themes raised:

* never merge claims made by separate infrastructures into a single synthetic assertion;
* clearly identify which infrastructure asserts which information;
* evidence from another system should be referenced, not silently absorbed;
* limitations should be mandatory;
* scope and applicability must remain visible;
* interoperability must not become mutual certification;
* avoid a single combined governance verdict spanning sovereign systems.

A particularly important principle emerging from this contribution is:

```text
The contract connects sovereign claims.
It does not merge them.
```

---

## Kazuki Toyota

**Contribution focus:** verification boundaries, canonicalization and minimal cryptographic interoperability.

Key themes raised:

* stable identity and traceability;
* versioned measurement context;
* explicit canonicalization method;
* explicit hash method and hash scope;
* artifact integrity and signature verification;
* clear limitations;
* minimal mandatory core with optional extensions.

His feedback highlighted **hash scope** as a particularly important interoperability property: two systems cannot claim to have verified the same artifact if they do not know precisely what representation was hashed.

---

## Emanuel Celano

**Contribution focus:** observational perimeter, interpretation limits and non-claims.

Key themes raised:

* transport not only what was observed, but also what could not be observed;
* expose measurement surface and declared visibility;
* preserve unresolved signals;
* explicitly communicate interpretation constraints;
* attach non-claims and observational limitations to the signal itself;
* avoid infrastructure-specific semantics where possible.

His contribution reinforced the principle that:

```text
Measurement boundaries should travel with the measurement.
```

---

## Pierre Mondoux

**Contribution focus:** minimal interoperable core, audit usability and simulation-based validation.

Key themes raised:

* keep the first contract deliberately small;
* preserve event identity, traceability, source, timestamp and measurement version;
* keep interoperability separate from telemetry, compliance and internal governance;
* use controlled simulations as an interoperability testbed;
* evaluate whether records remain readable and auditable as complexity and volume increase.

His contribution also opened a practical validation path through **AEROS simulation environments**.

---

## James Aull

**Contribution focus:** declaration vs observation vs interpretation vs authority.

Key themes raised:

* preserve identity, time continuity and provenance;
* distinguish declared state from observed state;
* explicitly preserve integrity and limitations;
* do not silently merge what one infrastructure declared, another observed, and a reviewer later concluded;
* keep each layer attributable and independently reviewable;
* prevent interoperability from becoming authority transfer or framework absorption.

His feedback reinforced a central design discipline:

```text
Declaration ≠ Observation
Observation ≠ Interpretation
Interpretation ≠ Authority
```

---

# 2. Emerging shared principles

Across these independent contributions, several recurring principles emerged.

## 2.1 Keep the common core small

Interoperability depends on consistent implementation.

A smaller mandatory core is generally preferable to a comprehensive but inconsistently implemented schema.

---

## 2.2 Measurement is not authority

A runtime measurement can inform another system.

It does not automatically:

* authorize execution;
* block execution;
* modify permission;
* establish truth;
* establish safety;
* transfer authority.

---

## 2.3 Limitations travel with the signal

A measurement should expose:

* what was observed;
* under what scope;
* with what coverage;
* with what limitations;
* what remains unresolved;
* and what the measurement **does not establish**.

---

## 2.4 Preserve provenance

A downstream system should be able to understand:

```text
who asserted what
        ↓
under which conditions
        ↓
using which version
        ↓
with which integrity reference
```

and reconstruct the relevant trace.

---

## 2.5 Preserve sovereign infrastructures

Interoperability connects systems.

It should not silently merge:

* their claims;
* their policies;
* their evidence;
* their governance models;
* their authority.

---

## 2.6 Integrity must be independently verifiable

Canonicalization, hashing, signatures and verification references must be sufficiently explicit for an independent system to reproduce verification.

---

## 2.7 The consumer remains in control

NeoMundi provides the measurement signal and its verifiable trace.

The consuming infrastructure retains:

```text
interpretation
policy
decision
action
```

---

# 3. Implementation & pilot contributors

The following section documents people and infrastructures contributing through **hands-on interoperability work, pilot implementation, simulation, integration or technical validation**.

This category is intentionally distinct from initial design reflection.

An implementation contributor may test how NeoMundi signals interact with another infrastructure without having participated in the original design of the contract itself.

---

## Mark Mocnaj — OGS

**Contribution type:** interoperability implementation, synthetic pilot, governance-object articulation, receipts and replay.

Mark Mocnaj contributed through hands-on interoperability work between **NeoMundi and OGS**.

The work explored how NeoMundi runtime measurement objects can remain distinct from downstream OGS governance objects while still being connected through an auditable technical interface.

Key contribution areas include:

* testing the articulation between NeoMundi runtime signal objects and an independent governance infrastructure;
* preserving the separation between runtime measurement and downstream governance evaluation;
* preserving the boundary between observation and execution authority;
* documenting object flows across the two infrastructures;
* working with governance objects, receipts and replay records;
* exploring how provenance, versioning and evidence continuity can be preserved across the interface;
* contributing executable verification material and structured interoperability documentation;
* helping clarify how one infrastructure can consume another infrastructure's signal without absorbing its authority.

The contribution demonstrates an important interoperability principle:

```text
NeoMundi observation
        ↓
transport / articulation
        ↓
independent governance infrastructure
        ↓
its own interpretation and consequence handling
```

The two systems remain distinct.

NeoMundi does not silently become the OGS policy engine, and OGS does not redefine the NeoMundi measurement.

### Scope of the work

The documented OGS interoperability work is a **synthetic technical pilot**.

It demonstrates architecture, object articulation, receipts, replay and interface coherence.

It should not be interpreted as:

* independent production validation;
* autonomous processing of arbitrary real-world NeoMundi payloads;
* certification of either infrastructure;
* proof that all possible NeoMundi/OGS integration paths have been validated.

This distinction is intentional and part of the evidence boundary.

Mark's contribution represents one of the early examples of moving from:

```text
interoperability as an idea
        ↓
to
        ↓
interoperability as an implemented technical boundary
```

---

## Additional implementation & pilot contributors

This section is currently being consolidated.

Future entries may include work involving:

* independent consumer implementations;
* sovereign infrastructure integrations;
* agent orchestration environments;
* governance systems;
* audit and evidence infrastructures;
* simulation environments;
* runtime monitoring systems;
* research implementations;
* independent cryptographic verification;
* cross-infrastructure traceability.

Additional pilots and technical contributors will be added as their participation and public attribution are confirmed.

---

# 4. What counts as a contribution

NeoMundi Measurement Interoperability is being developed through several distinct forms of contribution.

Future versions of this document will progressively classify contributions using categories such as:

```text
Design reflection
Technical review
Schema feedback
Implementation
Pilot integration
Simulation
Independent validation
Cryptographic verification
Documentation
Open-source contribution
```

These categories are not hierarchical.

A conceptual review and an implementation pilot contribute in different ways.

The purpose of this record is to make those differences visible rather than collapsing every contribution into a single generic label.

---

# 5. Development path

The current approach is deliberately progressive.

```text
V0.0
Initial architecture
+ external critical review
        ↓

V0.1
Machine-readable contract
+ signed real-world examples
+ independent reference consumer
        ↓

Pilot phase
Independent infrastructures implement,
test and challenge the contract
        ↓

Documentation & hardening
Failures, ambiguities and interoperability
requirements are documented
        ↓

Stable public release
        ↓

Open-source release
```

The objective is **not** to declare a standard before it has been tested.

The objective is to:

```text
build
→ expose
→ challenge
→ implement
→ test
→ document
→ simplify
→ harden
→ open
```

an interoperability primitive with independent infrastructures.

---

# 6. Current public technical baseline

The current public repository already includes:

* the NeoMundi Measurement Interoperability specification;
* a versioned JSON Schema;
* two real NeoMundi signed contract examples;
* SHA-256 payload integrity;
* Ed25519/JWS signatures;
* public JWKS verification;
* an independent reference consumer;
* sovereignty checks;
* consumer-defined routing examples;
* auditable receipt storage;
* an offline verification path.

This means the current V0.1 can already demonstrate:

```text
receive
→ validate
→ verify
→ interpret
→ apply consumer policy
→ retain evidence
```

without requiring access to NeoMundi's internal producer code.

---

# 7. From public pilot to open release

NeoMundi intends to release a stable version of the interoperability layer under an open-source license after the current validation and pilot phase.

The purpose of the current period is to:

* test the contract against independent infrastructures;
* identify ambiguous semantics;
* validate independent cryptographic verification;
* document implementation patterns;
* expose failure cases;
* challenge responsibility boundaries;
* reduce unnecessary complexity;
* stabilize the mandatory core.

The future open-source release is intended to represent not merely a published JSON format, but an interoperability layer that has been:

```text
reviewed
tested
implemented
challenged
documented
```

across different technical contexts.

---

# 8. Why this development process matters

Interoperability cannot be established by declaration alone.

A schema may look coherent while still failing when:

* another infrastructure interprets a field differently;
* canonicalization assumptions diverge;
* authority boundaries become ambiguous;
* provenance is lost;
* signatures cannot be independently verified;
* limitations disappear downstream;
* the receiving system mistakes an observation for a decision.

The purpose of this collective development process is therefore not simply to gather opinions.

It is to expose the contract to **different technical worldviews and independent infrastructures early enough for disagreement to improve the object**.

---

# 9. Attribution policy

This document is an acknowledgment record.

It is **not a legal assignment of intellectual property**.

Being listed here means that a person or organization contributed:

* feedback;
* technical review;
* testing;
* implementation work;
* pilot activity;
* simulation;
* documentation;
* validation;
* or another documented contribution to the development process.

It does not necessarily mean that the contributor:

* authored the NeoMundi contract;
* owns the NeoMundi contract;
* endorses every element of the current implementation;
* accepts responsibility for NeoMundi's implementation;
* transfers intellectual property rights;
* represents NeoMundi;
* certifies the NeoMundi system.

Specific organizational claims, logos and partnership statements should only be used once their public attribution has been confirmed.

---

# 10. An evolving collective record

This document will evolve.

Some early contributors may still be missing from **V0.0**.

That is expected.

Some contributors participated through conceptual review.

Others contribute through:

* implementation;
* testing;
* simulation;
* pilot integration;
* independent verification;
* documentation;
* future open-source work.

The objective is not to freeze an artificial list too early.

The objective is to build a traceable record as the interoperability ecosystem grows.

If you contributed to this work and believe your contribution is missing or inaccurately represented, please contact NeoMundi so the record can be corrected.

---

# 11. A growing interoperability story

The NeoMundi Measurement Interoperability Contract is not being developed in isolation.

It began as an internal architecture.

It was then exposed to independent critical review.

It is now moving through technical implementations and pilot infrastructures.

The next stage is broader testing, documentation and hardening.

The longer-term objective is a stable open release.

```text
one measurement layer
        ↓
many independent infrastructures
        ↓
shared verification
        ↓
no forced shared authority
```

That is the interoperability boundary this work is trying to preserve.

---

**NeoMundi Measurement Interoperability**

*Developed by NeoMundi and strengthened through independent technical feedback, interoperability testing and an evolving ecosystem of contributors.*

© 2026 NeoMundi / Louis M Sàrl — All rights reserved.

Open-source licensing is planned for a future stable release.
