# Contributeurs & développement collectif — V0.0

[🇫🇷 Français](./CONTRIBUTORS_FR.md) · [🇬🇧 English](./CONTRIBUTORS.md) · [README principal](./README_FR.md)

> **Ce document constitue un registre évolutif des personnes et infrastructures ayant contribué par des retours techniques, des perspectives architecturales, des tests d’interopérabilité, des pilotes ou des revues critiques à l’initiative NeoMundi Measurement Interoperability.**

Cette version est une **V0.0**.

Elle est volontairement incomplète et évoluera au fur et à mesure que de nouveaux pilotes, revues techniques et implémentations indépendantes seront documentés.

---

## Origine du projet

Le **NeoMundi Measurement Interoperability Contract** est développé et maintenu par NeoMundi comme couche publique d’interopérabilité destinée au transport de signaux de mesure runtime entre infrastructures indépendantes.

Son objectif est simple :

```text
mesurer
   ↓
transporter un signal vérifiable
   ↓
permettre à une autre infrastructure de le vérifier
   ↓
laisser cette infrastructure conserver
l’interprétation, la politique, l’autorité et l’action
```

L’architecture initiale du contrat a été développée par NeoMundi puis soumise à un premier cercle de praticiens, chercheurs, concepteurs d’infrastructures et spécialistes de la gouvernance pour revue critique.

Leurs retours ont permis de challenger certaines hypothèses, de clarifier les frontières de responsabilité et de renforcer le modèle d’interopérabilité.

---

# Première réflexion collective

Les personnes suivantes ont apporté des retours techniques ou architecturaux indépendants au cours de la phase initiale de conception.

Cette liste documente une **contribution à la réflexion et au processus de revue**.

Elle n’implique ni copropriété du contrat NeoMundi, ni approbation de chaque choix de conception, ni responsabilité vis-à-vis de l’implémentation finale.

---

## Evelyne-Claudia Yantony

**Axe de contribution :** frontières de gouvernance, correctabilité, passage vers la revue et séparation entre observation et autorité.

Principaux thèmes soulevés :

* une observation ne doit pas devenir une autorisation ;
* la réévaluation de gouvernance doit rester distincte de l’autorité d’exécution ;
* les besoins de revue et les frontières d’autorité doivent être explicites ;
* `execution_permission_changed` doit rester visible et sans ambiguïté ;
* les limites et mesures incomplètes doivent voyager avec l’observation ;
* le contrat doit préserver la séquence :

```text
Observation
→ Réévaluation de gouvernance
→ Autorité
→ Correctabilité / Action
```

Ses retours ont fortement renforcé la séparation explicite entre **signal de mesure, interprétation de gouvernance et autorité d’exécution**.

---

## William Zade

**Axe de contribution :** noyau opérationnel minimal, corrélation d’événements, auditabilité respectueuse de la confidentialité et discipline d’implémentation.

Principaux thèmes soulevés :

* conserver un contrat minimal, stable et opérationnellement interprétable ;
* préserver la corrélation entre événements et workflows ;
* distinguer, lorsque cela est possible, l’identité de modèle déclarée de l’identité réellement résolue à l’exécution ;
* maintenir séparés stabilité, cohérence et validation factuelle ;
* rendre explicites les limites et les mesures manquantes ;
* préférer un petit noyau obligatoire complété par des extensions optionnelles.

Ses retours ont renforcé le principe selon lequel l’interopérabilité repose sur **l’implémentation cohérente d’un petit noyau commun**, plutôt que sur un schéma maximaliste.

---

## Darz' Morris

**Axe de contribution :** continuité de preuve, transitions d’état, provenance et reconstructibilité.

Principaux thèmes soulevés :

* l’interopérabilité nécessite un langage partagé de preuve et de transition d’état ;
* identité, provenance et contexte runtime doivent rester reconstructibles ;
* le contrat doit capturer davantage que la réponse finale ;
* intégrité et rejouabilité sont centrales pour l’audit ;
* deux systèmes doivent pouvoir diverger tout en conservant assez de structure commune pour comprendre pourquoi ;
* éviter la sur-ingénierie et les artefacts de gouvernance uniquement rétrospectifs.

Sa contribution a mis l’accent sur **la continuité des transitions d’état et la reconstructibilité des preuves**.

---

## James Moore

**Axe de contribution :** légitimité, autorité, délégation et gouvernance au moment de l’exécution.

Principaux thèmes soulevés :

* l’autorité doit rester attribuable ;
* juridiction et limites de délégation peuvent devenir importantes en aval ;
* les chemins d’escalade et états d’override doivent rester explicites lorsque nécessaire ;
* la traçabilité seule n’établit pas une autorité légitime ;
* l’interopérabilité ne doit pas impliquer silencieusement une permission d’agir.

