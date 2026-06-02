# Zotero-Normalize 项目进度

## 2026-04-23: Zotero 8 适配完成

- [x] 更新 package.json 依赖：zotero-plugin-scaffold 0.8.0→0.8.6，zotero-plugin-toolkit 5.1.0-beta.4→5.1.2，zotero-types 4.1.0-beta.1→4.1.2
- [x] 更新 addon/manifest.json：strict_min_version 6.999→7.0，strict_max_version 保持 8.*
- [x] 替换 Zotero.Promise.delay 为原生 Promise（src/hooks.ts, src/modules/examples.ts）
- [x] tsconfig.json 排除废弃的 src/modules/examples.ts 编译
- [x] 修复 Creator 类型：Zotero.Creator → _ZoteroTypes.Item.Creator，补全缺失的 firstName 字段
- [x] 修复 Extra-clean.ts 中 itemsView.refreshAndMaintainSelection 类型错误
- [x] 重写 RMenu.ts：ztoolkit.Menu.register → Zotero.MenuManager.registerMenu（Zotero 8 新 API）
- [x] hooks.ts 添加 MenuManager 菜单注销逻辑
- [x] npm run build 通过，无 TypeScript 错误

## 2026-04-23: Zotero 9 适配

- [x] 诊断问题：manifest.json strict_max_version "8.*" 导致 Zotero 9 拒绝加载
- [x] 更新 addon/manifest.json：strict_min_version 7.0→8.0，strict_max_version 8.*→9.*
- [x] npm run build 通过

## 2026-05-07: 修复 P1 High 问题（跳过 P1-5）

### P1-1：抽取中文姓氏库（去重 + DRY 修复）
- [x] 新建 `src/utils/chinese-names.ts`，导出 `SINGLE_SURNAMES`、`COMPOUND_SURNAMES`、`ALL_SURNAMES`、`SORTED_SURNAMES_DESC`
- [x] 删除异体字「锺离」，保留简体「钟离」
- [x] 删除重复「章」（Creator-name-switch.ts / Creator-one-line.ts 各一处）
- [x] 修复 `sort` 副作用：`SORTED_SURNAMES_DESC` 在模块加载时预排序，不再每次调用重新 sort
- [x] 重构 4 个文件：
  - `Creator-name-separate-zh.ts`：`compoundSurnames` → `COMPOUND_SURNAMES`
  - `Creator-input.ts`：`compoundSurnames` → `COMPOUND_SURNAMES`
  - `Creator-name-switch.ts`：`chineseSurnames` + sort → `ALL_SURNAMES` / `SORTED_SURNAMES_DESC`
  - `Creator-one-line.ts`：`chineseSurnames` + sort → `SORTED_SURNAMES_DESC`

### P1-2：拆分 RMenu.ts 巨石 → `src/modules/Rmenu/` 目录（6 文件）
- [x] `RMenu.ts` — 装饰器
- [x] `UIRMenu.ts` — 菜单注册，内部 dialog 调用改为直接函数调用
- [x] `dialogInput.ts` — 手动输入作者对话框
- [x] `dialogOneLine.ts` — 单行作者对话框
- [x] `dialogLanguage.ts` — 语言选择对话框
- [x] `dialogHelp.ts` — 帮助说明对话框
- [x] 更新 `src/hooks.ts` import 路径，`InputFactory` 类移除，不保留薄包装
- [x] 删除原 `src/modules/RMenu.ts`

### P1-3：空指针 + 合并对齐
- [x] `Creator-name-merge-en.ts`：加 `fieldMode === 1` 防御性保留分支；`creator.lastName` 加 `?? ""`
- [x] `Creator-name-merge-zh.ts`：同上防御性分支；简化合并逻辑

### P1-4：Date-ISO 改进（保留美式日期解析）
- [x] 增加显式格式：`YYYY/MM/DD`、`YYYYMMDD`
- [x] ISO 格式（`YYYY-MM-DD`）直接跳过，避免无意义更新
- [x] `skipCount` 统计无效日期
- [x] 循环结束后 `ProgressWindow` 显示：已更新 / 无日期 / 跳过

