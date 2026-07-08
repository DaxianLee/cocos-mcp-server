# Cocos Creator MCP Server-Plugin

🌐 [简体中文](README.md) · [English](README.EN.md) · [繁體中文](README.zh-TW.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português](README.pt.md) · [Français](README.fr.md) · **Deutsch** · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

Ein umfassendes MCP-(Model-Context-Protocol-)Server-Plugin für Cocos Creator 3.8+, das es KI-Assistenten ermöglicht, über ein standardisiertes Protokoll mit dem Cocos Creator Editor zu interagieren. Installation und Nutzung mit einem Klick – lästige Umgebungs- und Konfigurationsschritte entfallen vollständig. Bereits getestet mit dem Claude Client, der Claude CLI und Cursor; andere Editoren werden theoretisch ebenfalls einwandfrei unterstützt.

**🚀 Jetzt mit 50 leistungsstarken, konsolidierten Tools – für 99 % Editor-Kontrolle!**

## Die PRO-Version wurde auf 1.7.8 aktualisiert

| Typ | Link |
|------|------|
| **Video-Vorschau** | [Bilibili-Video](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **Kostenlos testen** | [VberAI Cocos Creator 3.x MCP Pro – Testzugang](https://www.vberai.com/game-engines/cocos) |
| **Kostenlos testen** | [VberAI Cocos Creator 2.x MCP Pro – Testzugang](https://www.vberai.com/game-engines/cocos2x) |
| **KI-Design-Canvas** | [VberAI Studio —— Die weltweit erste KI-native Design-Plattform für Spiele](https://studio.vberai.com) |
| **Offizielle Website** | [VberAI Offizielle Website vberai.com](https://www.vberai.com) |

## Funktionen der Cocos MCP 3.x Pro-Version

> 🚀 Die Pro-Version wird von **VberAI** entwickelt und kontinuierlich gepflegt —— [Pro-Version jetzt testen](https://www.vberai.com/game-engines/cocos) ｜ [Video-Demo ansehen](https://www.bilibili.com/video/BV1rTAXzuEH3/)

Ein professionelles MCP-(Model-Context-Protocol-)Plugin, das speziell für **Cocos Creator 3.8.6+** entwickelt wurde und es KI-Assistenten ermöglicht, den Editor über ein standardisiertes Protokoll direkt zu steuern. **16 intentionserkennende Tools** decken **231 Operationen** ab, verteilt auf **12 Kern-Fähigkeitsmodule**, und begleiten den gesamten Entwicklungsprozess von Cocos Creator 3.x. Es nutzt das Streamable HTTP-Protokoll in Kombination mit einem Token-optimierten Design, das Token spart und Aufrufe stabiler macht, und unterstützt die Ein-Klick-Konfiguration gängiger KI-Clients (Cursor, Claude, Windsurf usw.).

| Intentionserkennende Tools | Abgedeckte Operationen | Abgedeckte Module | Kommunikationsprotokoll |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 Module** | **Streamable HTTP** |

### Zwölf Kern-Fähigkeitsmodule

| Modul | Anzahl Operationen | Beschreibung |
|------|---:|------|
| Szenenverwaltung | 24 | Öffnen, Speichern, Erstellen und Wechseln von Szenen, Hierarchieabfragen und Snapshots, mit Unterstützung für Rückgängig-Operationen und Skriptausführung. |
| Node-Operationen | 18 | Vollständiges CRUD für Nodes, mit Unterstützung für Massenänderungen, das Anhängen von Skripten, Node-Typerkennung und Zwischenablage-Operationen. |
| Komponentensystem | 8 | Hinzufügen, Entfernen, Abfragen und Ändern von Komponenten sowie Eigenschaftsverwaltung, mit Unterstützung für Klick-Ereignis-Bindung und Massen-Ereigniskonfiguration. |
| Prefab-System | 13 | Erstellen, Instanziieren und Wechseln des Bearbeitungsmodus von Prefabs, mit Unterstützung für das Anwenden/Zurücksetzen von Änderungen und Prefab-Validierung. |
| Asset-Verwaltung | 19 | Abfragen, Suchen, CRUD und Importieren von Assets, mit Unterstützung für Abhängigkeitsanalyse und UUID-Pfad-Konvertierung. |
| Editor-Steuerung | 33 | Editor-Operationen wie Projekteinstellungen, Logs, Einstellungen, Build und Vorschau. |
| Szenenansicht | 32 | Gizmo, Kamera, Raster und Referenzbilder, bietet Viewport-Kontext und randbewusste Steuerung. |
| UI- und Vorlagenerstellung | 13 | UI-Komponenten mit einem Klick erstellen, vollständige Node-Hierarchien über JSON-Bäume aufbauen, integrierte UI-Vorlagen. |
| Animationssystem | 39 | Keyframe-Bearbeitung, Kurvenanpassung, Animationsereignisse, Preset-Anwendung sowie Verwaltung von Spine-Skelett-Animationen. |
| Wissensdatenbank-Abfrage | 8 | Integrierte Wissensdatenbank zu Komponenteneigenschaften, UI-Designregeln, Layout-Mustern und Best Practices, für präzise KI-Unterstützung bei der Entwicklung. |
| Validierung und Snapshots | 6 | Prüfung des Szenenlayouts, Validierung von Asset-Referenzen, Hierarchieanalyse, ergänzt durch Regressionsprüfung mittels Szenen-Snapshots. |
| Schriftarten und Label | 9 | Verwaltung von Schriftart-Assets und Operationen an Rich-Text-Label, einschließlich Einstellungen zum Textsatz. |

#### Intelligente Funktionen

- **Intelligente Pfadauflösung** — Alle Node-Parameter akzeptieren UUID, Pfad (z. B. `Canvas/Panel/Button`) oder Namen und werden automatisch aufgelöst
- **Automatische UI-Erkennung** — Beim Erstellen eines Nodes unter einem UI-Elternknoten wird automatisch `cc.UITransform` hinzugefügt
- **Viewport-Kontext** — Gibt beim Erstellen/Ändern von Nodes die Design-Auflösung und den sichtbaren Bereich zurück, mit automatischer Warnung bei Überschreitung
- **Integrierte Wissensdatenbank** — Die KI kann Komponenteneigenschaftstabellen, Koordinatensystemregeln, Layout-Muster und weiteres Wissen abfragen
- **Szenen-Builder** — Beschreibt die vollständige UI-Hierarchie per JSON und baut sie mit einem einzigen Aufruf auf, wobei Canvas/Camera/Komponentenkonfiguration automatisch verarbeitet werden
- **Referenzbild-System** — Überlagert UI-Entwürfe in der Szenenansicht, sodass die KI Oberflächen anhand der Designvorlage aufbauen kann
- **Node-Baum-Caching** — Ein Cache mit 2 Sekunden TTL vermeidet wiederholte Abfragen und wird nach Änderungsoperationen automatisch invalidiert
- **Atomare Operationen** — builder/composite nutzen einen Snapshot-Mechanismus mit automatischem Rollback bei Fehlern

### Pro-Version vs. Open-Source-Version

| Funktion | Open-Source-Version | Pro-Version |
|------|:---:|:---:|
| Kommunikationsprotokoll | HTTP-Protokoll | **Streamable HTTP** |
| Token-Optimierung | Grunddesign | Optimiertes Design, spart mehr Token und ist stabiler |
| Operationscode-Methode | ✕ | ✅ |
| Ein-Klick-Konfiguration | ✕ | ✅ |
| Tool-Anpassung | ✕ | ✅ |
| Intentionserkennende Tools | Basis-Tools | 16 Arten, decken 231 Operationen ab |
| Szene in einem Schritt erstellen | ✕ | ✅ |
| Integrierte Wissensdatenbank | ✕ | ✅ |
| Animation / Spine-System | ✕ | ✅ 39 Animationsoperationen |

---

## 🌐 Über VberAI —— Die KI-native Produktivitätsplattform für Spieleentwicklung

**VberAI** ist eine **KI-native Produktivitätsplattform für die Spieleentwicklung**, die sich an Game-Entwickler, Art-Teams und Content-Teams richtet, und zugleich der Entwickler und Betreuer der Pro-Version dieses Cocos MCP-Plugins. VberAI ist derzeit der **einzige Anbieter, der gleichzeitig MCP-Plugins für die drei führenden Engines Unity, Godot und Cocos Creator bereitstellt**, und entwickelt rund um die Vision „KI wirklich in die Spieleproduktionspipeline zu integrieren" drei Produktlinien:

- **🎮 Game-Engine-MCP-Plugins** —— Betreiben einen MCP-Dienst direkt im Engine-Editor, sodass KI-Clients wie Claude Desktop, Claude Code, Cursor, Windsurf und Cline Szenen, Komponenten, Assets, Animationen und Skripte direkt lesen und bearbeiten können.
- **🎨 AI Studio** —— Eine KI-native Design-Canvas für Spiele: Auf der einen Seite werden PSD / Figma / Engine-Projekte importiert, auf der anderen Seite Unity- / Cocos- / Godot-Szenen und -Prefabs exportiert.
- **✂️ AI Super Matting (KI-Freistellung)** —— Freistellung mit einem Klick direkt im Browser, mit Präzision bis auf einzelne Haare und echtem Alpha-Kanal-Output, Abrechnung nach Nutzung.

### Die Familie der Engine-MCP-Plugins

| Plugin | Beschreibung |
|------|------|
| **Unity MCP** | Enterprise-taugliches MCP-Plugin, deckt Szene / GameObject / Komponente / Prefab / Material / Animation / Shader ab, unterstützt Unity 2022.3+ und Unity 6 |
| **Cocos MCP 3.x Pro** | Die Pro-Version dieses Projekts, 16 intentionserkennende Tools / 231 Operationen, Cocos Creator 3.8.6+, Streamable HTTP |
| **Cocos MCP 2.x Pro** | Maßgeschneidert für ältere Cocos Creator 2.4.x+ Projekte (noch aktiv betriebene 2.x-Produktivprojekte) |
| **Godot MCP** | Komplett kostenlos, MIT-Open-Source, 100+ Tool-Befehle über 21 Systeme, Godot 4.x, kompatibel mit GDScript und C# |


---

## 🎨 VberAI Studio —— Die weltweit erste KI-native Design-Plattform für Spiele

> **Eine KI-native Design-Plattform, die für Spiele gemacht ist.** Von Grund auf kompatibel mit den Engines Unity, Cocos und Godot, mit zahlreichen häufig genutzten KI-Tools und Automatisierungs-Workflows, die die durchgängige Lieferung von Art-Generierung, Ein-Klick-Reskinning, Asset-Verwaltung und Designvorlagen bis hin zur Engine ermöglichen — zusammen mit dem Rückfluss aus der Engine wird so die gesamte Entwicklungskette „KI-Design → KI in der Game-Engine" vollständig durchgängig gemacht.
>
> 👉 **[Jetzt zu AI Studio](https://studio.vberai.com)** ｜ [Mehr erfahren](https://www.vberai.com/studio)


### Vollständige Produktionskette

**Design und Projekt-Assets importieren → Häufige KI-Generierung und -Bearbeitung → Komponentenbasierte Engine-Lieferung → Echtzeit-Synchronisierung mit der Engine über Engine MCP → Rückfluss aus der Engine**

In Kombination mit diesem Cocos MCP-Plugin schreibt AI Studio Szenen, Prefabs, Komponenten und Art-Assets in das Projekt zurück; Engine MCP lässt die KI anschließend in Cocos Creator Skripte, Komponentenkonfiguration, Asset-Verwaltung und Debugging fortsetzen und schafft so einen durchgängigen Entwicklungskreislauf —— das steigert die Teameffizienz erheblich und macht sogar aus einer einzigen Person ein ganzes Team.

**🔗 Verwandte Links**：[VberAI Offizielle Website](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI Super Matting](https://www.vberai.com/ai-studio/bg-removal) ｜ [Plattform-Preise](https://www.vberai.com/pricing) ｜ Support kontaktieren: support@vberai.com

---


## Änderungsprotokoll der Open-Source-Version

## 🚀 Wichtiges Update v1.5.4

## Video-Demo der aktuellen Open-Source-Version

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **Tool-Vereinfachung und Refactoring**: Die ursprünglich über 150 Tools wurden zu 50 hochgradig wiederverwendbaren Kern-Tools mit hoher Abdeckung konsolidiert; sämtlicher unnötiger redundanter Code wurde entfernt, was Benutzerfreundlichkeit und Wartbarkeit erheblich verbessert.
- **Vereinheitlichung der Operationscodes**: Alle Tools verwenden das Muster „Operationscode + Parameter", was den KI-Aufrufprozess erheblich vereinfacht, die Erfolgsquote von KI-Aufrufen erhöht, die Anzahl der KI-Aufrufe reduziert und den Token-Verbrauch um 50 % senkt.
- **Umfassendes Upgrade der Prefab-Funktionalität**: Alle Kernfunktionen von Prefabs – Erstellung, Instanziierung, Synchronisierung, Referenzen – wurden vollständig überarbeitet und verbessert, mit Unterstützung für komplexe Referenzbeziehungen und 100%iger Übereinstimmung mit dem offiziellen Format.
- **Ereignisbindung und Vervollständigung älterer Funktionen**: Ereignisbindung sowie ältere Funktionen für Nodes/Komponenten/Assets wurden ergänzt und implementiert; alle Methoden entsprechen vollständig der offiziellen Implementierung.
- **Schnittstellenoptimierung**: Alle Schnittstellenparameter sind klarer, die Dokumentation ist vollständiger, sodass die KI sie leichter verstehen und aufrufen kann.
- **Optimierung des Plugin-Panels**: Die Panel-UI ist übersichtlicher, die Bedienung intuitiver.
- **Leistungs- und Kompatibilitätsverbesserung**: Die Gesamtarchitektur ist effizienter und kompatibel mit allen Versionen ab Cocos Creator 3.8.6.


## Tool-System und Operationscodes

- Alle Tools folgen der Namenskonvention „Kategorie_Operation", die Parameter verwenden ein einheitliches Schema und unterstützen das Umschalten zwischen mehreren Operationscodes (action), was die Flexibilität und Erweiterbarkeit erheblich steigert.
- 50 Kern-Tools decken alle Editor-Operationen ab: Szene, Node, Komponente, Prefab, Asset, Projekt, Debugging, Einstellungen, Server, Nachrichten-Broadcast und mehr.
- Beispiel für einen Tool-Aufruf:

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

## Wichtigste Funktionskategorien (Auswahl)

- **scene_management**: Szenenverwaltung (Szene abrufen/öffnen/speichern/neu erstellen/schließen)
- **node_query / node_lifecycle / node_transform**: Node-Abfrage, -Erstellung, -Löschung, Eigenschaftsänderungen
- **component_manage / component_script / component_query**: Komponenten hinzufügen/entfernen, Skripte anhängen, Komponenteninformationen
- **prefab_browse / prefab_lifecycle / prefab_instance**: Prefab-Browsing, -Erstellung, -Instanziierung, -Synchronisierung
- **asset_manage / asset_analyze**: Asset-Import, -Löschung, Abhängigkeitsanalyse
- **project_manage / project_build_system**: Projekt ausführen, builden, Konfigurationsinformationen
- **debug_console / debug_logs**: Konsolen- und Log-Verwaltung
- **preferences_manage**: Einstellungen
- **server_info**: Serverinformationen
- **broadcast_message**: Nachrichten-Broadcast


### v1.4.0 - 26. Juli 2025

#### 🎯 Wichtige Fehlerbehebungen
- **Prefab-Erstellung vollständig behoben**: Das Problem des Verlusts von Komponenten-/Node-/Asset-Referenzen bei der Prefab-Erstellung wurde vollständig gelöst
- **Korrekte Referenzverarbeitung**: Ein Referenzformat implementiert, das vollständig mit manuell erstellten Prefabs übereinstimmt
  - **Interne Referenzen**: Node- und Komponentenreferenzen innerhalb des Prefabs werden korrekt in das Format `{"__id__": x}` umgewandelt
  - **Externe Referenzen**: Node- und Komponentenreferenzen außerhalb des Prefabs werden korrekt auf `null` gesetzt
  - **Asset-Referenzen**: Referenzen auf Prefabs, Texturen, Sprite-Frames usw. behalten das UUID-Format vollständig bei
- **Standardisierung der API zum Entfernen von Komponenten/Skripten**: Beim Entfernen von Komponenten/Skripten muss nun die cid der Komponente (das type-Feld) übergeben werden – Skript- oder Klassenname können nicht verwendet werden. KI und Benutzer sollten zunächst mit getComponents das type-Feld (cid) abrufen und dieses dann an removeComponent übergeben. So können alle Arten von Komponenten und Skripten zu 100 % zuverlässig entfernt werden, kompatibel mit allen Cocos Creator-Versionen.

#### 🔧 Kernverbesserungen
- **Optimierung der Indexreihenfolge**: Die Erstellungsreihenfolge der Prefab-Objekte wurde angepasst, um die Übereinstimmung mit dem Cocos Creator-Standardformat sicherzustellen
- **Unterstützung von Komponententypen**: Die Erkennung von Komponentenreferenzen wurde erweitert und unterstützt nun alle Komponententypen, die mit cc. beginnen (Label, Button, Sprite usw.)
- **UUID-Mapping-Mechanismus**: Das System zur Zuordnung interner UUIDs zu Indizes wurde verbessert, um die korrekte Erstellung von Referenzbeziehungen sicherzustellen
- **Standardisierung des Eigenschaftsformats**: Die Reihenfolge und das Format der Komponenteneigenschaften wurden korrigiert, um Parsing-Fehler der Engine zu beseitigen

#### 🐛 Fehlerbehebungen
- **Behebung eines Prefab-Importfehlers**: Der Fehler `Cannot read properties of undefined (reading '_name')` wurde behoben
- **Behebung der Engine-Kompatibilität**: Der Fehler `placeHolder.initDefault is not a function` wurde behoben
- **Behebung der Eigenschaftsüberschreibung**: Verhindert, dass kritische Eigenschaften wie `_objFlags` durch Komponentendaten überschrieben werden
- **Behebung des Referenzverlusts**: Stellt sicher, dass Referenzen aller Art korrekt gespeichert und geladen werden

#### 📈 Funktionserweiterungen
- **Vollständige Erhaltung von Komponenteneigenschaften**: Alle Komponenteneigenschaften einschließlich privater Eigenschaften (wie _group, _density usw.)
- **Unterstützung von Kind-Node-Strukturen**: Korrekte Verarbeitung der Hierarchiestruktur und Kind-Node-Beziehungen von Prefabs
- **Verarbeitung von Transform-Eigenschaften**: Erhält Position, Rotation, Skalierung und Hierarchieinformationen des Nodes
- **Optimierung der Debug-Informationen**: Detaillierte Logs zur Referenzverarbeitung hinzugefügt, um die Fehlersuche zu erleichtern

#### 💡 Technische Durchbrüche
- **Erkennung von Referenztypen**: Unterscheidet intelligent zwischen internen und externen Referenzen, um ungültige Referenzen zu vermeiden
- **Formatkompatibilität**: Generierte Prefabs sind zu 100 % formatkompatibel mit manuell erstellten Prefabs
- **Engine-Integration**: Prefabs können normal in Szenen eingebunden werden, ohne jegliche Laufzeitfehler
- **Leistungsoptimierung**: Der Prefab-Erstellungsprozess wurde optimiert, um die Verarbeitungseffizienz bei großen Prefabs zu verbessern

**🎉 Die Prefab-Erstellungsfunktion ist jetzt vollständig einsatzbereit und unterstützt komplexe Komponentenreferenzbeziehungen sowie vollständige Prefab-Strukturen!**

### v1.3.0 - 25. Juli 2024

#### 🆕 Neue Funktionen
- **Integriertes Tool-Verwaltungspanel**: Umfassende Tool-Verwaltungsfunktionen wurden direkt in das Hauptsteuerungspanel integriert
- **Tool-Konfigurationssystem**: Selektives Aktivieren/Deaktivieren von Tools implementiert, mit Unterstützung für persistente Konfiguration
- **Dynamisches Laden von Tools**: Die Tool-Erkennung wurde verbessert und kann nun alle 158 verfügbaren Tools des MCP-Servers dynamisch laden
- **Echtzeit-Tool-Statusverwaltung**: Echtzeit-Aktualisierung von Tool-Anzahl und -Status hinzugefügt, die sich sofort widerspiegelt, wenn einzelne Tools umgeschaltet werden
- **Konfigurationspersistenz**: Tool-Konfigurationen werden automatisch zwischen Editor-Sitzungen gespeichert und geladen

#### 🔧 Verbesserungen
- **Vereinheitlichte Panel-Oberfläche**: Die Tool-Verwaltung wurde als Tab in das Haupt-MCP-Server-Panel integriert, wodurch ein separates Panel überflüssig wird
- **Erweiterte Servereinstellungen**: Die Serverkonfigurationsverwaltung wurde verbessert, mit besserer Persistenz und Ladefunktion
- **Vue 3-Integration**: Upgrade auf die Vue 3 Composition API für bessere Reaktivität und Leistung
- **Bessere Fehlerbehandlung**: Umfassende Fehlerbehandlung mit Rollback-Mechanismus für fehlgeschlagene Operationen hinzugefügt
- **Verbesserte UI/UX**: Das visuelle Design wurde verbessert, mit passenden Trennlinien, eigenständigen Blockstilen und nicht-transparenten Modal-Hintergründen

#### 🐛 Fehlerbehebungen
- **Behebung der Tool-Statuspersistenz**: Das Problem, dass der Tool-Status beim Wechseln von Tabs oder erneutem Öffnen des Panels zurückgesetzt wurde, wurde behoben
- **Behebung des Konfigurationsladens**: Probleme beim Laden der Servereinstellungen und bei der Nachrichtenregistrierung wurden korrigiert
- **Behebung der Checkbox-Interaktion**: Probleme beim Deaktivieren von Checkboxen wurden behoben und die Reaktionsfähigkeit verbessert
- **Behebung des Panel-Scrollings**: Stellt die korrekte Scroll-Funktion im Tool-Verwaltungspanel sicher
- **Behebung der IPC-Kommunikation**: Verschiedene IPC-Kommunikationsprobleme zwischen Frontend und Backend wurden behoben

#### 🏗️ Technische Verbesserungen
- **Vereinfachte Architektur**: Die Komplexität mehrerer Konfigurationen wurde entfernt, mit Fokus auf eine einheitliche Konfigurationsverwaltung
- **Bessere Typsicherheit**: TypeScript-Typdefinitionen und Schnittstellen wurden erweitert
- **Verbesserte Datensynchronisierung**: Bessere Synchronisierung zwischen dem Frontend-UI-Status und dem Backend-Tool-Manager
- **Erweitertes Debugging**: Umfassende Protokollierungs- und Debugging-Funktionen hinzugefügt

#### 📊 Statistische Informationen
- **Gesamtzahl der Tools**: Von 151 auf 158 Tools erhöht
- **Kategorien**: 13 Tool-Kategorien mit umfassender Abdeckung
- **Editor-Steuerung**: Erreicht eine Abdeckung von 98 % der Editor-Funktionen

### v1.2.0 - Vorherige Version
- Erstveröffentlichung mit 151 Tools
- Grundlegende MCP-Server-Funktionalität
- Szenen-, Node-, Komponenten- und Prefab-Operationen
- Projektsteuerung und Debugging-Tools



## Schnellstart

**Claude CLI-Konfiguration:**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp (verwenden Sie Ihre eigene konfigurierte Portnummer)
```

**Claude-Client-Konfiguration:**

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

**Cursor- oder VS-artige MCP-Konfiguration**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## Funktionen

### 🎯 Szenenoperationen (scene_*)
- **scene_management**: Szenenverwaltung - Aktuelle Szene abrufen, Szenen öffnen/speichern/erstellen/schließen, unterstützt Abfrage der Szenenliste
- **scene_hierarchy**: Szenenhierarchie - Vollständige Szenenstruktur abrufen, unterstützt Einbeziehung von Komponenteninformationen
- **scene_execution_control**: Ausführungssteuerung - Komponentenmethoden, Szenenskripte und Prefab-Synchronisierung ausführen

### 🎮 Node-Operationen (node_*)
- **node_query**: Node-Abfrage - Nodes nach Name/Muster suchen, Node-Informationen abrufen, 2D/3D-Typ erkennen
- **node_lifecycle**: Node-Lebenszyklus - Nodes erstellen/löschen, unterstützt vorinstallierte Komponenten und Prefab-Instanziierung
- **node_transform**: Node-Transformation - Ändert Node-Name, Position, Rotation, Skalierung, Sichtbarkeit und weitere Eigenschaften
- **node_hierarchy**: Node-Hierarchie - Nodes verschieben, kopieren, einfügen, unterstützt Operationen an der Hierarchiestruktur
- **node_clipboard**: Node-Zwischenablage - Node kopieren/einfügen/ausschneiden
- **node_property_management**: Eigenschaftsverwaltung - Node-Eigenschaften, Komponenteneigenschaften und Transform-Eigenschaften zurücksetzen

### 🔧 Komponentenoperationen (component_*)
- **component_manage**: Komponentenverwaltung - Engine-Komponenten hinzufügen/entfernen (cc.Sprite, cc.Button usw.)
- **component_script**: Skriptkomponenten - Benutzerdefinierte Skriptkomponenten anhängen/entfernen
- **component_query**: Komponentenabfrage - Komponentenliste, Detailinformationen und verfügbare Komponententypen abrufen
- **set_component_property**: Eigenschaften setzen - Einzelne oder mehrere Komponenteneigenschaftswerte setzen

### 📦 Prefab-Operationen (prefab_*)
- **prefab_browse**: Prefab-Browsing - Prefabs auflisten, Informationen ansehen, Dateien validieren
- **prefab_lifecycle**: Prefab-Lebenszyklus - Prefab aus Node erstellen, Prefab löschen
- **prefab_instance**: Prefab-Instanzen - In Szene instanziieren, Verknüpfung aufheben, Änderungen anwenden, Original wiederherstellen
- **prefab_edit**: Prefab-Bearbeitung - Bearbeitungsmodus betreten/verlassen, Prefab speichern, Änderungen testen

### 🚀 Projektsteuerung (project_*)
- **project_manage**: Projektverwaltung - Projekt ausführen, Projekt builden, Projektinformationen und -einstellungen abrufen
- **project_build_system**: Build-System - Build-Panel steuern, Build-Status prüfen, Vorschauserver verwalten

### 🔍 Debugging-Tools (debug_*)
- **debug_console**: Konsolenverwaltung - Konsolenprotokolle abrufen/leeren, unterstützt Filterung und Begrenzung
- **debug_logs**: Log-Analyse - Projektprotokolldateien lesen/durchsuchen/analysieren, unterstützt Musterabgleich
- **debug_system**: Systemdebugging - Editor-Informationen, Leistungsstatistiken und Umgebungsinformationen abrufen

### 📁 Asset-Verwaltung (asset_*)
- **asset_manage**: Asset-Verwaltung - Assets im Batch importieren/löschen, Metadaten speichern, URLs generieren
- **asset_analyze**: Asset-Analyse - Abhängigkeiten abrufen, Asset-Verzeichnis exportieren
- **asset_system**: Asset-System - Assets aktualisieren, Status der Asset-Datenbank abfragen
- **asset_query**: Asset-Abfrage - Assets nach Typ/Ordner abfragen, Detailinformationen abrufen
- **asset_operations**: Asset-Operationen - Assets erstellen/kopieren/verschieben/löschen/speichern/erneut importieren

### ⚙️ Einstellungen (preferences_*)
- **preferences_manage**: Einstellungsverwaltung - Editor-Einstellungen abrufen/setzen
- **preferences_global**: Globale Einstellungen - Globale Konfiguration und Systemeinstellungen verwalten

### 🌐 Server und Broadcasting (server_* / broadcast_*)
- **server_info**: Serverinformationen - Serverstatus, Projektdetails und Umgebungsinformationen abrufen
- **broadcast_message**: Nachrichten-Broadcast - Benutzerdefinierte Nachrichten abhören und senden

### 🖼️ Referenzbilder (referenceImage_*)
- **reference_image_manage**: Referenzbildverwaltung - Referenzbilder in der Szenenansicht hinzufügen/löschen/verwalten
- **reference_image_view**: Referenzbildansicht - Anzeige und Bearbeitung von Referenzbildern steuern

### 🎨 Szenenansicht (sceneView_*)
- **scene_view_control**: Szenenansichtssteuerung - Gizmo-Tools, Koordinatensystem und Ansichtsmodus steuern
- **scene_view_tools**: Szenenansicht-Tools - Verschiedene Tools und Optionen der Szenenansicht verwalten

### ✅ Validierungstools (validation_*)
- **validation_scene**: Szenenvalidierung - Szenenintegrität validieren, fehlende Assets prüfen
- **validation_asset**: Asset-Validierung - Asset-Referenzen validieren, Asset-Integrität prüfen

### 🛠️ Tool-Verwaltung
- **Tool-Konfigurationssystem**: Selektives Aktivieren/Deaktivieren von Tools, unterstützt mehrere Konfigurationssätze
- **Konfigurationspersistenz**: Automatisches Speichern und Laden von Tool-Konfigurationen
- **Konfigurationsimport/-export**: Unterstützt den Import und Export von Tool-Konfigurationen
- **Echtzeit-Statusverwaltung**: Echtzeit-Aktualisierung und -Synchronisierung des Tool-Status

### 🚀 Kernvorteile
- **Vereinheitlichte Operationscodes**: Alle Tools folgen der Namenskonvention „Kategorie_Operation" mit einheitlichem Parameter-Schema
- **Hohe Wiederverwendbarkeit**: 50 Kern-Tools decken 99 % der Editor-Funktionen ab
- **KI-freundlich**: Klare Parameter, vollständige Dokumentation, einfacher Aufruf
- **Leistungsoptimierung**: Senkt den Token-Verbrauch um 50 % und erhöht die Erfolgsquote von KI-Aufrufen
- **Vollständige Kompatibilität**: 100 % übereinstimmend mit der offiziellen Cocos Creator API

## ⚠️ Vor der Installation lesen (Wichtig)

> **Löschen Sie vor der Erstinstallation oder einem Upgrade unbedingt die beiden Dateien `mcp-server.json` und `tool-manager.json` im Verzeichnis `settings/` Ihres aktuellen Projekts, da andernfalls die Anzeige der Tool-Liste des Plugins fehlerhaft sein kann!**
>
> Dateipfad: `IhrProjekt/settings/mcp-server.json` und `IhrProjekt/settings/tool-manager.json`
> Nach dem Löschen dieser beiden Dateien öffnen Sie das Plugin-Panel erneut, um den Normalzustand wiederherzustellen.

## Installationsanleitung

### 1. Plugin-Dateien kopieren

Kopieren Sie den gesamten Ordner `cocos-mcp-server` in das `extensions`-Verzeichnis Ihres Cocos Creator-Projekts. Alternativ können Sie das Projekt auch direkt über den Erweiterungsmanager importieren:

```
IhrProjekt/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- Plugin hier ablegen
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. Abhängigkeiten installieren

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. Plugin bauen

```bash
npm run build
```

### 4. Plugin aktivieren

1. Starten Sie Cocos Creator neu oder aktualisieren Sie die Erweiterungen
2. Das Plugin erscheint im Erweiterungsmenü
3. Klicken Sie auf `Erweiterungen > Cocos MCP Server`, um das Steuerungspanel zu öffnen

## Verwendung

### Server starten

1. Öffnen Sie das MCP-Server-Panel über `Erweiterungen > Cocos MCP Server`
2. Konfigurieren Sie die Einstellungen:
   - **Port**: HTTP-Serverport (Standard: 3000)
   - **Automatischer Start**: Startet den Server automatisch beim Öffnen des Editors
   - **Debug-Protokollierung**: Aktiviert detaillierte Protokolle für die Entwicklung
   - **Maximale Verbindungen**: Maximal zulässige Anzahl gleichzeitiger Verbindungen

3. Klicken Sie auf „Server starten", um Verbindungen anzunehmen

### KI-Assistenten verbinden

Der Server stellt einen HTTP-Endpunkt unter `http://localhost:3000/mcp` (oder dem von Ihnen konfigurierten Port) bereit.

KI-Assistenten können sich über das MCP-Protokoll verbinden und auf alle verfügbaren Tools zugreifen.


## Entwicklung

### Projektstruktur
```
cocos-mcp-server/
├── source/                    # TypeScript-Quelldateien
│   ├── main.ts               # Plugin-Einstiegspunkt
│   ├── mcp-server.ts         # MCP-Server-Implementierung
│   ├── settings.ts           # Einstellungsverwaltung
│   ├── types/                # TypeScript-Typdefinitionen
│   ├── tools/                # Tool-Implementierungen
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (bereits integriert in node-tools.ts und scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # UI-Panel-Implementierung
│   └── test/                 # Testdateien
├── dist/                     # Kompilierte JavaScript-Ausgabe
├── static/                   # Statische Assets (Icons usw.)
├── i18n/                     # Internationalisierungsdateien
├── package.json              # Plugin-Konfiguration
└── tsconfig.json             # TypeScript-Konfiguration
```

### Aus dem Quellcode bauen

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungs-Build (Watch-Modus)
npm run watch

# Produktions-Build
npm run build
```

### Neue Tools hinzufügen

1. Erstellen Sie eine neue Tool-Klasse in `source/tools/`
2. Implementieren Sie die Schnittstelle `ToolExecutor`
3. Fügen Sie das Tool zur Initialisierung in `mcp-server.ts` hinzu
4. Das Tool wird automatisch über das MCP-Protokoll bereitgestellt

### TypeScript-Unterstützung

Das Plugin ist vollständig in TypeScript geschrieben und bietet:
- Aktivierte strikte Typprüfung
- Umfassende Typdefinitionen für alle APIs
- IntelliSense-Unterstützung während der Entwicklung
- Automatische Kompilierung zu JavaScript

## Fehlerbehebung

### Häufige Probleme

1. **Server startet nicht**: Prüfen Sie die Verfügbarkeit des Ports und die Firewall-Einstellungen
2. **Tools funktionieren nicht**: Stellen Sie sicher, dass die Szene geladen ist und die UUIDs gültig sind
3. **Build-Fehler**: Führen Sie `npm run build` aus, um TypeScript-Fehler zu prüfen
4. **Verbindungsprobleme**: Überprüfen Sie die HTTP-URL und den Serverstatus

### Debug-Modus

Aktivieren Sie die Debug-Protokollierung im Plugin-Panel, um detaillierte Betriebsprotokolle zu erhalten.

### Debugging-Tools verwenden

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

## Systemanforderungen

- Cocos Creator 3.8.6 oder höher
- Node.js (in Cocos Creator enthalten)
- TypeScript (als Entwicklungsabhängigkeit installiert)

## Lizenz

Dieses Plugin ist für die Verwendung in Cocos Creator-Projekten bestimmt, der Quellcode ist mitgeliefert und darf zu Lern- und Austauschzwecken genutzt werden. Er ist nicht verschlüsselt und unterstützt Ihre eigene Weiterentwicklung und Optimierung. Weder der Code dieses Projekts noch davon abgeleiteter Code darf für kommerzielle Zwecke oder den Weiterverkauf verwendet werden. Für eine kommerzielle Nutzung kontaktieren Sie bitte mich.

## Kontaktieren Sie mich, um der Gruppe beizutreten
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
