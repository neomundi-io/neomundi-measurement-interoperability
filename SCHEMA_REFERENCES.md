# Schema references — RGC v0.1.0

**Reference date: 2026-11-02.** Verified against the NeoMundi production service
and against this repository on that date.

This document exists because **three different byte sequences describe RGC
v0.1.0, they all declare the same `$id`, and two of them are the same document
while the third is not.** A consumer that validates against one of them and
assumes the others are identical will eventually be surprised. Here is the exact
situation.

---

## 1. What NeoMundi actually produces today

| | |
|---|---|
| Contract version emitted by the production API | **`0.1.0`** — `RGC_SCHEMA_VERSION = "0.1.0"` in the service |
| Declared in every contract at | `identity.schema_version` |
| Contracts on record | **18 449**, **100 % at `0.1.0`**, **100 % signed by `kid = neomundi-rgc-2026-01`** |
| Measurement version currently served | **`3.3.1`** (`audit.measurement_version`) |
| Normalizer version | **`1.0.0`** |

> **`v0.2` is published in this repository but is NOT produced by the API.**
> `schema/contract-v0.2.schema.json` exists and declares
> `$id = …/rgc/0.2.0/contract.schema.json`. **No NeoMundi contract has ever been
> emitted at `0.2.0`** — 0 of 18 449. Do not validate a NeoMundi contract against
> it, and do not treat its presence as a statement that `0.2.0` is available.

---

## 2. The three v0.1.0 schema documents

| # | Variant | Canonical location | Bytes | SHA-256 of the exact bytes |
|---|---|---|---|---|
| **S1** | **Served by the API** | `GET https://api.neomundi.io/v1/rgc/schema` | **42 886** | `7a4579e7c526114e08ddab44dd8d9d5b564f60cf68a4928183646480dbc13eb4` |
| **S2** | **Pinned in the service image** | `govern-v3/app/rgc/schemas/rgc-contract-0.1.0.schema.json` in the private backend repository | **101 876** | `f3df447e7b55d20b49c0243d75b96e51b5e6975e9ce86669ad9cbb0b2da960e4` |
| **S3** | **Published here** | [`schema/contract-v0.1.schema.json`](schema/contract-v0.1.schema.json) | **10 543** | `b3804bf98ba9dbdd16a2beb56567e4d4ca46ebee06b06b18734938db7a1177dd` |

All three declare the **same** `$id`:
`https://schemas.neomundi.io/rgc/0.1.0/contract.schema.json`
and the **same** top-level `required`:
`["identity", "provenance", "observation", "governance", "integrity"]`.

### 2.1 Git references

| Variant | Commit | Note |
|---|---|---|
| **S2** | `d1ef605` — *"Regenerate the frozen schema snapshot, and bind it to the live schema"*, on the backend repository's default branch | 🔴 the authoritative bytes are the **Git blob** (LF line endings), SHA-256 `f3df447e…`. A clone on a platform that converts line endings yields **different bytes** — a Windows working copy of this file measures 105 365 bytes, SHA-256 `1dddf8db…`. **Hash the blob, not the checkout.** |
| **S3** | `8525055a0eb5`, committed 2026-08-26T18:37:41Z | blob SHA `376e87ffec51…` |
| v0.2 *(not produced)* | `53a9c652a0cf`, committed 2026-08-26T18:38:21Z | 20 176 bytes, SHA-256 `e7a25ea10877ac15a7ebac1959b95769d63e72085e4eb9c02899db482ec37818` |

### 2.2 Which of them are the same document

Compared after JSON parsing, and by a canonical re-serialisation
(`sort_keys=True`, `separators=(",",":")`):

| Variant | Canonical SHA-256 | |
|---|---|---|
| **S1** | `58f333c19aa991dd257745c58305c047243ba5f20ddc746a10cb661701784957` | ⟵ |
| **S2** | `58f333c19aa991dd257745c58305c047243ba5f20ddc746a10cb661701784957` | ⟵ **identical to S1** |
| **S3** | `e12105dd45a9b7856cd2c21aabf242b8d5d1ca46ff017bd886147bba3c350dd0` | **different document** |

> **S1 and S2 are the same JSON Schema.** Their 59 000-byte difference is **pure
> serialisation** — the pinned file is pretty-printed, the endpoint response is
> not. Any consumer may use either; they will accept and reject exactly the same
> documents.
>
> **S3 is a genuinely different document**, not a reformatting of the other two.

### 2.3 How S3 differs, and why it matters

| | S1 / S2 | S3 |
|---|---|---|
| `title` | `NeoMundi Runtime Governance Contract` | `NeoMundi Measurement Interoperability Contract (RGC v0.1)` |
| `additionalProperties` | **`false`** | **absent** |
| `allOf` (cross-field constraints) | **present** | **absent** |

**S3 is more permissive than S1/S2.** It accepts documents that S1/S2 reject:
documents carrying unknown extra properties, and documents that violate the
cross-field constraints expressed in `allOf` — among them the coherence between
`measurement_status`, `measurement_coverage` and the per-signal statuses.

**Practical consequences, stated plainly:**

1. A contract that validates against **S3 only** is **not** necessarily a
   conforming NeoMundi contract.
2. A contract that validates against **S1/S2** validates against **S3** as well.
   The strict direction is the safe one.
