/**
 * NeoMundi Measurement Interoperability — embedded demo data.
 *
 * Everything in this file is copied verbatim from this repository. Nothing
 * here is invented: field names, endpoints, and example values all trace
 * back to a specific file in the repo (see comments below).
 *
 * STRINGS holds interface copy only (EN/FR). JSON field names, standardized
 * technical terms (SHA-256, Ed25519/JWS, JWKS, Schema, JSON, API, endpoint)
 * and the contract examples themselves are never translated and never live
 * in this object.
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
  flagged: { contract: CONTRACT_FLAGGED },
  within_bounds: { contract: CONTRACT_WITHIN_BOUNDS },
};

/**
 * Interface copy, EN/FR. Section blurbs are paraphrased closely from
 * README.md §2 ("Contract structure"). Section names themselves
 * (identity/provenance/observation/governance/integrity) are JSON field
 * names and are never translated — they live only in index.html/script.js.
 */
const STRINGS = {
  en: {
    hero: {
      brand: "NeoMundi Measurement Interoperability",
      tagline: "One measurement contract. Every infrastructure.",
      headline: "NeoMundi measures. Your infrastructure decides.",
      sub: "A public, versioned, cryptographically signed contract for transporting a NeoMundi runtime measurement into your infrastructure — structured so any external system can validate it, verify its integrity and origin independently, and apply its own interpretation and policy.",
    },
    flow: {
      ariaLabel: "Contract flow",
      step1: "AI system",
      step2: "NeoMundi measurement",
      step3: "Signed JSON",
      step4: "Verify",
      step5: "Consume",
      step6: "Decide",
      boundaryLabel: "consumer boundary",
      boundaryAria: "Consumer boundary",
      caption: "Left of the boundary: what NeoMundi standardizes — transport and verification of the measurement. Right of the boundary: interpretation, policy, thresholds and enforcement, which stay entirely with the consumer.",
    },
    badges: {
      json: "JSON, machine-readable",
      schema: "Schema versioned",
      sha256: "SHA-256 integrity",
      sig: "Ed25519 / JWS signature",
      verify: "Independent verification",
      control: "Consumer keeps control",
    },
    contract: {
      title: "The contract",
      exampleAria: "Example contract",
      exampleFlagged: "Flagged — review required",
      exampleWithinBounds: "Within bounds — no review",
      note: "Two real historically signed RGC v0.1 observations from <code>examples/</code> in the repository. Unmodified.",
      sectionsAria: "Contract sections",
      legendDefault: "Select a section above to see what it's for.",
    },
    sections: {
      identity: { blurb: "Identifies and correlates the observation across systems: schema version, request id, W3C trace id, timestamp, system id, pseudonymized model, runtime mode." },
      provenance: { blurb: "Technical provenance of the measurement: measurement engine version, normalizer version, number of checks emitted, canonicalization method. No raw conversational content." },
      observation: { blurb: "The runtime measurement itself: status, coverage, observed signal values, classification, confidence, limitations and the explicit measurement boundary. A bounded signal — not a universal verdict." },
      governance: { blurb: "Non-binding advisory information. A review recommendation is not an execution authorization and does not replace the consumer's own policy." },
      integrity: { blurb: "What independent verification needs: the SHA-256 payload fingerprint, canonicalization method, the Ed25519/JWS signature, signer identity and key_id." },
    },
    verify: {
      title: "How your infrastructure verifies it",
      note: "Only endpoints and primitives this repository actually documents or uses.",
      tabsAria: "Verification language",
      curlCaption1: "Public schema and verification keys — README §11.",
      curlCaption2: "Obtain a contract for an existing observation — README §12 (requires an API key).",
      pythonCaption: "Adapted from <code>consumer-reference/rgc_consumer_demo/verify.py</code> in this repository — standard library + <code>cryptography</code> and <code>pyjwt</code> only, no NeoMundi internal code.",
      jsCaption: "Runs live, in this page, against the example selected on the left — via <code>SubtleCrypto</code> (SHA-256 always; Ed25519 where the browser's WebCrypto implements it).",
      runButton: "Run live verification",
      running: "Running…",
      runError: "Verification failed to run: ",
      runDone: "Done — ran against the \"{example}\" example.",
    },
    terminal: {
      title: "CONTRACT RECEIVED",
      labelSchema: "Schema",
      labelHash: "SHA-256",
      labelSignature: "Signature",
      labelKey: "Key",
      labelMeasurement: "Measurement",
      labelControl: "CONTROL",
      schemaPassed: "core structural checks passed",
      schemaFailed: "core structural checks FAILED",
      schemaScope: "Checked: required sections, model pattern, coverage range, execution_permission_changed=false. Not checked here: full JSON Schema Draft 2020-12 (all $ref / enum / format rules) — <a href=\"https://github.com/neomundi-io/neomundi-measurement-interoperability/blob/main/consumer-reference/rgc_consumer_demo/validate.py\" target=\"_blank\" rel=\"noopener\">run the reference Python validator</a> for that.",
      hashMatch: "MATCH",
      hashMismatch: "MISMATCH (recomputed {hash}…)",
      hashScopeStatic: "Precomputed. Enable JavaScript to recompute this fingerprint live, in your browser, from the raw contract.",
      hashScopeLive: "Recomputed live, in your browser, from the raw contract via SubtleCrypto SHA-256.",
      sigVerified: "VERIFIED (Ed25519/JWS)",
      sigNotVerified: "NOT VERIFIED — signature or signed claims did not match",
      sigNotSupported: "NOT VERIFIED IN THIS BROWSER",
      sigScopeStatic: "Precomputed. Enable JavaScript to verify this Ed25519/JWS signature live against the public JWKS.",
      sigScopeLiveSupported: "Verified live, in your browser, against the public JWKS (GET /v1/rgc/jwks) via SubtleCrypto Ed25519.",
      sigScopeLiveUnsupported: "Live verification was attempted in your browser.",
      sigReason: "This browser's WebCrypto does not implement Ed25519 verification — the check above could not run here. Verify with the reference Python verifier (verify.py) instead.",
      keyResolved: "RESOLVED",
      keyNotFound: "NOT FOUND",
      keyScope: "Found in the published JWKS (<code>GET /v1/rgc/jwks</code>).",
      measurementDetail: "available to consumer",
      controlDetail: "remains with your infrastructure",
      noscript: "JavaScript is disabled: the Schema/SHA-256/Signature/Key lines above show the documented outcome for this exact signed example, not a live recomputation. Enable JavaScript to re-run every check in your own browser.",
    },
    json: {
      noscript: "Enable JavaScript for the interactive version: switch examples, highlight sections, and re-verify this contract live in your browser.",
    },
    cta: {
      schema: "View JSON Schema",
      github: "View on GitHub",
      guide: "Integration Guide",
    },
    footnote: "NeoMundi provides the measurement signal and its verifiable trace. It does not grant, revoke, or otherwise alter execution permission, and does not require access to your policy engine, thresholds, or enforcement logic.",
  },

  fr: {
    hero: {
      brand: "NeoMundi Measurement Interoperability",
      tagline: "Un seul contrat de mesure. Toutes les infrastructures.",
      headline: "NeoMundi mesure. Votre infrastructure décide.",
      sub: "Un contrat public, versionné et signé cryptographiquement pour transporter une mesure runtime NeoMundi vers votre infrastructure — structuré pour qu'un système externe puisse le valider, vérifier son intégrité et son origine de façon indépendante, et appliquer sa propre interprétation et sa propre politique.",
    },
    flow: {
      ariaLabel: "Flux du contrat",
      step1: "Système IA",
      step2: "Mesure NeoMundi",
      step3: "JSON signé",
      step4: "Vérifier",
      step5: "Consommer",
      step6: "Décider",
      boundaryLabel: "frontière consommateur",
      boundaryAria: "Frontière consommateur",
      caption: "À gauche de la frontière : ce que NeoMundi standardise — le transport et la vérification de la mesure. À droite de la frontière : l'interprétation, la politique, les seuils et l'application des règles, qui restent entièrement du côté du consommateur.",
    },
    badges: {
      json: "JSON, lisible par machine",
      schema: "Schema versionné",
      sha256: "Intégrité SHA-256",
      sig: "Signature Ed25519 / JWS",
      verify: "Vérification indépendante",
      control: "Le consommateur garde le contrôle",
    },
    contract: {
      title: "Le contrat",
      exampleAria: "Exemple de contrat",
      exampleFlagged: "Signalé — revue requise",
      exampleWithinBounds: "Dans les limites — aucune revue",
      note: "Deux observations RGC v0.1 réellement signées, historiques, issues de <code>examples/</code> dans le dépôt. Non modifiées.",
      sectionsAria: "Sections du contrat",
      legendDefault: "Sélectionnez une section ci-dessus pour voir à quoi elle sert.",
    },
    sections: {
      identity: { blurb: "Identifie et met en corrélation l'observation entre systèmes : version du schema, request id, trace id W3C, horodatage, system id, modèle pseudonymisé, mode runtime." },
      provenance: { blurb: "Provenance technique de la mesure : version du moteur de mesure, version du normaliseur, nombre de checks émis, méthode de canonicalisation. Aucun contenu conversationnel brut." },
      observation: { blurb: "La mesure runtime elle-même : statut, couverture, valeurs des signaux observés, classification, confiance, limitations et frontière de mesure explicite. Un signal borné — pas un verdict universel." },
      governance: { blurb: "Information consultative non contraignante. Une recommandation de revue n'est pas une autorisation d'exécution et ne remplace pas la politique propre du consommateur." },
      integrity: { blurb: "Ce dont a besoin la vérification indépendante : l'empreinte SHA-256 du payload, la méthode de canonicalisation, la signature Ed25519/JWS, l'identité du signataire et le key_id." },
    },
    verify: {
      title: "Comment votre infrastructure la vérifie",
      note: "Uniquement des endpoints et primitives que ce dépôt documente ou utilise réellement.",
      tabsAria: "Langage de vérification",
      curlCaption1: "Schema public et clés de vérification — README §11.",
      curlCaption2: "Obtenir un contrat pour une observation existante — README §12 (nécessite une clé API).",
      pythonCaption: "Adapté de <code>consumer-reference/rgc_consumer_demo/verify.py</code> dans ce dépôt — bibliothèque standard + <code>cryptography</code> et <code>pyjwt</code> uniquement, aucun code interne NeoMundi.",
      jsCaption: "S'exécute en direct, dans cette page, sur l'exemple sélectionné à gauche — via <code>SubtleCrypto</code> (SHA-256 toujours ; Ed25519 lorsque le WebCrypto du navigateur l'implémente).",
      runButton: "Lancer la vérification en direct",
      running: "En cours…",
      runError: "Échec de l'exécution de la vérification : ",
      runDone: "Terminé — exécuté sur l'exemple « {example} ».",
    },
    terminal: {
      title: "CONTRAT REÇU",
      labelSchema: "Schema",
      labelHash: "SHA-256",
      labelSignature: "Signature",
      labelKey: "Clé",
      labelMeasurement: "Mesure",
      labelControl: "CONTRÔLE",
      schemaPassed: "contrôles structurels de base réussis",
      schemaFailed: "contrôles structurels de base EN ÉCHEC",
      schemaScope: "Vérifié : sections requises, pattern du modèle, plage de couverture, execution_permission_changed=false. Non vérifié ici : JSON Schema Draft 2020-12 complet (tous les $ref / enum / format) — <a href=\"https://github.com/neomundi-io/neomundi-measurement-interoperability/blob/main/consumer-reference/rgc_consumer_demo/validate.py\" target=\"_blank\" rel=\"noopener\">exécutez le validateur Python de référence</a> pour cela.",
      hashMatch: "CORRESPONDANCE",
      hashMismatch: "NE CORRESPOND PAS (recalculé {hash}…)",
      hashScopeStatic: "Précalculé. Activez JavaScript pour recalculer cette empreinte en direct, dans votre navigateur, à partir du contrat brut.",
      hashScopeLive: "Recalculée en direct, dans votre navigateur, à partir du contrat brut via SubtleCrypto SHA-256.",
      sigVerified: "VÉRIFIÉE (Ed25519/JWS)",
      sigNotVerified: "NON VÉRIFIÉE — signature ou claims signées non concordantes",
      sigNotSupported: "NON VÉRIFIÉE DANS CE NAVIGATEUR",
      sigScopeStatic: "Précalculé. Activez JavaScript pour vérifier cette signature Ed25519/JWS en direct par rapport à la JWKS publique.",
      sigScopeLiveSupported: "Vérifiée en direct, dans votre navigateur, par rapport à la JWKS publique (GET /v1/rgc/jwks) via SubtleCrypto Ed25519.",
      sigScopeLiveUnsupported: "Une vérification en direct a été tentée dans votre navigateur.",
      sigReason: "Le WebCrypto de ce navigateur n'implémente pas la vérification Ed25519 — le contrôle ci-dessus n'a pas pu s'exécuter ici. Vérifiez plutôt avec le vérificateur Python de référence (verify.py).",
      keyResolved: "RÉSOLUE",
      keyNotFound: "INTROUVABLE",
      keyScope: "Trouvée dans la JWKS publiée (<code>GET /v1/rgc/jwks</code>).",
      measurementDetail: "disponible pour le consommateur",
      controlDetail: "reste entre les mains de votre infrastructure",
      noscript: "JavaScript est désactivé : les lignes Schema/SHA-256/Signature/Clé ci-dessus montrent le résultat documenté pour cet exemple signé, pas un recalcul en direct. Activez JavaScript pour relancer chaque contrôle dans votre propre navigateur.",
    },
    json: {
      noscript: "Activez JavaScript pour la version interactive : changer d'exemple, surligner les sections, et revérifier ce contrat en direct dans votre navigateur.",
    },
    cta: {
      schema: "Voir le JSON Schema",
      github: "Voir sur GitHub",
      guide: "Guide d'intégration",
    },
    footnote: "NeoMundi fournit le signal de mesure et sa trace vérifiable. Il n'accorde, ne révoque ni ne modifie l'autorisation d'exécution, et ne nécessite pas d'accès à votre moteur de politique, vos seuils ou votre logique de mise en application.",
  },
};
