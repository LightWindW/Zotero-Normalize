# 📚 Zotero Normalize 插件

[![zotero target version](https://img.shields.io/badge/Zotero-7-green?style=flat-square&logo=zotero&logoColor=CC2936)](https://www.zotero.org)
[![Using Zotero Plugin Template](https://img.shields.io/badge/Using-Zotero%20Plugin%20Template-blue?style=flat-square&logo=github)](https://github.com/windingwind/zotero-plugin-template)

[简体中文](README.md) | [English](doc/README-En.md)

 <img src="doc\logo.jpg" alt="Plugin Logo" style="zoom:50%;" />

一个用于批量、手动修改 Zotero 条目数据的插件，帮助用户高效整理文献元数据。

本插件旨在支持用户对Zotero条目数据进行批量手动修改，以提升文献元数据的整理效率。

该插件开发初衷主要用于弥补自动修复功能的不足以及实现自定义规范化功能。推荐先使用Linter插件[![GitHub Repo stars](https://img.shields.io/github/stars/northword/zotero-format-metadata?label=zotero-format-metadata&style=flat-square)](https://github.com/northword/zotero-format-metadata)自动规范化条目，这能解决大部分条目规范化问题。若自动修复后仍存在部分特殊情况：如所有作者位于同一行、作者姓名顺序颠倒等，此时用户可通过本插件进行手动调整。若修改作者名称过程较为复杂，用户也可以直接输入文献全部作者信息，快速实现作者姓名及其顺序的规范化。

此外，该插件支持用户根据个人偏好自定义作者姓名的显示格式（单栏或双栏），从而更好地适配不同用户的阅读习惯。

---

## 🧩 功能概览

Zotero Normalize 提供以下核心功能：

可多选条目进行批量处理，右键出现插件菜单：
<img src="doc\fig_zh.jpg" alt="Plugin Logo" style="zoom:50%;" />

### 1️⃣ 作者栏错乱修改

处理作者姓名格式混乱的问题，支持多种操作方式：

- **1.1 作者姓名拆分合并**
  - 根据文献语言（中文/英文）选择不同处理方式
  - 双栏模式：姓前名后
  - 单栏模式：
    - 中文：保持姓前名后并姓名间没有空格，符合阅读习惯
    - 英文：保持名前姓后，符合阅读习惯

- **1.2 交换作者姓名**
  - 适合作者姓和名放反的情况
  - 建议在双栏模式下使用
  - 单栏模式默认使用第一个空格分隔姓和名，中文姓名则会自动识别常见姓进行姓名分隔
- **1.3 同一行作者批量修改**
  - 当所有作者处于同一行时，自动识别并拆分
  - 需要选择同一行内作者之间的分隔符
  - 该模式双栏模式中文姓名会自动识别常见姓进行姓名分隔，英文姓名以最后一个空格分隔姓名

  <img src="doc\oneline.jpg" alt="Plugin Logo" style="zoom:50%;" />

- **1.4 删除名中的短横线**
  - 建议在双栏模式下使用
  - 单栏模式默认使用最后一个空格分隔姓和名，默认前部分是名

- **1.5 手动输入作者信息**
  - 当条目作者缺失大半时，或者上述调整不方便时可以手动输入所有作者
  - 可选择双栏或单栏模式、并根据页面提示输入作者
  - 该模式仅支持对单个条目修改
    <img src="doc\input.jpg" alt="Plugin Logo" style="zoom:50%;" />

### 2️⃣ 批量修改时间格式

将条目中的日期统一转换为 ISO 标准格式：`YYYY-MM-DD`

### 3️⃣ 批量修改文献语言

支持统一设置条目语言，也可自定义目标语言值

### 4️⃣ 批量清空 Extra 字段

清除条目中的 Extra 字段内容，便于后续添加注释或备注信息

---

## 🚀 安装方式

1. 下载 `.xpi` 插件文件
2. 打开 Zotero，点击顶部菜单栏中的 `工具` → `插件`
3. 点击右上角齿轮图标 → `从文件安装插件`
4. 选择下载的 `.xpi` 文件并安装

---

## 💡 使用建议

- 在处理作者信息时，建议先确认条目语言，以获得最佳效果
- 插件支持批量操作，但也提供手动输入功能，适合特殊条目处理
- 清空 Extra 字段前请确认是否有重要信息，避免误删

---

## 🛠️ 开发者信息

本插件基于 [Zotero Plugin Template](https://github.com/windingwind/zotero-plugin-template) 构建，支持 Zotero 7。

欢迎反馈问题或提出建议！

---
