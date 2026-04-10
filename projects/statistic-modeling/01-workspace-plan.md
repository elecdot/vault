---
tags:
  - workspace
  - python
  - stata
  - research-workflow
kind: project
format: note
status: active
project: "[[statistic-modeling]]"
aliases:
  - Statistic Modeling Workspace Plan
---

# Statistic Modeling Workspace Plan

This note is the workspace initialization plan for [[statistic-modeling]]. It translates the research direction in [[00-roadmap|Topic of Statistic Modeling Contest]] into a practical repository setup for a standalone code workspace.

## Summary

为该项目建立一个独立代码仓，采用 `uv` 管理 Python 环境，整体架构按“研究流水线仓库”而不是“notebook 集合”来设计。当前项目仍处于政策抓取可行性验证和变量口径确认阶段，因此初始化方案以“够用、可复现、低心智负担”为原则，不预铺完整生产体系。

当前项目采用以下固定原则：

- Python 负责抓取、清洗、特征工程、面板构建、可视化和导出 Stata 输入。
- Stata 负责正式计量回归、稳健性检验和论文/比赛口径结果复核。
- Git 只管理代码、配置、文档、小型手工标注资产、必要样例和数据来源元信息，不管理原始或大体量中间数据，也不默认管理运行产物。
- `notebooks/` 只用于探索和展示，不承担正式生产流程。
- 初始仓库只创建当前阶段确实会用到的最小骨架，其余目录和脚本后续按需增加。

Obsidian 继续作为项目知识库与研究笔记系统，代码仓独立维护；两者通过 README、数据字典和工作流文档保持同步。

## Implementation Changes

### 1. 仓库形态与目录规范

初始化为独立 Git 仓库，但区分“初始化即创建”和“后续按需增加”两层结构。

初始化阶段实际创建的最小骨架如下：

```text
statistic-modeling/
├─ pyproject.toml
├─ uv.lock
├─ .python-version
├─ .gitignore
├─ .env.example
├─ README.md
├─ justfile
├─ configs/
│  ├─ paths.toml
│  ├─ study.toml
│  └─ study.sample.toml
├─ data/
│  ├─ raw/
│  ├─ interim/
│  ├─ processed/
│  ├─ README.md
│  └─ source-manifest.csv
├─ src/
│  └─ statistic_modeling/
│     ├─ config.py
│     ├─ io.py
│     ├─ utils/
│     ├─ policy/
│     ├─ panel/
│     ├─ analysis/
│     └─ export/
├─ scripts/
│  ├─ collect_policy_texts.py
│  ├─ build_panel.py
│  └─ export_stata_inputs.py
├─ stata/
│  ├─ did_main.do
│  └─ setup.do
├─ outputs/
│  ├─ figures/
│  ├─ tables/
│  └─ logs/                            # 逻辑输出目录，运行时自动创建，默认不进 Git
├─ docs/
│  ├─ data-dictionary.md
│  └─ workflow.md
└─ tests/
   └─ fixtures/
```

目标态可保留更完整的扩展空间，但以下内容不要求初始化即创建，等真正进入对应阶段后再补：

- `build_policy_labels.py`、`build_policy_index.py`、`summarize_outputs.py`
- `robustness.do`、`utils.do`
- 多个预命名 notebook
- `variable-spec.md`、`research-design.md` 等补充文档
- `external/`、`models/` 等仅在出现明确用途后再创建

关键约束如下：

- `src/` 只放可复用逻辑，不写一次性分析。
- `scripts/` 是正式入口，必须可通过 `uv run ...` 独立执行。
- `notebooks/` 只调用 `src/` 中的函数，不重复拷贝数据处理代码。
- `stata/` 接收 Python 导出的标准化输入数据，并输出表格或结果文件到 `outputs/`。
- `docs/data-dictionary.md` 从 Day 1 就建立，作为变量和数据口径唯一文档源。
- 当前研究还在验证抓取与变量口径，仓库初始化不预铺完整生产目录。
- 仓库初始化验收只基于 sample fixture，不依赖真实 CSMAR、真实政策文本或图书馆内网环境。
- fresh clone 的 sample 冒烟不要求手改任何受版本管理的配置文件。

### 2. 环境与依赖管理

使用 `uv` 初始化，Python 版本固定为 `3.12`。初始环境只安装当前阶段真正需要的依赖，避免把未来可能用到的工具提前放进主环境。

当前项目采用以下依赖分层：

- 核心数据层：`pandas`, `pyarrow`, `numpy`
- 分析与可视化层：`statsmodels`, `linearmodels`, `matplotlib`, `seaborn`, `jupyter`, `ipykernel`
- 工程辅助层：`pydantic`, `python-dotenv`, `pyyaml`, `rich`
- 抓取与文本层：`httpx`, `beautifulsoup4`, `lxml`, `selectolax`, `jieba`
- 日志方案：使用标准 `logging`
- 可选 NLP 层：`transformers`, `datasets`, `accelerate` 仅在真正进入微调阶段时再添加，初始化不安装
- 开发层：`pytest`, `ruff`

