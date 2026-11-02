# Signing key provenance — NeoMundi Runtime Governance Contract (RGC)

**Attestation date: 2026-11-02.** This document states which signing key NeoMundi
controls, so that a consumer can establish key provenance without relying on a
single channel.

It contains **public key material only**. No private key, no seed, no token.

---

## 1. Operator identity

| | |
|---|---|
| Operator of the signing infrastructure | **NeoMundi** |
| Service that signs RGC contracts | the NeoMundi Runtime Measurement API, reachable at `https://api.neomundi.io` |
| GitHub organisation publishing this repository | `neomundi-io` |
| Contact | `contact@neomundi.io` |

> **A limitation we state rather than hide.** NeoMundi operates as more than one
> legal entity, and this document does **not** assign the key to one of them. It
> attests operational control by the party that runs the production API and this
> repository. A consumer who needs a named legal counterparty should request it
> explicitly rather than infer it from this file.

---

## 2. Active signing key

| | |
|---|---|
| Key id (`kid`) | `neomundi-rgc-2026-01` |
| Key type | `OKP` / `Ed25519` |
| Algorithm | `EdDSA` |
| Intended use | `sig` — **signing RGC contracts, and nothing else** |
| Public key (`x`, base64url) | `LLjtPDqyfEibFS0oszcaaYZwxdmfw0LN4FJvZBMBJhU` |
| Raw public key length | 32 bytes |
| **JWK thumbprint** (RFC 7638, SHA-256, base64url) | **`9oDjBYGDMNLrjkFIvVrBMhrV3fdtA0YGNz5xlgcHVCA`** |
| JWK thumbprint (hex) | `f680e305818330d2eb8e4148bd5ac1321ad5ddf76d034606373e719607075420` |
| SHA-256 of the 32 raw public-key bytes | `f7915e9bb9594cf587d014efa7dc76019e636e2d77b78a52a0a549c6847bc348` |
| First published in this repository | 2026-08-18 |
| Status | **active**, verified live on 2026-11-02 |

The canonical JWK Set, byte for byte:

    {"keys":[{"kty":"OKP","crv":"Ed25519","x":"LLjtPDqyfEibFS0oszcaaYZwxdmfw0LN4FJvZBMBJhU","kid":"neomundi-rgc-2026-01","use":"sig","alg":"EdDSA"}]}

SHA-256 of those exact bytes: **`35bff3919ee4c68e93edba0f94da2abe555da1d71de0cbee9fc3e242528e12c3`**

---

## 3. Statement of control

NeoMundi declares that the private key corresponding to `kid = neomundi-rgc-2026-01`
is held by NeoMundi production infrastructure and is used to sign RGC contracts.
**It is not shared with pilots, partners or consumers**, and it is never
transmitted outside the signing process.

### Why the live endpoint is evidence of control, not just publication

`GET /v1/rgc/jwks` does not serve a static file. The response is **derived from
the private key held by the signing process** at request time. If the signing key
is absent or unusable, the route answers **`503`** — it never answers with a
different key, and it never degrades to an unsigned contract.

Consequently, a `200` from that endpoint showing this `kid` and this `x`
establishes that **the process serving `api.neomundi.io` holds the private key**
for this public key. That is a stronger claim than "a file containing this key is
published somewhere".

---

## 4. Where this key can be obtained, independently

All channels **MUST** agree on the thumbprint in §2. **If they disagree, do not
trust the contract — contact NeoMundi.**

| # | Channel | Address | What its agreement demonstrates |
|---|---|---|---|
| **1** | Live API endpoint | `GET https://api.neomundi.io/v1/rgc/jwks` | served under a wildcard TLS certificate for `neomundi.io`; the response is derived from the private key in the signing process (§3) |
| **2** | This repository, normative path | [`keys/neomundi-rgc-2026-01.jwk.json`](keys/neomundi-rgc-2026-01.jwk.json) | the key is published in the NeoMundi GitHub organisation under a path that declares it normative, not a test fixture |
| **3** | This repository, consumer reference | [`consumer-reference/rgc_consumer_demo/fixtures/public_jwks.json`](consumer-reference/rgc_consumer_demo/fixtures/public_jwks.json) | the same bytes have been in this repository since **2026-08-18**, which is **before** any pilot artifact signed with this key was issued |
| **4** | Public contract site | `https://interop.neomundi.org/` | a NeoMundi domain delegates a subdomain to this organisation's GitHub Pages, linking the domain and the organisation |

