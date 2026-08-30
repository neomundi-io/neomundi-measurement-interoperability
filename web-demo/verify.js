/**
 * Live, in-browser verification logic.
 *
 * This mirrors consumer-reference/rgc_consumer_demo/verify.py and
 * validate.py from the repository: every check below is actually executed
 * in the visitor's browser against the embedded real signed contract — it
 * is not a hardcoded "success" state.
 *
 * Canonicalization matches Python's `json.dumps(sort_keys=True,
 * separators=(",", ":"))` (used by the reference verifier), including its
 * `ensure_ascii=True` escaping and its float formatting (a whole-number
 * float such as 1.0 is serialized as "1.0", not "1"). Getting this exactly
 * right matters: the SHA-256 fingerprint is computed over this exact byte
 * string, so any formatting drift would make a genuine signed contract
 * appear tampered.
 *
 * FLOAT_FIELDS lists the object-signal fields typed `"type": "number"` in
 * schema/contract-v0.1.schema.json (RgcObservedSignals) plus
 * `measurement_coverage` (RgcObservation) — the fields the schema declares
 * as floats, as opposed to `checks_emitted`, which is typed `"integer"`.
 */

const FLOAT_FIELDS = new Set([
  "stability_score",
  "coherence_score",
  "factual_hallucination_score",
  "semantic_instability_score",
  "semantic_risk",
  "confidence",
  "measurement_coverage",
]);

function escapeJsonString(s) {
  let out = '"';
  for (const ch of s) {
    const code = ch.codePointAt(0);
    if (ch === '"') out += '\\"';
    else if (ch === '\\') out += '\\\\';
    else if (code === 0x08) out += '\\b';
    else if (code === 0x0c) out += '\\f';
    else if (code === 0x0a) out += '\\n';
    else if (code === 0x0d) out += '\\r';
    else if (code === 0x09) out += '\\t';
    else if (code < 0x20) out += '\\u' + code.toString(16).padStart(4, '0');
    else if (code > 0x7e) {
      if (code > 0xffff) {
        const c = code - 0x10000;
        const hi = 0xd800 + (c >> 10);
        const lo = 0xdc00 + (c & 0x3ff);
        out += '\\u' + hi.toString(16).padStart(4, '0') + '\\u' + lo.toString(16).padStart(4, '0');
      } else {
        out += '\\u' + code.toString(16).padStart(4, '0');
      }
    } else out += ch;
  }
  return out + '"';
}

function formatFloat(n) {
  let s = String(n);
  if (!s.includes('.') && !s.includes('e') && !s.includes('E')) s += '.0';
  return s;
}

function canonicalize(value, keyName) {
  if (value === null) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') {
    return FLOAT_FIELDS.has(keyName) ? formatFloat(value) : String(value);
  }
  if (typeof value === 'string') return escapeJsonString(value);
  if (Array.isArray(value)) {
    return '[' + value.map((v) => canonicalize(v, keyName)).join(',') + ']';
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return '{' + keys.map((k) => escapeJsonString(k) + ':' + canonicalize(value[k], k)).join(',') + '}';
  }
  throw new Error('Unsupported value in canonical payload: ' + typeof value);
}

/** Canonical payload = {identity, provenance, observation, governance}.
 * `integrity` is excluded from its own hash (see verify.py / README §18). */
