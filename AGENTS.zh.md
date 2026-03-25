# AGENTS.zh.md（Obsidian Vault）

本文件定义：当你（Agent）在本 vault 中创建/修改笔记、补充链接、设计 tags 与 Bases 时，需要遵循的长期规范与工作流。目标是让归档与连接可维护、可扩展、可被 Bases 稳定检索。

## 适用范围

- 默认对整个 vault 生效（`/mnt/p/vault`）。
- 若子目录存在更具体的 `AGENTS.md`，以更深层的规则为准。

## 可用 Skills

当任务落在以下任一领域时，Agent 在规划或编辑前应主动查找并加载对应的 skill 指令。这里的 `skills/...` 路径应被视为逻辑技能标识，而不是固定的磁盘路径；不同 agent runtime 可以自行解析到各自的技能位置。

- `skills/obsidian-markdown.md`
  用于处理 Obsidian 风格 Markdown：frontmatter、wikilinks、嵌入、callouts、tags、笔记清理与重组。
  触发短语包括："整理这篇笔记"、"add frontmatter"、"fix wikilinks"、"convert to Obsidian note"、"清理标签和双链"
- `skills/obsidian-bases.md`
  用于处理 Obsidian Bases：`.base` 文件、视图、过滤器、公式、分组、排序与归档面板。
  触发短语包括："create a base"、"设计一个 Bases 视图"、"show inbox notes"、"build a projects table"、"做一个按状态分组的视图"
- `skills/obsidian-cli.md`
  用于 vault 自动化与运维类任务：搜索笔记、批量检查、属性查询、脚本化维护与 CLI 驱动工作流。
  触发短语包括："scan the vault"、"批量检查这些笔记"、"find notes missing kind"、"run Obsidian CLI"、"统计一下这个 vault"
- `skills/json-canvas.md`
  用于处理 Canvas：创建或编辑 `.canvas` 文件、可视化节点/边布局、概念图与关系图。
  触发短语包括："make a canvas"、"创建一张关系图"、"edit this .canvas"、"build a mind map"、"连一下这些节点"

如果用户请求很短、信息不足，Agent 也应当根据任务语言主动推断相关 skill。示例："整理 `obsidian-vault-git.md`，放入我的 vault 中" 应优先触发 `skills/obsidian-markdown.md`，然后再结合本文件中的 vault 规则决定放置位置、元数据与链接方式。

`AGENTS.md` 是 vault 全局规则的单一来源。Skills 只补充任务级执行指引，不应重新定义这里的全局规则。

## 总目标（长期可维护）

本 vault 采用 Zettelkasten 风格的方法组织笔记：

- **原子化**：一条笔记只表达一个想法 / 一个概念，避免混合多个主题。
- **可检索**：任何笔记都能通过 `tags + properties + Bases` 被稳定找到，相关笔记也能通过链接（MOC）导航，而不依赖文件夹路径。
- **可演进**：所使用的管理方法（例如 taxonomy）可以逐步扩展，而不需要频繁重构已有 tags。
- **低噪音**：避免过度打 tag 与链接泛滥；优先保证逻辑清晰与可导航性。
- **可自动化**：尽量用结构化 frontmatter 承载可计算、可过滤的信息，以便 Bases 和后续脚本工作。

## 安全与变更原则（Agent 必须遵守）

- **先扫描再改动**：涉及批量修改（例如大量补 frontmatter/tags/链接）前，先输出“变更计划 + 影响范围 + 示例”并等待确认。
- **最小改动**：不重写正文措辞，不做风格统一化“洗稿”；只补充必要的结构化元数据与链接。
- **不做破坏性重构**：未经明确授权，不批量重命名文件、不移动目录、不删除内容。
- **可逆性优先**：优先采用追加式修改，避免不可恢复的替换。

## Vault 结构

本 vault 使用 PARA 组织文件：

