# NeoMundi Measurement Interoperability

[🇬🇧 English](./README.md) · [🇫🇷 Français](./README_FR.md) ·
[NeoMundi](https://neomundi.io) · [Démonstration](https://interop.neomundi.org/) ·
[Créer un compte](https://controltower.neomundi.io/welcome)

## Transporter des mesures runtime d’IA vérifiables entre des systèmes indépendants

NeoMundi Measurement Interoperability est le contrat public permettant de transporter une mesure runtime NeoMundi d’un système à un autre sous la forme d’un objet JSON signé, versionné et vérifiable de manière indépendante.

Il permet à une infrastructure indépendante de :

* recevoir une mesure NeoMundi sans dépendre du moteur de mesure interne ;
* valider l’enregistrement par rapport à la version de schéma déclarée ;
* vérifier son intégrité, sa signature et sa provenance ;
* comprendre ce qui a été mesuré, ce qui ne l’a pas été et les limites de l’observation ;
* conserver un reçu auditable ;
* appliquer sa propre interprétation, sa propre politique et sa propre action opérationnelle.

Le même contrat peut être consommé par des **plateformes d’observabilité, des systèmes d’audit et de conformité, des outils de gouvernance, des assureurs, des agents IA, des plateformes cloud et des infrastructures partenaires**.

> **NeoMundi mesure. Votre infrastructure vérifie, interprète et décide.**

**Interface ouverte · Contrat signé · Sémantique versionnée · Vérification indépendante**

### Obtenir et vérifier votre premier contrat

1. **Créez votre compte NeoMundi et votre clé API**  
   [Ouvrir la plateforme NeoMundi →](https://controltower.neomundi.io/welcome)

2. **Générez une mesure runtime NeoMundi**  
   [Suivre le Quickstart Runtime Measurement →](https://github.com/neomundi-io/neomundi-runtime-measurement/blob/main/QUICKSTART.md)

3. **Récupérez le contrat d’interopérabilité**

   ```bash
   curl -X POST \
     "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
     -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
   ```

4. **Validez-le et vérifiez-le indépendamment**  
   Faites correspondre la version de schéma déclarée, validez le JSON, vérifiez l’empreinte SHA-256 et la signature Ed25519/JWS, puis appliquez votre propre politique.

[Exemples](./examples/) · [Consommateur de référence](./consumer-reference/) ·
[Schéma JSON](https://api.neomundi.io/v1/rgc/schema) ·
[Clés publiques de vérification](https://api.neomundi.io/v1/rgc/jwks)

### Statut des versions

| Version | Rôle |
|---|---|
| **RGC v0.1** | Contrat pilote historique signé, conservé sans modification pour la reproductibilité et la compatibilité |
| **RGC v0.2** | Sémantique versionnée corrigée pour la mesure partielle, la couverture, le statut de chaque signal et l’interprétation limitée au domaine mesuré |

Les artefacts historiques signés restent immuables. Les consommateurs automatisés doivent toujours utiliser la sémantique de la version de schéma déclarée par le contrat.

Ce contrat est mis à l’épreuve, testé et renforcé par des contributeurs indépendants et des infrastructures pilotes. Voir [Contributeurs et développement collectif](./CONTRIBUTORS.md).

---

## Flux du contrat

```text
Système d’IA
    ↓
NeoMundi mesure
    ↓
contrat d’interopérabilité signé
    ↓
votre système le vérifie
    ↓
votre système l’interprète
    ↓
votre système décide de l’action à entreprendre
```

**NeoMundi mesure. Votre infrastructure décide.**

---

# Principe

NeoMundi fournit un **signal de mesure runtime** et sa **trace vérifiable**.

L’infrastructure qui reçoit ce signal conserve le contrôle de :

* l’interprétation ;
* la politique ;
* la décision ;
* l’action.

Le contrat d’interopérabilité normalise l’**interface entre la mesure et sa consommation**.

Il ne normalise, ne divulgue et ne prescrit pas :

* l’implémentation interne de la mesure NeoMundi ;
* le moteur de politique du consommateur ;
* les seuils du consommateur ;
* les mécanismes d’exécution du consommateur ;
* l’architecture interne propre à un partenaire.

**Une interopérabilité publique ne signifie pas une implémentation publique.**

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
frontière du consommateur
────────────────────────────
    ↓
COUCHE PRIVÉE / PROPRE AU PARTENAIRE
interprétation
politique
seuils
décision
action
```

**Interface ouverte ≠ implémentation ouverte.**

---

# 1. Pourquoi ce contrat existe

Un système d’IA peut être mesuré par NeoMundi sans que l’infrastructure destinataire dépende du code interne de NeoMundi.

Le **NeoMundi Measurement Interoperability Contract** fournit une représentation :

* structurée ;
* versionnée ;
* signée cryptographiquement ;
* vérifiable indépendamment ;
* exploitable par une machine ;
* explicite sur sa frontière de mesure.

Il permet à une infrastructure externe de :

* valider la structure du contrat ;
* vérifier la version du schéma ;
* vérifier l’intégrité du payload ;
* vérifier la signature cryptographique ;
* corréler une observation entre plusieurs systèmes ;
* consommer les signaux de mesure ;
* comprendre les limites de la mesure ;
* distinguer les dimensions mesurées de celles qui ne le sont pas ;
* appliquer ses propres règles de gouvernance ;
* conserver une preuve auditable.

Le contrat définit **comment l’enregistrement de mesure est structuré, vérifié et consommé de façon sûre entre les systèmes**. La signification et les limites d’interprétation des signaux sous-jacents sont définies par le [NeoMundi Metric Contract](https://github.com/neomundi-io/neomundi-metric-contract).

Il n’exige pas de reconstruire le moteur de mesure interne de NeoMundi.

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

## `identity`

Sert à identifier et à corréler l’observation entre les systèmes.

Elle comprend notamment :

* la version du schéma ;
* l’identifiant de requête ;
* l’identifiant de trace ;
* l’horodatage ;
* l’identifiant du système ;
* l’identifiant pseudonymisé du modèle ;
* le mode runtime.

Le modèle doit être pseudonymisé ou représenté par :

```text
local
```

Les identifiants bruts du fournisseur ou du modèle ne sont pas transportés.

## `provenance`

Décrit la provenance technique de la mesure.

Elle peut comprendre :

* la version de mesure ;
* la version du normaliseur ;
* le nombre de contrôles émis ;
* l’identifiant du lot source ;
* la méthode de canonicalisation.

Cette couche de provenance n’expose pas le contenu conversationnel ou métier brut traité par le système d’IA.

## `observation`

Contient l’observation de mesure runtime :

* le statut de la mesure ;
* la couverture de la mesure ;
* les valeurs des signaux mesurés ;
* le statut de mesure de chaque signal ;
* la classification de l’observation ;
* la confiance ;
* les limitations ;
* la frontière de mesure ;
* le périmètre runtime.

Une observation NeoMundi est un **signal de mesure borné**. Ce n’est pas un verdict universel sur le système observé.

## `governance`

Contient des informations consultatives non contraignantes qu’un consommateur peut choisir d’utiliser comme données d’entrée de sa propre politique.

Une recommandation ou un signal de revue :

* n’est pas une autorisation d’exécution ;
* ne remplace pas la politique du consommateur ;
* ne déclenche pas automatiquement une action imposée par NeoMundi.

L’infrastructure destinataire décide du sens opérationnel qu’elle attribue éventuellement au signal.

## `integrity`

Contient les éléments nécessaires à une vérification indépendante :

* l’empreinte SHA-256 du payload ;
* les informations de canonicalisation ;
* la signature cryptographique Ed25519/JWS ;
* l’identité du signataire ;
* `key_id`.

---

# 3. Frontière épistémique — RGC v0.2

RGC v0.2 introduit des règles explicites empêchant une mesure d’affirmer davantage que ce qui a réellement été observé.

Principe central :

> **L’absence de preuve n’a de sens que dans le domaine mesuré.**

Un contrat doit distinguer :

```text
MESURÉ + AUCUN SIGNAL
```

de :

```text
NON MESURÉ
COUVERTURE INSUFFISANTE
```

Un signal non mesuré ne doit jamais être représenté par une valeur rassurante inventée.

## Statut de mesure par signal

RGC v0.2 introduit des états explicites pour chaque signal :

```text
measured
not_measured
insufficient_coverage
```

Si un signal est `measured`, sa valeur doit être numérique. S’il est `not_measured` ou `insufficient_coverage`, sa valeur doit être :

```json
null
```

`null` ne doit jamais être interprété comme :

```text
0.0
safe
normal
within_bounds
no risk
```

---

# 4. Couverture de la mesure

RGC v0.2 rend normative la relation entre le statut de l’observation et la couverture de mesure.

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

Une observation partiellement couverte ne peut pas être présentée comme complète.

La couverture désigne la fraction de la **frontière de mesure déclarée** effectivement couverte. Elle ne doit pas être interprétée automatiquement comme le pourcentage de champs de signaux individuels qui ont été mesurés.

---

# 5. Signification de `within_bounds`

Dans RGC v0.2 :

```text
observation_class = within_bounds
```

signifie :

> Aucun signal applicable franchissant un seuil n’a été détecté dans le domaine mesuré.

Cela ne signifie pas :

* que toutes les dimensions possibles ont été mesurées ;
* que le système est globalement sûr ;
* que les dimensions non mesurées ne contiennent aucun problème ;
* que les signaux non mesurés valent zéro ;
* que l’observation constitue une certification de sécurité.

La signification est explicitement bornée par le domaine mesuré.

---

# 6. Signification de `flagged`

Une observation partiellement couverte peut légitimement être classée :

```text
observation_class = flagged
```

lorsqu’un signal effectivement mesuré dans le domaine couvert justifie cette classification.

La mesure partielle limite donc la **portée de l’inférence**, et non la capacité à rapporter une preuve réellement observée.

---

# 7. `not_assessed`

RGC v0.2 prend également en charge :

```text
observation_class = not_assessed
```

lorsque les preuves mesurées disponibles ne permettent de conclure ni à `within_bounds` ni à `flagged`.

Cela évite qu’une mesure insuffisante soit silencieusement convertie en classification rassurante.

---

# 8. Frontière temporelle

Un contrat avec :

```text
runtime_scope = single_request
```

décrit une seule observation runtime.

Une observation unique ne peut établir à elle seule :

* une fréquence ;
* une persistance ;
* une récurrence ;
* une tendance ;
* une dérive.

Ces propriétés nécessitent la comparaison d’une série d’observations. Un enregistrement `single_request` ne doit donc jamais être interprété comme la preuve d’un comportement temporel qu’il ne mesure pas.

---

# 9. Frontière de responsabilité

L’un des invariants fondamentaux du contrat est :

```json
{
  "execution_permission_changed": false
}
```

Une mesure NeoMundi n’accorde, ne retire ni ne modifie silencieusement une autorisation d’exécution.

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
interprétation du consommateur
    ↓
politique du consommateur
    ↓
décision du consommateur
    ↓
action du consommateur
```

NeoMundi n’a pas besoin d’accéder au moteur de politique, aux seuils, à la logique de routage, au système de décision ou à l’architecture d’exécution propriétaires du consommateur.

Le consommateur conserve ces composants sous son propre modèle de gouvernance et de sécurité.

---

# 10. Souveraineté des données

Le contrat est conçu pour éviter le transport de contenu conversationnel ou métier brut.

Il ne contient pas :

* les prompts bruts des utilisateurs ;
* les réponses brutes des modèles ;
* les identifiants bruts du fournisseur ou du modèle.

Le consommateur peut vérifier indépendamment ces contraintes avant de stocker un contrat ou d’agir sur celui-ci.

Le contrat n’exige pas non plus la divulgation des politiques propriétaires, seuils privés, règles de décision, mécanismes d’exécution, architectures de gouvernance propres aux partenaires ou détails d’implémentation confidentiels.

Le contrat public concerne donc l’**interface partagée**, et non la logique interne privée des systèmes participants.

---

# 11. Endpoints publics

## Schéma JSON

```bash
curl https://api.neomundi.io/v1/rgc/schema
```

Le dépôt contient également des schémas versionnés, notamment :

```text
schema/contract-v0.1.schema.json
schema/contract-v0.2.schema.json
```

Un consommateur doit valider le contrat avec la version exacte déclarée par `identity.schema_version`.

Il ne doit jamais traiter silencieusement un contrat v0.2 avec la sémantique v0.1, ou inversement.

Le mécanisme exact de l’API pour récupérer plusieurs versions historiques doit être considéré comme un contrat d’API versionné et ne doit pas être supposé tant qu’il n’est pas explicitement publié.

## Clés publiques de vérification

```bash
curl https://api.neomundi.io/v1/rgc/jwks
```

Le champ `integrity.key_id` identifie la clé utilisée pour la vérification.

Récupérer le schéma et les clés publiques ne nécessite aucun accès au moteur de mesure interne de NeoMundi.

---

# 12. Obtenir un contrat

À partir d’une observation NeoMundi existante :

```bash
curl -X POST \
  "https://api.neomundi.io/v1/rgc/contracts/{request_id}" \
  -H "X-API-Key: YOUR_NEOMUNDI_API_KEY"
```

Un contrat de production doit être fondé sur JSON, versionné, doté d’une empreinte d’intégrité et signé cryptographiquement.

---

# 13. Parcours du consommateur

```text
1. Recevoir
2. Faire correspondre la version du schéma
3. Valider
4. Contrôler les frontières de souveraineté
5. Vérifier l’intégrité
6. Interpréter
7. Appliquer la politique du consommateur
8. Conserver le reçu
```

## Étape 1 — Recevoir

Le consommateur reçoit un contrat JSON correspondant à une observation NeoMundi.

## Étape 2 — Faire correspondre la version du schéma

Le consommateur vérifie :

```text
contract.identity.schema_version == schema.version
```

Une incompatibilité de version doit entraîner le rejet avant toute interprétation.

## Étape 3 — Valider

Le contrat est validé avec le schéma JSON correspondant. En v0.2, la validation peut imposer :

* la cohérence entre `complete` et une couverture totale ;
* la cohérence entre `partial` et une couverture incomplète ;
* le statut de mesure de chaque signal ;
* des valeurs numériques uniquement pour les signaux mesurés ;
* `null` pour les signaux non mesurés ou insuffisamment couverts.

## Étape 4 — Contrôler les contraintes de souveraineté

Le consommateur vérifie indépendamment l’absence de contenu brut interdit et de sémantique d’exécution non autorisée.

## Étape 5 — Vérifier l’intégrité

Le consommateur vérifie indépendamment :

* l’empreinte SHA-256 ;
* la signature Ed25519/JWS ;
* la clé de vérification ;
* les déclarations de métadonnées signées.

Le vérificateur de référence contrôle :

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

Le `kid` JWS, lorsqu’il est présent, doit correspondre à `integrity.key_id`.

## Étape 6 — Interpréter

L’infrastructure lit les valeurs mesurées, le statut de chaque signal, la couverture, les limitations, la frontière de mesure et les informations consultatives.

L’interprétation doit rester bornée au domaine réellement mesuré.

## Étape 7 — Appliquer la politique du consommateur

Le consommateur détermine l’action appropriée. Par exemple :

```text
review_recommendation = required
            ↓
     suspendre le flux
            ↓
       revue humaine
```

Il s’agit d’un **exemple de politique définie par le consommateur**, non imposée par NeoMundi.

Une autre infrastructure peut choisir une simple journalisation, une surveillance accrue ou un reroutage. Le contrat reste l’interface de mesure ; la politique appartient au consommateur.

## Étape 8 — Conserver un reçu auditable

Un consommateur peut conserver :

* l’identifiant de requête ;
* la version du schéma ;
* le hash du payload ;
* la clé de vérification ;
* le résultat de la vérification d’intégrité ;
* le résultat de la vérification de signature ;
* la décision de routage ;
* la justification de la décision ;
* l’horodatage du traitement ;
* le contrat complet reçu.

Cela préserve une piste d’audit versionnée.

---

# 14. Consommateur de référence

NeoMundi fournit un consommateur de référence indépendant montrant comment un système tiers peut traiter un contrat.

```text
contrat
    ↓
contrôle de version du schéma
    ↓
validation JSON Schema
    ↓
contrôles de souveraineté
    ↓
vérification SHA-256
    ↓
vérification Ed25519/JWS + déclarations signées
    ↓
politique définie par le consommateur
    ↓
reçu auditable
```

L’implémentation de référence est indépendante du code producteur de NeoMundi. Elle ne reproduit pas le moteur de mesure interne et démontre uniquement un modèle générique d’interopérabilité.

Un partenaire peut conserver entièrement privés sa logique d’interprétation, son moteur de politique, ses seuils, sa logique de décision, ses mécanismes de routage et d’exécution, son architecture de gouvernance et sa propriété intellectuelle.

Voir [Consommateur de référence](./consumer-reference/README.md).

---

# 15. Démonstration hors ligne historique v0.1

La démonstration hors ligne existante utilise les observations RGC v0.1 originales signées.

Depuis `consumer-reference/`, exécutez :

```bash
python -m pip install -r requirements.txt
python -m rgc_consumer_demo.cli --offline
```

Elle utilise deux contrats v0.1 signés de `../examples/`, le schéma `../schema/contract-v0.1.schema.json` et la fixture JWKS publique locale.

Résultat historique attendu :

```text
hash_match=True
signature_valid=True
```

Les exemples v0.1 signés sont conservés sans modification pour la reproductibilité. Ils ne doivent pas être réécrits rétroactivement selon la v0.2, car toute modification invaliderait leurs hash et signatures d’origine.

---

# 16. Fixtures RGC v0.2

Les fixtures illustratives v0.2 se trouvent dans `examples/fixtures/`.

Elles démontrent notamment une mesure partielle avec des signaux `measured`, `not_measured` et `insufficient_coverage`, ainsi qu’une mesure partielle comportant une preuve `flagged` dans le domaine mesuré.

Ces fixtures illustrent le schéma et sa sémantique. Sauf si elles sont explicitement générées et signées par le producteur canonique NeoMundi, elles ne doivent pas être présentées comme des observations NeoMundi réelles et cryptographiquement valides.

Les observations v0.2 valides en production doivent être générées, hachées et signées par le producteur canonique.

---

# 17. Standards utilisés

## JSON Schema

Le contrat utilise **JSON Schema Draft 2020-12**, qui fournit une validation structurelle et sémantique exploitable par une machine.

## W3C Trace Context

La corrélation intersystèmes utilise un identifiant de trace compatible avec la forme définie par **W3C Trace Context**, sans remplacer les mécanismes internes des systèmes de traçage externes.

## SHA-256

Une représentation JSON canonique sert à calculer l’empreinte SHA-256 du payload. L’empreinte détecte une modification et ne doit pas être confondue avec la signature elle-même.

## JWS / Ed25519

Le contrat utilise **JSON Web Signature — RFC 7515**, **Ed25519** et une représentation de clé publique au format **JWK**. La signature permet de vérifier indépendamment l’origine et l’intégrité.

## CloudEvents

La structure reprend certains principes généraux de CloudEvents concernant l’identité, la source, le temps et le type d’événement, tout en conservant les noms de champs propres à NeoMundi.

**NeoMundi ne revendique pas une conformité complète avec l’enveloppe CloudEvents.**

---

# 18. Modèle d’intégrité

Un contrat de production valide exige à la fois :

```text
empreinte SHA-256
+
signature Ed25519/JWS
```

Il n’existe aucun mode de repli valide fondé uniquement sur le hash. Si la signature cryptographique requise ne peut pas être produite, aucun contrat de production signé valide ne doit être émis.

Les métadonnées signées comprennent :

```text
payload_hash
hash_algorithm
schema_version
request_id
timestamp
```

Le consommateur doit vérifier à la fois la validité cryptographique et la cohérence entre ces déclarations et le contrat reçu.

---

# 19. Versionnement

Le format du contrat est explicitement versionné.

## RGC v0.1

RGC v0.1 reste disponible pour la reproductibilité historique, la vérification des observations signées existantes et la compatibilité avec les artefacts pilotes existants.

Les observations v0.1 signées restent inchangées et leur sémantique d’origine est préservée comme fait historique.

## RGC v0.2

RGC v0.2 introduit une sémantique corrigée pour :

* la mesure partielle ;
* l’état de mesure de chaque signal ;
* les signaux non mesurés pouvant prendre la valeur `null` ;
* l’interprétation limitée au domaine mesuré ;
* la cohérence entre la couverture et le statut de mesure ;
* les limites temporelles explicites de `single_request`.

Invariant central :

> **L’absence de preuve n’a de sens que dans le domaine mesuré.**

RGC v0.2 est introduit comme une nouvelle version plutôt que comme une réécriture silencieuse de la v0.1. Cela préserve la reproductibilité historique, la falsifiabilité, l’intégrité cryptographique et l’évolution explicite du protocole.

---

# 20. Ce que ce contrat ne fait pas

Le contrat NeoMundi Measurement Interoperability ne :

* donne ni ne révoque une autorisation d’exécution ;
* remplace pas le moteur de politique du consommateur ;
* décide pas au nom d’une infrastructure tierce ;
* certifie ni des données tierces ni la sécurité globale d’un système d’IA ;
* ne formule pas d’affirmation au-delà du domaine mesuré ;
* ne transforme pas une absence de mesure en valeur rassurante ;
* ne déduit pas une dérive d’une observation unique ;
* n’exige pas d’accès au code interne de NeoMundi ;
* ne divulgue pas les formules internes de mesure ;
* ne transporte pas les prompts ou réponses bruts ;
* n’impose pas une politique universelle de routage ;
* n’exige pas la divulgation des politiques, seuils ou logiques de décision et d’exécution des partenaires ;
* ne transfère ni le contrôle ni la propriété de leur propriété intellectuelle.

Il s’agit d’une **interface vérifiable entre la mesure runtime et les systèmes qui consomment cette mesure**.

---

# 21. Modèle d’intégration

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
 Observabilité    Gouvernance        Audit
        ↓              ↓              ↓
 journalisation     politique      conservation
        ↓              ↓              ↓
    analyse          action          preuve
```

La couche de mesure reste la même. Les applications peuvent différer. Chaque infrastructure consommatrice conserve sa propre implémentation en aval.

---

# 22. Interface publique, implémentation privée

NeoMundi sépare volontairement l’**interopérabilité** de la **divulgation de l’implémentation**.

La couche publique peut comprendre :

* la structure du contrat ;
* la sémantique des champs ;
* les règles de versionnement et de validation ;
* les mécanismes de vérification ;
* les clés publiques ;
* les exemples approuvés et les fixtures illustratives ;
* le comportement générique du consommateur de référence.

La couche privée peut comprendre :

* l’implémentation interne de la mesure NeoMundi ;
* la logique de gouvernance propriétaire ;
* les moteurs de politique, seuils et règles de décision des consommateurs ;
* les stratégies de routage et mécanismes d’exécution ;
* l’architecture confidentielle des partenaires ;
* la propriété intellectuelle non publiée.

Les systèmes indépendants peuvent ainsi interopérer sans qu’aucune partie n’expose sa mécanique interne.

**Interface ouverte. Implémentation indépendante.**

---

# 23. Statut

Le contrat d’interopérabilité comprend actuellement :

```text
RGC v0.1 — contrat pilote historique signé
RGC v0.2 — sémantique d’interopérabilité versionnée et corrigée
```

Le format peut continuer à évoluer. Toute modification destinée à une consommation automatisée doit rester explicitement versionnée. Les artefacts historiques signés doivent rester immuables.

---

## NeoMundi

**Couche fondamentale de mesure runtime pour les systèmes d’IA.**

Une primitive de mesure. Plusieurs applications. Plusieurs infrastructures.

**NeoMundi fournit le signal. Vous conservez le contrôle.**

---

Une licence open source est prévue pour une prochaine version.