function canonicalPayload(contract) {
  const sections = {
    identity: contract.identity,
    provenance: contract.provenance,
    observation: contract.observation,
    governance: contract.governance,
  };
  return canonicalize(sections, null);
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(str) {
  const bytes = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return bytesToHex(new Uint8Array(digest));
}

function base64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const bin = atob(s);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function base64urlDecodeToString(s) {
  return new TextDecoder().decode(base64urlToBytes(s));
}

/** Step 1: recompute and compare the SHA-256 fingerprint. Always runs —
 * SHA-256 via SubtleCrypto is universally supported. */
async function checkHash(contract) {
  const canonical = canonicalPayload(contract);
  const recomputed = await sha256Hex(canonical);
  return {
    recomputed,
    expected: contract.integrity.payload_hash,
    match: recomputed === contract.integrity.payload_hash,
  };
}

/** Step 2: verify the Ed25519/JWS signature and its signed claims, exactly
 * as consumer-reference/rgc_consumer_demo/verify.py does. Uses the WebCrypto
 * Ed25519 algorithm (W3C "Secure Curves" spec) — supported in current
 * Chrome, Edge and Safari; if the running browser lacks it, this reports
 * `supported: false` rather than a false positive. */
async function checkSignature(contract, jwks) {
  const integrity = contract.integrity;
  const parts = integrity.signature.split('.');
  if (parts.length !== 3) {
    return { supported: true, valid: false, reason: 'Malformed compact JWS.' };
  }
  const [headerB64, payloadB64, sigB64] = parts;

  let header, claims;
  try {
    header = JSON.parse(base64urlDecodeToString(headerB64));
    claims = JSON.parse(base64urlDecodeToString(payloadB64));
  } catch (e) {
    return { supported: true, valid: false, reason: 'Could not decode JWS header/payload.' };
  }

  if (header.alg !== 'EdDSA') {
    return { supported: true, valid: false, reason: `Unexpected JWS algorithm: ${header.alg}` };
  }
  if (header.kid !== undefined && header.kid !== integrity.key_id) {
    return { supported: true, valid: false, reason: 'JWS kid does not match integrity.key_id.' };
  }

  const jwk = (jwks.keys || []).find((k) => k.kid === integrity.key_id);
  if (!jwk) {
    return { supported: true, valid: false, reason: `key_id ${integrity.key_id} not found in JWKS.` };
  }

  let signatureValid;
  try {
    const publicKey = await crypto.subtle.importKey(
      'jwk',
      { kty: jwk.kty, crv: jwk.crv, x: jwk.x, key_ops: ['verify'], ext: true },
      { name: 'Ed25519' },
      true,
      ['verify']
    );
    const signingInput = new TextEncoder().encode(headerB64 + '.' + payloadB64);
    const signatureBytes = base64urlToBytes(sigB64);
    signatureValid = await crypto.subtle.verify({ name: 'Ed25519' }, publicKey, signatureBytes, signingInput);
  } catch (e) {
    return { supported: false, valid: false, reason: 'This browser does not support Ed25519 verification via WebCrypto.' };
  }

  const expectedClaims = {
    payload_hash: integrity.payload_hash,
    hash_algorithm: integrity.hash_algorithm,
    schema_version: contract.identity.schema_version,
    request_id: contract.identity.request_id,
    timestamp: contract.identity.timestamp,
  };
  const claimsMatch = Object.entries(expectedClaims).every(([k, v]) => claims[k] === v);

  return {
    supported: true,
    valid: signatureValid && claimsMatch,
    signatureValid,
    claimsMatch,
    keyId: integrity.key_id,
  };
}

/** Step 3: "core structural checks" — a small, named subset of
 * schema/contract-v0.1.schema.json, executed live in JS. This is NOT a full
 * JSON Schema Draft 2020-12 validator (no $ref/allOf resolution, no
 * exhaustive enum/format checking) — that full validation is what
 * consumer-reference/rgc_consumer_demo/validate.py performs with the
 * `jsonschema` library. The gap is stated explicitly in the UI. */
function structuralChecks(contract) {
  const items = [];
  const add = (label, passed) => items.push({ label, passed: !!passed });

  const topKeys = ['identity', 'provenance', 'observation', 'governance', 'integrity'];
  add('Top-level sections present (identity, provenance, observation, governance, integrity)',
    topKeys.every((k) => Object.prototype.hasOwnProperty.call(contract, k)));

  const model = contract.identity && contract.identity.model;
  add('identity.model is pseudonymized or "local" (pattern ^(local|model-[0-9a-f]{12})$)',
    typeof model === 'string' && /^(local|model-[0-9a-f]{12})$/.test(model));

  const coverage = contract.observation && contract.observation.measurement_coverage;
  add('observation.measurement_coverage is within [0.0, 1.0]',
    typeof coverage === 'number' && coverage >= 0 && coverage <= 1);

  const signals = (contract.observation && contract.observation.observed_signals) || {};
  const signalFields = ['stability_score', 'coherence_score', 'factual_hallucination_score', 'semantic_instability_score', 'semantic_risk', 'confidence'];
  add('observed_signals: required fields present, each within [0.0, 1.0]',
    signalFields.every((f) => typeof signals[f] === 'number' && signals[f] >= 0 && signals[f] <= 1));

  const execChanged = contract.governance &&
    contract.governance.governance_boundary &&
    contract.governance.governance_boundary.execution_permission_changed;
  add('governance_boundary.execution_permission_changed === false (schema const)', execChanged === false);

  const payloadHash = contract.integrity && contract.integrity.payload_hash;
  const signature = contract.integrity && contract.integrity.signature;
  add('integrity.payload_hash matches ^[0-9a-f]{64}$ and signature matches compact-JWS shape',
    typeof payloadHash === 'string' && /^[0-9a-f]{64}$/.test(payloadHash) &&
    typeof signature === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(signature));

  const passed = items.every((i) => i.passed);
  return { items, passed };
}

async function runVerification(contract, jwks) {
  const structural = structuralChecks(contract);
  const hash = await checkHash(contract);
  const signature = await checkSignature(contract, jwks);
  return { structural, hash, signature };
}