```vault
inbox/        # 捕捉临时的 idea/信息
projects/     # P：正在进行且有时间限制的项目
areas/        # A：长期负责的领域（无明确截止时间）、标准、清单、复盘等
knowledge/    # 提炼后的“永久笔记”，构成可检索知识库
resources/    # 尚未挂靠到项目或体系化知识下的外部资源摘录
archive/      # 不再维护 / 已结束的内容（包括项目归档）
daily/        # 每日记录与总结（主题/想法/未完成事项）
bases/        # 使用 Obsidian Bases 做二次组织
templates/    # 模板文件夹
```

决策（v1）：**不对顶层目录名添加数字前缀**。原因：本 vault 以 `links + Bases` 为主导航；目录名保持语义清晰，可以减少后续在 Bases 过滤条件与路径示例中的维护成本。

注意：如果你仍选择使用带编号的名称，需要同步更新 Bases 里的 `file.inFolder(...)` 过滤条件。

## 文件与命名约定

- **文件名**：使用可读的小写英文单词；必要时可增加关键词区分（例如 `topic-keyword`）；使用 `-` 连接。避免过长、空格和特殊字符（尤其是 `:`、`#`、`[]`）；避免路径语义重复的命名（例如 `obsidian/obsidian-bases`）。
- **日期型命名**：如果笔记使用日期名，统一采用 `YYYY-MM-DD`（例如 `2026-03-05`）。
- **附件**：遵循 Obsidian 的附件设置；附件应保存在笔记对应的附件位置（例如 `attachments/`），不要散落。正文中使用 `![[...]]` 引用。

### 顺序编号（可选，不默认启用）

有些用户会在文件/文件夹名前加数字前缀（例如 `01-...`）以获得文件系统中的固定排序。对于本 vault（以 `links + Bases` 为主导航）：

- **默认不对普通笔记文件名启用数字前缀**：避免在 `[[wikilink]]` 与 Bases 的 `file.name/file.basename` 展示中引入噪音和维护成本。
- **如确实需要线性顺序**（课程、书籍章节、系列清单、固定流程文档等），可以只对该小范围系列启用数字前缀：
  - 推荐使用固定宽度（例如两位）前缀：`01-...`、`02-...`、`10-...`，便于排序与插入。
  - 具体到笔记显示与链接的处理方式，请参考 `obsidian-markdown`。

更详细的笔记编辑规则、链接启发式与示例，放在 `obsidian-markdown` 中。

## 笔记最小结构（推荐）

### Frontmatter（结构化属性）

保持属性集合精简且稳定。对于需要在 Bases 中过滤或分组的信息，优先使用 properties 而不是大量 tags。

推荐的最小属性集（按需使用，不要求每条都填满）：

```yaml
---
title: 
tags: []
kind:           # concept / resource / project / area / person / meeting / daily / index, etc.
format:         # note / outline / checklist / summary / reference / journal / template, etc.
status:         # fleeting / active / paused / done / archived（可选）
area:           # 领域 / 责任区（可选）
project: ""     # 相关项目（可选；推荐使用链接或保持字符串一致）
source: ""      # 来源（书 / 文章 / 视频 / 对话等；可选）
aliases: []     # 笔记别名：更友好的显示名与检索入口（可选）
---
```

规则：

- `kind/format/status/area/project/source` 用于**结构化分类与过滤**（Bases 与搜索）。
- `tags` 用于**关键词 / 主题**（例如 `openai`、`agent`、`coding`），服务于搜索与联想。避免把结构化分类也编码进 tags，减少冗余。
- 字符串包含特殊字符时要加引号，确保 YAML 合法。

字段约定（v1）：

- `kind`：作为 Bases 里的主语义分类字段。它应回答“这条笔记本质上是在服务什么对象”，并保持长期稳定。
- `format`：笔记当前采用的文档形态或工作流形态。它应回答“这条笔记现在是怎么表达的”，比 `kind` 更允许变化。
- `status`：可选；只在需要流程管理时启用（例如项目的 `active/paused/done`）。
- `area` / `project`：优先用链接（例如 `[[areas/xxx]]`、`[[projects/yyy]]`），让结构化字段也能参与图谱连接。
- `source`：优先用链接或 URL（例如 `[[resources/xxx]]` 或 `"https://..."`）。

