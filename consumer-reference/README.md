# NeoMundi Measurement Interoperability — Reference Consumer

[🇬🇧 English](#english) · [🇫🇷 Français](#français) · [Main README](../README.md) · [Examples](../examples/README.md)

---

# English

## Purpose

This directory contains the **reference consumer implementation** for the NeoMundi Measurement Interoperability Contract.

Its purpose is to demonstrate how an independent third-party infrastructure can consume, validate, verify and act upon a NeoMundi measurement contract **without importing NeoMundi's internal producer or measurement-engine code**.

The reference flow is:

```text
contract
    ↓
schema-version match
    ↓
JSON Schema validation
    ↓
sovereignty checks
    ↓
SHA-256 payload verification
    ↓
Ed25519/JWS signature + signed-claims verification
    ↓
consumer-defined routing
    ↓
auditable receipt
```

NeoMundi provides a measurement signal and its verifiable trace.

**The consuming infrastructure retains interpretation, policy, decision and action.**

The interoperability layer defines how the measurement may be consumed safely. It does not disclose or require reconstruction of NeoMundi's internal measurement engine.

---

## Core boundary

The contract preserves a strict separation between:

```text
measurement
    ↓
verifiable interoperability signal
    ↓
────────────────────────────
    consumer boundary
────────────────────────────
    ↓
interpretation
    ↓
policy
    ↓
decision
    ↓
action
```

NeoMundi measures.

The consumer decides what to do with the measurement.

A valid NeoMundi contract does **not** by itself:

* authorize execution;
* refuse execution;
* certify an AI system as safe;
* establish truth outside the declared measurement scope;
* make claims about dimensions that were not measured.

---

## Epistemic boundary — RGC v0.2

RGC v0.2 makes the epistemic limits of a runtime observation explicit.

The governing principle is:

> **Absence of evidence is only meaningful over the measured domain.**

This means that a contract must distinguish between:

```text
MEASURED + NO SIGNAL
```

and:

```text
NOT MEASURED
INSUFFICIENT COVERAGE
```

An unmeasured signal must never be represented by an invented reassuring numeric value.

In v0.2, each observed signal therefore has an explicit measurement status:

```text
measured
not_measured
insufficient_coverage
```

When a signal is actually measured, its value is numeric.

When no valid measurement was produced, its value is `null`.

`null` must never be interpreted as:

```text
0.0
safe
normal
within_bounds
no risk
```

---

## Observation-level coverage

RGC v0.2 also makes observation-level measurement coverage normative.

```text
measurement_status = complete
```

requires:

```text
measurement_coverage = 1.0
```

and:

```text
measurement_status = partial
```

requires:

```text
measurement_coverage < 1.0
```

This prevents a partial observation from being represented as complete.

Measurement coverage describes the fraction of the declared measurement boundary actually covered by the observation.

It must not automatically be interpreted as the proportion of individual signal fields that were measured.

---

## Meaning of `within_bounds`

In RGC v0.2:

```text
observation_class = within_bounds
```

means only:

> No threshold-crossing signal was detected **within the measured domain**.

It does **not** mean:

* every possible dimension was measured;
* the system is globally safe;
* no issue exists outside the measurement boundary;
* unmeasured signals are equivalent to zero.

Likewise, a partial observation may legitimately be:

```text
observation_class = flagged
```

if a measured signal crosses an applicable threshold within the measured domain.

A third state is available when the evidence does not support either classification:

```text
observation_class = not_assessed
```

---

## Temporal boundary

A record with:

```text
runtime_scope = single_request
```

describes one runtime observation only.

A single record cannot by itself establish:

* frequency;
* persistence;
* recurrence;
* trend;
* drift.

Those properties require comparison across a series of observations.

The interoperability contract therefore prevents a single-request record from being interpreted as evidence of temporal behavior that it does not measure.

---

## What the reference consumer does

The reference implementation demonstrates the following operations.

### 1. Match the schema version

Before interpreting a contract, the reference consumer verifies that:

```text
contract.identity.schema_version == schema.version
```

A consumer must never silently validate a contract produced under one schema version against another schema version.

For example:

```text
contract v0.2 + schema v0.1
```

must be rejected.

This protects the semantics of versioned interoperability.

---

### 2. Validate the contract

The received payload is validated against its corresponding public JSON Schema.

Schema validation checks both structural and normative interoperability rules.

Under v0.2 this includes, among other constraints:

* consistency between measurement status and coverage;
* explicit per-signal measurement status;
* nullability of unmeasured signals;
* consistency between signal status and signal value.

A contract that does not comply with its declared schema is rejected before routing.

---

### 3. Check sovereignty constraints

The consumer independently verifies that the interoperability contract does not expose prohibited raw content.

The reference implementation checks that the contract does not contain:

* raw user prompts;
* raw model responses;
* raw provider/model identifiers.

The model identifier must remain pseudonymized or be represented as:

```text
local
```

The consumer also independently verifies:

```json
{
  "execution_permission_changed": false
}
```

This provides defense in depth for the governance boundary.

---

### 4. Verify the payload fingerprint

The consumer independently recalculates the SHA-256 fingerprint of the canonical contract payload and compares it with:

```text
integrity.payload_hash
```

The hashed payload contains:

```text
identity
provenance
observation
governance
```

The `integrity` section is excluded from its own hash.

This enables a third party to detect any modification of the signed measurement contract.

---

### 5. Verify the cryptographic signature

The consumer verifies the Ed25519/JWS signature using the public key identified by:

```text
integrity.key_id
```

The public verification keys are available through:

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

The reference verifier checks the signed claim set:

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

It also checks that:

* the JWS algorithm is `EdDSA`;
* the declared key exists in the published JWKS;
* the JWS `kid`, when present, matches `integrity.key_id`;
* all signed claims correspond exactly to the contract received.

A cryptographically valid signature is therefore not sufficient if the signed metadata does not correspond to the received contract.

---

### 6. Apply consumer-defined routing

The reference implementation includes one example consumer-defined routing policy.

For example:

```text
review_recommendation = required
            ↓
       pause workflow
            ↓
        human review
```

This is a **consumer policy example**.

It is not an execution rule imposed by NeoMundi.

The demonstration currently maps:

```text
required
    → pause_and_escalate

recommended
    → flag_for_review

not_indicated
    → proceed
```

These are consumer-side actions.

In particular:

```text
review_recommendation = not_indicated
```

does **not** mean:

```text
safe
fully measured
risk-free
certified
```

It means only that the example consumer policy does not indicate review for that observation.

The resulting consumer action never extends the NeoMundi measurement boundary.

---

### 7. Store an auditable receipt

The reference consumer demonstrates how a receiving system can retain a versioned and auditable receipt after processing a contract.

The receipt preserves evidence of:

* request identifier;
* schema version;
* payload hash;
* verification key;
* hash verification result;
* signature verification result;
* consumer routing result;
* routing rationale;
* processing time;
* complete contract received.

This allows v0.1 and v0.2 observations to remain distinguishable in the consumer audit trail.

---

## Reference modules

The reference implementation is organized around the following components:

| Module           | Role                                           |
| ---------------- | ---------------------------------------------- |
| `validate.py`    | JSON Schema validation                         |
| `verify.py`      | SHA-256 and Ed25519/JWS verification           |
| `sovereignty.py` | Data sovereignty and execution-boundary checks |
| `routing.py`     | Example consumer-defined routing               |
| `storage.py`     | Versioned auditable receipt storage            |
| `connector.py`   | Consumer processing orchestration              |
| `cli.py`         | End-to-end demonstration                       |

The implementation is deliberately independent from NeoMundi producer code.

---

## Offline demonstration

The historical v0.1 reference consumer can be executed without a live NeoMundi server.

From the `consumer-reference/` directory:

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

The historical offline demonstration uses:

* two real signed NeoMundi v0.1 contracts from `../examples/`;
* the public v0.1 schema from `../schema/contract-v0.1.schema.json`;
* the NeoMundi public JWKS stored locally in `rgc_consumer_demo/fixtures/public_jwks.json`.

No NeoMundi API key is required.

The private signing key is never included.

The local JWKS contains only the public key required to independently verify the Ed25519/JWS signatures of the published v0.1 example contracts.

Expected historical result:

```text
hash_match=True
signature_valid=True
```

for both signed v0.1 contracts.

These signed observations are retained unchanged for reproducibility.

They should not be rewritten retrospectively to conform to v0.2 semantics.

---

## RGC v0.2 fixtures

RGC v0.2 introduces corrected epistemic semantics for partial measurements.

Illustrative v0.2 fixtures are stored under:

```text
../examples/fixtures/
```

They demonstrate cases such as:

```text
partial coverage
+
measured signals
+
not_measured signals
+
insufficient_coverage
```

and:

```text
partial coverage
+
flagged measured evidence
```

These fixtures demonstrate the structure and semantics of v0.2.

Unless explicitly generated and signed by the canonical NeoMundi producer, illustrative fixtures must **not** be presented as cryptographically valid live observations.

Production-valid v0.2 examples must be generated, hashed and signed through the canonical producer.

---

## Consume a real NeoMundi contract

For a contract already obtained from NeoMundi:

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

The consumer may also receive the corresponding schema and JWKS directly from local storage or cache.

A contract must always be processed against the schema version it declares.

The exact public API mechanism for retrieving multiple schema versions should be treated as an API contract in its own right and must not be assumed by consumer implementations.

---

## Using the consumer as a library

Example:

```python
from rgc_consumer_demo.connector import process_contract, ContractRejected
from rgc_consumer_demo.storage import ReceiptStore

store = ReceiptStore("receipts.db")

try:
    result = process_contract(
        contract,
        base_url="https://api.neomundi.io",
        store=store,
    )

    print(result.routing.action)
    print(result.routing.reason)

except ContractRejected as exc:
    print(f"Contract rejected: {exc}")
```

A rejected contract must not be used as the basis for a consumer action.

Successful processing, however, should also not be interpreted as an AI safety certification.

It means that the contract:

1. corresponds to its schema;
2. respects the interoperability sovereignty boundary;
3. passes its cryptographic integrity checks;
4. has been processed according to the consumer's chosen policy.

---

## Responsibility boundary

The reference consumer demonstrates the intended separation of responsibilities:

```text
NeoMundi
    ↓
runtime measurement
    ↓
signed interoperability contract
    ↓
────────────────────────────
       system boundary
────────────────────────────
    ↓
consumer verification
    ↓
consumer interpretation
    ↓
consumer policy
    ↓
consumer action
```

The reference implementation shows **one possible consumer behavior**.

It does not define what every consumer must do.

NeoMundi supplies the measurement primitive and its verifiable trace.

**The consumer owns the value created from that signal.**

---

## Versions and examples

### RGC v0.1

RGC v0.1 remains available for:

* historical reproducibility;
* verification of existing signed observations;
* compatibility with existing pilot artifacts.

Existing signed v0.1 examples must remain unchanged because changing their contents would invalidate their payload hashes and Ed25519 signatures.

### RGC v0.2

RGC v0.2 introduces the corrected epistemic semantics for:

* partial measurement;
* per-signal measurement status;
* nullable unmeasured signals;
* measured-domain interpretation;
* observation-level coverage consistency;
* temporal boundaries for single-request observations.

The core principle is:

> **Absence of evidence is only meaningful over the measured domain.**

RGC v0.2 is introduced as a new version rather than as a retrospective rewrite of v0.1.

---

# Français

## Objectif

Ce dossier contient l’**implémentation consommateur de référence** du NeoMundi Measurement Interoperability Contract.

Son objectif est de montrer comment une infrastructure tierce indépendante peut consommer, valider, vérifier et utiliser un contrat de mesure NeoMundi **sans importer le code interne du producteur ou du moteur de mesure NeoMundi**.

Le flux de référence est :

```text
contrat
    ↓
correspondance de version du schéma
    ↓
validation JSON Schema
    ↓
contrôles de souveraineté
    ↓
vérification SHA-256
    ↓
vérification Ed25519/JWS + claims signées
    ↓
routage défini par le consommateur
    ↓
reçu auditable
```

NeoMundi fournit un signal de mesure et sa trace vérifiable.

**L’infrastructure consommatrice conserve l’interprétation, la politique, la décision et l’action.**

La couche d’interopérabilité définit comment la mesure peut être consommée de manière sûre. Elle ne révèle pas et n’exige pas la reconstruction du moteur interne de mesure NeoMundi.

---

## Frontière fondamentale

Le contrat maintient une séparation stricte entre :

```text
mesure
    ↓
signal d’interopérabilité vérifiable
    ↓
────────────────────────────
   frontière consommateur
────────────────────────────
    ↓
interprétation
    ↓
politique
    ↓
décision
    ↓
action
```

NeoMundi mesure.

Le consommateur décide de ce qu’il fait de cette mesure.

Un contrat NeoMundi valide ne constitue pas à lui seul :

* une autorisation d’exécution ;
* un refus d’exécution ;
* une certification de sécurité d’un système IA ;
* une conclusion de vérité hors du périmètre mesuré ;
* une conclusion sur des dimensions qui n’ont pas été mesurées.

---

## Frontière épistémique — RGC v0.2

RGC v0.2 rend explicites les limites épistémiques d’une observation runtime.

Le principe directeur est :

> **L’absence de preuve n’est significative que dans le domaine effectivement mesuré.**

Le contrat doit donc distinguer :

```text
MESURÉ + AUCUN SIGNAL
```

de :

```text
NON MESURÉ
COUVERTURE INSUFFISANTE
```

Un signal qui n’a pas été mesuré ne doit jamais recevoir artificiellement une valeur numérique rassurante.

Dans v0.2, chaque signal possède donc un statut explicite :

```text
measured
not_measured
insufficient_coverage
```

Lorsqu’un signal est effectivement mesuré, sa valeur est numérique.

Lorsqu’aucune mesure valide n’a été produite, sa valeur est `null`.

`null` ne doit jamais être interprété comme :

```text
0.0
sûr
normal
within_bounds
absence de risque
```

---

## Couverture de l’observation

RGC v0.2 rend également normative la cohérence entre statut et couverture.

```text
measurement_status = complete
```

exige :

```text
measurement_coverage = 1.0
```

et :

```text
measurement_status = partial
```

exige :

```text
measurement_coverage < 1.0
```

Une observation partielle ne peut donc plus être représentée comme complète.

La couverture représente la fraction de la frontière de mesure déclarée effectivement couverte par l’observation.

Elle ne doit pas être automatiquement interprétée comme le pourcentage de champs de signaux individuels mesurés.

---

## Signification de `within_bounds`

Dans RGC v0.2 :

```text
observation_class = within_bounds
```

signifie uniquement :

> Aucun franchissement de seuil n’a été détecté **dans le domaine effectivement mesuré**.

Cela ne signifie pas :

* que toutes les dimensions possibles ont été mesurées ;
* que le système est globalement sûr ;
* qu’aucun problème n’existe hors de la frontière de mesure ;
* qu’un signal non mesuré équivaut à zéro.

Inversement, une observation partielle peut légitimement être :

```text
observation_class = flagged
```

si un signal effectivement mesuré franchit un seuil applicable dans le domaine couvert.

Un troisième état existe lorsque les éléments disponibles ne permettent pas de soutenir l’une ou l’autre classification :

```text
observation_class = not_assessed
```

---

## Frontière temporelle

Un record avec :

```text
runtime_scope = single_request
```

décrit uniquement une observation runtime.

À lui seul, un record ne peut pas établir :

* une fréquence ;
* une persistance ;
* une récurrence ;
* une tendance ;
* un drift.

Ces propriétés nécessitent une série d’observations.

Le contrat empêche ainsi qu’une observation ponctuelle soit interprétée comme décrivant une propriété temporelle qu’elle ne mesure pas.

---

## Ce que fait le consommateur de référence

### 1. Vérifier la version du schéma

Avant d’interpréter le contrat, le consommateur vérifie :

```text
contract.identity.schema_version == schema.version
```

Un consommateur ne doit jamais valider silencieusement un contrat produit sous une version contre le schéma d’une autre version.

Par exemple :

```text
contrat v0.2 + schéma v0.1
```

doit être rejeté.

---

### 2. Valider le contrat

Le payload reçu est validé contre le JSON Schema public correspondant à sa version.

Pour v0.2, cela permet notamment de contrôler :

* la cohérence statut/couverture ;
* le statut individuel de chaque signal ;
* la possibilité de représenter une absence de mesure par `null` ;
* la cohérence entre statut du signal et valeur du signal.

Un contrat non conforme est rejeté avant le routage.

---

### 3. Vérifier les contraintes de souveraineté

Le consommateur contrôle indépendamment que le contrat n’expose pas de contenu brut interdit.

L’implémentation de référence vérifie notamment l’absence de :

* prompts utilisateurs bruts ;
* réponses brutes des modèles ;
* identifiants bruts fournisseur/modèle.

L’identifiant du modèle doit rester pseudonymisé ou être représenté par :

```text
local
```

Le consommateur vérifie également :

```json
{
  "execution_permission_changed": false
}
```

Cette vérification constitue une défense supplémentaire de la frontière de gouvernance.

---

### 4. Vérifier l’empreinte du payload

Le consommateur recalcule indépendamment l’empreinte SHA-256 du payload canonique et la compare à :

```text
integrity.payload_hash
```

Le payload hashé contient :

```text
identity
provenance
observation
governance
```

La section `integrity` n’est pas incluse dans sa propre empreinte.

---

### 5. Vérifier la signature cryptographique

Le consommateur vérifie la signature Ed25519/JWS à partir de la clé publique identifiée par :

```text
integrity.key_id
```

Les clés publiques sont disponibles via :

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

Le consommateur vérifie également les claims signées :

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

Il contrôle aussi :

* que l’algorithme JWS est `EdDSA` ;
* que la clé déclarée existe dans le JWKS public ;
* que le `kid` du JWS, lorsqu’il est présent, correspond à `integrity.key_id` ;
* que toutes les claims signées correspondent exactement au contrat reçu.

---

### 6. Appliquer un routage défini par le consommateur

L’implémentation contient une politique consommateur d’exemple.

```text
required
    → pause_and_escalate

recommended
    → flag_for_review

not_indicated
    → proceed
```

Il s’agit uniquement d’un **exemple de politique consommateur**.

Ce n’est pas une règle d’exécution imposée par NeoMundi.

En particulier :

```text
review_recommendation = not_indicated
```

ne signifie pas :

```text
sûr
entièrement mesuré
sans risque
certifié
```

Cela signifie seulement que cette politique consommateur d’exemple n’indique pas de revue pour cette observation.

---

### 7. Conserver un reçu auditable

Le consommateur conserve un reçu versionné comprenant notamment :

* request ID ;
* version du schéma ;
* payload hash ;
* clé de vérification ;
* résultat de vérification du hash ;
* résultat de vérification de signature ;
* action consommateur ;
* justification du routage ;
* moment du traitement ;
* contrat complet reçu.

La version du schéma est donc conservée explicitement dans la trace consommateur.

---

## Modules de référence

| Module           | Rôle                                                  |
| ---------------- | ----------------------------------------------------- |
| `validate.py`    | Validation JSON Schema                                |
| `verify.py`      | Vérification SHA-256 et Ed25519/JWS                   |
| `sovereignty.py` | Contrôles de souveraineté et de frontière d’exécution |
| `routing.py`     | Exemple de routage consommateur                       |
| `storage.py`     | Stockage de reçus versionnés et auditables            |
| `connector.py`   | Orchestration du traitement                           |
| `cli.py`         | Démonstration de bout en bout                         |

L’implémentation reste volontairement indépendante du code producteur NeoMundi.

---

## Démonstration hors ligne

La démonstration historique v0.1 peut fonctionner sans serveur NeoMundi actif.

Depuis `consumer-reference/` :

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

Elle utilise :

* deux contrats NeoMundi v0.1 réels et signés depuis `../examples/` ;
* `../schema/contract-v0.1.schema.json` ;
* le JWKS public local dans `rgc_consumer_demo/fixtures/public_jwks.json`.

Aucune clé API NeoMundi n’est nécessaire.

La clé privée n’est jamais incluse.

Le résultat historique attendu est :

```text
hash_match=True
signature_valid=True
```

pour les deux contrats v0.1 signés.

Ces observations doivent rester inchangées afin de préserver leur reproductibilité historique et leur signature.

Elles ne doivent pas être réécrites rétrospectivement selon les règles de v0.2.

---

## Fixtures RGC v0.2

Les exemples illustratifs v0.2 sont conservés dans :

```text
../examples/fixtures/
```

Ils démontrent notamment :

```text
couverture partielle
+
signaux mesurés
+
signaux non mesurés
+
couverture insuffisante
```

ainsi que :

```text
couverture partielle
+
signal mesuré conduisant à flagged
```

Ces fixtures servent à démontrer la structure et la sémantique v0.2.

Tant qu’elles n’ont pas été réellement générées et signées par le producteur canonique NeoMundi, elles ne doivent pas être présentées comme des observations live cryptographiquement valides.

Les exemples de production v0.2 devront être générés, hashés et signés par le producteur canonique.

---

## Consommer un vrai contrat NeoMundi

Pour un contrat obtenu depuis NeoMundi :

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

Le consommateur peut aussi recevoir le schéma correspondant et le JWKS depuis un stockage local ou un cache.

Le contrat doit toujours être traité contre la version de schéma qu’il déclare.

Le mécanisme précis d’exposition API de plusieurs versions de schéma constitue lui-même un contrat d’API et ne doit pas être supposé par l’implémentation consommateur.

---

## Utilisation comme bibliothèque

```python
from rgc_consumer_demo.connector import process_contract, ContractRejected
from rgc_consumer_demo.storage import ReceiptStore

store = ReceiptStore("receipts.db")

try:
    result = process_contract(
        contract,
        base_url="https://api.neomundi.io",
        store=store,
    )

    print(result.routing.action)
    print(result.routing.reason)

except ContractRejected as exc:
    print(f"Contrat rejeté : {exc}")
```

Un contrat rejeté ne doit pas être utilisé comme base d’une action consommateur.

À l’inverse, un contrat correctement traité ne constitue pas pour autant une certification de sécurité.

Cela signifie uniquement qu’il :

1. correspond à son schéma ;
2. respecte les frontières d’interopérabilité ;
3. passe les vérifications cryptographiques ;
4. a été traité selon la politique définie par le consommateur.

---

## Frontière de responsabilité

```text
NeoMundi
    ↓
mesure runtime
    ↓
contrat d’interopérabilité signé
    ↓
────────────────────────────
     frontière du système
────────────────────────────
    ↓
vérification consommateur
    ↓
interprétation consommateur
    ↓
politique consommateur
    ↓
action consommateur
```

L’implémentation de référence montre **un comportement consommateur possible**.

Elle ne définit pas ce que tous les consommateurs doivent faire.

NeoMundi apporte la primitive de mesure et sa trace vérifiable.

**Le consommateur transforme ce signal en valeur selon ses propres règles.**

---

## Versions et exemples

### RGC v0.1

RGC v0.1 reste disponible pour :

* la reproductibilité historique ;
* la vérification des observations signées existantes ;
* la compatibilité avec les artefacts pilotes existants.

Les exemples v0.1 signés restent inchangés : modifier leur contenu invaliderait leur payload hash et leur signature Ed25519.

### RGC v0.2

RGC v0.2 introduit les corrections sémantiques concernant :

* les mesures partielles ;
* le statut individuel des signaux ;
* les valeurs `null` pour les signaux non mesurés ;
* la portée limitée au domaine effectivement mesuré ;
* la cohérence entre couverture et statut global ;
* la frontière temporelle des observations `single_request`.

Le principe central est :

> **L’absence de preuve n’est significative que dans le domaine effectivement mesuré.**

RGC v0.2 est introduit comme une nouvelle version et non comme une réécriture rétrospective de v0.1.

---

[↑ Back to top](#neomundi-measurement-interoperability--reference-consumer)
