# NeoMundi Measurement Interoperability — Reference Consumer

[🇬🇧 English](#english) · [🇫🇷 Français](#français) · [Main README](../README.md) · [Examples](../examples/README.md)

---

# English

## Purpose

This directory contains the **reference consumer implementation** for the NeoMundi Measurement Interoperability Contract.

Its purpose is to demonstrate how an independent third-party infrastructure can consume and verify a NeoMundi measurement contract **without importing NeoMundi's internal producer code**.

The reference flow is:

```text
contract
    ↓
JSON Schema validation
    ↓
SHA-256 verification
    ↓
Ed25519/JWS signature verification
    ↓
sovereignty checks
    ↓
consumer-defined routing
    ↓
auditable receipt
```

NeoMundi provides the measurement signal and its verifiable trace.

**The consuming infrastructure retains interpretation, policy, decision and action.**

---

## What the reference consumer does

The reference implementation demonstrates six operations.

### 1. Validate the contract

The received payload is validated against the public versioned JSON Schema.

A contract that does not comply with the expected schema is rejected before further processing.

---

### 2. Verify the payload fingerprint

The consumer independently recalculates the SHA-256 fingerprint of the canonical payload and compares it with:

```text
integrity.payload_hash
```

This allows modifications to the payload to be detected.

---

### 3. Verify the cryptographic signature

The consumer verifies the Ed25519/JWS signature using the public key corresponding to:

```text
integrity.key_id
```

The public verification keys are available through:

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

The public schema is available through:

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

---

### 4. Check sovereignty constraints

The consumer can independently verify that the interoperability contract does not expose prohibited raw content.

The reference implementation checks that the contract does not contain:

* raw user prompts;
* raw model responses;
* raw provider/model identifiers.

The model identifier must remain pseudonymized or be represented as:

```text
local
```

---

### 5. Apply consumer-defined routing

The reference implementation includes an example routing rule.

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

A real consuming infrastructure defines its own interpretation and policy.

The contract always preserves the governance boundary:

```json
{
  "execution_permission_changed": false
}
```

---

### 6. Store an auditable receipt

The reference consumer demonstrates how a receiving system can retain a versioned and auditable receipt after processing a contract.

This allows the consuming infrastructure to preserve evidence of:

* the contract received;
* validation status;
* integrity verification;
* signature verification;
* routing result;
* processing time.

---

## Reference modules

The current reference implementation is organized around the following components:

| Module           | Role                                 |
| ---------------- | ------------------------------------ |
| `validate.py`    | JSON Schema validation               |
| `verify.py`      | SHA-256 and Ed25519/JWS verification |
| `sovereignty.py` | Data sovereignty checks              |
| `routing.py`     | Example consumer-defined routing     |
| `storage.py`     | Versioned auditable receipt storage  |
| `connector.py`   | Consumer processing orchestration    |
| `cli.py`         | End-to-end demonstration             |

The implementation is deliberately independent from the NeoMundi producer code.

---

## Offline demonstration

The reference consumer can be executed without a live NeoMundi server:

```bash
python -m rgc_consumer_demo.cli --offline
```

The offline demonstration uses:

* bundled demonstration contracts;
* a local schema;
* a demonstration JWKS;
* a demonstration-only signing key.

The demonstration key is not a NeoMundi production key.

---

## Consume a real NeoMundi contract

For a contract already obtained from NeoMundi:

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

The consumer may also receive the schema and JWKS directly from local storage or cache rather than retrieving them for every contract.

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

A rejected contract should not be used as the basis for an automated consumer action.

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

---

## Examples

Two real signed contract examples are available in:

[`../examples/`](../examples/)

They illustrate two different measured states:

* `within-bounds-no-review.json`
* `flagged-review-required.json`

Both preserve the same execution boundary.

---

## Status

Current contract version:

```text
v0.1
```

The reference implementation corresponds to the current pilot version of the NeoMundi Measurement Interoperability Contract.

---

# Français

## Objectif

Ce dossier contient l’**implémentation consommateur de référence** du NeoMundi Measurement Interoperability Contract.

Son objectif est de montrer comment une infrastructure tierce indépendante peut consommer et vérifier un contrat de mesure NeoMundi **sans importer le code interne du producteur NeoMundi**.

Le flux de référence est :

```text
contrat
    ↓
validation JSON Schema
    ↓
vérification SHA-256
    ↓
vérification signature Ed25519/JWS
    ↓
contrôles de souveraineté
    ↓
routage défini par le consommateur
    ↓
reçu auditable
```

NeoMundi fournit le signal de mesure et sa trace vérifiable.

**L’infrastructure consommatrice conserve l’interprétation, la politique, la décision et l’action.**

---

## Ce que fait le consommateur de référence

L’implémentation de référence démontre six opérations.

### 1. Valider le contrat

Le payload reçu est validé contre le JSON Schema public correspondant à sa version.

Un contrat qui ne respecte pas le schéma attendu est rejeté avant tout traitement supplémentaire.

---

### 2. Vérifier l’empreinte du payload

Le consommateur recalcule indépendamment l’empreinte SHA-256 du payload canonique et la compare à :

```text
integrity.payload_hash
```

Cela permet de détecter une modification du contenu.

---

### 3. Vérifier la signature cryptographique

Le consommateur vérifie la signature Ed25519/JWS avec la clé publique correspondant à :

```text
integrity.key_id
```

Les clés publiques de vérification sont disponibles via :

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

Le schéma public est disponible via :

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

---

### 4. Vérifier les contraintes de souveraineté

Le consommateur peut vérifier indépendamment que le contrat d’interopérabilité n’expose pas de contenu brut interdit.

L’implémentation de référence contrôle notamment l’absence de :

* prompts utilisateurs bruts ;
* réponses brutes du modèle ;
* identifiants bruts fournisseur/modèle.

L’identifiant du modèle doit rester pseudonymisé ou être représenté par :

```text
local
```

---

### 5. Appliquer un routage défini par le consommateur

L’implémentation de référence contient une règle de routage d’exemple.

Par exemple :

```text
review_recommendation = required
            ↓
      suspendre le flux
            ↓
        revue humaine
```

Il s’agit d’un **exemple de politique consommateur**.

Ce n’est pas une règle d’exécution imposée par NeoMundi.

Une infrastructure réelle définit sa propre interprétation et sa propre politique.

Le contrat conserve toujours la frontière suivante :

```json
{
  "execution_permission_changed": false
}
```

---

### 6. Conserver un reçu auditable

Le consommateur de référence montre comment un système récepteur peut conserver un reçu versionné et auditable après traitement du contrat.

Cela permet de préserver une preuve de :

* contrat reçu ;
* statut de validation ;
* vérification d’intégrité ;
* vérification de signature ;
* résultat du routage ;
* moment du traitement.

---

## Modules de référence

L’implémentation actuelle est organisée autour des composants suivants :

| Module           | Rôle                                          |
| ---------------- | --------------------------------------------- |
| `validate.py`    | Validation JSON Schema                        |
| `verify.py`      | Vérification SHA-256 et Ed25519/JWS           |
| `sovereignty.py` | Contrôles de souveraineté des données         |
| `routing.py`     | Exemple de routage défini par le consommateur |
| `storage.py`     | Stockage de reçus versionnés et auditables    |
| `connector.py`   | Orchestration du traitement                   |
| `cli.py`         | Démonstration de bout en bout                 |

L’implémentation est volontairement indépendante du code producteur NeoMundi.

---

## Démonstration hors ligne

Le consommateur de référence peut être exécuté sans serveur NeoMundi actif :

```bash
python -m rgc_consumer_demo.cli --offline
```

La démonstration hors ligne utilise :

* des contrats de démonstration ;
* un schéma local ;
* un JWKS de démonstration ;
* une clé de signature réservée à la démonstration.

Cette clé n’est pas une clé de production NeoMundi.

---

## Consommer un vrai contrat NeoMundi

Pour un contrat déjà obtenu depuis NeoMundi :

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

Le consommateur peut également utiliser un schéma et un JWKS déjà stockés localement ou mis en cache plutôt que de les récupérer à chaque contrat.

---

## Utilisation comme bibliothèque

Exemple :

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

Un contrat rejeté ne devrait pas servir de base à une action automatisée côté consommateur.

---

## Frontière de responsabilité

Le consommateur de référence matérialise la séparation attendue :

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

---

## Exemples

Deux exemples de contrats réels signés sont disponibles dans :

[`../examples/`](../examples/)

Ils illustrent deux états mesurés différents :

* `within-bounds-no-review.json`
* `flagged-review-required.json`

Les deux conservent la même frontière d’exécution.

---

## Statut

Version actuelle du contrat :

```text
v0.1
```

L’implémentation de référence correspond à la version pilote actuelle du NeoMundi Measurement Interoperability Contract.

---

[↑ Back to top](#neomundi-measurement-interoperability--reference-consumer)