`kind` 取值约定（v1）：

- `concept`：可复用的概念、观点、方法、结论。
- `resource`：以外部材料为主对象的笔记，例如摘录、摘要、评注、来源跟踪。
- `project`：有明确完成条件的阶段性项目。
- `area`：没有明确终点、需要持续负责的领域。
- `person`：以人物为中心的笔记。
- `meeting`：对话、会议、讨论记录。
- `daily`：按日期组织的日记、日记式流水记录、daily note。
- `index`：作为 hub、MOC、导航页的笔记。

判别规则：

- `kind` 回答：“这条笔记从根本上是为了什么对象而存在？”
- `format` 回答：“这条笔记当前采用什么表达形态？”
- 只要某个值描述的是语义角色，它就属于 `kind`。
- 只要某个值描述的是表现形式或工作流形态，它就属于 `format`。
- 不要在 `kind` 中混入不同抽象层级；例如 `summary`、`checklist` 这类描述写法的值，不应进入 `kind`。

### Meta callout

- **不要**维护 `created/updated` 这类 frontmatter 属性。统一以 `file.ctime/file.mtime` 作为事实来源。若需要给读者展示时间，可在笔记尾部加一个只读的 Meta 区块。
  - Meta 展示可以使用 `Dataview` 读取 `file.ctime/file.mtime`；如果未安装 Dataview，则省略整个区块或手写时间。

### 正文（连接优先）

- 开头应尽量回答：这是什么、为什么重要、与什么相关。
- 内部引用使用 `[[wikilink]]`；外部 URL 才使用标准 Markdown 链接。
- 对于同一 `kind` 的笔记，优先使用一致的模板（位于 `templates/`），以减少缺项并提升可读性。当同一 `kind` 下存在多个高频表达形态或稳定重复的模板模式时，再用 `format` 或描述性子目录名细分模板选择。

### 模板（v1）

- 所有模板放在 `templates/` 中。
- 模板默认按 `kind` 组织，例如 `templates/concept/`、`templates/resource/`、`templates/project/`、`templates/daily/`。
- 当同一 `kind` 下存在多个高频表达形态或稳定重复的模板模式时，再引入第二层目录，例如 `templates/<kind>/<format>/` 或其他描述性子目录。
- 不要继续加深层级，除非新的分层确实能明显提升模板检索与选择效率。
- 文件名应保持可读，并直接表达模板产出的笔记形态，例如 `summary.md`、`outline.md`、`reference.md`、`weekly-review.md`。
- 每个重要的 `kind` 或高频 `format` 至少应有一个可用模板；能套用模板时优先从模板开始。
- `workflow` 不是本 vault 的正式笔记属性或 taxonomy 轴。若 `format` 仍不足以支持模板细分，可使用描述性的模板子目录名，但这只属于模板库内部组织约定。
- 如果没有合适模板，优先考虑抽象出一个新的模板模式。

## Tags 使用原则（关键词优先）

目标：尽量少、稳定、可复用，以提升长期检索与联想；把结构化分类留给 properties。

约定：

- tags 表达“这条笔记在讲什么”（关键词/主题），例如 `openai`、`agent`、`coding`、`zettelkasten`。
- 推荐统一使用小写 + kebab-case（例如 `project-management`），减少同义/大小写重复。
- 避免近义重复；宁可少而常用，不要多而稀有。
- 单条笔记通常以 **1–5 个** tags 为宜；超过时，优先考虑改用属性（例如 `area/project/source`）或链接（`[[相关概念]]`）。

## 链接（连接）规范

- 内部链接是本 vault 中检索与连接的核心组成部分，不只是 Markdown 语法。
  - 一个预示着未来补充的空连接是被允许的。
  - 鼓励句内本身承担语义的链接，例如`here suppose to be a [[keyword]]`