### 弹窗中英文自动切换（2026-05-09）n- [x] 在 `addon/locale/en-US/addon.ftl` 和 `zh-CN/addon.ftl` 中新增 22 个弹窗本地化键
- [x] 重构 `dialogInput.ts` — 导入 `getString`，替换 14 处硬编码中文
- [x] 重构 `dialogOneLine.ts` — 导入 `getString`，替换 13 处硬编码中文
- [x] `typings/i10n.d.ts` 由 `zotero-plugin-scaffold` 自动生成，包含全部新键
- [x] `npm run build` 通过（0.588s，无 TS 错误）
- [x] **dialogHelp.ts** — 新增 4 个 FTL 键（`dialog-help-title` / `dialog-help-heading` / `dialog-help-content` / `dialog-close`），替换全部硬编码中文，build 通过（0.164s）

### P2 修复（2026-05-08）
- [x] **D1** 清理模板代码：删除 hooks.ts 被注释代码（24+ 行）、删除 `examples.ts`、`prefs.ts`、`window.ts`
- [x] **D2** Creator-hyphen.ts 加注释说明（姓中连字符不删除）；Extra-clean.ts 移除 `refreshAndMaintainSelection`（Zotero 8/9 已不存在）
- [x] **D3** Magic strings 语义化：
  - `separatorType`: `"one"/"two"/"three"/"four"` → `"comma"/"semicolon"/"comma-fullwidth"/"semicolon-fullwidth"`（dialogOneLine.ts + Creator-one-line.ts）
  - `languageType`: `"1"/"2"` → `"surname-first"/"given-first"`（dialogInput.ts + Creator-input.ts）
- [x] **D4** 消除 `as any`：7 处属性级 `creatorType: "author" as any` → `creatorType: "author"`，`as any` 集中到 2 处 `setCreators` 调用（因 zotero-types `CreatorJSON` 缺 `fieldMode` 字段，无法完全消除）

### 验证
- [x] `npm run build` 通过，无 TypeScript 错误（0.166s）

## 2026-05-31: 移除启动时 ProgressWindow 提示

- [x] 删除 `src/hooks.ts` 中 `onMainWindowLoad` 的 ProgressWindow 弹窗逻辑（第39-58行）
- [x] 删除 `addon/locale/zh-CN/addon.ftl` 中的 `startup-begin` / `startup-finish` 键
- [x] 删除 `addon/locale/en-US/addon.ftl` 中的 `startup-begin` / `startup-finish` 键
- [x] `typings/i10n.d.ts` 为自动生成文件，未手动修改，下次 build 会自动同步
- [x] `npm run build` 通过（0.652s，无 TS 错误）

## 待验证

- [ ] Zotero 9 实际安装测试（右键菜单、对话框等功能）

## 2026-05-06: 全代码库审查

- [x] 使用 code-review-expert 审查 17 个 TS 源文件 + 配置（约 2900 行）
- [x] 输出 22 项问题（P0:3 / P1:7 / P2:8 / P3:4），写入 `Claude-review.md`
- [x] `Claude-review.md` 已加入 `.gitignore`，仅本地保留

## 2026-05-07: 修复 P0 Critical 问题

### 任务 B：补 `await saveTx()`（5 个文件，并发安全）
- [x] `Creator-name-merge-zh.ts`：`function` → `async function`，`item.saveTx()` → `await item.saveTx()`
- [x] `Creator-name-merge-en.ts`：同上
- [x] `Creator-name-separate-zh.ts`：同上
- [x] `Creator-name-separate-en.ts`：同上
- [x] `Creator-name-switch.ts`：同上

### 任务 C：调整 `Creator-input.ts` 副作用顺序
- [x] 把 `setField("language", ...)` 从两个判断分支移除，统一在 `setCreators` 之后、`saveTx` 之前写入

### 任务 A：修复 `Creator-one-line.ts` 数据破坏 BUG
- [x] 删除从 existingCreators 重建字符串再 split 的错误流程（含 join→split 同符号陷阱）
- [x] 改为直接 `inputValue.split(separator)` 处理用户输入
- [x] 增加空输入 / 无有效作者两道前置校验，给用户明确提示
- [x] inputValue 校验和 authorParts 拆分提到循环外，避免重复计算

### 验证
- [x] `npm run build` 通过，无 TypeScript 错误（0.567s）
