# Changelog

## v1.26.1 (2026-05-31)

### 🐛 Bug 修复

- **并发安全**：5 个 Creator 方法补全 `await item.saveTx()`，防止事务在循环中并发提交导致数据不一致
- **数据破坏修复**：`Creator-one-line.ts` 移除从已有 creators 重建字符串再 split 的错误流程，改为直接处理用户输入
- **副作用顺序**：`Creator-input.ts` 中 `setField("language")` 统一移至 `setCreators` 之后、`saveTx` 之前

### ♻️ 重构

- **DRY 修复**：抽取中文姓氏库 `src/utils/chinese-names.ts`，4 个文件统一引用，消除重复定义和 `sort` 副作用
- **模块化拆分**：`RMenu.ts` 巨石拆为 6 个独立文件（`RMenu.ts`、`UIRMenu.ts`、`dialogInput.ts`、`dialogOneLine.ts`、`dialogLanguage.ts`、`dialogHelp.ts`）
- **Magic strings 语义化**：`separatorType` (`"one"`→`"comma"`) 和 `languageType` (`"1"`→`"surname-first"`) 使用自文档化字符串
- **消除 `as any`**：7 处属性级 `as any` 移除，仅保留 2 处 `setCreators` 调用（zotero-types 限制）

### ✨ 新增

- **多语言支持**：所有弹窗 UI 文本全面本地化，支持中文/英文自动切换（29 个 FTL 键）
- **Date-ISO 改进**：新增 `YYYY/MM/DD` 和 `YYYYMMDD` 显式格式解析；ISO 格式直接跳过避免无意义更新；`skipCount` 统计无效日期
- **ProgressWindow 优化**：启动时不再弹出"插件已就绪"提示，保持安静启动

### 🧹 清理

- 删除废弃文件 `examples.ts`、`prefs.ts`、`window.ts`
- 清理 `hooks.ts` 中注释代码和启动 ProgressWindow
- `Creator-hyphen.ts` 添加行为注释（姓中连字符不删除）
- 移除无用的 `Zotero.alert` 调用（`Creator-input.ts`、`Creator-one-line.ts`）

### 🏗️ 技术变更

- Zotero 8/9 适配：`Zotero.Promise.delay` → 原生 `Promise`，`ztoolkit.Menu` → `Zotero.MenuManager`
- Creator 类型：`Zotero.Creator` → `_ZoteroTypes.Item.Creator`
- 依赖版本：`zotero-plugin-scaffold` 0.8.6、`zotero-plugin-toolkit` 5.1.2、`zotero-types` 4.1.2

---

## v1.25.0 (2025-08-31)

- 初始 Zotero 8 适配版本
