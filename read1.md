LightW，经过对项目结构和 Zotero 8/9 变更的调研，我为你整理了两份迁移计划。

当前项目状态速览
组件	当前版本	最新版本
zotero-plugin-scaffold	0.8.0	0.8.6
zotero-plugin-toolkit	5.1.0-beta.4	5.1.2
zotero-types	4.1.0-beta.1	4.1.2
manifest.json 最大兼容版本	8.*	—
Node.js	v24.14.1	✓ 满足要求
方案 A：适配 Zotero 8
Zotero 8 的核心变化是底层 Firefox 平台升级到 140（ESM 模块替代 JSM、移除 Bluebird Promise）。你的插件因为是 Zotero 7 的 bootstrap 插件，大部分代码结构可直接沿用，但需要做以下修改：

第 1 步：更新构建工具链
升级 package.json 中的依赖

zotero-plugin-scaffold → ^0.8.6
zotero-plugin-toolkit → ^5.1.2
zotero-types → ^4.1.2
更新 manifest.json（addon/manifest.json）

strict_min_version 改为 "7.0"（或 "8.0" 如果你打算只支持 8）
strict_max_version 改为 "8.*"
第 2 步：处理 Promise API 变更
搜索并替换以下代码模式：

Zotero 7（旧）	Zotero 8（新）
Zotero.Promise.delay(ms)	保留兼容，但建议改为 new Promise(r => setTimeout(r, ms))
Zotero.Promise.map(items, fn)	Promise.all(items.map(fn))
Zotero.Promise.defer()	手动构造 { promise, resolve, reject }
你的代码中使用了 Zotero.Promise.delay(1000)（src/hooks.ts:102），这在 Zotero 8 中仍可运行，但建议检查是否有 Bluebird 专属方法。

第 3 步：检查 ESM 模块导入
如果你的代码或依赖中使用了：


ChromeUtils.import("resource://gre/modules/Services.jsm");
需要改为：


import Services from "resource://gre/modules/Services.sys.mjs";
但你的插件通过 zotero-plugin-toolkit 封装了大部分调用，通常不需要直接改。

第 4 步：验证构建与测试

npm install
npm run build
npm run test
用 Zotero 8 实际安装测试插件功能（右键菜单、对话框等）。

方案 B：适配 Zotero 9
Zotero 9 于 2026 年 4 月发布，目前文档稀缺。相比 Zotero 8，它的插件架构没有发生像 7→8 那样的底层平台巨变，主要变化是版本兼容性声明。

第 1 步：更新版本约束
在 addon/manifest.json 中：


"applications": {
  "zotero": {
    "id": "Normalize@euclpts.com",
    "strict_min_version": "8.0",
    "strict_max_version": "9.*"
  }
}
如果你想同时兼容 Zotero 8 和 9：

strict_min_version: "8.0"
strict_max_version: "9.*"
如果你只想支持 9：

strict_min_version: "9.0"
strict_max_version: "9.*"
第 2 步：跟进工具链的最新适配
Zotero 9 推出后，zotero-plugin-scaffold、zotero-plugin-toolkit、zotero-types 可能会发布新版本以修复 Zotero 9 的特定问题。建议：

关注 windingwind/zotero-plugin-toolkit 的 Release
关注 zotero-plugin.dev 社区动态
第 3 步：实际测试
目前 Zotero 9 的插件文档被开发者称为"scavenger hunt"（ scavenger hunt），官方变更说明分散。最可靠的方式是：

下载 Zotero 9 Beta
安装你的插件
观察 Tools > Developer > Error Console 中的报错
推荐执行顺序
由于你的插件当前 strict_max_version 已经是 "8.*"，说明之前已经为 Zotero 8 做了部分准备。我建议：

先升级到 Zotero 8：更新工具链依赖 → 改 manifest.json 版本 → 构建测试
再扩展到 Zotero 9：在 Zotero 8 适配完成的基础上，只需调整 strict_max_version 为 "9.*" 并在 Zotero 9 中测试
是否要我直接开始实施？
我可以按以下小任务逐步执行：

更新 package.json 依赖到最新版
更新 manifest.json 的 Zotero 8/9 版本声明
替换代码中的 Zotero.Promise.delay 等潜在不兼容调用
构建并检查 TypeScript 错误
你希望我先做哪一步？还是一次性把 Zotero 8 的适配做完？