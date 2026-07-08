# Cocos Creator MCP 伺服器外掛

🌐 [简体中文](README.md) · [English](README.EN.md) · **繁體中文** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Español](README.es.md) · [Português](README.pt.md) · [Français](README.fr.md) · [Deutsch](README.de.md) · [Русский](README.ru.md) · [Tiếng Việt](README.vi.md)

一款適用於 Cocos Creator 3.8+ 的綜合性 MCP（模型上下文協議）伺服器外掛，讓 AI 助手能夠透過標準化協議與 Cocos Creator 編輯器進行互動。一鍵安裝即可使用，省去所有繁瑣的環境與設定。已測試過 Claude 客戶端、Claude CLI 和 Cursor，其他編輯器理論上也能完美支援。

**🚀 現在提供 50 個強力融合工具，實現 99% 的編輯器控制！**

## PRO 版本已經更新到了 1.7.8

| 類型 | 連結 |
|------|------|
| **影片預覽** | [Bilibili 影片](https://www.bilibili.com/video/BV1rTAXzuEH3/) |
| **免費體驗** | [vberai cocos creator 3.x 版本 mcp Pro 體驗網址](https://www.vberai.com/game-engines/cocos) |
| **免費體驗** | [vberai cocos creator 2.x 版本 mcp Pro 體驗網址](https://www.vberai.com/game-engines/cocos2x) |
| **AI 設計畫布** | [VberAI Studio —— 全球首個遊戲 AI 原生設計平台](https://studio.vberai.com) |
| **官網** | [VberAI 官網 vberai.com](https://www.vberai.com) |

## Cocos MCP 3.x Pro 版本特性

> 🚀 Pro 版由 **VberAI** 打造並持續維護 —— [立即體驗 Pro 版](https://www.vberai.com/game-engines/cocos) ｜ [觀看影片示範](https://www.bilibili.com/video/BV1rTAXzuEH3/)

專為 Cocos Creator 3.8.6+ 打造的專業級 MCP（模型上下文協定）外掛，讓 AI 助手透過標準化協定直接操控編輯器。**16 個意圖級工具**涵蓋 **231 項操作**，橫跨 **12 大能力模組**，貫穿 Cocos Creator 3.x 開發全流程。採用 Streamable HTTP 協定，配合 Token 最佳化設計，更省 Token、呼叫更穩定，支援一鍵設定主流 AI 客戶端（Cursor、Claude、Windsurf 等）。

| 意圖級工具 | 涵蓋操作 | 涵蓋模組 | 通訊協定 |
|:---:|:---:|:---:|:---:|
| **16** | **231** | **12 大模組** | **Streamable HTTP** |

### 十二大能力模組

| 模組 | 操作數 | 說明 |
|------|---:|------|
| 場景管理 | 24 | 場景的開啟、儲存、建立與切換，層級查詢與快照，支援復原操作和指令碼執行。 |
| 節點操作 | 18 | 節點的完整 CRUD，支援批次修改、指令碼掛載、節點類型偵測和剪貼簿操作。 |
| 元件系統 | 8 | 元件的增刪查改和屬性設定，支援點擊事件繫結和批次事件設定。 |
| 預製體系統 | 13 | 預製體的建立、實例化、編輯模式切換，支援套用/還原變更和預製體驗證。 |
| 資源管理 | 19 | 資源的查詢、搜尋、CRUD 與匯入，支援相依性分析、UUID 與路徑轉換。 |
| 編輯器控制 | 33 | 專案設定、日誌、偏好、建置與預覽等編輯器級操作。 |
| 場景檢視 | 32 | Gizmo、相機、格線與參考圖，提供視埠上下文與邊界感知控制。 |
| UI 與範本建構 | 13 | 一鍵建立 UI 元件，JSON 樹建構完整節點層級，內建多種 UI 範本。 |
| 動畫系統 | 39 | 關鍵影格編輯、曲線調整、動畫事件、預設套用，及 Spine 骨骼動畫管理。 |
| 知識庫查詢 | 8 | 內建元件屬性、UI 設計規則、版面配置模式和最佳實踐知識庫，AI 精準輔助開發。 |
| 驗證與快照 | 6 | 場景版面檢查、資源引用驗證、層級分析，配合場景快照回歸校驗。 |
| 字型與 Label | 9 | 字型資源管理與富文字 Label 操作，涵蓋文字排版設定。 |

#### 智慧特性

- **智慧路徑解析** — 所有節點參數皆可接受 UUID、路徑（如 `Canvas/Panel/Button`）或名稱，自動解析
- **UI 自動偵測** — 在 UI 父節點下建立節點時自動加入 `cc.UITransform`
- **視口上下文** — 建立/修改節點時回傳設計解析度、可視範圍，超出範圍自動警告
- **內建知識庫** — AI 可查詢元件屬性表、座標系規則、版面配置模式等知識
- **場景建構器** — 用 JSON 描述完整 UI 層級，一次呼叫即可建構出來，自動處理 Canvas/Camera/元件配置
- **參考圖片系統** — 在場景視圖疊加 UI 設計稿，讓 AI 看著設計圖搭建介面
- **節點樹快取** — 2 秒 TTL 快取避免重複查詢，變更操作後自動失效
- **原子化操作** — builder/composite 使用 snapshot 機制，失敗時自動回滾

### Pro 版 vs 開源版

| 功能 | 開源版 | Pro 版 |
|------|:---:|:---:|
| 通訊協議 | HTTP 協議 | **Streamable HTTP** |
| Token 最佳化 | 基礎設計 | 最佳化設計，更省 Token 更穩定 |
| 操作碼方法 | ✕ | ✅ |
| 一鍵配置 | ✕ | ✅ |
| 工具自訂 | ✕ | ✅ |
| 意圖識別級工具 | 基礎工具 | 16 種，涵蓋 231 項操作 |
| 一次性建立場景 | ✕ | ✅ |
| 內建知識庫 | ✕ | ✅ |
| 動畫 / Spine 系統 | ✕ | ✅ 39 項動畫操作 |

---

## 🌐 關於 VberAI —— AI 原生遊戲生產力平台

**VberAI** 是面向遊戲開發者、美術團隊與內容團隊的 **AI 原生遊戲生產力平台**，也是本 Cocos MCP 外掛 Pro 版的開發與維護方。VberAI 是目前**唯一同時為 Unity、Godot、Cocos Creator 三大主流引擎提供 MCP 外掛**的廠商，圍繞「讓 AI 真正融入遊戲生產管線」打造三條產品線：

- **🎮 遊戲引擎 MCP 外掛** —— 在引擎編輯器內執行 MCP 服務，讓 Claude Desktop、Claude Code、Cursor、Windsurf、Cline 等 AI 客戶端直接讀取並操作場景、元件、資源、動畫與腳本。
- **🎨 AI Studio** —— AI 原生遊戲設計畫布，一端匯入 PSD / Figma / 引擎專案，另一端匯出 Unity / Cocos / Godot 場景與預製體。
- **✂️ AI 超強去背（AI Super Matting）** —— 瀏覽器端一鍵去背，髮絲級精度 + 真實 Alpha 通道輸出，按量計費。

### 引擎 MCP 外掛家族

| 外掛 | 說明 |
|------|------|
| **Unity MCP** | 企業級 MCP 外掛，涵蓋場景 / GameObject / 元件 / 預製體 / 材質 / 動畫 / Shader，支援 Unity 2022.3+ 與 Unity 6 |
| **Cocos MCP 3.x Pro** | 本專案 Pro 版，16 個意圖級工具 / 231 項操作，Cocos Creator 3.8.6+，Streamable HTTP |
| **Cocos MCP 2.x Pro** | 專為 Cocos Creator 2.4.x+ 舊專案（仍在營運的 2.x 線上專案）量身打造 |
| **Godot MCP** | 完全免費、MIT 開源，100+ 工具指令涵蓋 21 個系統，Godot 4.x，相容 GDScript 與 C# |


---

## 🎨 VberAI Studio —— 全球首個遊戲 AI 原生設計平台

> **為遊戲而生的 AI 原生設計平台。** 從底層開始相容 Unity、Cocos、Godot 引擎，超多高頻 AI 工具與自動化流程，讓美術生成、一鍵換皮、資產管理、設計稿到引擎一體化交付，再加上引擎反向回流，徹底打通「AI 設計 → 遊戲引擎 AI」全開發鏈路。
>
> 👉 **[立即進入 AI Studio](https://studio.vberai.com)** ｜ [了解更多](https://www.vberai.com/studio)


### 完整生產鏈路

**匯入設計與專案資產 → AI 高頻生成與編輯 → 元件化引擎交付 → 透過 Engine MCP 即時同步到引擎 → 引擎反向回流**

配合本 Cocos MCP 外掛，AI Studio 把場景、預製體、元件與美術資源回寫到專案後，Engine MCP 讓 AI 在 Cocos Creator 中繼續完成腳本、元件配置、資源管理與除錯，形成端到端的開發閉環 —— 大幅提升團隊效率，甚至讓一個人就是一支隊伍。

**🔗 相關連結**：[VberAI 官網](https://www.vberai.com) ｜ [AI Studio](https://studio.vberai.com) ｜ [AI 超強去背](https://www.vberai.com/ai-studio/bg-removal) ｜ [平台定價](https://www.vberai.com/pricing) ｜ 聯絡支援：support@vberai.com

---


## 開源版本更新日誌

## 🚀 重大更新 v1.5.4

## 當前開源版本影片示範

[<img width="503" height="351" alt="视频演示" src="https://github.com/user-attachments/assets/f186ce14-9ffc-4a29-8761-48bdd7c1ea16" />](https://www.bilibili.com/video/BV1mB8dzfEw8?spm_id_from=333.788.recommend_more_video.0&vd_source=6b1ff659dd5f04a92cc6d14061e8bb92)

- **工具精簡與重構**：將原有 150+ 個工具濃縮整併為 50 個高複用、高覆蓋率的核心工具，去除所有無效冗餘程式碼，大幅提升易用性和可維護性。
- **操作碼統一**：所有工具皆採用「操作碼＋參數」模式，大幅簡化 AI 呼叫流程，提升 AI 呼叫成功率，減少 AI 呼叫次數，降低 50% Token 消耗。
- **預製體功能全面升級**：徹底修復並完善預製體的建立、實體化、同步、引用等所有核心功能，支援複雜引用關係，100% 對齊官方格式。
- **事件綁定與舊功能補全**：補充並實作了事件綁定、節點/元件/資源等舊功能，所有方法皆與官方實作完全對齊。
- **介面優化**：所有介面參數更清晰，文件更完善，AI 更容易理解與呼叫。
- **外掛面板優化**：面板 UI 更簡潔，操作更直觀。
- **效能與相容性提升**：整體架構更高效，相容 Cocos Creator 3.8.6 及以上所有版本。


## 工具體系與操作碼

- 所有工具均以「類別_操作」命名，參數採用統一 Schema，支援多操作碼（action）切換，大幅提升靈活性和可擴充性。
- 50 個核心工具涵蓋場景、節點、元件、預製體、資源、專案、除錯、偏好設定、伺服器、訊息廣播等全部編輯器操作。
- 工具呼叫範例：

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

## 主要功能類別（部分示例）

- **scene_management**：場景管理（取得/開啟/儲存/新建/關閉場景）
- **node_query / node_lifecycle / node_transform**：節點查詢、建立、刪除、屬性變更
- **component_manage / component_script / component_query**：元件增刪、腳本掛載、元件資訊
- **prefab_browse / prefab_lifecycle / prefab_instance**：預製體瀏覽、建立、實體化、同步
- **asset_manage / asset_analyze**：資源匯入、刪除、相依性分析
- **project_manage / project_build_system**：專案執行、建置、配置資訊
- **debug_console / debug_logs**：主控台與日誌管理
- **preferences_manage**：偏好設定
- **server_info**：伺服器資訊
- **broadcast_message**：訊息廣播


### v1.4.0 - 2025年7月26日

#### 🎯 重大功能修復
- **完全修復預製體建立功能**: 徹底解決了預製體建立時元件/節點/資源類型引用遺失的問題
- **正確的引用處理**: 實作了與手動建立預製體完全一致的引用格式
  - **內部引用**: 預製體內部的節點和元件引用正確轉換為 `{"__id__": x}` 格式
  - **外部引用**: 預製體外部的節點和元件引用正確設定為 `null`
  - **資源引用**: 預製體、紋理、精靈影格等資源引用完整保留 UUID 格式
- **元件/腳本移除 API 規範化**: 現在移除元件/腳本時，必須傳入元件的 cid（type 欄位），不能用腳本名或類別名。AI 和使用者應先用 getComponents 取得 type 欄位（cid），再傳給 removeComponent。這樣能 100% 準確移除所有類型的元件和腳本，相容所有 Cocos Creator 版本。

#### 🔧 核心改進
- **索引順序最佳化**: 調整預製體物件建立順序，確保與 Cocos Creator 標準格式一致
- **元件類型支援**: 擴充元件引用偵測，支援所有 cc. 開頭的元件類型（Label、Button、Sprite 等）
- **UUID 映射機制**: 完善內部 UUID 到索引的映射系統，確保引用關係正確建立
- **屬性格式標準化**: 修復元件屬性順序和格式，消除引擎解析錯誤

#### 🐛 錯誤修復
- **修復預製體匯入錯誤**: 解決 `Cannot read properties of undefined (reading '_name')` 錯誤
- **修復引擎相容性**: 解決 `placeHolder.initDefault is not a function` 錯誤
- **修復屬性覆蓋**: 防止 `_objFlags` 等關鍵屬性被元件資料覆蓋
- **修復引用遺失**: 確保所有類型的引用都能正確儲存和載入

#### 📈 功能增強
- **完整元件屬性保留**: 包括私有屬性（如 _group、_density 等）在內的所有元件屬性
- **子節點結構支援**: 正確處理預製體的層級結構和子節點關係
- **變換屬性處理**: 保留節點的位置、旋轉、縮放和層級資訊
- **除錯資訊優化**: 加入詳細的引用處理日誌，便於問題追蹤

#### 💡 技術突破
- **引用類型識別**: 智慧區分內部引用和外部引用，避免無效引用
- **格式相容性**: 產生的預製體與手動建立的預製體格式 100% 相容
- **引擎整合**: 預製體可以正常掛載到場景中，無任何執行階段錯誤
- **效能優化**: 優化預製體建立流程，提高大型預製體的處理效率

**🎉 現在預製體建立功能已完全可用，支援複雜的元件引用關係和完整的預製體結構！**

### v1.3.0 - 2024年7月25日

#### 🆕 新功能
- **整合工具管理面板**: 在主控制面板中直接加入了全面的工具管理功能
- **工具配置系統**: 實作了選擇性工具啟用/停用，支援持久化配置
- **動態工具載入**: 增強了工具發現功能，能夠動態載入 MCP 伺服器中的所有 158 個可用工具
- **即時工具狀態管理**: 加入了工具計數和狀態的即時更新，當單一工具切換時立即反映
- **配置持久化**: 在編輯器工作階段間自動儲存和載入工具配置

#### 🔧 改進
- **統一面板介面**: 將工具管理整併到主 MCP 伺服器面板作為分頁，消除了對獨立面板的需求
- **增強伺服器設定**: 改進了伺服器配置管理，具有更好的持久化和載入功能
- **Vue 3 整合**: 升級到 Vue 3 Composition API，提供更好的回應性和效能
- **更好的錯誤處理**: 加入了全面的錯誤處理，包含失敗操作的回滾機制
- **改進的 UI/UX**: 增強了視覺設計，包含適當的分隔線、獨特的區塊樣式和不透明的彈窗背景

#### 🐛 錯誤修復
- **修復工具狀態持久化**: 解決了工具狀態在分頁切換或面板重新開啟時重置的問題
- **修復配置載入**: 修正了伺服器設定載入問題和訊息註冊問題
- **修復核取方塊互動**: 解決了核取方塊取消勾選問題並改進了回應性
- **修復面板捲動**: 確保工具管理面板中的正確捲動功能
- **修復 IPC 通訊**: 解決了前端和後端之間的各種 IPC 通訊問題

#### 🏗️ 技術改進
- **簡化架構**: 移除了多重配置的複雜性，專注於單一配置管理
- **更好的型別安全**: 增強了 TypeScript 型別定義和介面
- **改進資料同步**: 前端 UI 狀態和後端工具管理器之間更好的同步
- **增強除錯**: 加入了全面的日誌記錄和除錯功能

#### 📊 統計資訊
- **工具總數**: 從 151 個增加到 158 個工具
- **類別**: 13 個工具類別，全面涵蓋
- **編輯器控制**: 實現 98% 的編輯器功能覆蓋

### v1.2.0 - 之前版本
- 初始發布，包含 151 個工具
- 基本 MCP 伺服器功能
- 場景、節點、元件和預製體操作
- 專案控制和除錯工具



## 快速使用

**Claude cli 配置：**

```
claude mcp add --transport http cocos-creator http://127.0.0.1:3000/mcp（使用你自己配置的連接埠號）
```

**Claude 客戶端配置：**

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

**Cursor 或 VS 類 MCP 配置**

```
{

  "mcpServers": { 

   "cocos-creator": {
      "url": "http://localhost:3000/mcp"
   }
  }

}
```

## 功能特性

### 🎯 場景操作 (scene_*)
- **scene_management**: 場景管理 - 取得目前場景、開啟/儲存/建立/關閉場景，支援場景清單查詢
- **scene_hierarchy**: 場景層級 - 取得完整場景結構，支援元件資訊包含
- **scene_execution_control**: 執行控制 - 執行元件方法、場景腳本、預製體同步

### 🎮 節點操作 (node_*)
- **node_query**: 節點查詢 - 按名稱/模式查找節點，取得節點資訊，偵測 2D/3D 類型
- **node_lifecycle**: 節點生命週期 - 建立/刪除節點，支援元件預裝、預製體實體化
- **node_transform**: 節點變換 - 修改節點名稱、位置、旋轉、縮放、可見性等屬性
- **node_hierarchy**: 節點層級 - 移動、複製、貼上節點，支援層級結構操作
- **node_clipboard**: 節點剪貼簿 - 複製/貼上/剪下節點操作
- **node_property_management**: 屬性管理 - 重設節點屬性、元件屬性、變換屬性

### 🔧 元件操作 (component_*)
- **component_manage**: 元件管理 - 新增/刪除引擎元件（cc.Sprite、cc.Button 等）
- **component_script**: 腳本元件 - 掛載/移除自訂腳本元件
- **component_query**: 元件查詢 - 取得元件清單、詳細資訊、可用元件類型
- **set_component_property**: 屬性設定 - 設定單一或多個元件屬性值

### 📦 預製體操作 (prefab_*)
- **prefab_browse**: 預製體瀏覽 - 列出預製體、檢視資訊、驗證檔案
- **prefab_lifecycle**: 預製體生命週期 - 從節點建立預製體、刪除預製體
- **prefab_instance**: 預製體實例 - 實體化到場景、解除連結、套用變更、還原原始
- **prefab_edit**: 預製體編輯 - 進入/退出編輯模式、儲存預製體、測試變更

### 🚀 專案控制 (project_*)
- **project_manage**: 專案管理 - 執行專案、建置專案、取得專案資訊和設定
- **project_build_system**: 建置系統 - 控制建置面板、檢查建置狀態、預覽伺服器管理

### 🔍 除錯工具 (debug_*)
- **debug_console**: 主控台管理 - 取得/清空主控台日誌，支援篩選和限制
- **debug_logs**: 日誌分析 - 讀取/搜尋/分析專案日誌檔案，支援模式比對
- **debug_system**: 系統除錯 - 取得編輯器資訊、效能統計、環境資訊

### 📁 資源管理 (asset_*)
- **asset_manage**: 資源管理 - 批次匯入/刪除資源、儲存中繼資料、產生 URL
- **asset_analyze**: 資源分析 - 取得相依關係、匯出資源清單
- **asset_system**: 資源系統 - 重新整理資源、查詢資源資料庫狀態
- **asset_query**: 資源查詢 - 按類型/資料夾查詢資源、取得詳細資訊
- **asset_operations**: 資源操作 - 建立/複製/移動/刪除/儲存/重新匯入資源

### ⚙️ 偏好設定 (preferences_*)
- **preferences_manage**: 偏好管理 - 取得/設定編輯器偏好設定
- **preferences_global**: 全域設定 - 管理全域配置和系統設定

### 🌐 伺服器與廣播 (server_* / broadcast_*)
- **server_info**: 伺服器資訊 - 取得伺服器狀態、專案詳情、環境資訊
- **broadcast_message**: 訊息廣播 - 監聽和廣播自訂訊息

### 🖼️ 參考圖片 (referenceImage_*)
- **reference_image_manage**: 參考圖片管理 - 新增/刪除/管理場景視圖中的參考圖片
- **reference_image_view**: 參考圖片視圖 - 控制參考圖片的顯示和編輯

### 🎨 場景視圖 (sceneView_*)
- **scene_view_control**: 場景視圖控制 - 控制 Gizmo 工具、座標系、視圖模式
- **scene_view_tools**: 場景視圖工具 - 管理場景視圖的各種工具和選項

### ✅ 驗證工具 (validation_*)
- **validation_scene**: 場景驗證 - 驗證場景完整性、檢查缺失資源
- **validation_asset**: 資源驗證 - 驗證資源引用、檢查資源完整性

### 🛠️ 工具管理
- **工具配置系統**: 選擇性啟用/停用工具，支援多套配置
- **配置持久化**: 自動儲存和載入工具配置
- **配置匯入匯出**: 支援工具配置的匯入匯出功能
- **即時狀態管理**: 工具狀態即時更新和同步

### 🚀 核心優勢
- **操作碼統一**: 所有工具採用「類別_操作」命名，參數 Schema 統一
- **高複用性**: 50 個核心工具涵蓋 99% 編輯器功能
- **AI 友善**: 參數清晰、文件完善、呼叫簡單
- **效能優化**: 降低 50% Token 消耗，提升 AI 呼叫成功率
- **完全相容**: 與 Cocos Creator 官方 API 100% 對齊

## ⚠️ 安裝前必讀（重要）

> **首次安裝或升級前，請務必刪除目前專案 `settings/` 目錄下的 `mcp-server.json` 和 `tool-manager.json` 兩個檔案，否則外掛的工具清單顯示會出現異常！**
>
> 檔案路徑：`你的專案/settings/mcp-server.json` 與 `你的專案/settings/tool-manager.json`
> 刪除這兩個檔案後，重新開啟外掛面板即可恢復正常。

## 安裝說明

### 1. 複製外掛檔案

將整個 `cocos-mcp-server` 資料夾複製到您的 Cocos Creator 專案的 `extensions` 目錄中，您也可以直接在擴充功能管理器中匯入專案：

```
你的專案/
├── assets/
├── extensions/
│   └── cocos-mcp-server/          <- 將外掛放在這裡
│       ├── source/
│       ├── dist/
│       ├── package.json
│       └── ...
├── settings/
└── ...
```

### 2. 安裝相依套件

```bash
cd extensions/cocos-mcp-server
npm install
```

### 3. 建置外掛

```bash
npm run build
```

### 4. 啟用外掛

1. 重新啟動 Cocos Creator 或重新整理擴充功能
2. 外掛將出現在擴充功能選單中
3. 點擊 `擴充功能 > Cocos MCP Server` 開啟控制面板

## 使用方法

### 啟動伺服器

1. 從 `擴充功能 > Cocos MCP Server` 開啟 MCP 伺服器面板
2. 配置設定：
   - **連接埠**: HTTP 伺服器連接埠（預設：3000）
   - **自動啟動**: 編輯器啟動時自動啟動伺服器
   - **除錯日誌**: 啟用詳細日誌以便開發除錯
   - **最大連線數**: 允許的最大並行連線數

3. 點擊「啟動伺服器」開始接受連線

### 連接 AI 助手

伺服器在 `http://localhost:3000/mcp`（或您配置的連接埠）上提供 HTTP 端點。

AI 助手可以使用 MCP 協議連接並存取所有可用工具。


## 開發

### 專案結構
```
cocos-mcp-server/
├── source/                    # TypeScript 原始檔
│   ├── main.ts               # 外掛進入點
│   ├── mcp-server.ts         # MCP 伺服器實作
│   ├── settings.ts           # 設定管理
│   ├── types/                # TypeScript 型別定義
│   ├── tools/                # 工具實作
│   │   ├── scene-tools.ts
│   │   ├── node-tools.ts
│   │   ├── component-tools.ts
│   │   ├── prefab-tools.ts
│   │   ├── project-tools.ts
│   │   ├── debug-tools.ts
│   │   ├── preferences-tools.ts
│   │   ├── server-tools.ts
│   │   ├── broadcast-tools.ts
│   │   ├── scene-advanced-tools.ts (已整合到 node-tools.ts 和 scene-tools.ts)
│   │   ├── scene-view-tools.ts
│   │   ├── reference-image-tools.ts
│   │   └── asset-advanced-tools.ts
│   ├── panels/               # UI 面板實作
│   └── test/                 # 測試檔案
├── dist/                     # 編譯後的 JavaScript 輸出
├── static/                   # 靜態資源（圖示等）
├── i18n/                     # 國際化檔案
├── package.json              # 外掛配置
└── tsconfig.json             # TypeScript 配置
```

### 從原始碼建置

```bash
# 安裝相依套件
npm install

# 開發建置（監視模式）
npm run watch

# 生產建置
npm run build
```

### 新增工具

1. 在 `source/tools/` 中建立新的工具類別
2. 實作 `ToolExecutor` 介面
3. 將工具加入 `mcp-server.ts` 初始化中
4. 工具會自動透過 MCP 協議公開

### TypeScript 支援

外掛完全使用 TypeScript 撰寫，具備：
- 啟用嚴格型別檢查
- 為所有 API 提供全面的型別定義
- 開發時的 IntelliSense 支援
- 自動編譯為 JavaScript

## 疑難排解

### 常見問題

1. **伺服器無法啟動**: 檢查連接埠可用性和防火牆設定
2. **工具無法運作**: 確保場景已載入且 UUID 有效
3. **建置錯誤**: 執行 `npm run build` 檢查 TypeScript 錯誤
4. **連線問題**: 驗證 HTTP URL 和伺服器狀態

### 除錯模式

在外掛面板中啟用除錯日誌以取得詳細的操作日誌。

### 使用除錯工具

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

## 系統需求

- Cocos Creator 3.8.6 或更高版本
- Node.js（Cocos Creator 自帶）
- TypeScript（作為開發相依套件安裝）

## 授權條款

本外掛供 Cocos Creator 專案使用，並且原始碼一併打包，可以用於學習和交流。沒有加密。可以支援您自行進行二次開發優化，任何本專案程式碼或衍生程式碼均不能用於任何商業用途、轉售，如需商用，請聯絡本人。

## 聯絡我加入群組
<img alt="image" src="https://github.com/user-attachments/assets/a276682c-4586-480c-90e5-6db132e89e0f" width="400" height="400" />