Ses retours ont renforcé la distinction entre **interopérabilité technique et autorité légitime d’exécution**.

---

## Ramon Loya

**Axe de contribution :** souveraineté des assertions, propriété des champs, preuve par référence et séparation d’audit.

Principaux thèmes soulevés :

* ne jamais fusionner les assertions produites par des infrastructures distinctes en une seule affirmation synthétique ;
* identifier clairement quelle infrastructure affirme quelle information ;
* les preuves issues d’un autre système doivent être référencées, pas absorbées silencieusement ;
* les limitations doivent être obligatoires ;
* le périmètre et l’applicabilité doivent rester visibles ;
* l’interopérabilité ne doit pas devenir une certification mutuelle ;
* éviter un verdict de gouvernance unique combinant plusieurs systèmes souverains.

Un principe particulièrement important issu de cette contribution est :

```text
Le contrat relie des assertions souveraines.
Il ne les fusionne pas.
```

---

## Kazuki Toyota

**Axe de contribution :** frontières de vérification, canonicalisation et interopérabilité cryptographique minimale.

Principaux thèmes soulevés :

* identité et traçabilité stables ;
* contexte de mesure versionné ;
* méthode de canonicalisation explicite ;
* méthode de hash et périmètre du hash explicites ;
* intégrité d’artefact et vérification de signature ;
* limitations claires ;
* petit noyau obligatoire avec extensions optionnelles.

Ses retours ont mis en lumière l’importance particulière du **périmètre du hash** : deux systèmes ne peuvent pas prétendre avoir vérifié le même artefact s’ils ne savent pas exactement quelle représentation a été hachée.

---

## Emanuel Celano

**Axe de contribution :** périmètre observationnel, limites d’interprétation et non-claims.

Principaux thèmes soulevés :

* transporter non seulement ce qui a été observé, mais aussi ce qui n’a pas pu l’être ;
* exposer la surface de mesure et la visibilité déclarée ;
* préserver les signaux non résolus ;
* communiquer explicitement les contraintes d’interprétation ;
* joindre les non-claims et limites observationnelles au signal lui-même ;
* éviter autant que possible les sémantiques trop spécifiques à une infrastructure.

Sa contribution a renforcé le principe selon lequel **les frontières de mesure doivent voyager avec la mesure**.

---

## Pierre Mondoux

**Axe de contribution :** noyau minimal interopérable, lisibilité pour l’audit et validation par simulation.

Principaux thèmes soulevés :

* garder volontairement petite la première version du contrat ;
* préserver identité d’événement, traçabilité, source, horodatage et version de mesure ;
* maintenir séparées interopérabilité, télémétrie, conformité et gouvernance interne ;
* utiliser des simulations contrôlées comme banc d’essai d’interopérabilité ;
* vérifier que les traces restent lisibles et auditables lorsque le volume ou la complexité augmente.

Sa contribution a également ouvert une voie de validation pratique au travers des **environnements de simulation AEROS**.

---

## James Aull

**Axe de contribution :** déclaration vs observation vs interprétation vs autorité.

Principaux thèmes soulevés :

* préserver identité, continuité temporelle et provenance ;
* distinguer état déclaré et état observé ;
* conserver explicitement intégrité et limitations ;
* ne pas fusionner silencieusement ce qu’une infrastructure a déclaré, ce qu’une autre a observé et ce qu’un reviewer a ensuite conclu ;
* maintenir chaque couche attribuable et révisable indépendamment ;
* empêcher l’interopérabilité de devenir un transfert d’autorité ou une absorption de framework.

Ses retours ont renforcé une discipline centrale :

```text
Déclaration ≠ Observation
Observation ≠ Interprétation
Interprétation ≠ Autorité
```

---

# Principes communs émergents

À travers ces contributions indépendantes, plusieurs principes récurrents se dégagent.

### 1. Garder le noyau commun petit

L’interopérabilité dépend de la cohérence d’implémentation.

Un petit noyau obligatoire est généralement préférable à un schéma exhaustif mais implémenté de façon inconsistante.

### 2. La mesure n’est pas l’autorité

Une mesure runtime peut informer un autre système.

Elle ne doit pas automatiquement autoriser, bloquer ou modifier l’exécution.

### 3. Les limitations voyagent avec le signal

Une mesure doit rendre visible :

* ce qui a été observé ;
* dans quel périmètre ;
* avec quelle couverture ;
* avec quelles limitations ;
* et ce qu’elle **n’établit pas**.

