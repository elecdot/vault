# AGENTS.zh.md（Obsidian Vault）

本文件定义：当你（Agent）在本 vault 中创建/修改笔记、补充链接、设计 tags 与 Bases 时，需要遵循的长期规范与工作流。目标是让归档与连接可维护、可扩展、可被 Bases 稳定检索。

## 适用范围

- 默认对整个 vault 生效（`/mnt/p/vault`）。
- 若子目录存在更具体的 `AGENTS.md`，以更深层的规则为准。

## 可用 Skills

当任务落在以下任一领域时，Agent 在规划或编辑前应主动查找并加载对应的 skill 指令。这里的 `skills/...` 路径应被视为逻辑技能标识，而不是固定的磁盘路径；不同 agent runtime 可以自行解析到各自的技能位置。

- `skills/obsidian-markdown.md`
  用于处理 Obsidian 风格 Markdown：frontmatter、wikilinks、嵌入、callout、tags、笔记清理与重组。
  Trigger phrases: "整理这篇笔记", "add frontmatter", "fix wikilinks", "convert to Obsidian note", "清理标签和双链"
- `skills/obsidian-bases.md`
  用于处理 Obsidian Bases：`.base` 文件、视图、过滤器、公式、分组、排序与归档面板。
  Trigger phrases: "create a base", "设计一个 Bases 视图", "show inbox notes", "build a projects table", "做一个按状态分组的视图"
- `skills/obsidian-cli.md`
  用于 vault 自动化与运维类任务：搜索笔记、批量检查、属性查询、脚本化维护与 CLI 驱动工作流。
  Trigger phrases: "scan the vault", "批量检查这些笔记", "find notes missing type", "run Obsidian CLI", "统计一下这个 vault"
- `skills/json-canvas.md`
  用于处理 Canvas：创建或编辑 `.canvas` 文件、可视化节点/边布局、概念图与关系图。
  Trigger phrases: "make a canvas", "创建一张关系图", "edit this .canvas", "build a mind map", "连一下这些节点"

如果用户请求很短、信息不足，Agent 也应当根据任务语言主动推断相关 skill。示例："整理 `obsidian-vault-git.md`，放入我的 vault 中" 应优先触发 `skills/obsidian-markdown.md`，然后再结合本文件中的 vault 规则决定放置位置、元数据与链接方式。

## 总目标（长期可维护）

本 vault 采用 Zettelkasten 系统方式设计和管理笔记系统，做到：
- **原子化**：一个笔记只表达一个想法 / 一个概念，不混合多个主题。
- **可检索**：任何笔记都能通过 `tags + properties + Bases` 被稳定找到，任何相关笔记都能通过链接导航（MOC），而不依赖文件夹路径。
- **可演进**：vault 所使用的管理方法（例如，分类法（taxonomy））允许逐步扩展，不会频繁重构已有 tags。
- **低噪音**：避免过度打 tag/过度互链；应当做到逻辑清晰，以“能支持检索与导航”为准。
- **可自动化**：尽量用结构化属性（frontmatter）承载可计算/可过滤信息，便于 Bases 视图与后续脚本批处理。

## 安全与变更原则（Agent 必须遵守）

- **先扫描再改动**：涉及批量修改（例如大量补 frontmatter/tags/链接）前，先输出“变更计划 + 影响范围 + 示例”并等待确认。
- **最小改动**：不重写正文措辞，不做风格统一化“洗稿”；只补充结构化元数据与必要链接。
- **不做破坏性重构**：未经明确授权，不批量重命名文件、不移动目录、不删除内容。
- **可逆性**：优先用追加属性/追加链接的方式；避免不可恢复的替换。

## Vault 的文件结构（逐步完善）

本 vault 采取 PARA 策略管理文件，基本文件结构为：

```vault
inbox/        # 捕捉临时的 idea/信息
projects/     # P：正在完成、有时间限制的项目
areas/        # A：长期负责的领域（无明确截止时间），用于维护标准/清单/复盘等
knowledge/    # 整理后的“永久笔记”（由 PARA 文件夹抽象总结而来），形成用于检索的知识库
resources/    # R：存放没有项目或成体系内容依托的外部资源摘录
archive/      # Archive：存放不再维护/已结束的内容（含项目归档）
daily/        # 日记专区，记录每日总结（主题/想法/未完成事项）
bases/        # 使用 Bases 进行笔记二次组织管理
templates/    # 模板文件夹
```

> 决策（v1）：**不对顶层目录名添加数字前缀**。原因：本 vault 以 `内链 + Bases` 为主导航；目录名保持语义清晰，避免后续在 Bases 过滤条件与文档路径示例中引入额外维护成本。
> 注意：若采用带编号名称，同步更改 Bases 中的 `file.inFolder(...)`

## 文件与命名约定

