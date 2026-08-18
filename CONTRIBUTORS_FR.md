# Contributeurs & développement collectif — V0.0

[🇫🇷 Français](./CONTRIBUTORS_FR.md) · [🇬🇧 English](./CONTRIBUTORS.md) · [README principal](./README_FR.md)

> **Ce document constitue un registre évolutif des personnes et infrastructures ayant contribué par des retours techniques, des perspectives architecturales, des tests d’interopérabilité, des travaux d’implémentation, des pilotes ou des revues critiques à NeoMundi Measurement Interoperability.**

Cette version est une **V0.0**.

Elle est volontairement incomplète.

Le registre évoluera à mesure que de nouvelles revues techniques, de nouveaux pilotes, de nouvelles implémentations indépendantes et de nouveaux travaux de validation seront documentés.

---

# Origine du projet

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
l’interprétation, la politique,
l’autorité et l’action
```

L’architecture initiale a été développée par NeoMundi puis exposée à un premier cercle de praticiens, chercheurs, concepteurs d’infrastructures et spécialistes de la gouvernance pour revue critique.

Leurs retours ont permis de challenger certaines hypothèses, de clarifier les frontières de responsabilité et de renforcer le modèle d’interopérabilité.

Un second cercle émerge désormais au travers de **travaux d’implémentation et de pilotes**, dans lesquels des infrastructures indépendantes testent la manière dont ces principes se comportent lorsque les systèmes se connectent réellement.

---

# 1. Première réflexion collective

Les personnes suivantes ont apporté des retours techniques ou architecturaux indépendants au cours de la phase initiale de conception.

Cette section documente une **contribution à la réflexion et au processus de revue**.

Être mentionné ici n’implique pas :

* la propriété du contrat NeoMundi ;
* la qualité d’auteur de l’implémentation finale ;
* l’approbation de chaque choix de conception NeoMundi ;
* une responsabilité vis-à-vis de l’implémentation NeoMundi.

---

## Evelyne-Claudia Yantony

**Axe de contribution :** frontières de gouvernance, correctabilité, passage vers la revue et séparation entre observation et autorité.

Principaux thèmes soulevés :

* une observation ne doit pas devenir une autorisation ;
* la réévaluation de gouvernance doit rester distincte de l’autorité d’exécution ;
* les besoins de revue et les frontières d’autorité doivent être explicites ;
* `execution_permission_changed` doit rester visible et sans ambiguïté ;
* les limitations et les mesures incomplètes doivent voyager avec l’observation ;
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

* garder le contrat minimal, stable et opérationnellement interprétable ;
* préserver la corrélation entre événements et workflows ;
* distinguer, lorsque possible, l’identité de modèle déclarée de l’identité réellement résolue à l’exécution ;
* maintenir séparés stabilité, cohérence et validation factuelle ;
* rendre explicites les limitations et les mesures manquantes ;
* préférer un petit noyau obligatoire complété par des extensions optionnelles.

Ses retours ont renforcé le principe selon lequel l’interopérabilité réussit grâce à **l’implémentation cohérente d’un petit noyau commun**, et non grâce à une complexité maximale du schéma.

---

## Darz' Morris

**Axe de contribution :** continuité de preuve, transitions d’état, provenance et reconstructibilité.

Principaux thèmes soulevés :

* l’interopérabilité nécessite un langage partagé de preuve et de transition d’état ;
* identité, provenance et contexte runtime doivent rester reconstructibles ;
* le contrat doit capturer davantage que la réponse finale ;
* intégrité et rejouabilité sont centrales pour l’audit ;
* deux systèmes doivent pouvoir diverger tout en conservant assez de structure commune pour comprendre pourquoi ;
* éviter la sur-ingénierie et les artefacts de gouvernance purement rétrospectifs.

Sa contribution a mis l’accent sur **la continuité des transitions d’état et la reconstructibilité des preuves**.

---

## James Moore

**Axe de contribution :** légitimité, autorité, délégation et gouvernance au moment de l’exécution.

Principaux thèmes soulevés :

* l’autorité doit rester attribuable ;
* juridiction et limites de délégation peuvent devenir importantes en aval ;
* les chemins d’escalade et états d’override doivent rester explicites lorsque cela est nécessaire ;
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
* éviter un verdict de gouvernance unique couvrant plusieurs systèmes souverains.

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

Ses retours ont mis en évidence l’importance particulière du **périmètre du hash** : deux systèmes ne peuvent pas prétendre avoir vérifié le même artefact s’ils ne savent pas précisément quelle représentation a été hachée.

---

## Emanuel Celano

**Axe de contribution :** périmètre observationnel, limites d’interprétation et non-claims.

Principaux thèmes soulevés :

* transporter non seulement ce qui a été observé, mais aussi ce qui n’a pas pu l’être ;
* exposer la surface de mesure et la visibilité déclarée ;
* préserver les signaux non résolus ;
* communiquer explicitement les contraintes d’interprétation ;
* joindre les non-claims et limitations observationnelles au signal lui-même ;
* éviter autant que possible les sémantiques trop spécifiques à une infrastructure.

Sa contribution a renforcé le principe suivant :

```text
Les frontières de mesure doivent voyager avec la mesure.
```

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

# 2. Principes communs émergents

À travers ces contributions indépendantes, plusieurs principes récurrents se dégagent.

## 2.1 Garder le noyau commun petit

L’interopérabilité dépend de la cohérence d’implémentation.

Un petit noyau obligatoire est généralement préférable à un schéma exhaustif mais implémenté de façon inconsistante.

---

## 2.2 La mesure n’est pas l’autorité

Une mesure runtime peut informer un autre système.

Elle ne doit pas automatiquement :

* autoriser l’exécution ;
* bloquer l’exécution ;
* modifier une permission ;
* établir la vérité ;
* établir la sécurité ;
* transférer l’autorité.

---

## 2.3 Les limitations voyagent avec le signal

Une mesure doit rendre visible :

* ce qui a été observé ;
* dans quel périmètre ;
* avec quelle couverture ;
* avec quelles limitations ;
* ce qui reste non résolu ;
* et ce que la mesure **n’établit pas**.

---

## 2.4 Préserver la provenance

Un système aval doit pouvoir comprendre :

```text
qui affirme quoi
        ↓
