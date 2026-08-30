/**
 * NeoMundi Measurement Interoperability — embedded demo data.
 *
 * Everything in this file is copied verbatim from this repository. Nothing
 * here is invented: field names, endpoints, and example values all trace
 * back to a specific file in the repo (see comments below).
 */

/* Source: examples/flagged-review-required.json — a real, historically
 * signed RGC v0.1 observation. Retained unchanged per examples/README.md. */
const CONTRACT_FLAGGED = {"identity":{"schema_version":"0.1.0","request_id":"3d55da6a-8170-4480-a435-b0af0583a9fe","trace_id":"00-3ff43f4daeaa44efce938d816566a094-278bf1314051a6df-01","timestamp":"2026-08-17T16:43:47.547079Z","system_id":"controltower-api","model":"local","mode":"OBS"},"provenance":{"measurement_version":"3.0.0","normalizer_version":"1.0.0","checks_emitted":3,"source_batch_id":null,"canonicalization_method":"sorted-json-utf8"},"observation":{"runtime_scope":"single_request","observation_window":null,"measurement_status":"complete","measurement_coverage":0.6,"observed_signals":{"stability_score":0.615385,"coherence_score":1.0,"factual_hallucination_score":1.0,"semantic_instability_score":0.0,"semantic_risk":0.0,"observation_class":"flagged","confidence":1.0},"limitations":["Measurement reflects a single runtime observation window; it is not a certification of third-party content.","The governance signal is advisory only — it does not grant, refuse, suspend, or modify any execution permission.","Provider/model identity is pseudonymized in this contract and cannot be reversed to the original value."],"measurement_boundary":"This contract measures a single observed runtime signal. It does not evaluate ground truth, does not certify third-party data, and carries no execution authority."},"governance":{"governance_boundary":{"authorization_status":"not_applicable","execution_permission_changed":false},"advisory":{"review_recommendation":"required","review_trigger":["contradiction","overclaim","factual_risk"],"recommended_review_type":["independent_evidence_review","human_validation"],"interpretation_policy":{"policy_id":"rgc-piste-b-advisory","policy_version":"0.1.0"}}},"integrity":{"payload_hash":"6a605bf81bbbf1086289ea974dbfe4011206db0bc9970cfa21aaaf557627811c","hash_algorithm":"sha256","canonicalization":"sorted-json-utf8","signature":"eyJhbGciOiJFZERTQSIsImtpZCI6Im5lb211bmRpLXJnYy0yMDI2LTAxIiwidHlwIjoiSldUIn0.eyJwYXlsb2FkX2hhc2giOiI2YTYwNWJmODFiYmJmMTA4NjI4OWVhOTc0ZGJmZTQwMTEyMDZkYjBiYzk5NzBjZmEyMWFhYWY1NTc2Mjc4MTFjIiwiaGFzaF9hbGdvcml0aG0iOiJzaGEyNTYiLCJzY2hlbWFfdmVyc2lvbiI6IjAuMS4wIiwicmVxdWVzdF9pZCI6IjNkNTVkYTZhLTgxNzAtNDQ4MC1hNDM1LWIwYWYwNTgzYTlmZSIsInRpbWVzdGFtcCI6IjIwMjYtMDgtMTdUMTY6NDM6NDcuNTQ3MDc5WiJ9.tismpbLKt5hG8vYBIF8k42xi35QFGlCZ8bMVavmz-Q0yS1OJRdUDrE5b-izvkczJZh-LvBvmLwBk8RDHdTP_AA","signer_identity":"neomundi-controltower-rgc","key_id":"neomundi-rgc-2026-01","confidentiality_class":"controlled","retention_reference":"governance_logs:3d55da6a-8170-4480-a435-b0af0583a9fe"}};

/* Source: examples/within-bounds-no-review.json — a real, historically
 * signed RGC v0.1 observation. Retained unchanged per examples/README.md. */