- **文件名**：应当使用可读小写英文单词，若必要可以加上关键词作区分（例如： `topic-keyword`）；使用`-`连接符。避免过长、避免含空格或特殊字符（尤其是 `:`、`#`、`[]`）；避免文件夹结构下冗余命名（例如 `obsidian/obsidian-bases`）。
- **日期型**：如果需要使用日期，统一 `YYYY-MM-DD`（例如 `2026-03-05`）。
- **附件**：附件应按照 Obsidian 设置中的策略，收纳至被引用笔记的同目录附件文件夹（`attachments/`），避免散落；笔记中使用 `![[...]]` 引用。

### 顺序编号（可选，不默认启用）

有些用户会在文件/文件夹名前加数字前缀（例如 `01-...`）以获得文件系统中的固定排序。对于本 vault（以 `内链 + Bases` 为主导航）：

- **默认不对普通笔记文件名启用数字前缀**：避免在 `[[wikilink]]`、Bases 的 `file.name/file.basename` 展示中引入噪音与维护成本。
- **如确实需要“线性顺序”**（课程、书籍章节、系列清单、固定流程文档等），可以对该“小范围系列”启用数字前缀：
  - 推荐使用固定宽度（例如两位）前缀：`01-...`、`02-...`、`10-...`，便于排序与插入。
  - 推荐在 frontmatter 中为读者与链接提供不带编号的名称（使用 `aliases` 字段），并在正文中用显示名链接（例如 `[[01-foo|foo]]`）。
  - Bases 视图中优先展示 `title`（或自定义显示字段），避免把编号当作主要信息。

## 笔记最小结构（推荐）

### Frontmatter（结构化属性）

除非确有需要，否则保持属性集合精简稳定；优先用 properties 而不是大量 tags 承载可过滤字段。

推荐的“最小属性集”（可按需使用，不强制每条都有）：

```yaml
---
title: ""
tags: []
type: ""        # note / concept / project / meeting / person / source / diary 等
status: ""      # fleeting / active / paused / done / archived 等（如需要）
area: ""        # 领域/责任区（可选）
project: ""     # 关联项目（可选，建议为链接或字符串一致）
source: ""      # 来源（书/文章/视频/对话等，可选）
aliases: []     # 笔记别名：用于更友好的显示名/可被搜索命中（可选）
---
```

规则：

- `type/status/area/project/source` 等属性用于**结构化分类与过滤**（给 Bases 或搜索用）。
- `tags` 用于**关键词/主题**（例如：`openai`、`agent`、`coding`），便于搜索与联想；尽量避免把“结构化分类”也写进 tags，减少冗余维护成本。
- 字符串含特殊字符时务必加引号，保证 YAML 合法。
- 不维护 created/updated 属性，统一用 file.ctime/file.mtime 做事实来源；为方便读者查看，只在末尾加入如下模块用于展示，不入库。
  - Meta 展示推荐使用 `Dataview` 插件读取 `file.ctime/file.mtime`；如未安装 Dataview，则省略整个 Meta 区块或改为手写时间。
```markdown
# 写在笔记尾部，不作为 properties，只给读者看
>[!info] Meta
> created: `= dateformat(this.file.ctime, "yyyy-MM-dd")`
> updated: `= dateformat(this.file.mtime, "yyyy-MM-dd HH:mm")`
```

字段约定（v1）：

- `type`：作为“主类型”用于 Bases 过滤；允许后续演进扩展，但对同一笔记不要频繁改动。
- `status`：可选；只在需要管理流程时启用（例如项目的 active/paused/done）。
- `area` / `project`：推荐填写为链接（例如 `[[areas/xxx]]`、`[[projects/yyy]]`），让结构化属性也能参与图谱连接。
- `source`：推荐填写为链接或 URL（例如 `[[resources/xxx]]` 或 `"https://..."`）。

### 正文（连接优先）

- 首段尽量回答“这是什么/为什么有用/和哪些笔记相关”。
- 相关笔记用 `[[wikilink]]`；只有外链才用标准 Markdown 链接。
- 特别的，笔记中应该为满足“原子性”的关键词（尤其是需要解释的名词等）也添加上相关笔记使用的 `[[wikilink]]`，即使它们尚未并创建。
- 相同类型（type）的笔记应当使用相同模板（在`templates/`文件夹下）进行构建，避免缺失内容同时提高可读性。（*模板库仍在建设中*）。

### 模板（v1）

- 模板全部放入 `templates/` 文件夹中
- 用 type 的逻辑结构组织模板，例如：`templates/project/course.md`、`templates/project/paper.md`；每个 type 至少对应一个（可以拥有多个）模板；创建该类型笔记时优先从模板创建
- 创建笔记时如果没有合适的模板，优先考虑抽象出一种模板。

## Tags 使用原则（关键词优先）

目标：少而稳、可复用、便于长期检索与联想；把“结构化分类”留给 properties。

约定：