3. Two different documents sharing one `$id` is a defect on our side. **We are
   not fixing it in this document**, because changing either file would change a
   published reference that consumers may already pin. It is recorded here so
   that nobody has to discover it.

**Recommendation for an acceptance suite:** validate against **S1** — the bytes
the production service actually serves — and treat S3 as a convenience copy. If
you need an offline pin, pin **S2**'s blob hash, which is the same document as S1.

---

## 3. Fingerprints that must not be confused

Four different kinds of fingerprint appear in this ecosystem. They answer
different questions and none substitutes for another.

| Kind | Example | Answers |
|---|---|---|
| **Schema fingerprint** | `7a4579e7…` (S1) | *which schema document did I validate against?* |
| **Artifact fingerprint** | SHA-256 of a received contract file | *is the file I hold the one that was sent?* |
| **Signed-payload fingerprint** | `integrity.payload_hash` | *do the four signed sections hash to the value the signature covers?* |
| **Evaluator configuration fingerprint** | `config_fingerprint`, `inference_config_hash`, `prompt_template_hash` in the measurement record | *was the measurement produced by the same evaluator configuration as another one?* |
| **Key fingerprint** | `9oDjBYGDMNLrjkFIvVrBMhrV3fdtA0YGNz5xlgcHVCA` (RFC 7638) | *is this the same signing key?* |

Evaluator configuration fingerprints live in the **measurement record**, not in
the RGC contract. A contract carries the measurement *versions*, not the
evaluator configuration identities.

---

## 4. Canonicalisation of the signed payload — the exact profile

`integrity.canonicalization` declares the string `sorted-json-utf8`. **That
string is ambiguous on the one point that changes the result**, so here is the
profile in full:

```python
canonical    = json.dumps(sections, sort_keys=True, separators=(",", ":"))  # ensure_ascii=True
payload_hash = hashlib.sha256(canonical.encode("utf-8")).hexdigest()
```

where `sections` is **exactly** `{"identity", "provenance", "observation",
"governance"}` — **`integrity` excluded**.

> 🔴 **Non-ASCII characters are escaped as `\uXXXX`.** That is `json.dumps`'s
> default. **RFC 8785 (JCS) requires the opposite** — raw UTF-8.
>
> This is not theoretical. On a real signed contract whose signed sections
> contain two non-ASCII characters (an em dash in `limitations`), the two
> profiles give different digests, and only ours matches the signed value:
>
> | Profile | Recomputed digest |
> |---|---|
> | **NeoMundi** (`ensure_ascii=True`) | `2251b2c61a641e8a88d6fd44ad5d94ceb436660b4ce4b8bc6d310962be53fbcc` ✅ matches `integrity.payload_hash` |
> | **JCS / RFC 8785** | `7124392a96181aae76e09132518d475652735e3b6a2807d4e9af519bee47ee00` ❌ |
>
> **A strict JCS verifier would reject an authentic NeoMundi contract.** Implement
> the profile above, not JCS, for RGC v0.1.0.

### 4.1 The five signed claims

The compact JWS in `integrity.signature` carries header `alg = EdDSA`,
`kid = neomundi-rgc-2026-01`, and exactly these claims, each bound to the
document body:

| Claim | Must equal |
|---|---|
| `payload_hash` | `integrity.payload_hash` |
| `hash_algorithm` | `sha256` |
| `schema_version` | `identity.schema_version` |
| `request_id` | `identity.request_id` |
| `timestamp` | `identity.timestamp` |

Checking those five bindings is what prevents a valid signature from being
replayed onto a different contract.

> **There is no `exp`, `nbf` or `iat` claim, and no expiry field anywhere in the
> v0.1.0 schema.** Verified on 2026-11-02: the served schema contains none of
> `expires`, `expiry`, `exp`, `not_after`, `valid_until`, `ttl`, `nbf`, `iat`.
> Freshness is therefore entirely the consumer's policy, derived from
> `identity.timestamp`. See the acceptance-conditions document exchanged
> bilaterally.

---

## 5. Verification endpoints, and what each one answers

| Endpoint | Auth | What it answers |
|---|---|---|
| `GET /v1/rgc/schema` | public | the schema document S1 |
| `GET /v1/rgc/jwks` | public | the active signing public key |
| `POST /v1/rgc/contracts/{request_id}` | Tier 03 | emit, sign and store a contract for an existing measurement |
| `GET /v1/rgc/contracts/{request_id}` | Tier 03 | **read back the stored record** — no re-emission, no re-signature |
| `GET /v1/rgc/verify/{request_id}` | public | *is the source measurement record still consistent with the stored contract?* |

> 🔴 **`GET /v1/rgc/verify/{request_id}` does not hash the document you hold.** It
> rebuilds the four sections from the source measurement record using the
> **current** code, compares the result to the stored `payload_hash`, and then
> verifies the stored JWS **with the active key**. It answers a server-side
> consistency question.
>
> **Verifying the artifact you received is a separate operation**, performed on
> your side: recompute the digest over the four sections of the document you
> hold, resolve the key by `kid`, verify the JWS, and check the five claim
> bindings. **Only that proves the integrity of the artifact in your possession.**
>
> A consequence worth stating: because the route rebuilds with current code, a
> change in our code — even a reworded limitation sentence — can flip its verdict
> to invalid **with the stored document unaltered**. Keep the signed document and
> verify the signature yourself.

---

*No private key, credential, token or customer content appears in this document.*