Channels 1, 2 and 3 were confirmed **byte-identical** on 2026-11-02:
SHA-256 `35bff3919ee4c68e93edba0f94da2abe555da1d71de0cbee9fc3e242528e12c3`.

---

## 5. What this document does **not** yet establish

We would rather name the gaps than let a verifier discover them.

| # | Gap | Consequence for a consumer |
|---|---|---|
| **G-1** | **The GitHub organisation `neomundi-io` is not domain-verified.** `GET /orgs/neomundi-io` returns `is_verified: false`, and the `neomundi.io` zone carries no GitHub verification `TXT` record. | "`neomundi-io` is NeoMundi" currently rests on the organisation's **name**. A rigorous verifier should not accept that on its own, and is right not to. |
| **G-2** | **No signed release, no tag.** This repository has `0` releases and `0` tags. | "a signed release" is not available as a channel today. |
| **G-3** | **The commit that first published this key is signed by GitHub's web-flow key**, not by a key NeoMundi holds (`committer.name: GitHub`). | the commit signature attests that an authenticated GitHub account produced it — it moves trust to GitHub, not to NeoMundi. |
| **G-4** | **The zone `neomundi.io` is not DNSSEC-signed** (no `DNSKEY`). | a DNS-based key channel would be a *distinct* channel, not a cryptographically authenticated one. |

**Each of G-1 to G-3 is being addressed; none is addressed yet at the attestation
date.** Until then, the strongest single piece of evidence is §3 — the live
endpoint derives the published key from the private key in use.

---

## 6. Rotation policy

> ⚠ **Not yet agreed. This section states today's observable behaviour and the
> three questions that remain open.** Do not read it as a published policy.

**Today's behaviour, read from the code in service:**

- `GET /v1/rgc/jwks` publishes **only the active key**. Retired keys are not served.
- Server-side verification (`GET /v1/rgc/verify/{request_id}`) verifies the stored
  JWS **with the active key**, without resolving the signature's `kid`.

**Consequence a consumer must act on today:**

> 🔴 **Retain the public key alongside any contract you intend to verify later.**
> After a rotation, the live endpoint would no longer let you verify an older
> contract, and the server-side verification route would report it invalid — with
> nothing having been altered.

**Open questions, pending a NeoMundi decision:**

1. Does a retired key remain published, and at which address?
2. Will the served JWKS publish several keys, or only the active one?
3. What notice period precedes a rotation, and through which channel?

---

## 7. How to verify this document

Recompute the thumbprint from the live endpoint and compare it to §2:

```bash
curl -s https://api.neomundi.io/v1/rgc/jwks
```

```python
import base64, hashlib, json
jwk = json.load(open("jwks.json"))["keys"][0]
canon = json.dumps({"crv": jwk["crv"], "kty": jwk["kty"], "x": jwk["x"]},
                   sort_keys=True, separators=(",", ":"))
print(base64.urlsafe_b64encode(hashlib.sha256(canon.encode()).digest()).decode().rstrip("="))
# expected: 9oDjBYGDMNLrjkFIvVrBMhrV3fdtA0YGNz5xlgcHVCA
```

RFC 7638 for an `OKP` key canonicalises exactly the members `{"crv","kty","x"}` as
sorted compact JSON, hashes with SHA-256, and base64url-encodes without padding.

---

## 8. What a valid signature does and does not prove

| A valid RGC signature proves | It does **not** prove |
|---|---|
| the document is **intact** — the canonical hash over its four signed sections matches | **who** holds the private key, absent this document |
| it was produced by **the holder of the private key** for this `x` | that the measurement described actually ran |
| the five signed claims are **bound to this document**, so the signature cannot be replayed onto another contract | any temporal property — a contract covers one record |

Execution is evidenced by the per-evaluator provenance in the measurement record
(`attempts`, `served_by`, `latency_ms`, `evaluator_runtime`, configuration
fingerprints), **not** by the signature. Both are necessary and they prove
different things.

---

*Public key material only. No private key, seed, token or credential appears in
this document.*
