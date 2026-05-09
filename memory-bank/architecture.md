# Zotero-Normalize 项目架构

## 项目概述

Zotero-Normalize 是一个 Zotero 插件（bootstrap 架构），用于批量规范化文献条目的元数据格式。当前版本 1.26.1，已适配 Zotero 8/9。

## 文件结构

### 入口与核心

- **src/index.ts** — 插件入口。实例化 Addon 类，挂载到全局 `Zotero` 对象，注册 `ztoolkit` 全局变量。
- **src/addon.ts** — Addon 类定义。管理插件生命周期状态（alive、initialized）、配置数据、ztoolkit 实例。
- **src/hooks.ts** — 生命周期钩子。`onStartup`、`onMainWindowLoad`、`onMainWindowUnload`、`onShutdown`、`onPrefsEvent`。在 `onMainWindowLoad` 中注册右键菜单，在 `onShutdown` 中注销 MenuManager 菜单。

### 右键菜单（RMenu）

按 CLAUDE.md「一个功能一个文件」拆分到 `src/modules/Rmenu/` 目录：

- **RMenu.ts** — `RMenu` 装饰器，为菜单注册和 dialog 函数提供统一的 try/catch 包装。
- **UIRMenu.ts** — 右键菜单注册。`registerRightClickMenuPopup()` 使用 `Zotero.MenuManager.registerMenu()`（Zotero 8 原生 API），包含作者姓名处理、日期格式化、语言修改、Extra 清空等功能。
- **dialogInput.ts** — 「手动输入作者」对话框（单/双栏 + 姓名顺序选择）。
- **dialogOneLine.ts** — 「所有作者在一行修改」对话框（分隔符 + 单/双栏选择）。
- **dialogLanguage.ts** — 「批量修改语言」对话框（zh / en / 自定义）。
- **dialogHelp.ts** — 「使用说明」对话框。

### 功能方法（methods）

每个文件对应右键菜单中的一个功能：

- **Creator-name-merge-zh.ts** — 中文姓名合并（双栏→单栏）
- **Creator-name-merge-en.ts** — 英文姓名合并（双栏→单栏，名+姓格式）
- **Creator-name-separate-zh.ts** — 中文姓名拆分（单栏→双栏）
- **Creator-name-separate-en.ts** — 英文姓名拆分（单栏→双栏，按空格分隔）
- **Creator-name-switch.ts** — 交换作者姓名的前后位置
- **Creator-one-line.ts** — 处理单行输入的多作者字符串
- **Creator-hyphen.ts** — 删除作者名中的短横线
- **Creator-input.ts** — 手动输入所有作者
- **Date-ISO.ts** — 将日期格式化为 YYYY-MM-DD
- **Extra-clean.ts** — 清空条目的 Extra 字段
- **Language-input.ts** — 批量修改文献语言字段

### 工具模块

- **src/utils/locale.ts** — 本地化字符串工具
- **src/utils/ztoolkit.ts** — ztoolkit 创建与配置
- **src/utils/chinese-names.ts** — 中文姓氏数据集（单姓 + 复姓），供 `Creator-name-*` 方法统一 import，避免 DRY 违规
- **src/modules/preferenceScript.ts** — 首选项面板脚本

### 废弃文件

- **src/modules/examples.ts** — 旧版示例代码（已被注释掉，不在编译范围内）

## Zotero 8 适配关键变更

1. **菜单注册**：从 `ztoolkit.Menu.register()`（toolkit 5.1.0-beta.4 已移除）迁移到 `Zotero.MenuManager.registerMenu()`（Zotero 8 原生插件 API）。菜单标签通过 `onShowing` 回调中的 `context.menuElem.setAttribute("label", ...)` 动态设置。
2. **Promise**：`Zotero.Promise.delay()` 替换为原生 `new Promise(r => setTimeout(r, ms))`。
3. **Creator 类型**：`Zotero.Creator` 在新版 zotero-types 中不存在，统一使用 `_ZoteroTypes.Item.Creator`。`setCreators` 要求 `firstName` 字段必须存在。
4. **依赖版本**：zotero-plugin-scaffold 0.8.6、zotero-plugin-toolkit 5.1.2、zotero-types 4.1.2。

## 异步与事务约定（2026-05-07 更新）

所有修改 Zotero 条目的 method 函数都必须遵循：

- 函数签名声明为 `export async function`
- `item.saveTx()` 必须 `await`，避免多个事务在循环中并发提交
- 仅修改内存的 `item.setField` / `item.setCreators` 调用应集中放在同一个 `saveTx` 之前，保证一次事务原子写入
- `Creator-one-line.ts` 的"一行修改"语义为：直接处理用户输入的 `inputValue`，不从已有 creators 重建字符串
