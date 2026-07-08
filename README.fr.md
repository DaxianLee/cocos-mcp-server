# Plugin serveur MCP pour Cocos Creator

🌐 [简体中文](README.md) · [English](README.EN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português](README.pt.md) · **Français** · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

Un plugin serveur MCP (Model Context Protocol) complet pour Cocos Creator 3.8+, permettant aux assistants IA d'interagir avec l'éditeur Cocos Creator via un protocole standardisé. Installation et utilisation en un clic, sans configuration d'environnement fastidieuse. Testé avec le client Claude, Claude CLI et Cursor ; les autres éditeurs devraient théoriquement être parfaitement compatibles également.

**🚀 Propose désormais 50 outils puissants et unifiés, pour un contrôle de l'éditeur à 99 % !**

## La version PRO a été mise à jour vers la 1.7.8

| Type | Lien |
|------|------|
| **Aperçu vidéo** | [Vidéo Bilibili](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Essai gratuit** | [Adresse d'essai vberai Cocos Creator 3.x MCP Pro](https://www.vberai.com/game-engines/cocos) |
| **Essai gratuit** | [Adresse d'essai vberai Cocos Creator 2.x MCP Pro](https://www.vberai.com/game-engines/cocos2x) |
| **Canevas de conception IA** | [VberAI Studio — la première plateforme de conception de jeux native IA au monde](https://studio.vberai.com) |
| **Site officiel** | [Site officiel VberAI vberai.com](https://www.vberai.com) |

## Fonctionnalités de la version Cocos MCP 3.x Pro

> 🚀 La version Pro est développée et maintenue en continu par **VberAI** — [Essayer la version Pro dès maintenant](https://www.vberai.com/game-engines/cocos) ｜ [Regarder la démonstration vidéo](https://www.bilibili.com/video/BV1rTAXzuEH3/)

Un plugin MCP (Model Context Protocol) professionnel conçu spécialement pour **Cocos Creator 3.8.6+**, permettant aux assistants IA de piloter directement l'éditeur via un protocole standardisé. **16 outils de niveau intention** couvrent **231 opérations**, réparties sur **12 grands modules de capacités**, couvrant l'ensemble du flux de développement de Cocos Creator 3.x. Basé sur le protocole Streamable HTTP, avec une conception optimisée pour les Tokens permettant d'économiser des Tokens et d'obtenir des appels plus stables, avec une configuration en un clic pour les principaux clients IA (Cursor, Claude, Windsurf, etc.).

| Outils de niveau intention | Opérations couvertes | Modules couverts | Protocole de communication |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 grands modules** | **Streamable HTTP** |

### Les douze grands modules de capacités

| Module | Nb d'opérations | Description |
|------|---:|------|
| Gestion de scènes | 24 | Ouverture, sauvegarde, création et changement de scène, requêtes de hiérarchie et instantanés, prise en charge de l'annulation et de l'exécution de scripts. |
| Opérations sur les nœuds | 18 | CRUD complet des nœuds, avec prise en charge des modifications par lot, du montage de scripts, de la détection du type de nœud et des opérations de presse-papiers. |
| Système de composants | 8 | Ajout, suppression, requête et modification des composants ainsi que réglage des propriétés, avec prise en charge de la liaison d'événements de clic et de la configuration d'événements par lot. |
| Système de prefabs | 13 | Création, instanciation et changement de mode d'édition des prefabs, avec prise en charge de l'application/annulation des modifications et de la validation des prefabs. |
| Gestion des ressources | 19 | Requête, recherche, CRUD et importation des ressources, avec prise en charge de l'analyse des dépendances et de la conversion UUID/chemin. |
| Contrôle de l'éditeur | 33 | Opérations de niveau éditeur telles que paramètres du projet, journaux, préférences, build et aperçu. |
| Vue de scène | 32 | Gizmo, caméra, grille et images de référence, offrant un contexte de viewport et un contrôle tenant compte des limites. |
| UI et construction de modèles | 13 | Création de composants d'UI en un clic, construction d'une hiérarchie de nœuds complète à partir d'un arbre JSON, avec de nombreux modèles d'UI intégrés. |
| Système d'animation | 39 | Édition d'images clés, ajustement des courbes, événements d'animation, application de préréglages, ainsi que la gestion des animations squelettiques Spine. |
| Requête de base de connaissances | 8 | Base de connaissances intégrée sur les propriétés des composants, les règles de conception d'UI, les modèles de mise en page et les meilleures pratiques, pour une assistance IA précise au développement. |
| Validation et instantanés | 6 | Vérification de la mise en page de la scène, validation des références de ressources, analyse de la hiérarchie, avec vérification de régression via les instantanés de scène. |
| Polices et Label | 9 | Gestion des ressources de police et opérations sur les Label de texte enrichi, couvrant les réglages de mise en forme du texte. |

#### Fonctionnalités intelligentes

- **Résolution intelligente de chemins** — Tous les paramètres de nœud acceptent un UUID, un chemin (par ex. `Canvas/Panel/Button`) ou un nom, résolus automatiquement
- **Détection automatique d'UI** — Ajout automatique de `cc.UITransform` lors de la création d'un nœud sous un nœud parent d'UI
- **Contexte de viewport** — Renvoie la résolution de conception et la zone visible lors de la création/modification d'un nœud, avec avertissement automatique en cas de dépassement
- **Base de connaissances intégrée** — L'IA peut consulter le tableau des propriétés des composants, les règles du système de coordonnées, les modèles de mise en page et d'autres connaissances
- **Constructeur de scène** — Décrit une hiérarchie d'UI complète en JSON et la construit en un seul appel, en gérant automatiquement la configuration de Canvas/Camera/composants
- **Système d'images de référence** — Superpose une maquette de conception d'UI dans la vue de scène, permettant à l'IA de construire l'interface en s'appuyant sur la maquette
- **Cache de l'arbre de nœuds** — Cache avec TTL de 2 secondes évitant les requêtes répétées, invalidé automatiquement après une opération de modification
- **Opérations atomiques** — builder/composite utilisent un mécanisme de snapshot, avec retour arrière automatique en cas d'échec

### Version Pro vs version open source

| Fonctionnalité | Version open source | Version Pro |
|------|:---:|:---:|
| Protocole de communication | Protocole HTTP | **Streamable HTTP** |
| Optimisation des Tokens | Conception de base | Conception optimisée, plus économe en Tokens et plus stable |
| Méthode par code d'opération | ✕ | ✅ |
| Configuration en un clic | ✕ | ✅ |
| Personnalisation des outils | ✕ | ✅ |
| Outils de niveau intention | Outils de base | 16 types, couvrant 231 opérations |
| Création de scène en une fois | ✕ | ✅ |
| Base de connaissances intégrée | ✕ | ✅ |
| Système d'animation / Spine | ✕ | ✅ 39 opérations d'animation |

---

## 🌐 À propos de VberAI — la plateforme de productivité IA native pour les jeux

**VberAI** est une **plateforme de productivité IA native pour les jeux** destinée aux développeurs de jeux, aux équipes artistiques et aux équipes de contenu ; c'est aussi l'éditeur qui développe et maintient la version Pro de ce plugin Cocos MCP. VberAI est actuellement le **seul éditeur à proposer des plugins MCP pour les trois principaux moteurs Unity, Godot et Cocos Creator à la fois**, et construit trois gammes de produits autour de l'idée de « faire véritablement entrer l'IA dans le pipeline de production des jeux » :

- **🎮 Plugins MCP pour moteurs de jeu** — Exécute un service MCP dans l'éditeur du moteur, permettant aux clients IA tels que Claude Desktop, Claude Code, Cursor, Windsurf et Cline de lire et manipuler directement les scènes, composants, ressources, animations et scripts.
- **🎨 AI Studio** — Un canevas de conception de jeux natif IA, qui importe d'un côté des fichiers PSD / Figma / projets moteur, et exporte de l'autre des scènes et prefabs Unity / Cocos / Godot.
- **✂️ Détourage IA ultra-performant (AI Super Matting)** — Détourage en un clic directement dans le navigateur, avec une précision au niveau du cheveu et une sortie en canal alpha réel, facturé à l'usage.

### La famille des plugins MCP pour moteurs

| Plugin | Description |
|------|------|
| **Unity MCP** | Plugin MCP de niveau entreprise, couvrant scène / GameObject / composant / prefab / matériau / animation / Shader, compatible Unity 2022.3+ et Unity 6 |
| **Cocos MCP 3.x Pro** | Version Pro de ce projet, 16 outils de niveau intention / 231 opérations, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Conçu sur mesure pour les anciens projets Cocos Creator 2.4.x+ (projets 2.x encore en exploitation) |
| **Godot MCP** | Entièrement gratuit, open source sous licence MIT, plus de 100 commandes d'outils couvrant 21 systèmes, Godot 4.x, compatible GDScript et C# |


---

## 🎨 VberAI Studio — la première plateforme de conception de jeux native IA au monde

> **Une plateforme de conception native IA conçue pour les jeux.** Compatible dès sa conception avec les moteurs Unity, Cocos et Godot, avec de très nombreux outils IA à forte fréquence d'usage et des flux d'automatisation, permettant une livraison intégrée allant de la génération artistique, du changement de skin en un clic, de la gestion des assets, jusqu'aux maquettes de conception livrées directement dans le moteur, avec en plus un retour d'information depuis le moteur, ce qui relie entièrement la chaîne de développement « conception IA → IA du moteur de jeu ».
>
> 👉 **[Accéder à AI Studio dès maintenant](https://studio.vberai.com)** ｜ [En savoir plus](https://www.vberai.com/studio)


### Chaîne de production complète

**Importation des conceptions et assets du projet → Génération et édition IA à haute fréquence → Livraison componentisée pour le moteur → Synchronisation en temps réel avec le moteur via Engine MCP → Retour d'information depuis le moteur**

Associé à ce plugin Cocos MCP, AI Studio réécrit les scènes, prefabs, composants et ressources artistiques dans le projet, puis Engine MCP permet à l'IA de poursuivre dans Cocos Creator le travail de scripts, de configuration des composants, de gestion des ressources et de débogage, formant ainsi une boucle de développement de bout en bout — ce qui améliore considérablement l'efficacité de l'équipe, au point qu'une seule personne peut accomplir le travail d'une équipe entière.

**🔗 Liens associés** : [Site officiel VberAI](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI Super Matting](https://www.vberai.com/ai-studio/bg-removal) ｜ [Tarifs de la plateforme](https://www.vberai.com/pricing) ｜ Contact support : support@vberai.com

---


## Journal des modifications de la version open source

## 🚀 Mise à jour majeure v1.5.4

## Démonstration vidéo de la version open source actuelle

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Simplification et refonte des outils** : Les plus de 150 outils d'origine ont été condensés et réorganisés en 50 outils principaux hautement réutilisables et à forte couverture, en supprimant tout le code redondant inutile, ce qui améliore considérablement la facilité d'utilisation et la maintenabilité.
- **Unification des codes d'opération** : Tous les outils adoptent le modèle « code d'opération + paramètres », ce qui simplifie considérablement le processus d'appel par l'IA, améliore le taux de réussite des appels IA, réduit le nombre d'appels IA et diminue la consommation de Tokens de 50 %.
- **Mise à niveau complète des fonctionnalités de prefab** : Correction et amélioration complètes de toutes les fonctions essentielles des prefabs — création, instanciation, synchronisation, références — avec prise en charge des relations de référence complexes et un alignement à 100 % sur le format officiel.
- **Complément de la liaison d'événements et des anciennes fonctionnalités** : Ajout et implémentation de la liaison d'événements et des anciennes fonctionnalités relatives aux nœuds/composants/ressources, toutes les méthodes étant désormais parfaitement alignées sur l'implémentation officielle.
- **Optimisation des interfaces** : Tous les paramètres d'interface sont plus clairs, la documentation est plus complète, ce qui facilite la compréhension et l'appel par l'IA.
- **Optimisation du panneau du plugin** : L'interface du panneau est plus épurée et les opérations plus intuitives.
- **Amélioration des performances et de la compatibilité** : Architecture globale plus efficace, compatible avec toutes les versions de Cocos Creator à partir de 3.8.6.


## Système d'outils et codes d'opération

- Tous les outils sont nommés selon le modèle « catégorie_action », avec des paramètres utilisant un schéma unifié et la prise en charge de la commutation entre plusieurs codes d'opération (action), ce qui améliore considérablement la flexibilité et l'extensibilité.
- Les 50 outils principaux couvrent l'ensemble des opérations de l'éditeur : scène, nœud, composant, prefab, ressource, projet, débogage, préférences, serveur, diffusion de messages, etc.
- Exemple d'appel d'outil :

```json
{
  "tool": "node_lifecycle",
  "arguments": {
    "action": "create",
    "name": "MyNode",
    "parentUuid": "parent-uuid",
    "nodeType": "2DNode"
  }
}
```

---

## Principales catégories de fonctionnalités (exemples partiels)

- **scene_management** : Gestion de scènes (récupérer/ouvrir/enregistrer/créer/fermer une scène)
- **node_query / node_lifecycle / node_transform** : Requête, création, suppression de nœuds, modification de propriétés
- **component_manage / component_script / component_query** : Ajout/suppression de composants, montage de scripts, informations sur les composants
- **prefab_browse / prefab_lifecycle / prefab_instance** : Navigation, création, instanciation et synchronisation des prefabs
- **asset_manage / asset_analyze** : Importation, suppression de ressources, analyse des dépendances
- **project_manage / project_build_system** : Exécution, build et informations de configuration du projet
- **debug_console / debug_logs** : Gestion de la console et des journaux
- **preferences_manage** : Préférences
- **server_info** : Informations sur le serveur
- **broadcast_message** : Diffusion de messages


### v1.4.0 - 26 juillet 2025

#### 🎯 Corrections majeures de fonctionnalités
- **Correction complète de la fonction de création de prefab** : Résolution complète du problème de perte des références de type composant/nœud/ressource lors de la création d'un prefab
- **Traitement correct des références** : Implémentation d'un format de référence parfaitement cohérent avec la création manuelle de prefabs
  - **Références internes** : Les références de nœuds et de composants internes au prefab sont correctement converties au format `{"__id__": x}`
  - **Références externes** : Les références de nœuds et de composants externes au prefab sont correctement définies sur `null`
  - **Références de ressources** : Les références de ressources telles que prefabs, textures, sprite frames conservent intégralement le format UUID
- **Normalisation de l'API de suppression de composant/script** : Désormais, pour supprimer un composant/script, il faut obligatoirement fournir le cid du composant (champ type) ; le nom du script ou de la classe ne peut pas être utilisé. L'IA et l'utilisateur doivent d'abord récupérer le champ type (cid) via getComponents, puis le transmettre à removeComponent. Cela permet de supprimer avec une précision de 100 % tous les types de composants et de scripts, tout en restant compatible avec toutes les versions de Cocos Creator.

#### 🔧 Améliorations essentielles
- **Optimisation de l'ordre des index** : Ajustement de l'ordre de création des objets du prefab pour garantir la cohérence avec le format standard de Cocos Creator
- **Prise en charge des types de composants** : Extension de la détection des références de composants pour prendre en charge tous les types de composants commençant par cc. (Label, Button, Sprite, etc.)
- **Mécanisme de mappage UUID** : Amélioration du système de mappage entre UUID interne et index, garantissant l'établissement correct des relations de référence
- **Standardisation du format des propriétés** : Correction de l'ordre et du format des propriétés des composants, éliminant les erreurs d'analyse du moteur

#### 🐛 Corrections de bugs
- **Correction d'une erreur d'importation de prefab** : Résolution de l'erreur `Cannot read properties of undefined (reading '_name')`
- **Correction de compatibilité avec le moteur** : Résolution de l'erreur `placeHolder.initDefault is not a function`
- **Correction d'écrasement de propriétés** : Empêche que des propriétés clés comme `_objFlags` soient écrasées par les données du composant
- **Correction de perte de références** : Garantit que tous les types de références sont correctement enregistrés et chargés

#### 📈 Améliorations fonctionnelles
- **Conservation complète des propriétés des composants** : Toutes les propriétés des composants, y compris les propriétés privées (telles que _group, _density, etc.)
- **Prise en charge de la structure des nœuds enfants** : Traitement correct de la structure hiérarchique du prefab et des relations entre nœuds enfants
- **Traitement des propriétés de transformation** : Conservation de la position, de la rotation, de l'échelle et des informations de hiérarchie du nœud
- **Optimisation des informations de débogage** : Ajout de journaux détaillés sur le traitement des références, facilitant le suivi des problèmes

#### 💡 Avancées techniques
- **Identification du type de référence** : Distinction intelligente entre références internes et externes, évitant les références invalides
- **Compatibilité de format** : Les prefabs générés sont 100 % compatibles avec le format des prefabs créés manuellement
- **Intégration au moteur** : Les prefabs peuvent être montés normalement dans la scène, sans aucune erreur à l'exécution
- **Optimisation des performances** : Optimisation du processus de création des prefabs, améliorant l'efficacité de traitement des prefabs volumineux

**🎉 La fonction de création de prefab est désormais entièrement opérationnelle, prenant en charge des relations de référence de composants complexes et une structure de prefab complète !**

### v1.3.0 - 25 juillet 2024

#### 🆕 Nouvelles fonctionnalités
- **Panneau de gestion des outils intégré** : Ajout direct d'une fonction complète de gestion des outils dans le panneau de contrôle principal
- **Système de configuration des outils** : Implémentation de l'activation/désactivation sélective des outils, avec prise en charge de la persistance de la configuration
- **Chargement dynamique des outils** : Amélioration de la fonction de découverte des outils, capable de charger dynamiquement les 158 outils disponibles du serveur MCP
- **Gestion en temps réel de l'état des outils** : Ajout de la mise à jour en temps réel du nombre et de l'état des outils, reflétée immédiatement lors du basculement d'un outil individuel
- **Persistance de la configuration** : Sauvegarde et chargement automatiques de la configuration des outils entre les sessions de l'éditeur

#### 🔧 Améliorations
- **Interface de panneau unifiée** : Fusion de la gestion des outils dans le panneau principal du serveur MCP sous forme d'onglet, éliminant le besoin d'un panneau séparé
- **Paramètres serveur améliorés** : Amélioration de la gestion de la configuration du serveur, avec de meilleures fonctions de persistance et de chargement
- **Intégration Vue 3** : Mise à niveau vers l'API Composition de Vue 3, offrant une meilleure réactivité et de meilleures performances
- **Meilleure gestion des erreurs** : Ajout d'une gestion complète des erreurs, incluant un mécanisme de retour arrière pour les opérations échouées
- **UI/UX améliorées** : Amélioration du design visuel, avec des séparateurs appropriés, un style de bloc distinctif et un arrière-plan modal opaque

#### 🐛 Corrections de bugs
- **Correction de la persistance de l'état des outils** : Résolution du problème de réinitialisation de l'état des outils lors du changement d'onglet ou de la réouverture du panneau
- **Correction du chargement de la configuration** : Correction des problèmes de chargement des paramètres serveur et d'enregistrement des messages
- **Correction de l'interaction des cases à cocher** : Résolution du problème de décochage des cases et amélioration de la réactivité
- **Correction du défilement du panneau** : Garantit un défilement correct dans le panneau de gestion des outils
- **Correction de la communication IPC** : Résolution de divers problèmes de communication IPC entre le frontend et le backend

#### 🏗️ Améliorations techniques
- **Architecture simplifiée** : Suppression de la complexité des configurations multiples, en se concentrant sur la gestion d'une configuration unique
- **Meilleure sécurité de type** : Amélioration des définitions de types et des interfaces TypeScript
- **Synchronisation des données améliorée** : Meilleure synchronisation entre l'état de l'UI frontend et le gestionnaire d'outils backend
- **Débogage amélioré** : Ajout d'une journalisation complète et de fonctionnalités de débogage

#### 📊 Statistiques
- **Nombre total d'outils** : Passé de 151 à 158 outils
- **Catégories** : 13 catégories d'outils, couverture complète
- **Contrôle de l'éditeur** : Atteint une couverture de 98 % des fonctionnalités de l'éditeur

### v1.2.0 - Version précédente
- Publication initiale, comprenant 151 outils
- Fonctionnalités de base du serveur MCP
- Opérations sur les scènes, nœuds, composants et prefabs
- Outils de contrôle de projet et de débogage



## Utilisation rapide

**Configuration Claude CLI :**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（utilisez le numéro de port que vous avez configuré）
```

**Configuration du client Claude :**

```
{

  "mcpServers": {

		"cocos-creator": {

 		"type": "http",

		"url": "http://127.0.0.1:3000/mcp"

		 }

	  }

}
```

**Configuration MCP pour Cursor ou les IDE de type VS**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Fonctionnalités

### 🎯 Opérations sur les scènes (scene_*)
- **scene_management**: Gestion de scènes - récupération de la scène actuelle, ouverture/sauvegarde/création/fermeture de scène, avec prise en charge de la requête de liste des scènes
- **scene_hierarchy**: Hiérarchie de scène - récupération de la structure complète de la scène, avec possibilité d'inclure les informations de composants
- **scene_execution_control**: Contrôle d'exécution - exécution de méthodes de composants, de scripts de scène, synchronisation de prefabs

### 🎮 Opérations sur les nœuds (node_*)
- **node_query**: Requête de nœuds - recherche de nœuds par nom/motif, récupération des informations de nœud, détection du type 2D/3D
- **node_lifecycle**: Cycle de vie du nœud - création/suppression de nœuds, avec prise en charge du préinstallation de composants et de l'instanciation de prefabs
- **node_transform**: Transformation du nœud - modification du nom, de la position, de la rotation, de l'échelle, de la visibilité et d'autres propriétés du nœud
- **node_hierarchy**: Hiérarchie des nœuds - déplacement, copie, collage de nœuds, avec prise en charge des opérations sur la structure hiérarchique
- **node_clipboard**: Presse-papiers de nœuds - opérations de copie/collage/coupe de nœuds
- **node_property_management**: Gestion des propriétés - réinitialisation des propriétés du nœud, des propriétés des composants et des propriétés de transformation

### 🔧 Opérations sur les composants (component_*)
- **component_manage**: Gestion des composants - ajout/suppression de composants du moteur (cc.Sprite, cc.Button, etc.)
- **component_script**: Composant de script - montage/suppression de composants de script personnalisés
- **component_query**: Requête de composants - récupération de la liste des composants, des informations détaillées, des types de composants disponibles
- **set_component_property**: Réglage des propriétés - définition d'une ou plusieurs valeurs de propriétés de composant

### 📦 Opérations sur les prefabs (prefab_*)
- **prefab_browse**: Navigation dans les prefabs - liste des prefabs, consultation des informations, validation des fichiers
- **prefab_lifecycle**: Cycle de vie du prefab - création d'un prefab à partir d'un nœud, suppression d'un prefab
- **prefab_instance**: Instance de prefab - instanciation dans la scène, déliaison, application des modifications, restauration de l'original
- **prefab_edit**: Édition de prefab - entrée/sortie du mode édition, sauvegarde du prefab, test des modifications

### 🚀 Contrôle de projet (project_*)
- **project_manage**: Gestion de projet - exécution du projet, build du projet, récupération des informations et paramètres du projet
- **project_build_system**: Système de build - contrôle du panneau de build, vérification de l'état du build, gestion du serveur d'aperçu

### 🔍 Outils de débogage (debug_*)
- **debug_console**: Gestion de la console - récupération/effacement des journaux de la console, avec prise en charge du filtrage et de la limitation
- **debug_logs**: Analyse des journaux - lecture/recherche/analyse des fichiers journaux du projet, avec prise en charge de la correspondance de motifs
- **debug_system**: Débogage système - récupération des informations de l'éditeur, des statistiques de performance, des informations d'environnement

### 📁 Gestion des ressources (asset_*)
- **asset_manage**: Gestion des ressources - importation/suppression par lot de ressources, sauvegarde des métadonnées, génération d'URL
- **asset_analyze**: Analyse des ressources - récupération des relations de dépendance, export de la liste des ressources
- **asset_system**: Système de ressources - actualisation des ressources, requête de l'état de la base de données des ressources
- **asset_query**: Requête de ressources - requête de ressources par type/dossier, récupération des informations détaillées
- **asset_operations**: Opérations sur les ressources - création/copie/déplacement/suppression/sauvegarde/réimportation de ressources

### ⚙️ Préférences (preferences_*)
- **preferences_manage**: Gestion des préférences - récupération/définition des préférences de l'éditeur
- **preferences_global**: Paramètres globaux - gestion de la configuration globale et des paramètres système

### 🌐 Serveur et diffusion (server_* / broadcast_*)
- **server_info**: Informations sur le serveur - récupération de l'état du serveur, des détails du projet, des informations d'environnement
- **broadcast_message**: Diffusion de messages - écoute et diffusion de messages personnalisés

### 🖼️ Images de référence (referenceImage_*)
- **reference_image_manage**: Gestion des images de référence - ajout/suppression/gestion des images de référence dans la vue de scène
- **reference_image_view**: Vue des images de référence - contrôle de l'affichage et de l'édition des images de référence

### 🎨 Vue de scène (sceneView_*)
- **scene_view_control**: Contrôle de la vue de scène - contrôle des outils Gizmo, du système de coordonnées, du mode de vue
- **scene_view_tools**: Outils de vue de scène - gestion des divers outils et options de la vue de scène

### ✅ Outils de validation (validation_*)
- **validation_scene**: Validation de scène - vérification de l'intégrité de la scène, contrôle des ressources manquantes
- **validation_asset**: Validation des ressources - vérification des références de ressources, contrôle de l'intégrité des ressources

### 🛠️ Gestion des outils
- **Système de configuration des outils**: Activation/désactivation sélective des outils, avec prise en charge de plusieurs jeux de configuration
- **Persistance de la configuration**: Sauvegarde et chargement automatiques de la configuration des outils
- **Import/export de configuration**: Prise en charge de l'import et de l'export de la configuration des outils
- **Gestion d'état en temps réel**: Mise à jour et synchronisation en temps réel de l'état des outils

### 🚀 Avantages principaux
- **Unification des codes d'opération**: Tous les outils suivent la nomenclature « catégorie_action », avec un schéma de paramètres unifié
- **Haute réutilisabilité**: 50 outils principaux couvrant 99 % des fonctionnalités de l'éditeur
- **Convivial pour l'IA**: Paramètres clairs, documentation complète, appels simples
- **Optimisation des performances**: Réduction de 50 % de la consommation de Tokens, amélioration du taux de réussite des appels IA
- **Compatibilité totale**: Alignement à 100 % avec l'API officielle de Cocos Creator

## ⚠️ À lire impérativement avant l'installation (important)

> **Avant toute première installation ou mise à niveau, veillez impérativement à supprimer les deux fichiers `mcp-server.json` et `tool-manager.json` situés dans le répertoire `settings/` de votre projet actuel, faute de quoi l'affichage de la liste des outils du plugin présentera des anomalies !**
>
> Chemin des fichiers : `votre projet/settings/mcp-server.json` et `votre projet/settings/tool-manager.json`
> Après avoir supprimé ces deux fichiers, rouvrez le panneau du plugin pour revenir à un fonctionnement normal.

## Instructions d'installation

### 1. Copier les fichiers du plugin

Copiez l'intégralité du dossier `cocos-mcp-server` dans le répertoire `extensions` de votre projet Cocos Creator ; vous pouvez également l'importer directement dans le gestionnaire d'extensions :

```
votre projet/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- Placez le plugin ici
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Installer les dépendances

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Compiler le plugin

```bash
npm run build
```

### 4. Activer le plugin

1. Redémarrez Cocos Creator ou actualisez les extensions
2. Le plugin apparaîtra dans le menu Extensions
3. Cliquez sur `Extension > Cocos MCP Server` pour ouvrir le panneau de contrôle

## Méthode d'utilisation

### Démarrage du serveur

1. Ouvrez le panneau du serveur MCP depuis `Extension > Cocos MCP Server`
2. Configurez les paramètres :
   - **Port** : Port du serveur HTTP (par défaut : 3000)
   - **Démarrage automatique** : Démarre automatiquement le serveur au lancement de l'éditeur
   - **Journalisation de débogage** : Active la journalisation détaillée pour le débogage en développement
   - **Nombre maximal de connexions** : Nombre maximal de connexions simultanées autorisées

3. Cliquez sur « Démarrer le serveur » pour commencer à accepter les connexions

### Connexion des assistants IA

Le serveur expose un point de terminaison HTTP à l'adresse `http://localhost:3000/mcp` (ou sur le port que vous avez configuré).

Les assistants IA peuvent se connecter via le protocole MCP et accéder à tous les outils disponibles.


## Développement

### Structure du projet
```
cocos-mcp-server/
├── source/                    # Fichiers source TypeScript
│   ├── main.ts               # Point d'entrée du plugin
│   ├── mcp-server.ts         # Implémentation du serveur MCP
│   ├── settings.ts           # Gestion des paramètres
│   ├── types/                # Définitions de types TypeScript
│   ├── tools/                # Implémentations des outils
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (intégré à node-tools.ts et scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # Implémentation des panneaux d'UI
│   └── test/                 # Fichiers de test
├── dist/                     # Sortie JavaScript compilée
├── static/                   # Ressources statiques (icônes, etc.)
├── i18n/                     # Fichiers d'internationalisation
├── package.json              # Configuration du plugin
└── tsconfig.json             # Configuration TypeScript
```

### Compiler depuis les sources

```bash
# Installer les dépendances
npm install

# Build de développement (mode surveillance)
npm run watch

# Build de production
npm run build
```

### Ajouter un nouvel outil

1. Créez une nouvelle classe d'outil dans `source/tools/`
2. Implémentez l'interface `ToolExecutor`
3. Ajoutez l'outil à l'initialisation de `mcp-server.ts`
4. L'outil sera automatiquement exposé via le protocole MCP

### Prise en charge de TypeScript

Le plugin est entièrement écrit en TypeScript et offre :
- Vérification stricte des types activée
- Définitions de types complètes pour toutes les API
- Prise en charge d'IntelliSense pendant le développement
- Compilation automatique en JavaScript

## Dépannage

### Problèmes courants

1. **Le serveur ne démarre pas** : Vérifiez la disponibilité du port et les paramètres du pare-feu
2. **Les outils ne fonctionnent pas** : Assurez-vous que la scène est chargée et que l'UUID est valide
3. **Erreurs de build** : Exécutez `npm run build` pour vérifier les erreurs TypeScript
4. **Problèmes de connexion** : Vérifiez l'URL HTTP et l'état du serveur

### Mode débogage

Activez la journalisation de débogage dans le panneau du plugin pour obtenir des journaux d'opérations détaillés.

### Utilisation des outils de débogage

```json
{
  "tool": "debug_get_console_logs",
  "arguments": {"limit": 50, "filter": "error"}
}
```

```json
{
  "tool": "debug_validate_scene",
  "arguments": {"checkMissingAssets": true}
}
```

## Configuration requise

- Cocos Creator 3.8.6 ou version ultérieure
- Node.js (fourni avec Cocos Creator)
- TypeScript (installé en tant que dépendance de développement)

## Licence

Ce plugin est destiné à être utilisé dans des projets Cocos Creator, et le code source est fourni avec, à des fins d'apprentissage et d'échange. Il n'est pas chiffré. Vous pouvez l'utiliser pour vos propres développements et optimisations secondaires ; toutefois, ni le code de ce projet ni tout code dérivé ne peuvent être utilisés à des fins commerciales ou de revente. Pour tout usage commercial, veuillez me contacter.

## Contactez-moi pour rejoindre le groupe
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