dans quelles conditions
        ↓
avec quelle version
        ↓
avec quelle référence d’intégrité
```

et reconstruire la trace pertinente.

---

## 2.5 Préserver la souveraineté des infrastructures

L’interopérabilité relie des systèmes.

Elle ne doit pas fusionner silencieusement :

* leurs assertions ;
* leurs politiques ;
* leurs preuves ;
* leurs modèles de gouvernance ;
* leur autorité.

---

## 2.6 L’intégrité doit être vérifiable indépendamment

Canonicalisation, hash, signatures et références de vérification doivent être suffisamment explicites pour qu’un système indépendant puisse reproduire la vérification.

---

## 2.7 Le consommateur garde le contrôle

NeoMundi fournit le signal de mesure et sa trace vérifiable.

L’infrastructure consommatrice conserve :

```text
interprétation
politique
décision
action
```

---

# 3. Contributeurs aux implémentations & pilotes

La section suivante documente les personnes et infrastructures contribuant par **des travaux concrets d’interopérabilité, des implémentations pilotes, des simulations, des intégrations ou des validations techniques**.

Cette catégorie est volontairement distincte de la réflexion initiale sur la conception.

Un contributeur d’implémentation peut tester la manière dont les signaux NeoMundi interagissent avec une autre infrastructure sans avoir participé à la conception initiale du contrat lui-même.

---

## Mark Mocnaj — OGS

**Type de contribution :** implémentation d’interopérabilité, pilote synthétique, articulation d’objets de gouvernance, reçus et replay.

Mark Mocnaj a contribué au travers de travaux concrets d’interopérabilité entre **NeoMundi et OGS**.

Ces travaux ont exploré la manière dont les objets de mesure runtime NeoMundi peuvent rester distincts des objets de gouvernance OGS en aval, tout en étant reliés par une interface technique auditable.

Principaux axes de contribution :

* tester l’articulation entre les objets de signal runtime NeoMundi et une infrastructure de gouvernance indépendante ;
* préserver la séparation entre mesure runtime et évaluation de gouvernance en aval ;
* préserver la frontière entre observation et autorité d’exécution ;
* documenter les flux d’objets entre les deux infrastructures ;
* travailler avec des objets de gouvernance, des reçus et des mécanismes de replay ;
* explorer la préservation de la provenance, du versioning et de la continuité de preuve au travers de l’interface ;
* contribuer à du matériel de vérification exécutable et à une documentation d’interopérabilité structurée ;
* aider à clarifier la manière dont une infrastructure peut consommer le signal d’une autre infrastructure sans absorber son autorité.

Cette contribution illustre un principe important d’interopérabilité :

```text
Observation NeoMundi
        ↓
transport / articulation
        ↓
infrastructure de gouvernance indépendante
        ↓
