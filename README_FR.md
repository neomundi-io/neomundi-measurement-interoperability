# Interopérabilité des mesures NeoMundi

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [NeoMundi](https://neomundi.io) · [API](https://api.neomundi.io)

> **Spécification publique d’interopérabilité permettant de transporter des signaux de mesure runtime NeoMundi signés, versionnés et vérifiables entre des systèmes indépendants.**

---

**Qu’est-ce que c’est ?**  
Un moyen simple de transporter une mesure NeoMundi d’un système à un autre dans un format JSON signé et vérifiable.

**À quoi cela sert-il ?**  
Cela permet à votre infrastructure de recevoir une mesure NeoMundi, de vérifier son authenticité, de comprendre le signal et de décider elle-même de ce qu’elle souhaite en faire.

**À qui cela s’adresse-t-il ?**  
Aux plateformes cloud, systèmes d’IA, agents, outils de gouvernance, systèmes d’audit, plateformes de monitoring et, plus généralement, à toute infrastructure souhaitant consommer des mesures NeoMundi sans dépendre du code interne de NeoMundi.

**Comment l’activer ?**  
Générez une mesure NeoMundi, récupérez son contrat d’interopérabilité, puis validez-le et vérifiez-le à l’aide du schéma public et de la clé publique.

**Ce contrat n’est pas développé de manière isolée : il est challengé, testé et renforcé par un cercle évolutif de contributeurs indépendants et d’infrastructures pilotes — suivez cette construction dans [Contributors & Collective Development](./CONTRIBUTORS.md).**

```text
Système d’IA
    ↓
NeoMundi mesure
    ↓
contrat JSON signé
    ↓
votre système le vérifie
    ↓
votre système décide quoi en faire
```

**NeoMundi mesure. Votre infrastructure décide.**

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [Exemples](./examples/) · [Consommateur de référence](./consumer-reference/)

---

## Principe

NeoMundi fournit un **signal de mesure runtime** ainsi que sa **trace vérifiable**.

L’infrastructure qui reçoit ce signal conserve le contrôle complet sur :

- l’interprétation ;
- la politique ;
- la décision ;
- l’action.

**NeoMundi mesure. Votre infrastructure décide.**

Une interopérabilité publique ne signifie **pas** une implémentation publique.

Une infrastructure consommatrice peut conserver entièrement privés, propriétaires ou confidentiels sa logique d’interprétation, ses règles de politique, ses seuils, ses mécanismes de décision, son architecture de gouvernance et ses mécanismes d’exécution.

---

## Pourquoi ce contrat existe

Un système d’IA peut être mesuré par NeoMundi sans que l’infrastructure consommant cette mesure dépende du code interne de NeoMundi.

Le **NeoMundi Measurement Interoperability Contract** fournit une représentation JSON :

- structurée ;
- versionnée ;
- signée cryptographiquement ;
- vérifiable indépendamment ;
- exploitable automatiquement par des systèmes tiers.

Il permet à une infrastructure externe de :

- valider la structure du contrat ;
- vérifier son intégrité ;
- vérifier sa signature cryptographique ;
- corréler l’observation entre plusieurs systèmes ;
- lire les signaux de mesure et leurs limites ;
- appliquer ses propres règles de gouvernance ;
- conserver une preuve auditable.

Le contrat standardise **l’interface entre la mesure et sa consommation**. Il ne standardise, ne divulgue et ne prescrit pas l’implémentation interne du consommateur.

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

Le contrat transporte **la mesure**.

Il ne transfère pas à NeoMundi le contrôle du système.

Il n’oblige pas non plus l’infrastructure consommatrice à exposer la logique propriétaire qu’elle applique après réception de la mesure.

Une frontière utile peut être représentée ainsi :

```text
NeoMundi
mesure
    ↓
COUCHE PUBLIQUE D’INTEROPÉRABILITÉ
contrat signé
validation
vérification
    ↓
────────────────────────────────
frontière du consommateur
────────────────────────────────
    ↓
COUCHE PRIVÉE / SPÉCIFIQUE AU PARTENAIRE
interprétation
politique
seuils
décision
exécution
```

**Interface ouverte ≠ implémentation ouverte.**

---

# 1. Ce que transporte le contrat

Le contrat est organisé autour de cinq sections principales :

```text
identity
provenance
observation
governance
integrity
```

## `identity`

Permet d’identifier et de corréler l’observation entre plusieurs systèmes.

Le modèle est représenté sous forme pseudonymisée ou comme :

```text
local
```

Les identifiants bruts des modèles fournisseurs ne sont pas transportés.

---

## `provenance`

Décrit l’origine et le contexte technique de la mesure sans exposer le contenu brut traité par le système d’IA.

---

## `observation`

Contient les signaux produits par la couche de mesure NeoMundi.

Cette section peut notamment contenir :

- des valeurs mesurées ;
- des limites connues ;
- le périmètre de la mesure ;
- les informations nécessaires à l’interprétation du signal.

Une observation NeoMundi est un **signal de mesure**, et non un verdict universel porté sur le système observé.

---

## `governance`

Contient des informations non contraignantes pouvant servir d’entrée à l’infrastructure consommatrice.

Une recommandation ou un signal de revue :

- n’est pas une autorisation d’exécution ;
- ne remplace pas la politique du consommateur ;
- ne déclenche pas automatiquement une action imposée par NeoMundi.

L’infrastructure destinataire reste responsable de déterminer la signification opérationnelle qu’elle souhaite, ou non, attribuer à cette information.

Sa logique interne de gouvernance n’a pas besoin d’être divulguée à NeoMundi ni rendue publique.

---

## `integrity`

Contient les éléments nécessaires à la vérification indépendante du contrat :

- empreinte SHA-256 du payload ;
- signature cryptographique Ed25519/JWS ;
- `key_id`.

---

# 2. Frontière de responsabilité

L’un des invariants fondamentaux du contrat est :

```json
{
  "execution_permission_changed": false
}
```

Cette valeur est imposée par le schéma.

Un contrat affirmant que NeoMundi a modifié silencieusement l’autorisation d’exécution est invalide.

La frontière est donc explicite :

```text
NeoMundi
    ↓
mesure
    ↓
signal vérifiable
    ↓
────────────────────────────
      frontière système
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

NeoMundi n’a pas besoin d’accéder au moteur de politique propriétaire du consommateur, à sa logique de décision ou à son architecture d’exécution.

Le consommateur peut implémenter ces éléments de manière privée, selon son propre modèle de gouvernance et de sécurité.

---

# 3. Souveraineté des données

Le contrat d’interopérabilité est conçu pour éviter de transporter du contenu brut.

Il ne contient pas :

- les prompts utilisateurs bruts ;
- les réponses brutes des modèles ;
- les identifiants bruts des modèles fournisseurs.

Le consommateur peut vérifier ces contraintes avant de stocker ou d’utiliser le contrat.

Cette propriété sépare :

**la mesure**

de

**la donnée métier ou conversationnelle ayant produit cette mesure**.

Le contrat n’exige pas non plus la divulgation de :

- politiques propriétaires du consommateur ;
- seuils internes ;
- règles de décision ;
- mécanismes d’exécution ;
- architecture de gouvernance propre au partenaire ;
- détails d’implémentation confidentiels.

L’interopérabilité publique concerne donc **l’interface partagée**, et non la logique interne privée des systèmes participants.

---

# 4. Endpoints publics

## Schéma JSON

Le schéma versionné du contrat est publiquement accessible :

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

identifie la clé publique correspondant à la signature du contrat.

La récupération du schéma et des clés publiques de vérification ne nécessite pas de clé API NeoMundi.

---

# 5. Obtenir un contrat

À partir d’une observation NeoMundi existante :

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

NeoMundi retourne alors un contrat :

- basé sur JSON ;
- versionné ;
- doté d’une empreinte d’intégrité ;
- signé cryptographiquement.

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

Le contrat est validé par rapport au schéma JSON public correspondant à sa version.

Un payload qui ne respecte pas le schéma doit être rejeté avant utilisation.

---

## Étape 3 — Vérifier

Le consommateur vérifie indépendamment :

- l’empreinte SHA-256 ;
- la signature Ed25519/JWS ;
- la clé de signature utilisée pour le contrat.

---

## Étape 4 — Interpréter

L’infrastructure lit les signaux de mesure, leurs limites et les éventuelles informations consultatives transportées par le contrat.

Leur signification opérationnelle dépend du propre contexte du consommateur.

NeoMundi ne prescrit pas la manière dont le consommateur doit interpréter un signal de mesure valide.

---

## Étape 5 — Appliquer sa propre politique

Le consommateur détermine l’action appropriée.

Exemple :

```text
review_recommendation = required
            ↓
      pause du workflow
            ↓
       revue humaine
```

Il s’agit uniquement d’un **exemple de politique consommateur**.

Cette politique n’est pas imposée par NeoMundi.

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
monitoring renforcé
```

ou :

```text
signal
    ↓
routage vers un autre système
```

Le contrat reste identique.

La politique appartient au consommateur.

La politique exacte, les seuils, la logique de routage et les mécanismes d’exécution peuvent rester entièrement propriétaires et confidentiels.

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

Cette implémentation est volontairement indépendante du code producteur de NeoMundi.

Elle ne nécessite pas d’importer les composants internes ayant généré la mesure.

Le consommateur de référence illustre uniquement un **exemple générique** de la manière dont une infrastructure destinataire peut valider, vérifier et consommer un contrat NeoMundi.

Il ne définit, ne reproduit et n’exige la divulgation d’aucun élément propriétaire d’un partenaire, notamment :

- logique d’interprétation ;
- moteur de politique ;
- seuils ;
- logique de décision ;
- architecture de gouvernance ;
- mécanismes de routage ;
- mécanismes d’exécution.

Un partenaire peut donc utiliser le contrat public d’interopérabilité tout en conservant son implémentation entièrement privée.

### Frontière d’interopérabilité

```text
PUBLIC
contrat NeoMundi
schéma
règles de vérification
clés publiques
modèle générique de consommation

PRIVÉ / DIVULGATION OPTIONNELLE
politique partenaire
seuils partenaire
logique de décision partenaire
mécanismes d’exécution partenaire
architecture partenaire
propriété intellectuelle partenaire
```

Le consommateur de référence public constitue un exemple d’interopérabilité, **et non un modèle imposant aux partenaires de révéler la manière dont leurs systèmes gouvernent ou agissent**.

---

## Démonstration hors ligne

Le consommateur de référence peut être exécuté sans serveur NeoMundi actif.

Depuis le répertoire `consumer-reference/` :

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

La démonstration hors ligne utilise :

- deux contrats NeoMundi réels et signés provenant de `../examples/` ;
- le schéma public du contrat situé dans `../schema/contract-v0.1.schema.json` ;
- le JWKS public NeoMundi stocké localement dans `rgc_consumer_demo/fixtures/public_jwks.json`.

Aucune clé API NeoMundi n’est requise.

Aucune clé privée de signature n’est incluse.

Le JWKS local contient uniquement la clé publique nécessaire à la vérification indépendante des signatures Ed25519/JWS des contrats d’exemple publiés.

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

Le consommateur peut également utiliser un schéma et un JWKS déjà récupérés ou mis en cache afin d’éviter une requête réseau à chaque contrat.

---

# 8. Standards utilisés

NeoMundi réutilise des standards établis plutôt que de créer des équivalents propriétaires.

## JSON Schema

Le contrat utilise :

**JSON Schema Draft 2020-12**

Le schéma permet une validation automatique et versionnée des payloads.

---

## W3C Trace Context

La corrélation entre systèmes repose sur un identifiant de trace compatible avec la forme définie par **W3C Trace Context**.

Cela permet de corréler une observation NeoMundi avec d’autres traces techniques sans remplacer les propres mécanismes de tracing du consommateur.

---

## SHA-256

Une représentation JSON canonique est utilisée pour calculer une empreinte SHA-256 du payload.

Cette empreinte permet de détecter toute modification du contenu.

Elle ne doit pas être confondue avec une signature cryptographique.

---

## JWS / Ed25519

Le contrat utilise :

- **JSON Web Signature — RFC 7515** ;
- **Ed25519** ;
- une représentation de clé publique au format **JWK**.

La signature permet au consommateur de vérifier cryptographiquement l’origine et l’intégrité du contrat.

---

## CloudEvents

La structure réutilise certains principes généraux de CloudEvents relatifs à :

- l’identité ;
- la source ;
- le temps ;
- le type d’événement.

Le contrat conserve néanmoins ses propres noms de champs spécifiques à NeoMundi.

**NeoMundi ne revendique pas une conformité complète à l’enveloppe CloudEvents.**

---

# 9. Modèle d’intégrité

Un contrat valide nécessite simultanément :

```text
empreinte SHA-256
+
signature Ed25519/JWS
```

Il n’existe pas de mode de repli valide reposant uniquement sur le hash.

Si la signature cryptographique ne peut pas être produite, aucun contrat signé valide ne doit être émis.

---

# 10. Versionnement

Le format du contrat est explicitement versionné.

Version pilote actuelle :

```text
v0.1
```

Un consommateur doit vérifier la version du schéma avant de traiter automatiquement un contrat.

Les versions futures pourront faire évoluer le format tout en gardant ces changements explicites pour les infrastructures l’ayant déjà intégré.

---

# 11. Ce que ce contrat ne fait pas

Le NeoMundi Measurement Interoperability Contract ne :

- donne pas d’autorisation d’exécution ;
- ne remplace pas le moteur de politique du consommateur ;
- ne décide pas au nom d’une infrastructure tierce ;
- ne certifie pas les données de tiers ;
- n’exige pas d’accès au code interne de NeoMundi ;
- ne transporte pas les prompts ou réponses bruts ;
- n’impose pas une règle unique de routage ;
- ne transforme pas un signal de mesure en vérité opérationnelle universelle ;
- n’exige pas la divulgation de l’implémentation propriétaire d’un partenaire ;
- n’exige pas la divulgation de seuils internes ou de règles de politique ;
- n’exige pas la publication de la logique de décision ou d’exécution ;
- ne transfère pas la propriété ni le contrôle de la propriété intellectuelle d’un partenaire.

Il constitue une **interface vérifiable entre la mesure et les systèmes qui consomment cette mesure**.

L’interface peut être publique tandis que les implémentations de part et d’autre restent privées.

---

# 12. Exemple d’intégration

Le même contrat peut être utilisé différemment selon l’infrastructure qui le reçoit.

```text
                    NeoMundi
                       ↓
                mesure runtime
                       ↓
            contrat interopérable
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 Observabilité      Gouvernance      Audit
        ↓              ↓              ↓
 journalisation      politique     conservation
        ↓              ↓              ↓
    analyse           action         preuve
```

La couche de mesure reste identique.

Les applications peuvent être multiples.

Chaque infrastructure consommatrice reste libre d’implémenter sa propre logique aval sans avoir à l’exposer publiquement.

---

# 13. Interface publique, implémentation privée

NeoMundi sépare volontairement **l’interopérabilité** de **la divulgation de l’implémentation**.

La couche publique peut inclure :

- la structure du contrat ;
- la sémantique des champs ;
- les règles de versionnement ;
- les règles de validation ;
- les mécanismes de vérification ;
- les clés publiques de vérification ;
- des payloads d’exemple synthétiques ou approuvés ;
- le comportement générique d’un consommateur de référence.

La couche privée peut inclure :

- la logique propriétaire de gouvernance ;
- les moteurs internes de politique ;
- les seuils ;
- les règles de décision ;
- les stratégies de routage ;
- les mécanismes d’exécution ;
- l’architecture confidentielle ;
- les intégrations spécifiques aux partenaires ;
- la propriété intellectuelle non publiée.

Cette séparation permet à des systèmes indépendants d’interopérer sans obliger NeoMundi ni ses partenaires à exposer leur mécanique interne.

**Interface ouverte. Implémentation indépendante.**

---

# 14. Statut

Le contrat est actuellement :

```text
Version pilote — v0.1
```

Le format peut encore évoluer.

Toute évolution destinée à une consommation automatisée doit rester explicitement versionnée.

---

## NeoMundi

**Couche fondamentale de mesure runtime pour les systèmes d’IA.**

Une couche de mesure. Plusieurs applications. Plusieurs infrastructures.

**NeoMundi fournit le signal. Vous gardez le contrôle.**

---

© 2026 NeoMundi / Louis M Sàrl — Tous droits réservés.

Une licence open source est prévue pour une version future.