### 4. Préserver la provenance

Un système aval doit pouvoir comprendre qui a affirmé quoi et reconstruire la trace pertinente.

### 5. Préserver la souveraineté des infrastructures

L’interopérabilité relie des systèmes.

Elle ne doit pas fusionner silencieusement leurs assertions, leurs politiques ou leur autorité.

### 6. L’intégrité doit être vérifiable indépendamment

Canonicalisation, hash, signatures et références de vérification doivent être suffisamment explicites pour qu’un système indépendant puisse reproduire la vérification.

### 7. Le consommateur garde le contrôle

NeoMundi fournit le signal de mesure et sa trace vérifiable.

L’infrastructure consommatrice conserve :

```text
interprétation
politique
décision
action
```

---

# Contributeurs aux implémentations & pilotes

Cette section documentera progressivement les infrastructures et équipes qui testent le contrat au travers d’intégrations réelles.

Cela pourra inclure :

* implémentations consommatrices indépendantes ;
* infrastructures souveraines ;
* environnements d’orchestration d’agents ;
* systèmes de gouvernance ;
* systèmes d’audit et de preuve ;
* environnements de simulation ;
* plateformes de monitoring runtime ;
* implémentations de recherche.

**V0.0 — liste en cours de consolidation.**

Des pilotes et contributeurs techniques supplémentaires seront ajoutés au fur et à mesure que leur participation et leur attribution publique seront confirmées.

---

# Trajectoire de développement

L’approche actuelle est volontairement progressive.

```text
V0.0
Architecture initiale
+ revue critique externe
        ↓

V0.1
Contrat lisible par machine
+ exemples réels signés
+ consommateur de référence indépendant
        ↓

Phase pilote
Des infrastructures indépendantes implémentent,
testent et challengent le contrat
        ↓

Documentation & durcissement
Les échecs, ambiguïtés et besoins
d’interopérabilité sont documentés
        ↓

Version publique stable
        ↓

Publication open source
```

L’objectif n’est pas de déclarer un standard avant qu’il ait été testé.

L’objectif est de **construire, tester, documenter et durcir une primitive d’interopérabilité avec des infrastructures indépendantes**, puis d’exposer une version stable pour une réutilisation plus large.

---

# Vers une publication open source

NeoMundi prévoit de publier une version stable de la couche d’interopérabilité sous licence open source après la phase actuelle de validation et de pilotes.

Cette période doit permettre de :

* tester le contrat face à des infrastructures indépendantes réelles ;
* identifier les ambiguïtés sémantiques ;
* valider la vérification cryptographique indépendante ;
* documenter les patterns d’implémentation ;
* exposer les cas d’échec ;
* réduire la complexité inutile ;
* stabiliser le noyau obligatoire.

La future version open source a donc vocation à représenter non seulement un schéma publié, mais un contrat **challengé par un travail réel d’interopérabilité**.

---

# Politique d’attribution

Ce document constitue un registre de reconnaissance, et non une cession juridique de propriété intellectuelle.

Être mentionné ici signifie qu’une personne ou une organisation a contribué par des retours, des tests, un travail d’implémentation ou une autre contribution documentée au processus de développement.

Cela ne signifie pas nécessairement que le contributeur :

* est auteur du contrat NeoMundi ;
* approuve chaque élément de l’implémentation actuelle ;
* accepte une responsabilité vis-à-vis de l’implémentation NeoMundi ;
* transfère des droits de propriété intellectuelle ;
* représente NeoMundi.

Les noms, organisations et logos ne doivent être associés publiquement à des pilotes ou implémentations spécifiques qu’une fois cette attribution confirmée.

---

# Un registre collectif évolutif

Ce document évoluera.

Certains contributeurs initiaux peuvent encore manquer dans cette V0.0.

Certaines personnes mentionnées ici ont participé à la réflexion conceptuelle ; d’autres contribueront par l’implémentation, les tests, les pilotes ou la validation indépendante.

Les versions futures distingueront progressivement :

```text
Réflexion de conception
Revue technique
Implémentation
Intégration pilote
Validation indépendante
Documentation
Contribution open source
```

Si vous avez contribué à ce travail et estimez que votre contribution est absente ou représentée de manière inexacte, contactez NeoMundi afin que le registre puisse être corrigé.

---

**NeoMundi Measurement Interoperability**

*Développé par NeoMundi et renforcé par des retours techniques indépendants, des tests d’interopérabilité et un écosystème évolutif de contributeurs.*

© 2026 NeoMundi / Louis M Sàrl — Tous droits réservés.

Une publication sous licence open source est prévue pour une future version stable.