const CONTRACT_WITHIN_BOUNDS = {"identity":{"schema_version":"0.1.0","request_id":"c735fe2c-b88f-488a-ab27-aa456e43a556","trace_id":"00-149519e750f0b7e901942da66c9f4693-53f5b5783400c854-01","timestamp":"2026-08-17T21:04:45.245605Z","system_id":"controltower-api","model":"local","mode":"OBS"},"provenance":{"measurement_version":"3.0.0","normalizer_version":"1.0.0","checks_emitted":3,"source_batch_id":null,"canonicalization_method":"sorted-json-utf8"},"observation":{"runtime_scope":"single_request","observation_window":null,"measurement_status":"complete","measurement_coverage":0.6,"observed_signals":{"stability_score":0.923077,"coherence_score":1.0,"factual_hallucination_score":0.0,"semantic_instability_score":0.0,"semantic_risk":0.0,"observation_class":"within_bounds","confidence":1.0},"limitations":["Measurement reflects a single runtime observation window; it is not a certification of third-party content.","The governance signal is advisory only — it does not grant, refuse, suspend, or modify any execution permission.","Provider/model identity is pseudonymized in this contract and cannot be reversed to the original value."],"measurement_boundary":"This contract measures a single observed runtime signal. It does not evaluate ground truth, does not certify third-party data, and carries no execution authority."},"governance":{"governance_boundary":{"authorization_status":"not_applicable","execution_permission_changed":false},"advisory":{"review_recommendation":"not_indicated","review_trigger":[],"recommended_review_type":[],"interpretation_policy":{"policy_id":"rgc-piste-b-advisory","policy_version":"0.1.0"}}},"integrity":{"payload_hash":"746c8e82e28b3048ab6a070901c648fe89a3df7a33324a25fd4a2b16ae96402d","hash_algorithm":"sha256","canonicalization":"sorted-json-utf8","signature":"eyJhbGciOiJFZERTQSIsImtpZCI6Im5lb211bmRpLXJnYy0yMDI2LTAxIiwidHlwIjoiSldUIn0.eyJwYXlsb2FkX2hhc2giOiI3NDZjOGU4MmUyOGIzMDQ4YWI2YTA3MDkwMWM2NDhmZTg5YTNkZjdhMzMzMjRhMjVmZDRhMmIxNmFlOTY0MDJkIiwiaGFzaF9hbGdvcml0aG0iOiJzaGEyNTYiLCJzY2hlbWFfdmVyc2lvbiI6IjAuMS4wIiwicmVxdWVzdF9pZCI6ImM3MzVmZTJjLWI4OGYtNDg4YS1hYjI3LWFhNDU2ZTQzYTU1NiIsInRpbWVzdGFtcCI6IjIwMjYtMDgtMTdUMjE6MDQ6NDUuMjQ1NjA1WiJ9.0Co6a9EN4xRRvfLV_8MCiJO5AWJ1F9SEF84Ck7YP5X5d6NAIGMuaQj2kENIyKHoBOmBQonsupgK1k2pT3Bw5DA","signer_identity":"neomundi-controltower-rgc","key_id":"neomundi-rgc-2026-01","confidentiality_class":"controlled","retention_reference":"governance_logs:c735fe2c-b88f-488a-ab27-aa456e43a556"}};

/* Source: consumer-reference/rgc_consumer_demo/fixtures/public_jwks.json
 * — the public JWKS used by the offline reference consumer demo. This is
 * public-key material only; no private key is included anywhere. */
const JWKS = {"keys":[{"kty":"OKP","crv":"Ed25519","x":"LLjtPDqyfEibFS0oszcaaYZwxdmfw0LN4FJvZBMBJhU","kid":"neomundi-rgc-2026-01","use":"sig","alg":"EdDSA"}]};

const EXAMPLES = {
  flagged: {
    label: "Flagged — review required",
    contract: CONTRACT_FLAGGED,
  },
  within_bounds: {
    label: "Within bounds — no review",
    contract: CONTRACT_WITHIN_BOUNDS,
  },
};

/* Section descriptions paraphrased closely from README.md §2
 * ("Contract structure"). */
const SECTION_INFO = {
  identity: {
    title: "identity",
    blurb: "Identifies and correlates the observation across systems: schema version, request id, W3C trace id, timestamp, system id, pseudonymized model, runtime mode.",
  },
  provenance: {
    title: "provenance",
    blurb: "Technical provenance of the measurement: measurement engine version, normalizer version, number of checks emitted, canonicalization method. No raw conversational content.",
  },
  observation: {
    title: "observation",
    blurb: "The runtime measurement itself: status, coverage, observed signal values, classification, confidence, limitations and the explicit measurement boundary. A bounded signal — not a universal verdict.",
  },
  governance: {
    title: "governance",
    blurb: "Non-binding advisory information. A review recommendation is not an execution authorization and does not replace the consumer's own policy.",
  },
  integrity: {
    title: "integrity",
    blurb: "What independent verification needs: the SHA-256 payload fingerprint, canonicalization method, the Ed25519/JWS signature, signer identity and key_id.",
  },
};