sa propre interprétation
et sa propre gestion des conséquences
```

Les deux systèmes restent distincts.

NeoMundi ne devient pas silencieusement le moteur de politique d’OGS, et OGS ne redéfinit pas la mesure NeoMundi.

### Périmètre des travaux

Le travail d’interopérabilité OGS documenté constitue un **pilote technique synthétique**.

Il démontre l’architecture, l’articulation des objets, les reçus, le replay et la cohérence de l’interface.

Il ne doit pas être interprété comme :

* une validation indépendante en production ;
* un traitement autonome de payloads NeoMundi réels et arbitraires ;
* une certification de l’une ou l’autre infrastructure ;
* une preuve que tous les chemins possibles d’intégration NeoMundi/OGS ont été validés.

Cette distinction est volontaire et fait partie de la frontière de preuve.

La contribution de Mark représente l’un des premiers exemples du passage :

```text
de l’interopérabilité comme idée
        ↓
à
        ↓
l’interopérabilité comme frontière
technique effectivement implémentée
```
---

## Richard — RiCo / ManChine

**Type de contribution :** intégration pilote, interopérabilité inter-infrastructures, passage vers l’admissibilité et reçus de gouvernance.

Richard contribue au travers d’un pilote d’interopérabilité entre **NeoMundi et RiCo / ManChine**.

L’objectif du pilote est de tester comment une mesure runtime NeoMundi signée peut être transportée vers une infrastructure indépendante tout en préservant une frontière stricte entre mesure et gouvernance en aval.

Principaux axes de contribution :

- tester le NeoMundi Measurement Interoperability Contract face à une infrastructure indépendante ;
- préserver la séparation entre la mesure runtime NeoMundi et la logique d’admissibilité RiCo ;
- explorer la manière dont des reçus de gouvernance peuvent être produits en aval sans modifier la mesure NeoMundi d’origine ;
- tester si la provenance, l’intégrité et les frontières de responsabilité restent compréhensibles au travers de l’interface ;
- identifier les frictions d’intégration, les ambiguïtés sémantiques et les éventuels besoins de documentation supplémentaires ;
- contribuer par des retours pratiques au durcissement du contrat public d’interopérabilité.

La frontière recherchée est :

```text
NeoMundi mesure
        ↓
contrat d’interopérabilité signé
        ↓
RiCo vérifie et interprète
        ↓
RiCo conserve l’admissibilité,
la gouvernance et la gestion des conséquences

---

## Autres contributeurs aux implémentations & pilotes

Cette section est actuellement en cours de consolidation.

Les futures entrées pourront inclure des travaux impliquant :

* des implémentations consommatrices indépendantes ;
* des intégrations avec des infrastructures souveraines ;
* des environnements d’orchestration d’agents ;
* des systèmes de gouvernance ;
* des infrastructures d’audit et de preuve ;
* des environnements de simulation ;
* des plateformes de monitoring runtime ;
* des implémentations de recherche ;
* des vérifications cryptographiques indépendantes ;
* de la traçabilité inter-infrastructures.

Des pilotes et contributeurs techniques supplémentaires seront ajoutés à mesure que leur participation et leur attribution publique seront confirmées.

---

# 4. Ce qui constitue une contribution

NeoMundi Measurement Interoperability se développe au travers de plusieurs formes distinctes de contribution.

Les futures versions de ce document distingueront progressivement des catégories telles que :

```text
Réflexion de conception
Revue technique
Retour sur le schéma
Implémentation
Intégration pilote
Simulation
Validation indépendante
Vérification cryptographique
Documentation
Contribution open source
```

Ces catégories ne sont pas hiérarchiques.

Une revue conceptuelle et un pilote d’implémentation contribuent de façons différentes.

L’objectif de ce registre est précisément de rendre visibles ces différences plutôt que de réduire toutes les contributions à un seul libellé générique.

---

# 5. Trajectoire de développement

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

L’objectif n’est **pas** de déclarer un standard avant qu’il ait été testé.

L’objectif est de :

```text
construire
→ exposer
→ challenger
→ implémenter
→ tester
→ documenter
→ simplifier
→ durcir
→ ouvrir
```

une primitive d’interopérabilité avec des infrastructures indépendantes.

---

# 6. Socle technique public actuel

Le dépôt public comprend déjà :

* la spécification NeoMundi Measurement Interoperability ;
* un JSON Schema versionné ;
* deux exemples réels de contrats NeoMundi signés ;
* l’intégrité du payload par SHA-256 ;
* des signatures Ed25519/JWS ;
* une vérification via JWKS public ;
* un consommateur de référence indépendant ;
* des vérifications de souveraineté ;
* des exemples de routage définis par le consommateur ;
* un stockage de reçus auditables ;
* un chemin de vérification offline.

Cela signifie que la V0.1 actuelle peut déjà démontrer :