环境规则：

- 所有依赖通过 `uv add` 管理，不手写 `requirements.txt` 作为主源。
- `uv.lock` 提交到 Git，确保可复现。
- `.env.example` 只放私有本地路径覆盖项和非敏感变量说明，不复制主配置。
- 统一命令入口使用 `justfile`，不再同时维护 `Makefile`。
- 若未来确有明确性能或工作流收益，再按需引入 `polars`、额外日志库或更重的 NLP 依赖。

### 3. 数据与配置治理

数据治理按“不可追踪的大文件不进 Git，可重建的小型结构化元数据进 Git”执行。

进入 Git：

- `configs/*.toml`
- 手工标注规范
- 小型标签映射表、字段映射表、样本白名单或黑名单
- 数据来源登记表，例如 `data/source-manifest.csv`
- 数据字典与变量说明文档

不进入 Git：

- CSMAR 导出表
- 抓取的政策全文原文库
- 中间清洗 parquet/csv
- 最终大面板数据
- notebook 检查点和临时导出图

配置规则：

- `paths.toml` 提供仓库内相对路径默认值，保证 fresh clone 和 sample fixture 可直接使用
- 若存在 `.env` 或环境变量覆盖，则私有本地路径优先生效
- `study.toml` 用于真实数据工作流
- `study.sample.toml` 用于 fresh clone 下的最小冒烟流程
- `study.sample.toml` 不要求配套单独的 `paths` 配置文件
- Python 与 Stata 都从同一份导出后的结构化数据规范工作，避免两套变量命名体系

数据来源追踪规则：

- `data/source-manifest.csv` 只记录元信息，不管理大文件本体
- 最低字段为 `source_name`, `source_type`, `url_or_origin`, `access_date`, `local_filename`, `notes`
- 所有原始数据、政策文本和手工整理表，一旦进入项目目录，都应在来源登记表中留痕
- `tests/fixtures/` 下的样例数据视为测试资产，初始化阶段不强制登记进来源表
- 来源登记是轻量追踪机制，不引入 DVC 等额外工具链

文件格式建议：

- 中间和最终分析数据优先 `parquet`
- 需要人工查阅的小表可额外导出 `csv`
- Python 到 Stata 的正式交换格式固定为 `.dta`，必要时可额外导出规范化 `.csv` 供人工核查

Git 与产物治理规则：

- 默认 ignore 原始数据、清洗中间数据、默认输出产物、大文件和 notebook checkpoint
- 默认 ignore `outputs/**` 常规运行产物
- 默认进入 Git 的仅包括代码、配置、文档、小型手工标注资产、来源登记表和必要样例数据
- `outputs/` 及其子目录由脚本运行时自动创建，不要求仓库预置空目录
- 若未来需要提交最终论文图表或展示产物，应使用单独导出副本或显式白名单，而不是改变默认 ignore 策略

### 4. 代码组织与职责边界

Python 子模块按职责拆分：

- `policy/`: 抓取、解析、正文清洗、分词、标签处理、政策强度指数构建
- `panel/`: 企业名单清洗、专利/财务数据拼接、面板平衡性检查、缺失值与异常值规则
- `analysis/`: Python 内部的描述性统计、预分析、事件研究预检查、图形生成
- `export/`: 向 Stata 导出建模输入、表格模板和结果摘要

流程边界：

- Python 负责“数据准备完成并导出可回归面板”
- Stata 负责“正式估计与论文口径表”
- 若 Python 先做试算，结果仅作校验，不作为最终主结果来源

Stata 复现约定：

- `stata/setup.do` 负责项目级初始化，包括路径约定、`version` 声明模板、基础设置和“待补充依赖说明”
- 所有 `do` 文件顶部固定写明 `version`
- `did_main.do` 只读取 Python 导出的标准面板，不直接处理原始数据
- Python 导出的字段命名是 Stata 侧唯一正式输入接口，字段说明统一记录在 `docs/data-dictionary.md`
- Stata 输出统一进入 `outputs/tables/` 和 `outputs/figures/`
- 渐进式 DID 的具体命令栈、事件研究实现和稳健性命令在研究设计定稿后补充，不属于初始化阶段阻塞项

脚本设计规则：

- 每个脚本只做一个稳定任务
- 脚本输入输出必须显式，不能依赖 notebook 单元状态
- 每个脚本运行后写日志到 `outputs/logs/`
- 失败时要报清楚缺哪份数据、缺哪个字段、哪一步校验未通过

