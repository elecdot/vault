---
tags:
  - inspiration
  - chatgpt
  - notebook
  - git
  - qol
kind: resource
format: capture
status: fleeting
source: ChatGPT
aliases:
  - Notebook Repo Setup
---

# Notebook Repo Setup

## Why
This show the cleanest way to setup a notebook repo.

## Excerpt
> [!quote] ChatGPT reply
> 下面给你一套我会实际推荐给 **research / ML / data** 项目的最终方案：
> 
> > **保留 notebook 的交互体验，但把版本控制的“主表示”转到文本层。**
> > 具体组合是：**Jupytext + nbstripout + nbdime + pre-commit + 明确目录规则**。
> > Jupytext 负责给 notebook 配一份可读的文本表示；nbstripout 负责去掉输出噪声；nbdime 改善 notebook diff/merge；pre-commit 把这些规则自动化。([GitHub][1])
> 
> ---
> 
> ## 1. 这套方案解决什么问题
> 
> 它主要解决 4 类痛点：
> 
> * `.ipynb` 是 JSON，普通 git diff 和 merge 体验差。nbdime 专门为 notebook 提供 diff/merge 集成。([nbdime.readthedocs.io][2])
> * notebook 输出、执行计数和部分 metadata 会制造大量无意义变更。nbstripout 就是为“剥离输出和部分 metadata”设计的，可作为 Git filter 或 pre-commit hook 使用。([GitHub][1])
> * notebook 需要一份更适合 review 的文本形式。Jupytext 支持把 notebook 和 `py:percent` 等文本格式做双向配对与同步。([Jupytext][3])
> * 靠人手工记规则不稳。pre-commit 的目的就是在每次提交前自动运行这些检查和清理步骤。([pre-commit.com][4])
> 
> ---
> 
> ## 2. 最终工作流
> 
> 我建议你采用这个工作流：
> 
> 1. **仓库中保留 `.ipynb` 和 `.py` 两份表示**
> 2. `.py` 使用 **Jupytext 的 `py:percent`** 格式
> 3. **git review 主要看 `.py`**
> 4. `.ipynb` 用于交互运行、可视化和展示
> 5. commit 前自动：
> 
>    * strip notebook outputs
>    * 格式化 / 检查文本脚本
> 6. notebook 冲突时优先用 nbdime 看 diff/merge
> 
> 这一套的核心不是“把 notebook 变成脚本”，而是让 notebook 同时拥有：
> 
> * 交互表示：`.ipynb`
> * 版本控制表示：`.py:percent` ([Jupytext][3])
> 
> ---
> 
> ## 3. 仓库结构
> 
> 建议直接这样组织：
> 
> ```text
> project/
>   src/
>     ...
>   notebooks/
>     scratch/
>     analysis/
>     reports/
>   scripts/
>   tests/
>   pyproject.toml
>   .pre-commit-config.yaml
>   .gitattributes
>   .gitignore
> ```
> 
> 目录约束建议是：
> 
> * `src/`：核心逻辑
> * `notebooks/scratch/`：临时探索，不要求长期维护
> * `notebooks/analysis/`：正式分析 notebook，允许进 git
> * `notebooks/reports/`：报告 / demo / 图表生成 notebook
> * `scripts/`：可重复执行入口
> * `tests/`：对 `src/` 做验证
> 
> 这部分是工程建议，不是工具硬性要求；但它能把“探索过程”和“长期资产”分离开。
> 
> ---
> 
> ## 4. 安装依赖
> 
> 先装这几个：
> 
> ```bash
> pip install jupytext nbstripout nbdime pre-commit
> ```
> 
> * Jupytext 提供 notebook 与文本格式之间的转换、配对和同步。([Jupytext][3])
> * nbstripout 用于清掉 notebook 输出和部分 metadata。([GitHub][1])
> * nbdime 改善 notebook 的 diff/merge。([nbdime.readthedocs.io][2])
> * pre-commit 用于在提交前自动执行 hook。([pre-commit.com][4])
> 
> ---
> 
> ## 5. Jupytext 配置
> 
> 把下面这段放进 `pyproject.toml`：
> 
> ```toml
> [tool.jupytext]
> formats = "ipynb,py:percent"
> notebook_metadata_filter = "kernelspec,jupytext"
> cell_metadata_filter = "tags"
> ```
> 
> 这表示：
> 
> * notebook 默认配对成 `ipynb + py:percent`
> * 只保留最有用的 notebook metadata
> * cell 级 metadata 只保留 `tags`
> 
> Jupytext 官方支持在项目配置中声明 `formats`，并支持 paired notebooks 与 `--sync` 工作流。([Jupytext][3])
> 
> 然后把现有 notebook 配对一次：
> 
> ```bash
> jupytext --set-formats ipynb,py:percent notebooks/analysis/example.ipynb
> ```
> 
> 之后会得到：
> 
> ```text
> notebooks/analysis/example.ipynb
> notebooks/analysis/example.py
> ```
> 
> Jupytext 官方文档支持这种 paired notebook 方式，并可通过 `--sync` 让两边按更新时间同步。([Jupytext][3])
> 
> ---
> 
> ## 6. nbstripout 配置
> 
> 推荐在仓库里启用本地 git filter：
> 
> ```bash
> nbstripout --install
> ```
> 
> nbstripout 官方说明它“用于剥离 notebook 输出”，并且既可以作为 Git filter，也可以作为 pre-commit hook。([GitHub][1])
> 
> 为了让属性文件显式存在于仓库里，再加一个 `.gitattributes`：
> 
> ```gitattributes
> *.ipynb filter=nbstripout
> ```
> 
> 这样做的好处是：
> 
> * 仓库规则更可见
> * 团队成员更容易理解 notebook 会被自动清理
> 
> 注意一点：`nbstripout --install` 会配置 git 过滤器；`.gitattributes` 负责把该过滤器绑定到 `.ipynb` 文件。nbstripout 官方 README 明确支持作为 Git filter 使用。([GitHub][1])
> 
> ---
> 
> ## 7. nbdime 配置
> 
> 启用 git 集成：
> 
> ```bash
> nbdime config-git --enable
> ```
> 
> 如果你想做全局配置，也可以：
> 
> ```bash
> nbdime config-git --enable --global
> ```
> 
> nbdime 官方 quickstart 明确推荐 `nbdime config-git --enable --global` 作为 notebook git 集成的快捷方式；它支持 diff driver、merge driver，以及 diff/merge tools 两类集成。([nbdime.readthedocs.io][2])
> 
> 这一步的意义是：
> 以后 notebook 出现差异或冲突时，不再只是硬看 JSON。
> 
> ---
> 
> ## 8. pre-commit 配置
> 
> 在仓库根目录建 `.pre-commit-config.yaml`：
> 
> ```yaml
> repos:
>   - repo: https://github.com/kynan/nbstripout
>     rev: 0.8.2
>     hooks:
>       - id: nbstripout
> 
>   - repo: https://github.com/mwouts/jupytext
>     rev: v1.18.1
>     hooks:
>       - id: jupytext
>         args: [--sync]
>         files: ^notebooks/.*\.(ipynb|py)$
> 
>   - repo: https://github.com/pre-commit/pre-commit-hooks
>     rev: v5.0.0
>     hooks:
>       - id: end-of-file-fixer
>       - id: trailing-whitespace
> ```
> 
> 然后执行：
> 
> ```bash
> pre-commit install
> pre-commit run --all-files
> ```
> 
> pre-commit 的官方定位就是“声明一组 hooks，并在每次 commit 前自动执行”；nbstripout 明确支持以 pre-commit hook 方式使用；Jupytext 官方 changelog 也提到它提供了 pre-commit hook。([pre-commit.com][4])
> 
> 我这里给的配置意图是：
> 
> * `nbstripout`：保证 `.ipynb` 不带输出进仓库
> * `jupytext --sync`：保证 `.ipynb` 和 `.py` 不漂移
> * 其余 hooks：做一些基础文本清理
> 
> 说明一下：`mwouts/jupytext` 的具体 tag 我这里没有再逐页确认到官方版本页，所以 `v1.18.1` 这一行你在落地时最好用你当前环境下能安装的最新稳定 tag 替换；`--sync` 这个工作流本身是 Jupytext 官方支持的。([Jupytext][3])
> 
> ---
> 
> ## 9. `.gitignore` 建议
> 
> ```gitignore
> .ipynb_checkpoints/
> __pycache__/
> *.pyc
> .env
> .venv/
> ```
> 
> 如果你想让 `scratch/` 完全不进版本库，也可以加：
> 
> ```gitignore
> notebooks/scratch/
> ```
> 
> 这是工程策略，不是工具要求。
> 对研究型仓库来说，这一步很有用，因为它能阻止“临时 notebook 污染主仓库”。
> 
> ---
> 
> ## 10. Notebook 编写规则
> 
> 这部分最重要。工具只能减噪，不能代替结构设计。
> 
> ### 规则 A：核心逻辑必须进 `src/`
> 
> notebook 里尽量只写：
> 
> * 导入
> * 参数声明
> * 调用 `src/`
> * 结果展示
> * Markdown 解释
> 
> 不要把主要算法、数据处理流程、评估逻辑都堆在 notebook 里。
> 
> ### 规则 B：notebook 必须能从上到下顺序运行
> 
> 不要依赖隐式内存状态。
> 
> ### 规则 C：路径和超参数集中管理
> 
> 例如 notebook 顶部统一：
> 
> ```python
> DATA_PATH = "../data/processed/train.parquet"
> MODEL_NAME = "baseline"
> SEED = 42
> ```
> 
> 或者直接读 `yaml`/环境变量。
> 
> ### 规则 D：命名要表达用途
> 
> 不要出现：
> 
> ```text
> test.ipynb
> final.ipynb
> final_v2.ipynb
> ```
> 
> 建议改成：
> 
> ```text
> 01_data_overview.ipynb
> 20_feature_analysis.ipynb
> 30_error_analysis.ipynb
> 90_paper_figures.ipynb
> ```
> 
> ---
> 
> ## 11. 日常使用方式
> 
> ### 新建一个正式 notebook
> 
> 先建 `.ipynb`，然后立即配对：
> 
> ```bash
> jupytext --set-formats ipynb,py:percent notebooks/analysis/20_error_analysis.ipynb
> ```
> 
> ### 日常编辑
> 
> 两种都可以：
> 
> * 在 VS Code / JupyterLab 里打开 `.ipynb`
> * 或在编辑器里直接改 `.py`
> 
> ### 提交前
> 
> 正常 `git add` / `git commit` 即可。
> pre-commit 会自动执行 strip 和 sync。([pre-commit.com][4])
> 
> ### 查看 notebook 差异
> 
> 如果是 `.py` 改动，直接普通 git diff 即可。
> 如果是 `.ipynb` 层面的差异或冲突，交给 nbdime。([nbdime.readthedocs.io][2])
> 
> ---
> 
> ## 12. 团队协作约定
> 
> 我建议你直接写进 README：
> 
> ### 必须遵守
> 
> * `src/` 放核心逻辑
> * 正式 notebook 统一放 `notebooks/analysis` 或 `notebooks/reports`
> * notebook 必须配对成 `ipynb + py:percent`
> * 不允许提交输出
> * 提交前必须通过 pre-commit
> 
> ### 推荐遵守
> 
> * 主要 review `.py`
> * notebook 只用于编排、分析和展示
> * `scratch/` 不进入主分支
> 
> 这样团队里的人即使不用完全一样的编辑器，也能按同一套资产规则协作。
> 
> ---
> 
> ## 13. 什么时候不该继续用 notebook
> 
> 出现下面信号时，就该把内容继续下沉到脚本或模块：
> 
> * notebook 变成 500+ 行主流程代码
> * 你开始复制出 `final2.ipynb`
> * 需要定期重跑
> * 需要测试
> * 需要 CI
> * 别人要复用其中逻辑
> 
> 那时 notebook 就只该保留“入口”和“展示”。
> 
> ---
> 
> ## 14. 给你的最终落地版本
> 
> 你可以直接照这个最小闭环执行：
> 
> ### 第一步
> 
> 安装：
> 
> ```bash
> pip install jupytext nbstripout nbdime pre-commit
> ```
> 
> ### 第二步
> 
> `pyproject.toml`：
> 
> ```toml
> [tool.jupytext]
> formats = "ipynb,py:percent"
> notebook_metadata_filter = "kernelspec,jupytext"
> cell_metadata_filter = "tags"
> ```
> 
> ### 第三步
> 
> `.gitattributes`：
> 
> ```gitattributes
> *.ipynb filter=nbstripout
> ```
> 
> ### 第四步
> 
> 启用工具：
> 
> ```bash
> nbstripout --install
> nbdime config-git --enable
> pre-commit install
> ```
> 
> ### 第五步
> 
> `.pre-commit-config.yaml`：
> 
> ```yaml
> repos:
>   - repo: https://github.com/kynan/nbstripout
>     rev: 0.8.2
>     hooks:
>       - id: nbstripout
> 
>   - repo: https://github.com/mwouts/jupytext
>     rev: v1.18.1
>     hooks:
>       - id: jupytext
>         args: [--sync]
>         files: ^notebooks/.*\.(ipynb|py)$
> 
>   - repo: https://github.com/pre-commit/pre-commit-hooks
>     rev: v5.0.0
>     hooks:
>       - id: end-of-file-fixer
>       - id: trailing-whitespace
> ```
> 
> ### 第六步
> 
> 把正式 notebook 配对：
> 
> ```bash
> jupytext --set-formats ipynb,py:percent notebooks/analysis/your_notebook.ipynb
> ```
> 
> ### 第七步
> 
> 团队规则：
> 
> * review `.py`
> * 运行 `.ipynb`
> * 核心逻辑进 `src/`
> * 输出不进仓库
> 
> 这套方案与 Jupytext 的 paired notebook / sync 工作流、nbstripout 的输出剥离方式、nbdime 的 git integration、以及 pre-commit 的 hook 模型是对齐的。([Jupytext][3])
> 
> ---
> 
> ## 15. 我对这套方案的评价
> 
> 这是一个偏工程化、但仍然尊重研究体验的折中方案：
> 
> * 不强迫你放弃 notebook
> * 不让 git 被 notebook 拖垮
> * 不把“探索过程”误当成“最终资产”
> * 让团队 review、merge、复现都更稳定
> 
> 你要是想继续落地，我下一步最适合给你的就是一份**可直接复制进仓库的完整模板文件集合**，包括 `pyproject.toml`、`.pre-commit-config.yaml`、`.gitattributes`、`.gitignore` 和 README 规范段落。
> 
> [1]: https://github.com/kynan/nbstripout?utm_source=chatgpt.com "nbstripout: strip output from Jupyter and IPython notebooks"
> [2]: https://nbdime.readthedocs.io/en/latest/vcs.html?utm_source=chatgpt.com "Version control integration — nbdime 4.0.4 documentation"
> [3]: https://jupytext.readthedocs.io/en/latest/changelog.html?utm_source=chatgpt.com "Jupytext ChangeLog - Read the Docs"
> [4]: https://pre-commit.com/?utm_source=chatgpt.com "pre-commit"

## Context
- Date captured: 2026-04-10 20:03
- Prompt: Not captured.
- Conversation link: none

## Related
- none

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