- tags 只表达“这条笔记在讲什么”（关键词/主题），例如：`openai`、`agent`、`coding`、`zettelkasten`。
- tags 推荐统一为小写 + kebab-case（例如 `project-management`），减少同义/大小写重复。
- 避免同义/近义重复；宁可少而常用，不要多而稀有。
- 一个笔记的 tags 通常 **1–5 个**为宜；超过请考虑改用属性（例如 `area/project/source`）或改用链接（`[[相关概念]]`）。

示例：

- `tags: [openai, agent, coding]`
- `tags: [writing, zettelkasten]`
- `tags: [project-management, roadmap]`

## 链接（连接）规范

- **语义链接优先**：尽量不要孤立放置单独的链接，保证笔记逻辑的有效和连贯性，在“需要跳转了解”的位置自然放置链接。例如在“taking-note”中：`you can use [[zettelkasten]] system to organize your notes`。
- **高置信度才互链**：只有当两条笔记确实存在可复用关系时才加链接。
- **待归档关键词链接**：当笔记中存在需要解释，或满足原子性，可以被归档的关键词时，使用 `[[keyword]]` 进行链接，即使目标笔记并不存在。
  - 请在设计时严格考虑 keyword 的关联程度和解释重要性，避免产生大量红链
- **链接优先级**：
  1. 同一概念的定义页（概念笔记）
  2. 上位/下位关系（父主题/子主题）
  3. 笔记内容存在逻辑关联
  4. 项目页（project hub）到相关产出/会议/决策
- **Hub/索引笔记（MOC结构化）**：当某个主题超过 ~7 条相关笔记时，考虑创建一个 hub（索引）笔记承载导航，按照一定逻辑组织为 `MOC` 而不是在每条笔记里互链爆炸。
- 允许在必要时在笔记内维护一个小的“相关”区块（例如 `## Related`），但保持短列表高可读。

## Bases（归档视图）规范

### 文件组织

- 建议集中放在 `bases/`（或你现有的统一目录），命名清晰可读，例如：
  - `bases/inbox.base`
  - `bases/projects.base`
  - `bases/orphans.base`

### 设计原则

- 每个 `.base` 先写清楚 scope：主要靠 `filters`（tag / folder / property）定义。
- `views` 以少而常用为准：通常 1–3 个视图（table/list/cards），table 优先。
- 公式（`formulas`）只放“通用且可复用”的计算字段；复杂逻辑宁可拆多个公式。
- 注意 YAML 引号规则；任何包含特殊字符的字符串都要加引号。

### 推荐的长期维护视图（可逐步落地）

- **inbox / 待整理**：缺少 `type` 或缺少核心属性、近期新建但未归类的笔记。
- **missing / 未创建链接**：列举全部拥有“未创建链接”的笔记（以及该链接）；常用公式参考 `.agents/skills/obsidian-bases/references/COMMON_FORMULAS.md`。
- **orphans / 孤儿**：无出链/无入链（或链接很少）的笔记，用于补连接。
- **projects / 项目总览**：`type=project`，按 `status` 分组。
- **recently-updated / 最近更新**：按 `file.mtime` 排序，作为“回顾入口”。

## 整理完成标准（DoD）

一条笔记从 inbox/临时状态进入“可长期维护”的最低标准：

- `type` 已填写（允许类型集合后续演进补齐）。
- `tags` 不超过 5 个，且能表达关键词主题。
- 至少有 1 个语义链接（`[[...]]`）或已被某个 MOC/Hub 收录。
- 若出现大量红链，优先在 Missing 视图中分批处理，避免长期积累失控。

## 维护例行（建议）

- 每周：清空 Inbox（补 `type/tags`、补 1–3 个关键链接）；参考 Missing 挑选需要的笔记进行补齐，避免 Missing 爆炸。
- 每月：处理 Orphans（为重要笔记补 hub、合并重复概念、清理同义 tag）。

## Agent 工作流（建议）

当用户说“完善归档与连接”时，按以下顺序执行：

1) **扫描现状**：统计现有 tags、常见属性、目录结构、孤儿/高频词（只汇总，不先动手大改）。
2) **提出 taxonomy 草案**：给出核心 properties（例如 `type/status/area/project/source`）与“关键词 tags”的建议清单；如用户明确需要，再补充命名空间 tags 方案。
3) **设计 2–5 个关键 Bases**：给出 `.base` 的 filters/views/关键公式草案。
4) **小批量试点**：先对一个领域或 20–50 条笔记应用规则并复核。
5) **再扩展**：在用户确认后进行批量应用与持续维护。

---

备注：当你需要创建/编辑 `.base` 文件时参考 vault 内的 `obsidian-bases` Skill；当你需要编辑普通笔记时参考 `obsidian-markdown` Skill；当你需要批量统计/管理/操作笔记，或利用 Obsidian 内置功能时，参考 `obsidian-cli` Skill。