### 5. Notebook 使用规范

`notebooks/` 保留，但严格限制职责：

- 用于探索数据分布、验证抓取结构、试验文本特征、快速画图
- 不承担正式数据清洗主流程
- 每个 notebook 只处理一个问题域
- 当前阶段不要求 Day 1 创建 `notebooks/`，等出现稳定探索需求后再增加
- notebook 顶部固定写明输入数据、输出产物、依赖脚本
- 重要结论一旦稳定，立即沉淀到 `src/` 或 `scripts/`

### 6. 文档、复现与质量控制

初始化时必须有以下文档：

- `README.md`
  - 项目目标
  - 目录结构
  - 环境初始化
  - 数据放置说明
  - 主要命令
  - Python/Stata 工作流关系
- `docs/data-dictionary.md`
  - 每个表、字段、来源、单位、时间范围、处理规则
- `docs/workflow.md`
  - 从原始数据到回归结果的流水线步骤

初始化最低质量标准：

- `ruff check` 通过
- `pytest` 覆盖配置读取、路径解析、关键转换函数、面板构建最小冒烟、Stata 输入导出最小冒烟
- 为关键脚本增加“最小样本冒烟测试”
- notebook 不纳入初始化验收，也不纳入正式测试面
- 更完整的测试和工作流演示在后续执行阶段逐步补齐

个人项目默认不强制 CI，但仓库结构要允许后续加 GitHub Actions。  
初始化阶段仅需预留以下检查命令：

- `uv run ruff check .`
- `uv run pytest`
- `uv run python scripts/build_panel.py --config configs/study.sample.toml`

## Public Interfaces / I/O Contracts

需要一开始就固定的接口与约定：

- Python 脚本统一接受 `--config` 参数；真实数据工作流使用 `configs/study.toml`，初始化冒烟使用 `configs/study.sample.toml`
- 数据输入输出路径默认从 `configs/paths.toml` 的仓库内相对路径解析，并允许 `.env` 或环境变量覆盖私有本地路径
- Python 导出给 Stata 的主面板正式交换格式固定为 `.dta`，必要时可附带 `.csv`
- Python 导出给 Stata 的主面板文件字段命名保持稳定，字段说明记录在 `docs/data-dictionary.md`
- Stata `do` 文件默认读取 Python 导出的标准数据路径，并将结果输出到 `outputs/tables/` 与 `outputs/figures/`
- Stata 当前只固定目录结构、入口文件和 I/O 约定，不在初始化阶段承诺具体估计命令实现
- 输出目录不存在时由脚本自动创建
- Git 默认不跟踪运行产物；任何例外必须显式说明
- `README.md` 中公开的命令即视为对未来自己的稳定接口，不频繁变更

## Test Plan

初始化后需要覆盖的最低验证场景：

1. 新机器克隆仓库后，执行 `uv sync` 能成功建立环境。
2. 在无真实数据情况下，仓库可完成静态检查与测试，不因缺失私有数据直接崩溃。
3. 用 sample fixture、仓库内默认相对路径和 `configs/study.sample.toml`，`scripts/build_panel.py` 能跑出标准化面板文件。
4. `scripts/export_stata_inputs.py` 能基于 sample 数据导出符合约定的 `.dta` 文件。
5. `stata/did_main.do` 在占位实现下能直接读取标准输入文件并遵守输出路径约定，即使具体估计命令仍待补充。
6. 初始化检查命令不会直接依赖真实 CSMAR、真实政策全文或图书馆内网环境。
7. 删除本地 `outputs/` 后重新运行脚本，输出目录会自动创建。
8. 缺字段、缺路径、年份范围不合法时，脚本能给出明确报错。

## Related

- [[00-roadmap|Topic of Statistic Modeling Contest]]
- [[statistic-modeling]]

## Next

- [ ] Refine the first implementation batch in `dev/`
- [ ] Lock the initial `pyproject.toml` and dependency set
- [ ] Confirm the first sample fixture and Python-to-Stata handoff shape
	
## Assumptions And Defaults

- Python 版本固定为 `3.12`。
- Python 为数据工程与分析中台，Stata 为正式计量估计主引擎。
- Git 不跟踪原始与大体量中间数据，也默认不跟踪运行产物，仅跟踪代码、配置、文档、小型手工资产、来源元信息和必要样例。
- Git 同时跟踪轻量数据来源元信息，以保证数据可追溯。
- 项目当前以个人高效推进为主，因此不默认上 CI，但保留后续接入空间。
- 首批不引入 DVC、Airflow、Docker、MLflow 等重型基础设施；等真实协作或算力需求出现后再升级。
- Stata 具体方法栈暂时留白是有意设计，不视为初始化方案缺陷。
- 测试体系采用“先可运行，后逐步完善”的策略。
