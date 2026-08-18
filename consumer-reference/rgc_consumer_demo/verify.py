"""Consumer reference — verify a contract's SHA-256 fingerprint + Ed25519/JWS signature.

Uses only the public `GET /v1/rgc/jwks` endpoint and standard libraries
(`cryptography`, `pyjwt`) — no dependency on NeoMundi's internal signing
code. `_canonical_sha256` is re-implemented independently from the public
contract specification rather than imported from NeoMundi's own code, so
this module proves the hash is reproducible by a third party, not just by
NeoMundi itself.
"""

from __future__ import annotations

import base64
import hashlib
import json
from dataclasses import dataclass
from typing import Any

import httpx
import jwt
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat


@dataclass
class VerificationResult:
    hash_match: bool
    signature_valid: bool
    recomputed_hash: str

    @property
    def valid(self) -> bool:
        return self.hash_match and self.signature_valid


def fetch_jwks(base_url: str, *, timeout: float = 10.0) -> dict[str, Any]:
    resp = httpx.get(f"{base_url.rstrip('/')}/v1/rgc/jwks", timeout=timeout)
    resp.raise_for_status()
    return resp.json()


def _jwk_to_public_key(jwk: dict[str, Any]) -> ed25519.Ed25519PublicKey:
    if jwk.get("kty") != "OKP" or jwk.get("crv") != "Ed25519":
        raise ValueError(f"Unsupported JWK type: {jwk.get('kty')}/{jwk.get('crv')}")
    x = jwk["x"]
    raw = base64.urlsafe_b64decode(x + "=" * (-len(x) % 4))
    return ed25519.Ed25519PublicKey.from_public_bytes(raw)


def _canonical_sha256(payload: dict[str, Any]) -> str:
    canonical = json.dumps(payload, sort_keys=True, separators=(",", ":"))
    return hashlib.sha256(canonical.encode("utf-8")).hexdigest()


def recompute_payload_hash(contract: dict[str, Any]) -> str:
    """Rebuilds the exact section set the producer signs: everything except
    `integrity` itself (canonicalization = sorted-json-utf8 over
    {identity, provenance, observation, governance}, per the published
    contract specification)."""
    sections = {
        "identity": contract["identity"],
        "provenance": contract["provenance"],
        "observation": contract["observation"],
        "governance": contract["governance"],
    }
    return _canonical_sha256(sections)


def verify_contract(contract: dict[str, Any], jwks: dict[str, Any]) -> VerificationResult:
    """Independently confirms `integrity.payload_hash` matches the contract
    content AND `integrity.signature` is a valid Ed25519/JWS over that hash,
    signed by the key named in `integrity.key_id`."""
    integrity = contract["integrity"]
    recomputed = recompute_payload_hash(contract)
    hash_match = recomputed == integrity["payload_hash"]

    key_id = integrity["key_id"]
    keys = {k["kid"]: k for k in jwks.get("keys", [])}
    signature_valid = False
    if key_id in keys:
        try:
            public_key = _jwk_to_public_key(keys[key_id])
            pem = public_key.public_bytes(
                encoding=Encoding.PEM, format=PublicFormat.SubjectPublicKeyInfo
            )
            claims = jwt.decode(integrity["signature"], pem, algorithms=["EdDSA"])
            signature_valid = claims.get("payload_hash") == integrity["payload_hash"]
        except Exception:
            signature_valid = False

    return VerificationResult(
        hash_match=hash_match, signature_valid=signature_valid, recomputed_hash=recomputed
    )