- 将 `[[...]]` 视为一种低成本标记潜在语义节点的方式，而不是“现在就必须创建目标笔记”的承诺。
  - 只要一个术语有语义重量，并且未来可能成为检索点、比较点或连接点，就优先先链接。
  - 只有当它开始反复出现、需要辨析，或值得收束到一个稳定解释入口时，再将其蒸馏为 `knowledge/` 下的 durable note。
- 笔记通常应至少拥有一个有意义的语义连接（`[[...]]`），或者被收录进某个 hub / MOC。
- 更详细的链接启发式、红链策略与 hub 规则，放在 `obsidian-markdown` 中。关于 concept 链接、红链、蒸馏时机与英文术语命名的完整决策模型，见 [[areas/concept-linking-and-distillation|Concept Linking And Distillation]]。

## Bases（归档视图）规范

### 文件组织

- 将 Bases 放在 `bases/` 中，并使用清晰可读的名字，例如：
  - `bases/inbox.base`
  - `bases/projects.base`
  - `bases/orphans.base`

### 设计原则

- 先用 `filters` 明确 scope（tag / folder / property）。
- 保持视图精简：通常 1–3 个视图（table/list/cards），优先 table。
- `formulas` 中只放通用且可复用的计算；复杂逻辑宁可拆成多个公式。
- 注意 YAML 引号规则；包含特殊字符的字符串应加引号。

### 推荐的长期维护视图（可逐步落地）

- **inbox / 待整理**：缺少 `kind` 或关键属性、且近期新建但尚未归类的笔记。
- **missing / 未解析链接**：列出带有未创建 / 未解析链接的笔记（以及对应链接）。常用公式参考 `.agents/skills/obsidian-bases/references/COMMON_FORMULAS.md`。
- **orphans / 孤儿**：没有出链且没有入链（或链接很少）的笔记，用于补连接。
- **projects / 项目总览**：`kind=project`，按 `status` 分组。
- **recently-updated / 最近更新**：按 `file.mtime` 排序，作为回顾入口。

更详细的 `.base` schema、公式、语法和示例，放在 `obsidian-bases` 中。

## 整理完成标准（DoD）

一条笔记从 inbox / 草稿状态进入“可长期维护”的最低标准：

- `kind` 已填写，并符合上面的语义判别规则。
- `format` 在确实有助于检索、模板或视图时填写。
- `tags` 不超过 5 个，且能够表达关键词主题。
- 至少有 1 个语义链接（`[[...]]`）或已被某个 MOC / Hub 收录。
- 如果红链开始积累，应通过 Missing 视图分批解决，避免长期漂移。

## 维护节奏（建议）

- 每周：清理 Inbox（补 `kind`，按需补 `format`，整理 `tags`，补 1–3 个关键链接）；用 Missing 视图挑选需要处理的笔记，避免 Missing 持续膨胀。
- 每月：处理 Orphans（给重要笔记补 hub、合并重复概念、清理同义 tag）。

## Agent 工作流（建议）

当用户要求“完善归档与连接”时，按以下顺序执行：

1) **扫描现状**：汇总当前 tags、常见属性、目录结构、孤儿笔记 / 高频词（只做总结，不先大改）。
2) **提出 taxonomy 草案**：给出核心 properties（例如 `kind/format/status/area/project/source`）与关键词 tags 的建议；只有在用户明确要求时才补 namespace tags。
3) **设计 2–5 个关键 Bases**：草拟 `.base` 的 filters / views / 关键公式。
4) **小批量试点**：先在一个领域或 20–50 条笔记上应用，再复核。
5) **再扩展**：得到确认后，再做批量应用和持续维护。

---

备注：当需要创建 / 编辑 `.base` 文件时，参考 vault 内的 `obsidian-bases` Skill；当需要编辑普通笔记时，参考 `obsidian-markdown` Skill；当需要批量统计 / 管理 / 操作笔记，或利用 Obsidian 内置能力时，参考 `obsidian-cli` Skill。
