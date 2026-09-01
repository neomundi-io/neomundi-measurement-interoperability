# NeoMundi Measurement Interoperability

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) · [NeoMundi](https://neomundi.io) · [Démo en direct](https://interop.neomundi.org/) · [API](https://api.neomundi.io)

> **Spécification publique d’interopérabilité pour transporter des signaux de mesure runtime NeoMundi signés, versionnés et vérifiables indépendamment entre systèmes distincts.**

---

**Qu’est-ce que c’est ?**
Un contrat public permettant de transporter une mesure runtime NeoMundi d’un système IA vers un autre système sous forme JSON signée, versionnée et vérifiable.

**À quoi cela sert-il ?**
Il permet à une infrastructure indépendante de recevoir une mesure NeoMundi, d’en vérifier l’intégrité et la provenance, d’en comprendre la frontière de mesure, puis de décider quoi en faire selon sa propre politique.

**À qui cela s’adresse-t-il ?**
Aux plateformes cloud, systèmes IA, agents, outils de gouvernance, systèmes d’observabilité, infrastructures d’audit, plateformes de monitoring et à toute infrastructure souhaitant consommer des mesures NeoMundi sans dépendre du moteur interne de mesure NeoMundi.

**Comment l’utiliser ?**
Générez ou recevez un contrat de mesure NeoMundi, validez-le contre la version de schéma qu’il déclare, vérifiez indépendamment son intégrité cryptographique, puis appliquez votre propre interprétation et votre propre politique.

**Ce contrat n’est pas développé isolément. Il est challengé, testé et renforcé par un cercle évolutif de contributeurs indépendants et d’infrastructures pilotes — voir [Contributors & Collective Development](./CONTRIBUTORS.md).**

```text
Système IA
    ↓
NeoMundi mesure
    ↓
contrat d’interopérabilité signé
    ↓
votre système le vérifie
    ↓
votre système l’interprète
    ↓
votre système décide quoi en faire
```

**NeoMundi mesure. Votre infrastructure décide.**

[Exemples](./examples/) · [Consommateur de référence](./consumer-reference/)

---

# Principe

NeoMundi fournit un **signal de mesure runtime** et sa **trace vérifiable**.

L’infrastructure qui reçoit ce signal conserve le contrôle sur :

* l’interprétation ;
* la politique ;
* la décision ;
* l’action.

Le contrat d’interopérabilité standardise **l’interface entre la mesure et sa consommation**.

Il ne standardise, ne révèle et ne prescrit pas :

* l’implémentation interne de la mesure NeoMundi ;
* le moteur de politique du consommateur ;
* les seuils du consommateur ;
* ses mécanismes d’enforcement ;
* son architecture interne spécifique.

**Interopérabilité publique ne signifie pas implémentation publique.**

```text
NeoMundi
mesure
    ↓
COUCHE PUBLIQUE D’INTEROPÉRABILITÉ
contrat signé
schéma
validation
vérification
    ↓
────────────────────────────
frontière consommateur
────────────────────────────
    ↓
COUCHE PRIVÉE / SPÉCIFIQUE AU PARTENAIRE
interprétation
politique
seuils
décision
action
```

**Interface ouverte ≠ implémentation ouverte.**

---

# 1. Pourquoi ce contrat existe

Un système IA peut être mesuré par NeoMundi sans que l’infrastructure qui consomme cette mesure dépende du code interne de NeoMundi.

Le **NeoMundi Measurement Interoperability Contract** fournit une représentation :

* structurée ;
* versionnée ;
* signée cryptographiquement ;
* vérifiable indépendamment ;
* consommable par machine ;
* explicite sur sa frontière de mesure.

Il permet à une infrastructure externe de :

* valider la structure du contrat ;
* vérifier sa version de schéma ;
* vérifier l’intégrité du payload ;
* vérifier la signature cryptographique ;
* corréler l’observation entre plusieurs systèmes ;
* consommer les signaux de mesure ;
* comprendre les limites de mesure ;
* distinguer les dimensions mesurées de celles qui ne le sont pas ;
* appliquer ses propres règles de gouvernance ;
* conserver une preuve auditable.

Le contrat définit **ce que signifie le signal et comment il peut être consommé de manière sûre**.

Il ne nécessite pas de reconstruire le moteur interne de mesure NeoMundi.

---

# 2. Structure du contrat

Le contrat contient cinq sections principales :

```text
identity
provenance
observation
governance
integrity
```

---

## `identity`

Permet d’identifier et de corréler l’observation entre plusieurs systèmes.

Cette section comprend notamment :

* la version du schéma ;
* l’identifiant de requête ;
* l’identifiant de trace ;
* l’horodatage ;
* l’identifiant système ;
* l’identifiant pseudonymisé du modèle ;
* le mode runtime.

Le modèle doit être pseudonymisé ou représenté par :

```text
local
```

Les identifiants bruts fournisseur/modèle ne sont pas transportés.

---

## `provenance`

Décrit la provenance technique de la mesure.

Elle peut contenir :

* la version de mesure ;
* la version du normalizer ;
* le nombre de checks produits ;
* l’identifiant de batch source ;
* la méthode de canonicalisation.

Cette couche de provenance n’expose pas le contenu conversationnel ou métier brut traité par le système IA.

---

## `observation`

Contient l’observation de mesure runtime.

Elle inclut :

* le statut de mesure ;
* la couverture de mesure ;
* les valeurs des signaux mesurés ;
* le statut individuel de chaque signal ;
* la classification de l’observation ;
* la confiance ;
* les limitations ;
* la frontière de mesure ;
* le scope runtime.

Une observation NeoMundi est un **signal de mesure borné**.

Ce n’est pas un verdict universel sur le système observé.

---

## `governance`

Contient des informations consultatives non contraignantes qu’un consommateur peut choisir d’utiliser dans sa propre politique.

Une recommandation ou un signal de revue :

* n’est pas une autorisation d’exécution ;
* ne remplace pas la politique du consommateur ;
* ne déclenche pas automatiquement une action imposée par NeoMundi.

L’infrastructure qui reçoit le signal décide de la signification opérationnelle qu’elle souhaite lui attribuer.

---

## `integrity`

Contient les éléments nécessaires à une vérification indépendante :

* empreinte SHA-256 du payload ;
* informations de canonicalisation ;
* signature cryptographique Ed25519/JWS ;
* identité du signataire ;
* `key_id`.

---

# 3. Frontière épistémique — RGC v0.2

RGC v0.2 introduit des règles explicites empêchant une mesure d’affirmer davantage que ce qui a réellement été observé.

Le principe central est :

> **L’absence de preuve n’est significative que dans le domaine effectivement mesuré.**

Un contrat doit distinguer :

```text
MESURÉ + AUCUN SIGNAL
```

de :

```text
NON MESURÉ
COUVERTURE INSUFFISANTE
```

Un signal non mesuré ne doit jamais être représenté par une valeur numérique artificiellement rassurante.

---

## Statut individuel des signaux

RGC v0.2 introduit des états explicites pour chaque signal :

```text
measured
not_measured
insufficient_coverage
```

Si un signal est :

```text
measured
```

sa valeur doit être numérique.

Si un signal est :

```text
not_measured
```

ou :

```text
insufficient_coverage
```

sa valeur doit être :

```json
null
```

`null` ne doit jamais être interprété comme :

```text
0.0
sûr
normal
within_bounds
absence de risque
```

---

# 4. Couverture de mesure

RGC v0.2 rend normative la relation entre statut de l’observation et couverture de mesure.

```text
measurement_status = complete
```

exige :

```text
measurement_coverage = 1.0
```

tandis que :

```text
measurement_status = partial
```

exige :

```text
measurement_coverage < 1.0
```

Une observation partiellement couverte ne peut donc plus être déclarée complète.

La couverture de mesure correspond à la fraction de la **frontière de mesure déclarée** effectivement couverte.

Elle ne doit pas être automatiquement interprétée comme le pourcentage de champs de signaux individuels mesurés.

---

# 5. Signification de `within_bounds`

Dans RGC v0.2 :

```text
observation_class = within_bounds
```

signifie :

> Aucun franchissement de seuil applicable n’a été détecté dans le domaine effectivement mesuré.

Cela ne signifie **pas** :

* que toutes les dimensions possibles ont été mesurées ;
* que le système est globalement sûr ;
* qu’aucun problème n’existe dans les dimensions non mesurées ;
* qu’un signal non mesuré équivaut à zéro ;
* que l’observation constitue une certification de sécurité.

La signification reste explicitement bornée au domaine mesuré.

---

# 6. Signification de `flagged`

Une observation partiellement couverte peut légitimement être :

```text
observation_class = flagged
```

lorsqu’un signal effectivement mesuré dans le domaine couvert justifie cette classification.

Une mesure partielle limite donc **la portée de l’inférence**, mais n’empêche pas de rapporter une preuve effectivement observée.

---

# 7. `not_assessed`

RGC v0.2 supporte également :

```text
observation_class = not_assessed
```

lorsque les éléments effectivement mesurés sont insuffisants pour soutenir :

```text
within_bounds
```

ou :

```text
flagged
```

Cela empêche qu’une mesure insuffisante soit silencieusement transformée en classification rassurante.

---

# 8. Frontière temporelle

Un contrat avec :

```text
runtime_scope = single_request
```

décrit une observation runtime ponctuelle.

Une observation unique ne peut pas, à elle seule, établir :

* une fréquence ;
* une persistance ;
* une récurrence ;
* une tendance ;
* un drift.

Ces propriétés nécessitent une comparaison entre plusieurs observations.

Un record `single_request` ne doit donc jamais être interprété comme une preuve d’un comportement temporel qu’il ne mesure pas.

---

# 9. Frontière de responsabilité

L’un des invariants fondamentaux du contrat est :

```json
{
  "execution_permission_changed": false
}
```

Une mesure NeoMundi ne peut pas accorder, retirer ou modifier silencieusement une permission d’exécution.

La séparation est explicite :

```text
NeoMundi
    ↓
mesure runtime
    ↓
signal vérifiable
    ↓
────────────────────────────
frontière du système
────────────────────────────
    ↓
interprétation consommateur
    ↓
politique consommateur
    ↓
décision consommateur
    ↓
action consommateur
```

NeoMundi n’a pas besoin d’accéder aux éléments propriétaires du consommateur :

* moteur de politique ;
* seuils ;
* logique de routage ;
* système de décision ;
* architecture d’enforcement.

Le consommateur conserve ces éléments sous son propre modèle de gouvernance et de sécurité.

---

# 10. Souveraineté des données

Le contrat d’interopérabilité est conçu pour éviter le transport de contenu conversationnel ou métier brut.

Il ne contient pas :

* de prompts utilisateurs bruts ;
* de réponses brutes du modèle ;
* d’identifiants fournisseur/modèle bruts.

Le consommateur peut vérifier indépendamment ces contraintes avant de stocker ou d’utiliser le contrat.

Le contrat ne nécessite pas non plus de révéler :

* des politiques propriétaires ;
* des seuils privés ;
* des règles de décision ;
* des mécanismes d’enforcement ;
* une architecture de gouvernance spécifique au partenaire ;
* des détails d’implémentation confidentiels.

Le contrat public concerne donc **l’interface partagée**, et non la logique interne privée des systèmes participants.

---

# 11. Endpoints publics

## JSON Schema

Le schéma public du contrat peut être récupéré via :

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

Le dépôt contient également des fichiers de schéma versionnés, notamment :

```text
schema/contract-v0.1.schema.json
schema/contract-v0.2.schema.json
```

Un consommateur doit valider un contrat contre la version exacte du schéma déclarée par :

```text
identity.schema_version
```

Un consommateur ne doit jamais interpréter silencieusement un contrat v0.2 avec la sémantique v0.1, ou inversement.

Le mécanisme API précis permettant de récupérer plusieurs versions historiques du schéma doit lui-même être considéré comme un contrat d’API versionné et ne doit pas être supposé tant qu’il n’a pas été publié explicitement.

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

identifie la clé utilisée pour la vérification.

Récupérer le schéma et les clés publiques de vérification ne nécessite pas d’accéder au moteur interne de mesure NeoMundi.

---

# 12. Obtenir un contrat

À partir d’une observation NeoMundi existante :

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

Un contrat de production est attendu comme :

* JSON ;
* versionné ;
* doté d’une empreinte d’intégrité ;
* signé cryptographiquement.

---

# 13. Workflow consommateur

Une intégration standard suit les étapes suivantes :

```text
1. Recevoir
2. Vérifier la version du schéma
3. Valider
4. Vérifier les frontières de souveraineté
5. Vérifier l’intégrité
6. Interpréter
7. Appliquer la politique consommateur
8. Conserver un reçu
```

---

## Étape 1 — Recevoir

Le consommateur reçoit un contrat JSON d’interopérabilité correspondant à une observation NeoMundi.

---

## Étape 2 — Vérifier la version du schéma

Le consommateur vérifie :

```text
contract.identity.schema_version == schema.version
```

Une différence de version doit conduire au rejet avant interprétation.

---

## Étape 3 — Valider

Le contrat est validé contre le JSON Schema correspondant.

Avec v0.2, la validation peut imposer :

* la cohérence entre `complete` et une couverture totale ;
* la cohérence entre `partial` et une couverture incomplète ;
* le statut individuel des signaux ;
* des valeurs numériques uniquement pour les signaux réellement mesurés ;
* `null` pour les signaux non mesurés ou insuffisamment couverts.

---

## Étape 4 — Vérifier les contraintes de souveraineté

Le consommateur contrôle indépendamment l’absence de contenu brut interdit ainsi que le respect de la frontière d’autorité d’exécution.

---

## Étape 5 — Vérifier l’intégrité

Le consommateur vérifie indépendamment :

* l’empreinte SHA-256 ;
* la signature Ed25519/JWS ;
* la clé de vérification ;
* les claims signées.

Le vérificateur de référence contrôle les claims suivantes :

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

Le `kid` du JWS, lorsqu’il est présent, doit correspondre à :

```text
integrity.key_id
```

---

## Étape 6 — Interpréter

L’infrastructure lit :

* les valeurs mesurées ;
* le statut de chaque signal ;
* la couverture de mesure ;
* les limitations ;
* la frontière de mesure ;
* les informations consultatives.

L’interprétation doit rester bornée au domaine effectivement mesuré.

---

## Étape 7 — Appliquer la politique consommateur

Le consommateur détermine l’action adaptée.

Par exemple :

```text
review_recommendation = required
            ↓
       suspendre le flux
            ↓
        revue humaine
```

Il s’agit d’un **exemple de politique définie par le consommateur**.

Elle n’est pas imposée par NeoMundi.

Une autre infrastructure peut choisir :

```text
signal
    ↓
journalisation uniquement
```

ou :

```text
signal
    ↓
surveillance renforcée
```

ou :

```text
signal
    ↓
reroutage
```

Le contrat reste l’interface de mesure.

La politique appartient au consommateur.

---

## Étape 8 — Conserver un reçu auditable

Un consommateur peut conserver :

* l’identifiant de requête ;
* la version de schéma ;
* le payload hash ;
* la clé de vérification ;
* le résultat de vérification d’intégrité ;
* le résultat de vérification de signature ;
* la décision de routage consommateur ;
* la justification de cette décision ;
* l’horodatage du traitement ;
* le contrat complet reçu.

Cela préserve une trace auditable et versionnée.

---

# 14. Consommateur de référence

NeoMundi fournit un consommateur de référence indépendant montrant comment un système tiers peut traiter un contrat.

Le flux de référence est :

```text
contrat
    ↓
vérification de version du schéma
    ↓
validation JSON Schema
    ↓
contrôles de souveraineté
    ↓
vérification SHA-256
    ↓
vérification Ed25519/JWS + claims signées
    ↓
politique définie par le consommateur
    ↓
reçu auditable
```

L’implémentation de référence est indépendante du code producteur NeoMundi.

Elle ne reproduit pas le moteur interne de mesure.

Elle démontre uniquement un pattern générique d’interopérabilité.

Un partenaire peut conserver entièrement privés :

* sa logique d’interprétation ;
* son moteur de politique ;
* ses seuils ;
* sa logique de décision ;
* ses mécanismes de routage ;
* ses mécanismes d’enforcement ;
* son architecture de gouvernance ;
* sa propriété intellectuelle.

Voir :

[Consommateur de référence](./consumer-reference/README.md)

---

# 15. Démonstration historique v0.1 hors ligne

La démonstration hors ligne existante utilise les observations signées RGC v0.1 originales.

Depuis :

```text
consumer-reference/
```

exécuter :

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

La démonstration historique utilise :

* deux contrats v0.1 signés depuis `../examples/` ;
* `../schema/contract-v0.1.schema.json` ;
* le JWKS public local.

Résultat historique attendu :

```text
hash_match=True
signature_valid=True
```

Les exemples v0.1 signés sont conservés inchangés pour assurer leur reproductibilité.

Ils ne doivent pas être réécrits rétrospectivement pour satisfaire v0.2, car cela invaliderait leurs payload hashes et leurs signatures d’origine.

---

# 16. Fixtures RGC v0.2

Les fixtures illustratives v0.2 sont stockées dans :

```text
examples/fixtures/
```

Elles montrent les sémantiques corrigées, par exemple :

```text
mesure partielle
+
signaux mesurés
+
signaux not_measured
+
insufficient_coverage
```

ainsi que :

```text
mesure partielle
+
preuve flagged dans le domaine mesuré
```

Ces fixtures illustrent le schéma et sa sémantique.

Tant qu’elles n’ont pas été explicitement générées et signées par le producteur canonique NeoMundi, elles ne doivent pas être présentées comme des observations NeoMundi live cryptographiquement valides.

Les observations v0.2 de production devront être générées, hashées et signées par le producteur canonique.

---

# 17. Standards utilisés

NeoMundi réutilise des standards existants lorsque cela est pertinent.

---

## JSON Schema

Le contrat utilise :

**JSON Schema Draft 2020-12**

Le schéma fournit une validation structurelle et sémantique lisible par machine.

---

## W3C Trace Context

La corrélation inter-systèmes utilise un identifiant de trace compatible avec la forme définie par **W3C Trace Context**.

Cela permet la corrélation avec des systèmes de tracing externes sans remplacer leurs propres mécanismes internes.

---

## SHA-256

Une représentation JSON canonique est utilisée pour calculer une empreinte SHA-256 du payload.

Cette empreinte permet de détecter une modification du contenu.

Elle ne doit pas être confondue avec la signature elle-même.

---

## JWS / Ed25519

Le contrat utilise :

* **JSON Web Signature — RFC 7515** ;
* **Ed25519** ;
* la représentation de clé publique au format **JWK**.

La signature permet la vérification indépendante de l’origine et de l’intégrité.

---

## CloudEvents

La structure reprend certains principes généraux de CloudEvents relatifs à :

* l’identité ;
* la source ;
* le temps ;
* le type d’événement.

Le contrat conserve néanmoins des noms de champs spécifiques à NeoMundi.

**NeoMundi ne revendique pas une conformité complète avec l’enveloppe CloudEvents.**

---

# 18. Modèle d’intégrité

Un contrat de production valide nécessite à la fois :

```text
empreinte SHA-256
+
signature Ed25519/JWS
```

Il n’existe pas de mode valide reposant uniquement sur le hash.

Si la signature cryptographique requise ne peut pas être produite, un contrat signé valide ne doit pas être émis.

Les métadonnées signées incluent :

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

Un consommateur doit vérifier à la fois la validité cryptographique et la cohérence de ces claims avec le contrat reçu.

---

# 19. Versioning

Le format du contrat est explicitement versionné.

## RGC v0.1

RGC v0.1 reste disponible pour :

* la reproductibilité historique ;
* la vérification des observations signées existantes ;
* la compatibilité avec les artefacts pilotes existants.

Les observations v0.1 signées restent inchangées.

Leur sémantique historique est conservée telle qu’elle existait.

---

## RGC v0.2

RGC v0.2 introduit des corrections sémantiques concernant :

* les mesures partielles ;
* le statut individuel des signaux ;
* les valeurs `null` pour les signaux non mesurés ;
* l’interprétation bornée au domaine mesuré ;
* la cohérence entre couverture et statut de mesure ;
* les limites temporelles explicites des observations `single_request`.

Invariant central :

> **L’absence de preuve n’est significative que dans le domaine effectivement mesuré.**

RGC v0.2 est introduit comme une nouvelle version plutôt que comme une réécriture silencieuse de v0.1.

Cela préserve :

* la reproductibilité historique ;
* la falsifiabilité ;
* l’intégrité cryptographique ;
* l’évolution explicite du protocole.

---

# 20. Ce que ce contrat ne fait pas

Le NeoMundi Measurement Interoperability Contract ne :

* donne pas d’autorisation d’exécution ;
* ne révoque pas d’autorisation d’exécution ;
* ne remplace pas le moteur de politique du consommateur ;
* ne décide pas à la place d’une infrastructure tierce ;
* ne certifie pas des données tierces ;
* ne certifie pas qu’un système IA est globalement sûr ;
* ne produit pas de conclusion au-delà du domaine effectivement mesuré ;
* ne transforme pas une absence de mesure en valeur rassurante ;
* n’infère pas un drift à partir d’une seule observation ;
* n’exige pas l’accès au code interne NeoMundi ;
* ne révèle pas les formules internes de mesure ;
* ne transporte pas les prompts ou réponses bruts ;
* n’impose pas une politique de routage universelle ;
* n’exige pas la divulgation des politiques du partenaire ;
* n’exige pas la divulgation des seuils du partenaire ;
* n’exige pas la publication de la logique de décision ou d’enforcement ;
* ne transfère ni le contrôle ni la propriété de la propriété intellectuelle du partenaire.

Il constitue une **interface vérifiable entre la mesure runtime et les systèmes qui consomment cette mesure**.

---

# 21. Pattern d’intégration

La même primitive de mesure peut être utilisée par plusieurs infrastructures :

```text
                    NeoMundi
                       ↓
                 mesure runtime
                       ↓
             contrat interopérable
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
 Observabilité     Gouvernance       Audit
        ↓              ↓              ↓
 journalisation      politique      rétention
        ↓              ↓              ↓
    analyse           action        preuve
```

La couche de mesure reste la même.

Les applications peuvent être multiples.

Chaque infrastructure consommatrice conserve sa propre implémentation aval.

---

# 22. Interface publique, implémentation privée

NeoMundi sépare volontairement **interopérabilité** et **divulgation de l’implémentation**.

La couche publique peut inclure :

* la structure du contrat ;
* la sémantique des champs ;
* les règles de versioning ;
* les règles de validation ;
* les mécanismes de vérification ;
* les clés publiques de vérification ;
* les exemples approuvés ;
* les fixtures illustratives ;
* le comportement générique du consommateur de référence.

La couche privée peut inclure :

* l’implémentation interne de la mesure NeoMundi ;
* la logique propriétaire de gouvernance ;
* les moteurs de politique des consommateurs ;
* les seuils ;
* les règles de décision ;
* les stratégies de routage ;
* les mécanismes d’enforcement ;
* les architectures confidentielles des partenaires ;
* la propriété intellectuelle non publiée.

Cette séparation permet à des systèmes indépendants d’interopérer sans obliger l’une ou l’autre partie à exposer son fonctionnement interne.

**Interface ouverte. Implémentation indépendante.**

---

# 23. Statut

Le contrat d’interopérabilité contient actuellement :

```text
RGC v0.1 — contrat pilote historique signé
RGC v0.2 — sémantique d’interopérabilité corrigée et versionnée
```

Le format peut continuer à évoluer.

Toute évolution destinée à une consommation automatique doit rester explicitement versionnée.

Les artefacts historiques signés doivent rester immuables.

---

## NeoMundi

**Couche fondamentale de mesure runtime pour les systèmes IA.**

Une primitive de mesure. Plusieurs applications. Plusieurs infrastructures.

**NeoMundi fournit le signal. Vous conservez le contrôle.**

---

© 2026 NeoMundi / Louis M Sàrl — Tous droits réservés.

Une licence open source est prévue pour une prochaine version.
