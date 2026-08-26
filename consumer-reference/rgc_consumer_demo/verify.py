"""Consumer reference — independently verify SHA-256 + Ed25519/JWS integrity.

Uses only the public `GET /v1/rgc/jwks` endpoint and standard third-party
libraries (`cryptography`, `pyjwt`). No NeoMundi internal signing code is
imported.

The canonical payload hash is independently reconstructed from the public
interoperability specification. This demonstrates that a third-party
consumer can reproduce and verify the integrity proof without access to
NeoMundi's internal measurement engine.

Integrity model
---------------

The payload hash covers the canonical JSON representation of:

    {
        "identity": ...,
        "provenance": ...,
        "observation": ...,
        "governance": ...
    }

The `integrity` section is excluded from its own payload hash.

The Ed25519/JWS signature is expected to bind the following claims:

- payload_hash
- hash_algorithm
- schema_version
- request_id
- timestamp

A signature is considered valid only if:

1. the payload hash recomputed by the consumer matches
   `integrity.payload_hash`;
2. the declared `key_id` exists in the published JWKS;
3. the JWS signature verifies with that public key;
4. the JWS header `kid`, when present, matches `integrity.key_id`;
5. every expected signed claim exactly matches the received contract.

This prevents a cryptographically valid JWS from being accepted when its
signed metadata does not correspond to the contract being consumed.
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
    """Fetch the public NeoMundi Ed25519 verification keys."""
    resp = httpx.get(
        f"{base_url.rstrip('/')}/v1/rgc/jwks",
        timeout=timeout,
    )
    resp.raise_for_status()
    return resp.json()


def _jwk_to_public_key(
    jwk: dict[str, Any],
) -> ed25519.Ed25519PublicKey:
    """Convert an Ed25519 OKP JWK into a cryptography public key."""
    if jwk.get("kty") != "OKP" or jwk.get("crv") != "Ed25519":
        raise ValueError(
            f"Unsupported JWK type: "
            f"{jwk.get('kty')}/{jwk.get('crv')}"
        )

    x = jwk["x"]
    raw = base64.urlsafe_b64decode(
        x + "=" * (-len(x) % 4)
    )

    return ed25519.Ed25519PublicKey.from_public_bytes(raw)


def _canonical_sha256(payload: dict[str, Any]) -> str:
    """Return SHA-256 over canonical sorted compact UTF-8 JSON."""
    canonical = json.dumps(
        payload,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    )
    return hashlib.sha256(
        canonical.encode("utf-8")
    ).hexdigest()


def recompute_payload_hash(contract: dict[str, Any]) -> str:
    """Rebuild the exact contract sections covered by payload_hash.

    Per the published interoperability contract, integrity itself is not
    included in the payload being hashed.

    The canonical payload is therefore:

        {
            identity,
            provenance,
            observation,
            governance
        }
    """
    sections = {
        "identity": contract["identity"],
        "provenance": contract["provenance"],
        "observation": contract["observation"],
        "governance": contract["governance"],
    }

    return _canonical_sha256(sections)


def _expected_signed_claims(
    contract: dict[str, Any],
) -> dict[str, Any]:
    """Build the signed claims expected from the received contract."""
    identity = contract["identity"]
    integrity = contract["integrity"]

    return {
        "payload_hash": integrity["payload_hash"],
        "hash_algorithm": integrity["hash_algorithm"],
        "schema_version": identity["schema_version"],
        "request_id": identity["request_id"],
        "timestamp": identity["timestamp"],
    }


def _signed_claims_match(
    claims: dict[str, Any],
    expected: dict[str, Any],
) -> bool:
    """Require every normative signed claim to match exactly."""
    return all(
        claims.get(name) == value
        for name, value in expected.items()
    )


def verify_contract(
    contract: dict[str, Any],
    jwks: dict[str, Any],
) -> VerificationResult:
    """Independently verify the integrity of one RGC contract.

    Verification covers both layers:

    1. canonical payload integrity through SHA-256;
    2. authenticity and signed metadata binding through Ed25519/JWS.

    Failure of either layer makes the verification result invalid.
    """
    integrity = contract["integrity"]

    recomputed = recompute_payload_hash(contract)
    hash_match = recomputed == integrity["payload_hash"]

    key_id = integrity["key_id"]

    keys = {
        key["kid"]: key
        for key in jwks.get("keys", [])
        if "kid" in key
    }

    signature_valid = False

    if key_id in keys:
        try:
            public_key = _jwk_to_public_key(keys[key_id])

            pem = public_key.public_bytes(
                encoding=Encoding.PEM,
                format=PublicFormat.SubjectPublicKeyInfo,
            )

            signature = integrity["signature"]

            header = jwt.get_unverified_header(signature)

            # The signature algorithm is normative.
            if header.get("alg") != "EdDSA":
                raise ValueError(
                    f"Unexpected JWS algorithm: {header.get('alg')!r}"
                )

            # If the JWS declares a key id, it must be the same key id
            # declared by the contract integrity section.
            header_kid = header.get("kid")
            if header_kid is not None and header_kid != key_id:
                raise ValueError(
                    "JWS kid does not match integrity.key_id."
                )

            claims = jwt.decode(
                signature,
                pem,
                algorithms=["EdDSA"],
                options={
                    "verify_aud": False,
                },
            )

            expected_claims = _expected_signed_claims(contract)

            signature_valid = _signed_claims_match(
                claims,
                expected_claims,
            )

        except Exception:
            signature_valid = False

    return VerificationResult(
        hash_match=hash_match,
        signature_valid=signature_valid,
        recomputed_hash=recomputed,
    )
