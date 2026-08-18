# NeoMundi Measurement Interoperability

[🇫🇷 Français](./README_FR.md) · [🇬🇧 English](./README.md) · [NeoMundi](https://neomundi.io) · [API](https://api.neomundi.io)

> **Spécification publique d’interopérabilité pour transporter des signaux de mesure runtime NeoMundi signés, versionnés et vérifiables entre systèmes indépendants.**

---

# NeoMundi Measurement Interoperability

**Qu’est-ce que c’est ?**
Une façon simple de faire passer une mesure NeoMundi d’un système à un autre sous forme de JSON signé et vérifiable.

**À quoi ça sert ?**
Votre infrastructure peut recevoir une mesure NeoMundi, vérifier qu’elle est authentique, lire le signal, puis décider elle-même quoi en faire.

**Pour qui ?**
Plateformes cloud, systèmes d’IA, agents, outils de gouvernance, systèmes d’audit, plateformes de monitoring et toute infrastructure qui veut consommer les mesures NeoMundi sans dépendre du code interne NeoMundi.

**Comment l’activer ?**
Vous produisez une mesure NeoMundi, récupérez son contrat d’interopérabilité, puis vous le validez et le vérifiez avec le schéma public et la clé publique.

**Ce contrat n’est pas construit en vase clos : il est challengé, testé et renforcé par un cercle évolutif de contributeurs indépendants et d’infrastructures pilotes — suivez cette histoire dans [Contributeurs & développement collectif](./CONTRIBUTORS_FR.md).**

```text
Système d’IA
   ↓
NeoMundi mesure
   ↓
contrat JSON signé
   ↓
votre système vérifie
   ↓
votre système décide quoi faire
```

**NeoMundi mesure. Votre infrastructure décide.**

[🇫🇷 Français](./README_FR.md) · [🇬🇧 English](./README.md) · [Exemples](./examples/) · [Consumer de référence](./consumer-reference/)

---

## Principe

NeoMundi fournit un **signal de mesure runtime** et sa **trace vérifiable**.

L’infrastructure qui reçoit ce signal conserve la maîtrise de :

* son interprétation ;
* sa politique ;
* sa décision ;
* son action.

**NeoMundi mesure. Votre infrastructure décide.**

---

## Pourquoi ce contrat existe

Un système d’IA peut être mesuré par NeoMundi sans que l’infrastructure qui consomme cette mesure dépende du code interne de NeoMundi.

Le **NeoMundi Measurement Interoperability Contract** fournit une représentation JSON :

* structurée ;
* versionnée ;
* signée cryptographiquement ;
* vérifiable indépendamment ;
* exploitable automatiquement par un système tiers.

Il permet notamment à une infrastructure externe de :

* valider la structure du contrat ;
* vérifier son intégrité ;
* vérifier sa signature cryptographique ;
* corréler l’observation entre plusieurs systèmes ;
* lire les signaux de mesure et leurs limites ;
* appliquer ses propres règles de gouvernance ;
* conserver une preuve auditable.

---

## Architecture

```text
Système d’IA
    ↓
Mesure runtime NeoMundi
    ↓
Contrat d’interopérabilité signé
    ↓
Infrastructure tierce
    ↓
Interprétation
    ↓
Politique
    ↓
Décision / Action
```

Le contrat transporte la **mesure**.

Il ne transfère pas le contrôle du système à NeoMundi.

---

# 1. Ce que transporte le contrat

Le contrat est organisé autour de cinq blocs principaux :

```text
identity
provenance
observation
governance
integrity
```

## `identity`

Permet d’identifier et de corréler l’observation entre plusieurs systèmes.

Le modèle est représenté sous une forme pseudonymisée ou par :

```text
local
```

Les identifiants bruts du fournisseur de modèle ne sont pas transportés.

---

## `provenance`

Décrit l’origine et le contexte technique de la mesure sans exposer les contenus bruts traités par l’IA.

---

## `observation`

Contient les signaux produits par la couche de mesure NeoMundi.

Cette section peut notamment préciser :

* les valeurs mesurées ;
* les limitations connues ;
* le périmètre de mesure ;
* les informations nécessaires à l’interprétation du signal.

Une observation NeoMundi est un **signal de mesure**, pas un verdict universel sur le système observé.

---

## `governance`

Contient des informations non contraignantes pouvant être utilisées comme entrée par l’infrastructure consommatrice.

Une recommandation ou un signal de revue :

* n’est pas une autorisation d’exécution ;
* ne remplace pas la politique du consommateur ;
* ne déclenche pas automatiquement une action imposée par NeoMundi.

---

## `integrity`

Contient les éléments nécessaires à la vérification indépendante du contrat :

* empreinte SHA-256 du payload ;
* signature cryptographique Ed25519/JWS ;
* identifiant de clé `key_id`.

---

# 2. Frontière de responsabilité

L’un des invariants fondamentaux du contrat est :

```json
{
  "execution_permission_changed": false
}
```

Cette valeur est imposée par le schéma.

Un contrat déclarant que NeoMundi a modifié silencieusement l’autorisation d’exécution est invalide.

La frontière est donc explicite :

```text
NeoMundi
    ↓
mesure
    ↓
signal vérifiable
    ↓
────────────────────────────
   frontière du système
────────────────────────────
    ↓
interprétation du consommateur
    ↓
politique du consommateur
    ↓
décision du consommateur
    ↓
action du consommateur
```

---

# 3. Souveraineté des données

Le contrat d’interopérabilité est conçu pour éviter le transport de contenu brut.

Il ne contient pas :

* le prompt utilisateur brut ;
* la réponse brute du modèle ;
* l’identifiant brut du modèle fournisseur.

Le consommateur peut vérifier ces contraintes avant de conserver ou d’utiliser le contrat.

Cette propriété permet de séparer :

**la mesure**
de
**la donnée métier ou conversationnelle ayant produit cette mesure**.

---

# 4. Endpoints publics

## JSON Schema

Le schéma versionné du contrat est disponible publiquement :

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

Il permet à un consommateur de vérifier automatiquement qu’un contrat respecte la structure attendue.

---

## Clés publiques de vérification

Les clés publiques nécessaires à la vérification cryptographique sont exposées via JWKS :

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

Le champ :

```text
integrity.key_id
```

permet d’identifier la clé publique correspondant à la signature du contrat.

La récupération du schéma et des clés publiques ne nécessite pas de clé API NeoMundi.

---

# 5. Obtenir un contrat

À partir d’une observation NeoMundi existante :

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

NeoMundi retourne alors un contrat :

* JSON ;
* versionné ;
* doté d’une empreinte d’intégrité ;
* signé cryptographiquement.

---

# 6. Workflow consommateur

Une intégration standard suit cinq étapes.

```text
1. Recevoir
2. Valider
3. Vérifier
4. Interpréter
5. Appliquer sa propre politique
```

## Étape 1 — Recevoir

Le consommateur reçoit le contrat JSON produit à partir d’une observation NeoMundi.

---

## Étape 2 — Valider

Le contrat est validé contre le JSON Schema public correspondant à sa version.

Un payload ne respectant pas le schéma doit être rejeté avant toute utilisation.

---

## Étape 3 — Vérifier

Le consommateur vérifie indépendamment :

* l’empreinte SHA-256 ;
* la signature Ed25519/JWS ;
* la clé utilisée pour signer le contrat.

---

## Étape 4 — Interpréter

L’infrastructure lit les signaux de mesure, les limitations et les éventuelles informations consultatives transportées par le contrat.

La signification opérationnelle dépend du contexte du consommateur.

---

## Étape 5 — Appliquer sa propre politique

Le consommateur décide de l’action appropriée.

Exemple :

```text
review_recommendation = required
            ↓
       suspendre le flux
            ↓
       revue humaine
```

Cette règle n’est qu’un **exemple de politique consommateur**.

Elle n’est pas imposée par NeoMundi.

Une autre infrastructure pourrait choisir :

```text
signal
    ↓
journalisation uniquement
```

ou :

```text
signal
    ↓
augmentation de la surveillance
```

ou encore :

```text
signal
    ↓
routage vers un autre système
```

Le contrat reste identique.

La politique appartient au consommateur.

---

# 7. Consommateur de référence

NeoMundi fournit une implémentation de référence montrant comment un système indépendant peut traiter un contrat.

Le flux de référence est :

```text
contrat
    ↓
validation JSON Schema
    ↓
vérification SHA-256
    ↓
vérification Ed25519/JWS
    ↓
contrôle des contraintes de souveraineté
    ↓
politique définie par le consommateur
    ↓
reçu auditable
```

Cette implémentation est volontairement indépendante du code producteur NeoMundi.

Elle ne nécessite pas l’import des composants internes qui ont généré la mesure.

---

## Démonstration hors ligne

Le consommateur de référence peut être exécuté sans serveur NeoMundi actif.

Depuis le dossier `consumer-reference/` :

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

La démonstration hors ligne utilise :

* deux contrats NeoMundi réels signés depuis `../examples/` ;
* le schéma public du contrat depuis `../schema/contract-v0.1.schema.json` ;
* le JWKS public NeoMundi conservé localement dans `rgc_consumer_demo/fixtures/public_jwks.json`.

Aucune clé API NeoMundi n’est nécessaire.

Aucune clé privée de signature n’est incluse.

Le JWKS local contient uniquement la clé publique nécessaire pour vérifier indépendamment les signatures Ed25519/JWS des contrats publiés.

Résultat attendu pour les deux contrats :

```text
hash_match=True
signature_valid=True
```

Voir la [documentation complète du consommateur de référence](./consumer-reference/README.md).

---

## Consommer un contrat réel

```bash
python -m rgc_consumer_demo.cli \
  --base-url https://api.neomundi.io \
  --contract-file my_contract.json
```

Le consommateur peut également utiliser un schéma et un JWKS déjà récupérés ou mis en cache afin de ne pas effectuer une requête réseau pour chaque contrat.

---

# 8. Standards utilisés

NeoMundi réutilise des standards existants plutôt que de créer des mécanismes propriétaires équivalents.

## JSON Schema

Le contrat utilise :

**JSON Schema Draft 2020-12**

Le schéma permet une validation automatique et versionnée du payload.

---

## W3C Trace Context

La corrélation inter-systèmes s’appuie sur un identifiant de trace compatible avec la forme définie par **W3C Trace Context**.

Cela permet de relier une observation NeoMundi à d’autres traces techniques sans remplacer les mécanismes de traçabilité propres au système consommateur.

---

## SHA-256

Une représentation JSON canonique est utilisée pour calculer une empreinte SHA-256 du payload.

L’empreinte permet de détecter une modification du contenu.

Elle ne doit pas être confondue avec une signature cryptographique.

---

## JWS / Ed25519

Le contrat utilise :

* **JSON Web Signature — RFC 7515** ;
* **Ed25519** ;
* une représentation publique de clé au format **JWK**.

La signature permet au consommateur de vérifier cryptographiquement l’origine et l’intégrité du contrat.

---

## CloudEvents

La structure reprend certains principes généraux de CloudEvents concernant notamment :

* l’identité ;
* la source ;
* le temps ;
* le type d’événement.

Le contrat conserve néanmoins ses propres champs NeoMundi.

**NeoMundi ne revendique pas une conformité complète à l’enveloppe CloudEvents.**

---

# 9. Modèle d’intégrité

Un contrat valide nécessite simultanément :

```text
empreinte SHA-256
+
signature Ed25519/JWS
```

Il n’existe pas de mode valide reposant uniquement sur l’empreinte SHA-256.

Si la signature cryptographique ne peut pas être produite, un contrat signé valide ne doit pas être émis.

---

# 10. Versionnement

Le format du contrat est explicitement versionné.

Version pilote actuelle :

```text
v0.1
```

Un consommateur doit vérifier la version du schéma avant de traiter automatiquement un contrat.

Les versions futures peuvent faire évoluer le format sans rendre cette évolution implicite pour les infrastructures déjà intégrées.

---

# 11. Ce que ce contrat ne fait pas

Le NeoMundi Measurement Interoperability Contract ne :

* donne pas une autorisation d’exécution ;
* remplace pas le moteur de politique du consommateur ;
* décide pas à la place d’une infrastructure tierce ;
* certifie pas des données produites par des tiers ;
* exige pas l’accès au code interne NeoMundi ;
* transporte pas les prompts ou réponses brutes ;
* impose pas une règle unique de routage ;
* transforme pas un signal de mesure en vérité opérationnelle universelle.

Il constitue une **interface vérifiable entre la mesure et les systèmes qui consomment cette mesure**.

---

# 12. Exemple d’intégration

Un même contrat peut être utilisé de différentes manières selon l’infrastructure qui le reçoit.

```text
                    NeoMundi
                       ↓
                mesure runtime
                       ↓
             contrat interopérable
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Observabilité   Gouvernance       Audit
        ↓              ↓              ↓
     journal        politique      conservation
        ↓              ↓              ↓
     analyse         action          preuve
```

La couche de mesure reste la même.

Les applications peuvent être multiples.

---

# 13. Statut

Le contrat est actuellement en :

```text
Pilot version — v0.1
```

Le format peut encore évoluer.

Toute évolution destinée à être consommée automatiquement doit rester explicitement versionnée.

---

## NeoMundi

**Fundamental runtime measurement layer for AI systems.**

One measurement layer. Multiple applications. Multiple infrastructures.

**NeoMundi fournit le signal. Vous conservez le contrôle.**

---

© 2026 NeoMundi / Louis M Sàrl — All rights reserved.

Open-source licensing is planned for a future release.
