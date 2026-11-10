# Figma 操作流程

以下示範安裝 plugin 後的實際操作。

## 一次性準備（每台電腦做一次）

```
/plugin marketplace add zheeejun/korokke-figma-plugin-
/plugin install korokke-figma@korokke-figma-plugin
```

第一次用到 Figma 時，會出現登入連結，點開授權即可。需要 Components 檔的編輯權限。

---

## 流程 A：新元件第一次放進 Figma

```
你：把 ap-ui-toggle 匯出到 figma
```

Claude 會：

1. 讀 `src/app/components/ap-ui-toggle/` 的 html / ts / css。
2. 在 Components 檔找名為 `ap-ui-toggle` 的 page，沒有就新建。
3. 用 ap-components-lib 的元件與 palette 變數建出元件，旁邊放 390×844 預覽框。
4. 回報 page 連結、用了哪些元件庫資源、有哪些屬性。

---

## 流程 B：請 Claude 改程式碼（Figma 自動跟上）

```
你：ap-ui-tab-group 的 small 尺寸文字改成 text-xs
```

1. Claude 修改 `ap-ui-tab-group.component.html`。
2. 觸發器偵測到元件被改，提醒 Claude 同步。
3. 改完後，Claude 用 skill 第 6 節同步 Figma 一次，只改有差異的地方。
4. 你收到的回報像這樣：

> ap-ui-tab-group 已同步（[連結](https://www.figma.com/design/x0yURGG3vM0bRRVJdwTrLg/Components?node-id=18-139)）
>
> | 屬性 | 舊值 → 新值 |
> |---|---|
> | ap-ui-tab small 文字 | 14/20 → 12/16 |

你只要說要改什麼，不用另外提 Figma。

---

## 流程 C：你自己在 VS Code 改了程式碼

觸發器看不到你自己的修改，改完說一聲即可：

```
你：sync figma for ap-ui-tab-group
```

一次改了好幾個也可以：

```
你：我改了 ap-ui-tab-group 和 ap-ui-toggle，同步 figma
```

如果 Figma 本來就一致，Claude 會回報「no changes」。

---

## 流程 D：只想看差異，先不動 Figma

```
你：比對 ap-ui-tab-group 和 figma，列出差異就好，先不要改
```

看完再決定：

```
你：照這樣改
```

---

## 流程 E：修改 skill 本身

例如想讓同步規則多一條「hover 狀態一律用 zinc-700」：

1. 編輯 `skills/export-component-to-figma/SKILL.md`，或直接請 Claude 改：
   ```
   你：在 skill 第 6 節加一條：hover 背景一律用 zinc-700
   ```
2. commit 並 push。
3. 在每台電腦上執行：
   ```
   /plugin marketplace update korokke-figma-plugin
   ```

---

## 速查

| 想做的事 | 怎麼說 |
|---|---|
| 第一次匯出 | `把 ap-xxx 匯出到 figma` |
| 請 Claude 改程式碼 | 照常描述要改什麼，Figma 會自動同步 |
| 你自己改了程式碼 | `sync figma for ap-xxx` |
| 只看差異 | `比對 ap-xxx 和 figma，先不要改` |
| 改 skill 規則 | 改這個 repo，push，再 `/plugin marketplace update` |