```text
recevoir
→ valider
→ vérifier
→ interpréter
→ appliquer la politique du consommateur
→ conserver la preuve
```

sans nécessiter d’accès au code interne producteur de NeoMundi.

---

# 7. Du pilote public à l’ouverture

NeoMundi prévoit de publier une version stable de la couche d’interopérabilité sous licence open source après la phase actuelle de validation et de pilotes.

La période actuelle doit permettre de :

* tester le contrat face à des infrastructures indépendantes ;
* identifier les ambiguïtés sémantiques ;
* valider la vérification cryptographique indépendante ;
* documenter les patterns d’implémentation ;
* exposer les cas d’échec ;
* challenger les frontières de responsabilité ;
* réduire la complexité inutile ;
* stabiliser le noyau obligatoire.

La future version open source a vocation à représenter non seulement un format JSON publié, mais une couche d’interopérabilité qui aura été :

```text
relue
testée
implémentée
challengée
documentée
```

dans différents contextes techniques.

---

# 8. Pourquoi ce processus de développement est important

L’interopérabilité ne peut pas être établie par simple déclaration.

Un schéma peut sembler cohérent tout en échouant lorsque :

* une autre infrastructure interprète un champ différemment ;
* les hypothèses de canonicalisation divergent ;
* les frontières d’autorité deviennent ambiguës ;
* la provenance se perd ;
* les signatures ne peuvent pas être vérifiées indépendamment ;
* les limitations disparaissent en aval ;
* le système récepteur confond une observation avec une décision.

L’objectif de ce processus de développement collectif n’est donc pas seulement de recueillir des opinions.

Il est d’exposer le contrat à **des visions techniques différentes et à des infrastructures indépendantes suffisamment tôt pour que le désaccord améliore l’objet**.

---

# 9. Politique d’attribution

Ce document constitue un registre de reconnaissance.

Il ne constitue **pas une cession juridique de propriété intellectuelle**.

Être mentionné ici signifie qu’une personne ou une organisation a contribué par :

* des retours ;
* une revue technique ;
* des tests ;
* des travaux d’implémentation ;
* une activité pilote ;
* de la simulation ;
* de la documentation ;
* de la validation ;
* ou une autre contribution documentée au processus de développement.

Cela ne signifie pas nécessairement que le contributeur :

* est auteur du contrat NeoMundi ;
* est propriétaire du contrat NeoMundi ;
* approuve chaque élément de l’implémentation actuelle ;
* accepte une responsabilité vis-à-vis de l’implémentation NeoMundi ;
* transfère des droits de propriété intellectuelle ;
* représente NeoMundi ;
* certifie le système NeoMundi.

Les déclarations spécifiques concernant une organisation, les logos et les affirmations de partenariat ne doivent être utilisées qu’une fois leur attribution publique confirmée.

---

# 10. Un registre collectif évolutif

Ce document évoluera.

Certains contributeurs initiaux peuvent encore manquer dans cette **V0.0**.

C’est attendu.

Certaines personnes ont contribué au travers de revues conceptuelles.

D’autres contribuent au travers de :

* l’implémentation ;
* les tests ;
* la simulation ;
* l’intégration pilote ;
* la vérification indépendante ;
* la documentation ;
* de futurs travaux open source.

L’objectif n’est pas de figer trop tôt une liste artificielle.

L’objectif est de construire un registre traçable à mesure que l’écosystème d’interopérabilité se développe.

Si vous avez contribué à ce travail et estimez que votre contribution est absente ou représentée de manière inexacte, contactez NeoMundi afin que le registre puisse être corrigé.

---

# 11. Une histoire d’interopérabilité en construction

Le NeoMundi Measurement Interoperability Contract n’est pas développé en vase clos.

Il a commencé comme une architecture interne.

Il a ensuite été exposé à une revue critique indépendante.

Il passe désormais par des implémentations techniques et des infrastructures pilotes.

L’étape suivante est un élargissement des tests, de la documentation et du durcissement.

L’objectif à plus long terme est une version ouverte et stable.

```text
une couche de mesure
        ↓
de nombreuses infrastructures indépendantes
        ↓
une vérification partagée
        ↓
aucune autorité partagée imposée
```

C’est cette frontière d’interopérabilité que ce travail cherche à préserver.

---

**NeoMundi Measurement Interoperability**

*Développé par NeoMundi et renforcé par des retours techniques indépendants, des tests d’interopérabilité et un écosystème évolutif de contributeurs.*

© 2026 NeoMundi / Louis M Sàrl — Tous droits réservés.

Une publication sous licence open source est prévue pour une future version stable.
