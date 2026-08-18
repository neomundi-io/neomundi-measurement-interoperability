# Contributors & Collective Development — V0.0

[🇬🇧 English](./CONTRIBUTORS.md) · [🇫🇷 Français](./CONTRIBUTORS_FR.md) · [Main README](./README.md)

> **This document is an evolving record of people and infrastructures that have contributed technical feedback, architectural perspectives, interoperability testing, pilot work or critical review to the NeoMundi Measurement Interoperability initiative.**

This is **V0.0**.

It is intentionally incomplete and will evolve as additional pilots, technical reviews and independent implementations are documented.

---

## Project origin

The **NeoMundi Measurement Interoperability Contract** is developed and maintained by NeoMundi as a public interoperability layer for transporting runtime measurement signals between independent infrastructures.

Its purpose is simple:

```text
measure
   ↓
transport a verifiable signal
   ↓
allow another infrastructure to verify it
   ↓
let that infrastructure retain interpretation,
policy, authority and action
```

The initial contract architecture was developed by NeoMundi and then exposed to a first circle of external practitioners, researchers, infrastructure builders and governance specialists for critical review.

Their feedback has helped challenge assumptions, clarify boundaries and strengthen the interoperability model.

---

# Initial design reflection

The following people contributed independent technical or architectural feedback during the early design phase.

This list records **contribution to the reflection and review process**.

It does not imply ownership of the NeoMundi contract, endorsement of every design choice, or responsibility for the final implementation.

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
* avoid overengineering and post-hoc governance documentation.

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

His contribution reinforced the principle that **measurement boundaries should travel with the measurement**.

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

# Emerging shared principles

Across these independent contributions, several recurring principles emerged.

### 1. Keep the common core small

Interoperability depends on consistent implementation.

A smaller mandatory core is generally preferable to a comprehensive but inconsistently implemented schema.

### 2. Measurement is not authority

A runtime measurement can inform another system.

It does not automatically authorize, block or modify execution.

### 3. Limitations travel with the signal

A measurement should expose:

* what was observed;
* under what scope;
* with what coverage;
* with what limitations;
* and what it does **not** establish.

### 4. Preserve provenance

A downstream system should be able to understand who asserted what and reconstruct the relevant trace.

### 5. Preserve sovereign infrastructures

Interoperability connects systems.

It should not silently merge their claims, policies or authority.

### 6. Integrity must be independently verifiable

Canonicalization, hashing, signatures and verification references must be sufficiently explicit for an independent system to reproduce verification.

### 7. The consumer remains in control

NeoMundi provides the measurement signal and its verifiable trace.

The consuming infrastructure retains:

```text
interpretation
policy
decision
action
```

---

# Implementation & pilot contributors

This section will progressively document infrastructures and teams that test the contract through real integrations.

Examples may include:

* independent consumer implementations;
* sovereign infrastructure integrations;
* agent orchestration environments;
* governance systems;
* audit and evidence infrastructures;
* simulation environments;
* runtime monitoring systems;
* research implementations.

**V0.0 — list currently being consolidated.**

Additional pilots and technical contributors will be added as their participation and public attribution are confirmed.

---

# Development path

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

The objective is not to declare a standard before it has been tested.

The objective is to **build, test, document and harden an interoperability primitive with independent infrastructures**, then expose a stable version for broader reuse.

---

# Toward an open release

NeoMundi intends to release a stable version of the interoperability layer under an open-source license after the current validation and pilot phase.

The purpose of this period is to:

* test the contract against real independent infrastructures;
* identify ambiguous semantics;
* validate independent cryptographic verification;
* document implementation patterns;
* expose failure cases;
* reduce unnecessary complexity;
* stabilize the mandatory core.

The future open-source release is therefore intended to represent not only a published schema, but a contract that has been **challenged through real interoperability work**.

---

# Attribution policy

This document is an acknowledgment record, not a legal assignment of intellectual property.

Being listed here means that a person or organization contributed feedback, testing, implementation work or another documented contribution to the development process.

It does not necessarily mean that the contributor:

* authored the NeoMundi contract;
* endorses every element of the current implementation;
* accepts responsibility for NeoMundi's implementation;
* transfers intellectual property rights;
* represents NeoMundi.

Names, organizations and logos should only be associated publicly with specific pilot or implementation claims once that attribution has been confirmed.

---

# An evolving collective record

This document will evolve.

Some early contributors may still be missing from V0.0.

Some contributors listed here participated in conceptual review; others will contribute through implementation, testing, pilots or independent validation.

Future versions will progressively distinguish:

```text
Design reflection
Technical review
Implementation
Pilot integration
Independent validation
Documentation
Open-source contribution
```

If you contributed to this work and believe your contribution is missing or inaccurately represented, please contact NeoMundi so the record can be corrected.

---

**NeoMundi Measurement Interoperability**

*Developed by NeoMundi and strengthened through independent technical feedback, interoperability testing and an evolving ecosystem of contributors.*

© 2026 NeoMundi / Louis M Sàrl — All rights reserved.

Open-source licensing is planned for a future stable release.
