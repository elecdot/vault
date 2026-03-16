---
tags:
  - inspiration
  - chatgpt
  - mamba
  - conda
  - uv
  - jupyter
  - python
  - pytorch
  - cuda
  - machine-learning
kind: "resource"
format: "capture"
status: "fleeting"
source: "ChatGPT"
aliases:
  - "Python And System Envrionment Management With uv and micromamba"
---

# Python And System Envrionment Management With uv and micromamba

## Why
This build a mental model for Python envrionment managment

## Excerpt
> [!quote] ChatGPT reply
> 可以这样理解，但要把它说得更精确一点：
> 
> **默认策略：优先用 `uv`。**
> **例外策略：当你明确需要 conda/micromamba 的强项时，再引入它。**
> 
> 对你现在的需求，这个判断基本成立：
> 除了 **经常切换 CUDA / PyTorch / 其他重二进制科学计算栈** 这类场景外，大多数纯 Python 项目，直接用 `uv` 就很合适。Astral 在它的 Jupyter 指南里也直接给出了 `uv add --dev ipykernel` 这类项目内开发依赖的做法；同时，uv 的项目模型就是围绕 `pyproject.toml`、dependency groups 和 lock/sync 设计的。([Astral Docs][1])
> 
> 更实用的结论是：
> 
> ## 什么时候“应该优先 uv”
> 
> 这些场景里，我会把 `uv` 当默认答案：
> 
> * Web 后端、CLI、自动化脚本、数据处理脚本
> * 一般课程作业 / 个人项目
> * 依赖主要来自 PyPI
> * 你希望项目是 **`pyproject.toml + uv.lock + .venv`** 这种可复现结构
> * 你主要在 VS Code、pytest、ruff、Jupyter 里开发
> 
> 这类项目里，`conda` 往往只是“也能做”，但不是最自然的那条路。`uv add --dev ...` 会把开发依赖放进 dependency groups；`uv lock` / `uv sync` 则负责锁定和同步环境。([Astral Docs][2])
> 
> ## 什么时候“值得用 micromamba/conda”
> 
> 当你碰到下面这些情况，conda/micromamba 就不只是“可选”，而是常常更省心：
> 
> * **CUDA、cuDNN、PyTorch** 版本矩阵经常变
> * 你需要快速试多个 GPU 栈
> * 你依赖大量 **非 Python 的二进制库**，而这些库在 conda-forge 上更成熟
> * 你在做偏科研/实验型工作，经常临时拉起多个重环境
> * 你要处理一些 PyPI 上 wheel 覆盖不佳、平台兼容性麻烦的包
> 
> micromamba 本质上就是 conda 生态的一个轻量前端，用来管理 conda 环境完全合理。它不自带默认 `base` Python，这点反而让它更“干净”。([mamba.readthedocs.io][3])
> 
> ## 所以不是“除了 ML 都别用 conda”，而是：
> 
> 更准确的原则是：
> 
> **能被视为“普通 Python 项目”的，就先用 uv。**
> **只有当问题开始变成“二进制/系统库/硬件栈管理问题”时，再让 micromamba/conda 上场。**
> 
> 这比按“是不是 ML 项目”分类更稳。
> 
> 因为并不是所有 ML 项目都需要 conda。
> 例如很多只跑 CPU、只用 scikit-learn / lightgbm / notebooks 的项目，用 `uv` 完全没问题。
> 反过来，有些非 ML 项目只要碰到复杂原生依赖，也可能更适合 conda。这个判断核心不在“ML”三个字，而在 **你是否进入了重二进制环境管理**。这是个推断，但和各工具的设计边界是吻合的。([mamba.readthedocs.io][4])
> 
> ## 你可以采用的实践准则
> 
> 我建议你用这套分层规则：
> 
> ### A. 纯 Python / 常规项目
> 
> 直接：
> 
> ```bash
> uv init
> uv add ...
> uv add --dev ipykernel pytest ruff
> ```
> 
> 这是最干净的。Astral 的 Jupyter 文档也是按这个路线写的。([Astral Docs][1])
> 
> ### B. GPU / CUDA / PyTorch 频繁切换
> 
> 用：
> 
> * **micromamba 管底层环境**
> * **uv 管 Python 依赖**
> 
> 也就是：
> 
> * micromamba 负责 Python 版本、CUDA 相关、大型二进制包边界
> * uv 负责项目依赖声明、锁定、开发依赖、Jupyter 工具链
> 
> 这就是你说的“conda + uv 混用”，而且这通常是很有价值的，不是多此一举。
> 
> ### C. Jupyter kernel 管理
> 
> 不管底层是 uv 还是 micromamba，原则都一样：
> 
> * **哪个环境要被 Notebook 选中，哪个环境里就要装 `ipykernel`**
> * Jupyter 的 kernelspec 是独立的数据文件，和解释器/运行时配置分开管理；它不是“全局有一个 ipykernel 就够了”那种机制。([Jupyter 文档][5])
> 
> ## 给你一个简短决策表
> 
> 你以后可以这么选：
> 
> * **课程项目 / 普通仓库 / 工程化 Python** → `uv`
> * **Notebook + 常规数据分析** → 大概率 `uv`
> * **多 CUDA / 多 Torch / 多实验 GPU 栈** → `micromamba + uv`
> * **依赖很多原生库、PyPI 轮子不稳定** → 优先考虑 `micromamba`
> * **只是因为“别人都在用 conda”** → 不足以成为使用理由
> 
> ## 一句落地建议
> 
> 如果你现在是 **CS 学习 + 工程化开发 + VS Code + Jupyter** 这条路线，我建议你把：
> 
> **`uv` 作为默认工作流**，
> 把 **micromamba** 保留给 **GPU / CUDA / 科学计算重环境**。
> 
> 这会让你的日常项目更统一，也更容易形成稳定习惯。
> 
> 你要的话，我可以下一条直接给你一套我比较推荐的目录与命令模板：
> 
> * 纯 `uv` 项目模板
> * `micromamba + uv + VS Code + Jupyter` 混合模板
> 
> 这样你以后开新项目基本照抄就行。
> 
> [1]: https://docs.astral.sh/uv/guides/integration/jupyter/?utm_source=chatgpt.com "Using uv with Jupyter - Astral Docs"
> [2]: https://docs.astral.sh/uv/concepts/projects/dependencies/?utm_source=chatgpt.com "Managing dependencies | uv - Astral Docs"
> [3]: https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html?utm_source=chatgpt.com "Micromamba User Guide — documentation"
> [4]: https://mamba.readthedocs.io/en/latest/user_guide/mamba.html?utm_source=chatgpt.com "Mamba User Guide — documentation"
> [5]: https://docs.jupyter.org/en/stable/projects/architecture/content-architecture.html?utm_source=chatgpt.com "Architecture"
> 
> ---(1
> 
> 对，B 的关键不是“两个包管理器一起装包”，而是：
> 
> **把它们分层。**
> 
> 你可以用这个心智模型来管：
> 
> # 一个分层模型
> 
> ## 第 1 层：micromamba 管“底座环境”
> 
> 它负责那些 **重、慢、和硬件/系统强相关** 的东西，比如：
> 
> * Python 大版本
> * CUDA / cuDNN
> * PyTorch 的大方向组合
> * 少数更适合从 conda-forge 或 pytorch channel 拿的二进制包
> 
> micromamba 本身就是 conda 生态的轻量前端，不需要默认 `base` 环境，也支持 `micromamba run -p/-n ...` 这种不激活 shell 也能执行命令的方式。([Mamba][1])
> 
> 你可以把它理解成：
> 
> > **“我先造一个可运行的机器房间。”**
> 
> ---
> 
> ## 第 2 层：uv 管“项目依赖快照”
> 
> 它负责项目自己的 Python 依赖声明与锁定：
> 
> * `pyproject.toml`
> * `uv.lock`
> * dev 依赖
> * notebook 依赖
> * lint / test / training script 所需依赖
> 
> uv 的项目模型就是围绕 `pyproject.toml`、`.venv` 和 `uv.lock` 组织的；`uv run` 和 `uv sync` 会把环境和 lockfile 对齐。([Astral Docs][2])
> 
> 你可以把它理解成：
> 
> > **“在这个房间里，我再布置这个项目自己的工作台。”**
> 
> ---
> 
> # 一句话原则
> 
> **micromamba 决定“这是什么机器”。**
> **uv 决定“这个项目在这台机器上要装什么”。**
> 
> ---
> 
> # 什么时候新建一个 micromamba 环境
> 
> 不要把 micromamba 环境按“每个项目一个”来建。
> 在混用模式下，更好的粒度通常是：
> 
> **一个重大二进制栈 = 一个 micromamba 环境**
> 
> 例如：
> 
> * `torch-cu118-py311`
> * `torch-cu121-py311`
> * `cpu-py311`
> * `rapids-py310`
> 
> 因为这些环境真正区分的是：
> 
> * Python 版本
> * CUDA 版本
> * Torch 大版本 / channel 来源
> * 系统级 ABI 风险
> 
> 这类差异很大，值得分开。
> 而同一个底座上可以跑多个项目。
> 
> ---
> 
> # 什么时候新建一个 uv 项目环境
> 
> **每个项目都应该有自己的 uv 项目环境。**
> 
> 也就是每个仓库都有自己的：
> 
> * `pyproject.toml`
> * `uv.lock`
> * `.venv`
> 
> 因为 uv 默认就是在项目中使用虚拟环境，并把依赖静态声明到文件里；这比临时 `pip install` 到某个共享环境更可复现。([Astral Docs][3])
> 
> 所以结构上更像这样：
> 
> ```text
> micromamba envs/
>   torch-cu121-py311      ← 底座 A
>   torch-cu118-py311      ← 底座 B
>   cpu-py311              ← 底座 C
> 
> projects/
>   vision-exp/
>     pyproject.toml
>     uv.lock
>     .venv
>   rag-prototype/
>     pyproject.toml
>     uv.lock
>     .venv
>   tabular-baseline/
>     pyproject.toml
>     uv.lock
>     .venv
> ```
> 
> ---
> 
> # 切换环境时，到底在切什么
> 
> 你其实在切两件事，但优先级不同。
> 
> ## 切换 1：切底座
> 
> 这决定你当前面对的是哪套 CUDA / Torch / Python 大环境。
> 
> 比如：
> 
> ```bash
> micromamba activate torch-cu121-py311
> ```
> 
> 或者更稳一点，不依赖当前 shell 状态：
> 
> ```bash
> micromamba run -n torch-cu121-py311 python -V
> ```
> 
> 这一步是在切“机器房间”。
> 
> ---
> 
> ## 切换 2：切项目
> 
> 进入某个仓库后，真正运行项目代码时，应该优先通过 `uv run` 或项目 `.venv` 来保证依赖正确。
> 
> 例如：
> 
> ```bash
> cd vision-exp
> uv sync
> uv run python train.py
> ```
> 
> uv 文档明确说明：`uv run` 会先检查 lockfile 是否和 `pyproject.toml` 一致，并让项目环境和 lockfile 保持同步，然后再执行命令。([Astral Docs][4])
> 
> 这一步是在切“工作台”。
> 
> ---
> 
> # 你应该怎样理解“谁覆盖谁”
> 
> 最重要的一点：
> 
> **项目运行时，应该以项目 `.venv` 为准。**
> 
> 也就是说，真正要保证的是：
> 
> * 你当前项目的 `.venv` 是在正确的底座之上创建的
> * 你运行命令时走的是这个 `.venv`
> 
> 否则就会出现经典错误：
> 
> * shell 里激活的是 A 环境
> * VS Code 选的是 B 解释器
> * notebook kernel 指向的是 C
> * 实际 import 到的 torch 又来自 D
> 
> 这就是“环境错位”。
> 
> ---
> 
> # 最稳的操作规则
> 
> 给你一套非常实用的规则。
> 
> ## 规则 1：先选底座，再创建/同步项目
> 
> 比如你准备在 CUDA 12.1 + Python 3.11 上做一个项目：
> 
> ```bash
> micromamba create -n torch-cu121-py311 python=3.11
> micromamba activate torch-cu121-py311
> ```
> 
> 然后进项目：
> 
> ```bash
> cd vision-exp
> uv sync
> ```
> 
> 此时你要有意识地把这个项目的 `.venv` 视为：
> 
> > “建立在 `torch-cu121-py311` 这个底座之上的项目环境”
> 
> ---
> 
> ## 规则 2：平时运行尽量用 `uv run`
> 
> 不要默认靠“我好像激活了对的环境”。
> 
> 改成：
> 
> ```bash
> uv run python train.py
> uv run pytest
> uv run jupyter lab
> ```
> 
> 因为 `uv run` 的价值就在于：它会按项目 lockfile 和项目环境执行，而不是赌你当前 shell 的状态。([Astral Docs][4])
> 
> ---
> 
> ## 规则 3：一个项目不要试图同时容纳互相冲突的 CUDA/Torch 栈
> 
> 这点非常关键。
> 
> uv 会把项目里的依赖一起解析；如果不同 dependency groups 之间互不兼容，默认会解析失败，除非显式声明它们冲突。([Astral Docs][5])
> 
> 所以这种想法通常不优雅：
> 
> ```text
> 同一个 pyproject.toml
>   group A: torch+cu118
>   group B: torch+cu121
>   group C: torch cpu
> ```
> 
> 实践上更好的方式通常是：
> 
> * **不同重大栈，用不同 micromamba 底座**
> * 必要时，用不同项目目录或不同实验仓库
> 
> 因为这比把所有冲突版本塞进一个 `pyproject.toml` 清晰得多。
> 
> ---
> 
> # 一个推荐的目录与命名法
> 
> 我建议你用“底座名可见”的命名。
> 
> ## micromamba 环境名
> 
> ```text
> torch-cu118-py310
> torch-cu121-py311
> cpu-py311
> ```
> 
> 一眼就知道：
> 
> * Torch/CUDA 大致组合
> * Python 版本
> 
> ## 项目目录
> 
> ```text
> projects/
>   object-detection/
>   llm-finetune/
>   tabular-xgboost/
> ```
> 
> ## 项目内 README 顶部写清楚
> 
> ```text
> Base env: torch-cu121-py311
> Expected Python: 3.11
> GPU stack: CUDA 12.1
> ```
> 
> 这样你几个月后回来，还知道这个项目当初依赖哪套底座。
> 
> ---
> 
> # Jupyter / ipykernel 在这个模型里的位置
> 
> 把 kernel 想成：
> 
> > **“给 Jupyter 看的一个入口标签”**
> 
> IPython 文档说明，如果你想在 virtualenv 或 conda 环境里使用某个 Python 作为 kernel，需要在那个环境里安装并注册 `ipykernel`。([IPython 文档][6])
> 
> 所以规则是：
> 
> **哪个环境要给 Notebook 用，哪个环境里就要有 `ipykernel`。**
> 
> 在混用模式下，通常有两种做法。
> 
> ## 做法 A：kernel 指向项目 `.venv`
> 
> 这是我更推荐的。
> 
> 优点：
> 
> * 最贴近项目依赖
> * notebook 和脚本行为一致
> * 不会因为共享底座里多装了点东西而污染项目
> 
> ## 做法 B：kernel 直接指向 micromamba 底座
> 
> 只适合很临时的实验。
> 缺点是项目依赖不再由 `pyproject.toml + uv.lock` 完整表达，复现性会下降。
> 
> 所以如果你问“怎么保证用到所需要的环境”，Jupyter 场景里答案就是：
> 
> **让 notebook 也走项目 `.venv`，不要偷懒直接用共享底座。**
> 
> ---
> 
> # 一个最稳的日常工作流
> 
> 假设你要做两个项目：
> 
> * `vision-exp` 需要 CUDA 12.1
> * `ablation-old` 需要 CUDA 11.8
> 
> ## 第一步：准备底座
> 
> ```bash
> micromamba create -n torch-cu121-py311 python=3.11
> micromamba create -n torch-cu118-py311 python=3.11
> ```
> 
> ## 第二步：项目 A
> 
> ```bash
> micromamba activate torch-cu121-py311
> cd vision-exp
> uv sync
> uv add --dev ipykernel
> uv run python -m ipykernel install --user --name vision-exp-cu121
> ```
> 
> ## 第三步：项目 B
> 
> ```bash
> micromamba activate torch-cu118-py311
> cd ablation-old
> uv sync
> uv add --dev ipykernel
> uv run python -m ipykernel install --user --name ablation-old-cu118
> ```
> 
> 这样你的 notebook 下拉框里会出现两个非常明确的 kernel 名字，不容易选错。
> 
> ---
> 
> # 怎样检查“我现在到底用了哪个环境”
> 
> 每次怀疑环境错了，就检查三件事：
> 
> ## 1. 当前 Python 是谁
> 
> ```bash
> which python
> python -V
> ```
> 
> Windows 可用：
> 
> ```powershell
> where python
> python -V
> ```
> 
> ## 2. 项目是否按 lockfile 运行
> 
> ```bash
> uv run python -V
> uv run python -c "import sys; print(sys.executable)"
> ```
> 
> 如果这里打印的是项目 `.venv` 下的解释器，基本就对了。
> 
> ## 3. 关键包来自哪里
> 
> ```bash
> uv run python -c "import torch; print(torch.__file__); print(torch.__version__)"
> ```
> 
> 这能快速暴露“其实 import 的不是你以为的那个 torch”。
> 
> ---
> 
> # 你可以把“保证正确环境”总结成四个动作
> 
> **第一，选对底座。**
> 决定 CUDA / Torch / Python 大组合。
> 
> **第二，项目本地化。**
> 每个项目有自己的 `pyproject.toml`、`uv.lock`、`.venv`。([Astral Docs][2])
> 
> **第三，用 `uv run` 执行。**
> 不要把正确性寄托在 shell 激活状态上。([Astral Docs][4])
> 
> **第四，给 notebook 单独注册清晰名字的 kernel。**
> 并让它指向项目环境，而不是模糊的共享环境。([IPython 文档][6])
> 
> ---
> 
> # 一个最有用的判断标准
> 
> 你以后遇到任何“环境到底怎么配”的问题，都先问自己：
> 
> **这个问题是在“底座层”还是“项目层”？**
> 
> 如果是这些问题：
> 
> * CUDA 版本
> * Python 3.10 还是 3.11
> * Torch 大轮子从哪来
> * GPU 栈兼容性
> 
> 那是 **micromamba 层**。
> 
> 如果是这些问题：
> 
> * notebook 依赖
> * `transformers` / `pandas` / `pytest` / `ruff`
> * 项目锁定
> * 团队复现
> * VS Code / Jupyter 跑这个项目该用什么
> 
> 那是 **uv 层**。
> 
> 一旦你把问题先分层，管理就不会乱。
> 
> ---
> 
> # 最后给你的实践建议
> 
> 对你这种会做 ML、又重视工程化的人，我建议默认采用这个原则：
> 
> **共享重底座，隔离轻项目。**
> 
> 也就是：
> 
> * 少量 micromamba 环境
> * 每个项目一个 uv 环境
> * 运行项目永远优先 `uv run`
> * notebook kernel 永远尽量绑定项目 `.venv`
> 
> 这样既保留了 conda 在 GPU/二进制栈上的优势，也保留了 uv 在项目可复现、速度和工程整洁上的优势。
> 
> 下一条我可以直接给你一套适合 **Windows + WSL + VS Code** 的实际命令模板，包括：
> `micromamba create`、`uv sync`、`ipykernel install`、以及如何在 VS Code 里避免选错 kernel。
> 
> [1]: https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html "Micromamba User Guide — documentation"
> [2]: https://docs.astral.sh/uv/guides/projects/ "Working on projects | uv"
> [3]: https://docs.astral.sh/uv/pip/environments/ "https://docs.astral.sh/uv/pip/environments/"
> [4]: https://docs.astral.sh/uv/concepts/projects/sync/ "Locking and syncing | uv"
> [5]: https://docs.astral.sh/uv/concepts/projects/dependencies/ "https://docs.astral.sh/uv/concepts/projects/dependencies/"
> [6]: https://ipython.readthedocs.io/en/stable/install/kernel_install.html "Installing the IPython kernel — IPython 9.11.0 documentation"
> 
> ---(2
> 
> 你这里卡住的点很关键：**你把 micromamba 环境 和 uv 项目环境 想成了同一层**。
> 其实不是。
> 
> 最准确的理解是：
> 
> # 核心结论
> 
> **Python 程序最终不是“运行在 micromamba 里”或“运行在 uv 里”。**
> 它最终运行在某个 **Python 解释器 + 对应 site-packages** 上。
> 
> 而在混用方案里：
> 
> * **micromamba 提供一个“底层 Python 解释器”**
> * **uv 再基于这个解释器创建项目自己的 `.venv`**
> * 你平时真正运行项目时，通常跑的是 **uv 的 `.venv`**
> * 但这个 `.venv` 的“父解释器来源”可以是 micromamba 环境里的 Python。([Astral Docs][1])
> 
> 所以不是：
> 
> ```text
> Python 跑在 uv 里面，uv 再包含 micromamba
> ```
> 
> 而更像是：
> 
> ```text
> micromamba env 里的 python
>         ↓
> 被 uv 选中作为解释器来源
>         ↓
> uv 创建项目 .venv
>         ↓
> 你的代码实际跑在项目 .venv
> ```
> 
> ---
> 
> # 先纠正一个最重要的误解
> 
> ## uv 不会“把 micromamba 加入自己的环境”
> 
> **不会。**
> 
> uv 不认识“micromamba 这个环境管理器”这一层抽象；
> 它关心的是：**我要用哪个 Python 解释器来创建/管理项目虚拟环境。**
> 
> uv 的文档写得很明确：
> 
> * `--python` 可以指定“用于项目环境的 Python 解释器”
> * 如果你给的是某个虚拟环境里的解释器，uv **不会直接把包安装进那个环境**，而是会**用它来创建项目虚拟环境**。([Astral Docs][1])
> 
> 这句话基本就是你问题的答案。
> 
> ---
> 
> # 你可以这样建立心智模型
> 
> ## micromamba 环境 = 解释器供应商
> 
> 它提供：
> 
> * 某个 Python 版本
> * 某套 CUDA / Torch / 二进制栈
> * 一个可以调用的 `python`
> 
> 例如：
> 
> ```bash
> micromamba create -n torch-cu121-py311 python=3.11
> ```
> 
> 这个环境里会有一个 Python。
> micromamba 本身不带默认 Python；环境里的 Python 是你创建环境时装进去的。([Mamba][2])
> 
> ---
> 
> ## uv 项目环境 = 项目隔离层
> 
> uv 默认要求使用虚拟环境，并且会在项目目录里找 `.venv`；
> 运行 `uv run` 时，它会优先使用项目的 `.venv`。([Astral Docs][3])
> 
> 所以实际项目层通常是：
> 
> ```text
> repo/
>   pyproject.toml
>   uv.lock
>   .venv/
> ```
> 
> `.venv` 才是你日常开发、运行、测试、notebook 最应该绑定的环境。
> 
> ---
> 
> # 那么正确流程是不是“先 activate micromamba，再 uv init/add/run”？
> 
> **可以这样做，但更准确地说：先让 uv 看到你想用的那个 Python。**
> 
> 有两种方式。
> 
> ## 方式 A：先激活 micromamba，再让 uv 自动发现
> 
> ```bash
> micromamba activate torch-cu121-py311
> cd your-project
> uv init
> uv venv
> uv add torch ipykernel
> uv run python -V
> ```
> 
> 为什么这能工作？
> 
> 因为 uv 会从若干位置发现 Python，包括 `PATH` 上的解释器。
> 激活 micromamba 后，该环境的 `python` 会出现在 `PATH` 前面，于是 uv 往往会选到它。([Astral Docs][4])
> 
> 这个方式最直观。
> 
> ---
> 
> ## 方式 B：不激活，直接显式指定解释器
> 
> 这其实更稳。
> 
> 例如：
> 
> ```bash
> uv venv --python /path/to/micromamba/envs/torch-cu121-py311/bin/python
> ```
> 
> 或者在项目命令中指定：
> 
> ```bash
> uv sync --python /path/to/.../python
> ```
> 
> 因为 uv 的 `--python` 就是专门干这个的：指定项目环境要基于哪个解释器。([Astral Docs][1])
> 
> 这比“我猜当前 shell 激活的是对的环境”更可靠。
> 
> ---
> 
> # 所以到底谁在运行代码？
> 
> 对于混用方案，分三种情况看：
> 
> ## 1. 你直接运行 micromamba 环境里的 python
> 
> 例如：
> 
> ```bash
> micromamba run -n torch-cu121-py311 python script.py
> ```
> 
> 这时程序跑在 **micromamba 环境本体** 里。
> 
> 但这不是我推荐的项目日常方式，因为项目依赖没有被 `.venv + uv.lock` 明确隔离。
> 
> ---
> 
> ## 2. 你在项目里用 `uv run`
> 
> 例如：
> 
> ```bash
> uv run python script.py
> ```
> 
> 这时程序跑在 **项目 `.venv`** 里。
> 这通常才是你想要的。([Astral Docs][1])
> 
> ---
> 
> ## 3. 你在 VS Code/Jupyter 里运行
> 
> 这取决于你选中的 interpreter/kernel 是谁。
> 
> * 如果 VS Code 选的是项目 `.venv`，就跑在 `.venv`
> * 如果选的是 micromamba 环境里的 Python，就跑在 micromamba 环境本体
> 
> 所以 **VS Code 不是自动“懂你的意图”**，而是看你选了哪个环境。
> 
> ---
> 
> # 那 VS Code 怎么支持这个模型？
> 
> 可以，而且支持得很好，但你要记住：
> 
> ## VS Code 看到的是“Python 环境”，不是“你的心智模型”
> 
> VS Code Python 扩展会自动发现多种环境，包括：
> 
> * workspace 里的 `venv`
> * 系统 Python
> * Conda 环境
> 
> 它会扫描环境管理器并列出可选解释器。([Visual Studio Code][5])
> 
> 虽然文档里明确点名的是 Conda，但对你实践上最重要的是两件事：
> 
> * **项目 `.venv` 会被发现**
> * **Conda 类环境也会被发现**
> * 然后你来决定选哪个。([Visual Studio Code][5])
> 
> ---
> 
> # VS Code + Jupyter 在这里怎么工作
> 
> Jupyter kernel picker 会让你选择一个内核。
> VS Code 的 notebook kernel 管理就是基于“选具体 kernel / Python 环境”来工作的。([Visual Studio Code][6])
> 
> 因此混用模式下，最稳的做法是：
> 
> ## 推荐：让 Jupyter 绑定到项目 `.venv`
> 
> 也就是：
> 
> 1. 用 micromamba 提供底层 Python
> 2. 用 uv 在项目里建 `.venv`
> 3. 在项目 `.venv` 里装 `ipykernel`
> 4. 在 VS Code notebook 里选这个 `.venv` 对应的 kernel
> 
> 这样 notebook 和 `uv run python ...` 是同一个环境，最不容易错。
> 
> ---
> 
> # 一个完整的正确流程
> 
> 假设你要做一个需要 CUDA 12.1 底座的项目。
> 
> ## 第一步：建 micromamba 底座
> 
> ```bash
> micromamba create -n torch-cu121-py311 python=3.11
> ```
> 
> 如果你还要在这个底座层放少量二进制关键包，也可以在这层处理。
> 
> ---
> 
> ## 第二步：进入项目，告诉 uv 用这个 Python
> 
> ### 方法 1：激活后创建
> 
> ```bash
> micromamba activate torch-cu121-py311
> cd your-project
> uv init
> uv venv
> uv add --dev ipykernel
> ```
> 
> ### 方法 2：显式指定
> 
> ```bash
> cd your-project
> uv init
> uv venv --python /absolute/path/to/micromamba/envs/torch-cu121-py311/bin/python
> uv add --dev ipykernel
> ```
> 
> 这两种方法的本质一样：
> **让 `.venv` 基于你想要的 micromamba Python 建立。** ([Astral Docs][1])
> 
> ---
> 
> ## 第三步：之后日常运行都尽量走 uv
> 
> ```bash
> uv run python train.py
> uv run pytest
> uv run jupyter lab
> ```
> 
> 因为 uv 会自动找到项目 `.venv`，而且不要求你先手动 activate。([Astral Docs][1])
> 
> ---
> 
> # 那我还需不需要 micromamba activate？
> 
> ## 平时开发：不一定需要
> 
> 如果 `.venv` 已经建好了，很多时候你直接：
> 
> ```bash
> cd project
> uv run python ...
> ```
> 
> 就够了。
> 
> 因为 uv 会发现项目 `.venv`。([Astral Docs][1])
> 
> ---
> 
> ## 只有在这些场景下，activate 会更有用
> 
> * 你第一次创建 `.venv`，想让 uv 自动选中当前 micromamba Python
> * 你要直接检查底座层 Python / CUDA / Torch 状态
> * 你要在底座层手动运行某些命令
> 
> 所以 `activate` 更像是：
> 
> > “我现在在操作底座层”
> 
> 而不是：
> 
> > “以后每次跑项目都必须 activate”
> 
> ---
> 
> # 你真正要保证的是什么？
> 
> 不是“uv 识别 micromamba”。
> 
> 而是这两件事：
> 
> ## 1. 项目的 `.venv` 是用正确的解释器创建的
> 
> 也就是它的底层来源是你想要的 micromamba Python。
> 
> ## 2. 运行时你真的用的是项目 `.venv`
> 
> 也就是：
> 
> * CLI 用 `uv run`
> * VS Code 选项目 `.venv`
> * Jupyter 也选项目 `.venv` 对应的 kernel
> 
> 做到这两点，环境基本就不会乱。
> 
> ---
> 
> # 一个很实用的检查方法
> 
> 你可以在项目里运行：
> 
> ```bash
> uv run python -c "import sys; print(sys.executable)"
> ```
> 
> 如果输出的是项目目录下的 `.venv/.../python`，说明你当前项目运行环境是对的。
> 
> 再检查底层包：
> 
> ```bash
> uv run python -c "import torch; print(torch.__version__); print(torch.__file__)"
> ```
> 
> 这样就能确认你 import 到的是哪个环境里的 torch。
> 
> ---
> 
> # 关于 VS Code Jupyter，最后给你一个非常实用的规则
> 
> ## 不要在脑中想“Jupyter 支持 micromamba + uv 吗”
> 
> 应该想：
> 
> **Jupyter 只需要一个可运行的 Python kernel。**
> 
> 而你要做的是：
> 
> * 让项目 `.venv` 成为这个 kernel
> * 不要让 notebook 直接绑定到一个模糊的共享底座环境
> 
> VS Code 本身支持选择 kernel / Python 环境；Python 扩展也会自动发现常见环境。([Visual Studio Code][6])
> 
> 所以答案是：**支持，而且很自然。**
> 
> ---
> 
> # 最后压缩成一句话
> 
> 你的混用工作流应该理解成：
> 
> **micromamba 负责准备“哪种 Python/CUDA 机器”，uv 负责在这台机器上给每个项目建自己的 `.venv`，而 VS Code/Jupyter 最终绑定的是这个项目 `.venv`。** ([Astral Docs][1])
> 
> 如果你愿意，我下一条可以直接给你一份 **Windows/WSL 下可照抄的完整命令流程**，从 `micromamba create` 到 `uv venv`、`ipykernel`、再到 VS Code 里该点哪里。
> 
> [1]: https://docs.astral.sh/uv/reference/cli/ "Commands | uv"
> [2]: https://mamba.readthedocs.io/en/latest/user_guide/micromamba.html "Micromamba User Guide — documentation"
> [3]: https://docs.astral.sh/uv/pip/environments/ "Using environments | uv"
> [4]: https://docs.astral.sh/uv/concepts/python-versions/ "Python versions | uv"
> [5]: https://code.visualstudio.com/docs/python/environments "Python environments in VS Code"
> [6]: https://code.visualstudio.com/docs/datascience/jupyter-kernel-management "Manage Jupyter Kernels in VS Code"
> 
> ---(3
> 
> 你的理解 **已经很接近正确模型**。但我帮你把几个关键点再精确一下，否则以后可能在环境调试时会产生误解。
> 
> 先给一个**校正后的结论版本**：
> 
> > **micromamba 提供 Python + CUDA 等“基础运行时”；
> > uv 基于某个 Python 解释器创建项目 `.venv` 并管理依赖；
> > 项目代码和 Jupyter 通常运行在 `.venv`；
> > VS Code / Jupyter 只需要选择这个 `.venv` 的解释器或 kernel。**
> 
> 基本就是你说的，但有 **两个需要修正的小地方**。
> 
> ---
> 
> # 1️⃣ “python 基座”的真实含义
> 
> 你说：
> 
> > micromamba 创建 python 基础设施（基座）
> 
> 这个说法是对的，但要理解 **基座到底是什么**。
> 
> 一个 micromamba env 本质包含：
> 
> ```
> Python interpreter
> + site-packages
> + native libs (CUDA / MKL / etc)
> ```
> 
> 关键点：
> 
> **uv 不会“继承这个环境的 site-packages”。**
> 
> 它只会用 **这个 env 里的 Python 可执行文件** 来创建 `.venv`。
> 
> 换句话说：
> 
> ```
> micromamba env
>     └── python interpreter
>             │
>             ▼
> uv 使用这个 interpreter
> 创建
> project/.venv
> ```
> 
> 而 `.venv` 自己有独立的：
> 
> ```
> site-packages
> ```
> 
> 所以 `.venv` 不是“叠加在 conda env 上”。
> 
> 而是：
> 
> ```
> 独立环境
> 但 python binary 来自那个 env
> ```
> 
> ---
> 
> # 2️⃣ uv 如何“选择” micromamba env
> 
> 你说：
> 
> > uv 自动选择或手动选择 python 基座
> 
> 这个描述是正确的。
> 
> uv 实际只做一件事：
> 
> **寻找 Python 解释器。**
> 
> 来源可以是：
> 
> ```
> PATH 中的 python
> 系统 python
> conda env python
> micromamba env python
> pyenv python
> ```
> 
> 当你：
> 
> ```
> micromamba activate torch-cu121
> ```
> 
> 之后：
> 
> ```
> python
> ```
> 
> 指向的是：
> 
> ```
> .../micromamba/envs/torch-cu121/bin/python
> ```
> 
> 于是 uv 创建 `.venv` 时默认用这个。
> 
> 也可以显式指定：
> 
> ```
> uv venv --python /path/to/mamba/env/python
> ```
> 
> ---
> 
> # 3️⃣ 环境结构的真实形态
> 
> 很多人脑中会想象成：
> 
> ```
> micromamba env
>    └── uv venv
>         └── packages
> ```
> 
> 实际上不是嵌套。
> 
> 更准确是：
> 
> ```
> micromamba env
>    └── python binary
>          │
>          ▼
> project/.venv
>    ├── python (symlink or copy)
>    └── site-packages (project deps)
> ```
> 
> 也就是：
> 
> **共享解释器来源，但不共享包。**
> 
> 这也是为什么 `.venv` 仍然是完全隔离的。
> 
> ---
> 
> # 4️⃣ 什么时候这个模型真正有价值
> 
> 如果你只是普通 Python 项目：
> 
> ```
> uv venv
> ```
> 
> 就够了。
> 
> micromamba 的价值主要体现在：
> 
> ### GPU / CUDA
> 
> 例如：
> 
> ```
> CUDA 11.8
> CUDA 12.1
> ```
> 
> 这些涉及：
> 
> ```
> libcuda
> cudnn
> torch wheels
> ```
> 
> 这些 **conda 管理更稳定**。
> 
> 所以你可以：
> 
> ```
> micromamba env: torch-cu118
> micromamba env: torch-cu121
> ```
> 
> 然后：
> 
> ```
> project A -> venv based on cu118 python
> project B -> venv based on cu121 python
> ```
> 
> 这样每个项目：
> 
> ```
> CUDA stack correct
> +
> project deps isolated
> ```
> 
> ---
> 
> # 5️⃣ VS Code + Jupyter 的关键点
> 
> 你最后一句：
> 
> > 只要 Jupyter 选择该 venv 即可
> 
> **完全正确。**
> 
> Jupyter kernel 本质只是：
> 
> ```
> python interpreter path
> ```
> 
> 当 `.venv` 里有：
> 
> ```
> ipykernel
> ```
> 
> VS Code 就会识别它。
> 
> 所以最终你在 notebook 里看到的是类似：
> 
> ```
> Python (.venv)
> ```
> 
> 只要选这个即可。
> 
> ---
> 
> # 6️⃣ 最终的完整心智模型（推荐记住这一版）
> 
> 可以把整个系统想象成 **三层结构**：
> 
> ```
> Layer 1  (runtime stack)
> micromamba env
> Python + CUDA + system libs
> 
> Layer 2  (project environment)
> uv .venv
> project dependencies
> 
> Layer 3  (execution)
> VS Code / Jupyter / uv run
> ```
> 
> 运行路径：
> 
> ```
> Jupyter / CLI
>       │
>       ▼
> project/.venv/python
>       │
>       ▼
> Python runtime
> (from micromamba env originally)
> ```
> 
> ---
> 
> # 7️⃣ 一个很多人不知道但非常有用的技巧
> 
> 如果你想 **确认 `.venv` 用的是哪个 Python 基座**：
> 
> 运行：
> 
> ```
> uv run python -c "import sys; print(sys.base_prefix)"
> ```
> 
> 如果输出类似：
> 
> ```
> .../micromamba/envs/torch-cu121
> ```
> 
> 说明 `.venv` 的 **base interpreter 来自那个 env**。
> 
> 这在调试 CUDA / torch 环境时非常有用。
> 
> ---
> 
> # 8️⃣ 最后给你的一个实践建议（很关键）
> 
> 为了避免混乱，我强烈建议：
> 
> **给 micromamba env 起清晰名字**
> 
> 例如：
> 
> ```
> torch-cu118-py310
> torch-cu121-py311
> cpu-py311
> ```
> 
> 然后项目 README 写：
> 
> ```
> Base runtime: torch-cu121-py311
> ```
> 
> 这样半年后你还能知道这个项目依赖哪个 GPU stack。
> 
> ---
> 
> ✅ **最终一句话总结**
> 
> 你的模型基本正确，只需要记住这一点：
> 
> > **micromamba env 提供 Python 运行时；uv 基于这个 Python 创建独立 `.venv`；项目和 Jupyter 实际运行在 `.venv` 中。**
> 
> ---
> 
> 如果你愿意，我可以再补一个 **“90% ML 工程师其实不知道的 uv + conda 混用陷阱”**（和 PyTorch / CUDA / wheels 的解析顺序有关）。
> 那个知识点会让你以后 **少浪费很多调环境时间**。
> 
> ---(4
> 
> 你的直觉 **基本正确，但需要稍微精确一下**。关键区别不是“是不是 Python 包”，而是：
> 
> > **它们是否主要依赖大型原生（二进制）库和系统 ABI。**
> 
> 换句话说，**PyTorch 和 CUDA 在技术上仍然是 Python packages，但它们的核心价值不在 Python 层，而在底层的 C/C++/GPU 二进制。**
> 
> 理解这一点后，你就能理解为什么 **conda / micromamba 在这类栈上更舒服，而 uv/pip 更适合纯 Python 依赖**。
> 
> ---
> 
> # 1️⃣ Python 包 vs Binary 依赖
> 
> 典型 Python 包（纯 Python 或轻量 C 扩展）：
> 
> ```text
> requests
> pydantic
> fastapi
> pytest
> transformers
> ```
> 
> 这些包的特点：
> 
> * Python 代码为主
> * wheel 很小
> * 依赖链简单
> * pip / uv 可以轻松解析和安装
> 
> ---
> 
> 而像 **PyTorch** 这种库就完全不同。
> 
> 它的 Python 包只是一个 **binding 层**，真正的核心是：
> 
> ```text
> libtorch (C++)
> CUDA kernels
> cuDNN
> NCCL
> MKL / OpenBLAS
> 大量 GPU 编译代码
> ```
> 
> 安装 PyTorch 时，实际上在下载：
> 
> ```text
> 几百 MB ~ 几 GB 的二进制库
> ```
> 
> Python 只是调用接口。
> 
> ---
> 
> # 2️⃣ CUDA 更不是 Python 依赖
> 
> **CUDA** 本身甚至不是 Python 包，它是：
> 
> ```text
> GPU runtime
> compiler (nvcc)
> driver interface
> math libraries
> ```
> 
> 很多 Python ML 库只是 **链接 CUDA runtime**。
> 
> 例如：
> 
> ```text
> PyTorch
> TensorFlow
> JAX
> RAPIDS
> ```
> 
> 这些库在运行时会加载 CUDA 的 `.so` / `.dll`。
> 
> ---
> 
> # 3️⃣ 为什么 conda / micromamba 在这里更舒服
> 
> conda 的包格式不是只针对 Python。
> 
> 它可以打包：
> 
> ```text
> Python
> C++
> Fortran
> CUDA libs
> system libraries
> ```
> 
> 例如一个 conda PyTorch 包会包含：
> 
> ```text
> torch
> libtorch
> cudnn
> cublas
> nccl
> ```
> 
> 而 pip / uv 只能处理：
> 
> ```text
> Python wheel
> ```
> 
> 所以 pip 解决这个问题的方法是：
> 
> ```text
> 预编译巨型 wheel
> ```
> 
> 例如：
> 
> ```text
> torch-2.x-cp311-linux_x86_64.whl
> ```
> 
> 里面已经把很多 CUDA runtime 打包进去了。
> 
> 这就是为什么 torch wheel 动辄 **几百 MB**。
> 
> ---
> 
> # 4️⃣ 所以本质区别是这个
> 
> 不要把区别理解为：
> 
> ```text
> conda = binary
> pip = python
> ```
> 
> 更准确是：
> 
> | 类型                 | 适合工具               |
> | ------------------ | ------------------ |
> | 纯 Python 生态        | uv / pip           |
> | heavy native stack | conda / micromamba |
> 
> 原因是 **ABI / 编译链 / 系统库依赖**。
> 
> ---
> 
> # 5️⃣ 一个更工程化的视角
> 
> 你可以把 ML 环境看成两层：
> 
> ### Runtime layer
> 
> ```text
> Python
> CUDA
> cuDNN
> libtorch
> BLAS
> system libraries
> ```
> 
> 这层决定：
> 
> ```text
> GPU 能不能用
> ABI 是否兼容
> ```
> 
> 这就是 **micromamba 的职责**。
> 
> ---
> 
> ### Python dependency layer
> 
> ```text
> transformers
> datasets
> pandas
> hydra
> wandb
> notebook
> pytest
> ```
> 
> 这层才是 **uv 的强项**。
> 
> ---
> 
> # 6️⃣ 为什么很多 ML 工程师环境会崩
> 
> 因为他们混淆了这两层。
> 
> 典型错误流程：
> 
> ```text
> pip install torch
> pip install tensorflow
> pip install jax
> ```
> 
> 然后 CUDA / cuDNN / ABI 全冲突。
> 
> ---
> 
> 而比较稳的方式是：
> 
> ```text
> micromamba env
>    └─ torch + cuda stack
> 
> uv project
>    └─ python deps
> ```
> 
> 这样职责分离。
> 
> ---
> 
> # 7️⃣ 但要注意一个现实
> 
> 很多时候 **pip/uv 其实已经够用**。
> 
> 例如：
> 
> ```bash
> uv add torch torchvision
> ```
> 
> pip wheel 已经包含：
> 
> ```text
> CUDA runtime
> ```
> 
> 这在 **单一 GPU 栈** 时很好用。
> 
> 只有在这些情况下 conda 才明显更优：
> 
> * 多 CUDA 版本
> * 多 torch 版本
> * RAPIDS / CUDA C++ stack
> * HPC cluster
> * 编译型科学计算
> 
> ---
> 
> # 8️⃣ 一个非常有用的判断标准
> 
> 以后遇到一个包，可以问：
> 
> **这个包主要是 Python 逻辑，还是 native runtime？**
> 
> 如果是：
> 
> ### Python logic
> 
> 例如：
> 
> ```text
> fastapi
> langchain
> transformers
> pandas
> ```
> 
> 用 uv 完全没问题。
> 
> ---
> 
> ### native runtime
> 
> 例如：
> 
> ```text
> torch
> tensorflow
> jax
> opencv
> rapids
> ```
> 
> 那你就要考虑：
> 
> ```text
> CUDA
> BLAS
> compiler
> ABI
> ```
> 
> 这时 conda 往往更舒服。
> 
> ---
> 
> # 9️⃣ 所以你刚才的总结可以修正为
> 
> 更精确的说法是：
> 
> > **CUDA 是系统级 runtime；PyTorch 是 Python binding + 巨型 native runtime；因此它们更接近“binary stack”而不是普通 Python 包。**
> 
> 而 uv 主要擅长管理：
> 
> ```text
> Python dependency graph
> ```
> 
> micromamba 更擅长管理：
> 
> ```text
> native runtime stack
> ```
> 
> ---
> 
> ✅ **最终一句话版本**
> 
> 你刚才的理解可以升级为：
> 
> > **CUDA / PyTorch 等 ML 框架虽然通过 Python 使用，但本质依赖大型 native runtime，因此更像“系统级二进制栈”，这也是为什么 conda/micromamba 在这些场景下更稳定，而 uv/pip 更适合纯 Python 依赖管理。**
> 
> ---
> 
> 如果你愿意，我可以再给你讲一个 **很多 ML 工程师第一次理解后都会“恍然大悟”的概念：**
> 
> **为什么 `pip install torch` 有时会偷偷装 CPU 版、CUDA 版、甚至错误 CUDA 版。**
> 
> 理解那个机制，你以后调 GPU 环境会轻松很多。
> 
> ---(5
> 
> 这是个非常好的问题，因为这里正好是 **Python 环境结构的核心机制**。如果你理解了 `site-packages` 与 native libraries 的区别，很多环境问题都会变得非常清晰。
> 
> 我先给一个结论版，然后逐层拆解。
> 
> **结论：**
> 
> * `site-packages` 是 **Python 包安装目录**
> * native libraries 是 **底层 C/C++/GPU 动态库**
> * `uv venv` 不会继承 `site-packages`
> * 但 `.venv` 仍然会使用系统或 runtime 层提供的 native libraries（例如 CUDA）
> 
> ---
> 
> # 1️⃣ 什么是 `site-packages`
> 
> 在任何 Python 环境中都会有一个目录：
> 
> ```text
> .../lib/python3.x/site-packages/
> ```
> 
> 这个目录的作用非常简单：
> 
> > **存放 Python 安装的包**
> 
> 例如如果你安装：
> 
> ```bash
> pip install numpy pandas
> ```
> 
> 它们会被安装到：
> 
> ```text
> site-packages/
>     numpy/
>     pandas/
> ```
> 
> 当 Python 运行：
> 
> ```python
> import numpy
> ```
> 
> Python 会从 `sys.path` 中寻找模块，其中最重要的路径之一就是 `site-packages`。
> 
> 你可以自己查看：
> 
> ```python
> import sys
> print(sys.path)
> ```
> 
> ---
> 
> # 2️⃣ 一个 Python 环境的基本结构
> 
> 一个典型环境（venv / conda / micromamba）看起来像这样：
> 
> ```text
> env/
>   bin/
>     python
>   lib/
>     python3.11/
>       site-packages/
> ```
> 
> 其中：
> 
> | 部分              | 作用               |
> | --------------- | ---------------- |
> | `python`        | Python 解释器       |
> | `site-packages` | Python packages  |
> | `lib/*.so`      | native libraries |
> 
> ---
> 
> # 3️⃣ Python package vs Native library
> 
> 这两个经常被混淆。
> 
> ## Python package
> 
> 例如：
> 
> ```
> pandas
> fastapi
> requests
> ```
> 
> 安装后结构通常是：
> 
> ```text
> site-packages/
>     pandas/
>         __init__.py
> ```
> 
> 主要是 Python 代码。
> 
> ---
> 
> ## Native library
> 
> 例如：
> 
> * BLAS
> * CUDA
> * cuDNN
> * libtorch
> 
> 这些通常是：
> 
> ```text
> .so  (Linux)
> .dll (Windows)
> .dylib (macOS)
> ```
> 
> 例如：
> 
> ```text
> libcuda.so
> libcudnn.so
> libtorch.so
> ```
> 
> Python **不会直接管理这些文件**。
> 
> 它们通过：
> 
> ```
> dynamic linker
> ```
> 
> 在系统层加载。
> 
> ---
> 
> # 4️⃣ PyTorch 的特殊情况
> 
> 像 **PyTorch** 这样的库同时包含：
> 
> ### Python layer
> 
> ```text
> site-packages/torch/
> ```
> 
> 用于：
> 
> ```
> import torch
> ```
> 
> ---
> 
> ### Native runtime
> 
> 例如：
> 
> ```
> libtorch.so
> CUDA kernels
> ```
> 
> 这些会被 Python extension 加载。
> 
> ---
> 
> # 5️⃣ 为什么 uv 不继承 micromamba 的 site-packages
> 
> 当 uv 创建 `.venv` 时，它做的是：
> 
> ```text
> 创建一个新的 Python virtual environment
> ```
> 
> 结构类似：
> 
> ```text
> project/
>   .venv/
>     bin/python
>     lib/python3.x/site-packages/
> ```
> 
> 这个 `site-packages` **一开始是空的**。
> 
> 原因是：
> 
> > venv 的设计目标就是 **依赖隔离**
> 
> 如果继承了父环境的 `site-packages`：
> 
> ```
> conda env packages
> +
> project packages
> ```
> 
> 那么项目依赖就不可控了。
> 
> 这会破坏：
> 
> ```
> pyproject.toml
> uv.lock
> ```
> 
> 的可复现性。
> 
> ---
> 
> # 6️⃣ 但 native libraries 仍然会被使用
> 
> 这就是很多人困惑的地方。
> 
> 虽然 `.venv` 有独立的 `site-packages`，但它仍然使用：
> 
> ```
> 系统 loader
> ```
> 
> 来加载 native libraries。
> 
> 例如 CUDA。
> 
> CUDA 可能在：
> 
> ```
> /usr/lib
> conda env
> NVIDIA driver
> ```
> 
> Python extension 会通过：
> 
> ```
> LD_LIBRARY_PATH
> PATH
> dynamic linker
> ```
> 
> 找到这些库。
> 
> 所以 `.venv` **不需要复制 CUDA**。
> 
> ---
> 
> # 7️⃣ 所以结构实际上是这样的
> 
> 假设你有：
> 
> ```
> micromamba env
> ```
> 
> 和：
> 
> ```
> project .venv
> ```
> 
> 结构关系更像：
> 
> ```
> micromamba env
>     python
>     CUDA libs
>     system libs
>         ↑
>         runtime loader
> 
> project/.venv
>     python interpreter
>     site-packages
>         torch
>         transformers
> ```
> 
> 也就是说：
> 
> ```
> python packages -> isolated
> native libs -> shared runtime
> ```
> 
> ---
> 
> # 8️⃣ 为什么这种设计非常重要
> 
> 如果 `.venv` 继承 `site-packages`：
> 
> ```
> conda torch
> +
> pip torch
> ```
> 
> 很容易发生：
> 
> ```
> ABI mismatch
> symbol errors
> segfault
> ```
> 
> 这就是很多 Python ML 环境崩溃的原因。
> 
> ---
> 
> # 9️⃣ 一个你可以自己验证的小实验
> 
> 进入任何 Python 环境：
> 
> ```python
> import sys
> print(sys.prefix)
> print(sys.base_prefix)
> ```
> 
> 通常会看到：
> 
> ```
> sys.prefix       -> .venv
> sys.base_prefix  -> base python
> ```
> 
> 这说明：
> 
> ```
> venv uses base interpreter
> but separate packages
> ```
> 
> ---
> 
> # 🔟 总结
> 
> 可以用一句非常清晰的话记住：
> 
> **`site-packages` = Python 依赖层**
> **native libraries = 系统 / runtime 层**
> 
> 所以当你混用：
> 
> ```
> micromamba + uv
> ```
> 
> 实际分工是：
> 
> | 层               | 管理工具       |
> | --------------- | ---------- |
> | native runtime  | micromamba |
> | python packages | uv         |
> 
> ---
> 
> 如果你愿意，我可以再画一张 **“Python 环境三层架构图”**（interpreter / site-packages / native runtime），那张图会把 **venv / conda / pip / uv 的关系一次性讲清楚。
> 很多 ML 工程师其实都没有真正理解这张图。
>---(5
> 下面我先给你一张 **完整的 Python/ML 环境架构图**，然后解释两个非常关键的现实问题：
> 
> 1. `uv + conda/micromamba` 混用时的常见陷阱
> 2. 为什么 `pip install torch` 经常装到 **CPU 版 / 错 CUDA 版**
> 
> 这两个问题其实都源于 **Python 运行时加载机制 + wheel 分发策略**。
> 
> ---
> 
> # 一、Python / ML 环境架构图
> 
> 把整个系统想象成 **四层结构**（从底到上）。
> 
> ```text
> ┌─────────────────────────────────────┐
> │ Layer 4 — Application               │
> │                                     │
> │  your code                          │
> │  notebooks                          │
> │  training scripts                   │
> └─────────────────────────────────────┘
>                  │
>                  ▼
> ┌─────────────────────────────────────┐
> │ Layer 3 — Python Packages           │
> │ (managed by uv / pip)               │
> │                                     │
> │  transformers                       │
> │  pandas                             │
> │  lightning                          │
> │  torch (Python bindings)            │
> │                                     │
> │ location:                           │
> │  project/.venv/site-packages        │
> └─────────────────────────────────────┘
>                  │
>                  ▼
> ┌─────────────────────────────────────┐
> │ Layer 2 — Python Interpreter        │
> │                                     │
> │  python executable                  │
> │  CPython runtime                    │
> │                                     │
> │ source could be:                    │
> │  system python                      │
> │  pyenv                              │
> │  micromamba env                     │
> │                                     │
> │ uv venv is created from this        │
> └─────────────────────────────────────┘
>                  │
>                  ▼
> ┌─────────────────────────────────────┐
> │ Layer 1 — Native Runtime            │
> │                                     │
> │  CUDA                               │
> │  cuDNN                              │
> │  NCCL                               │
> │  BLAS / MKL                         │
> │  GPU driver                         │
> │                                     │
> │ loaded dynamically (.so/.dll)       │
> └─────────────────────────────────────┘
> ```
> 
> ---
> 
> # 二、uv + micromamba 在这张图中的位置
> 
> 如果你混用两者，职责分工其实很清晰：
> 
> ```text
> Layer 4   your code
> 
> Layer 3   uv manages
>           Python packages
> 
> Layer 2   Python interpreter
>           (often from micromamba)
> 
> Layer 1   CUDA / system runtime
>           usually installed by conda
> ```
> 
> 换句话说：
> 
> ```text
> micromamba → runtime infrastructure
> uv         → project dependency graph
> ```
> 
> ---
> 
> # 三、`uv + conda` 混用最常见的陷阱
> 
> 最大的坑只有一个：
> 
> > **conda env 和 uv venv 同时安装 Python packages**
> 
> 例如很多人会这样：
> 
> ```bash
> micromamba create -n torch python=3.11 pytorch
> ```
> 
> 然后：
> 
> ```bash
> uv add torch transformers
> ```
> 
> 结果就出现：
> 
> ```text
> conda torch
> +
> pip torch
> ```
> 
> 这会导致：
> 
> ```
> two different libtorch
> two different CUDA bindings
> ```
> 
> 最终可能出现：
> 
> * segmentation fault
> * symbol not found
> * GPU 不可见
> * CUDA mismatch
> 
> **正确做法：**
> 
> 如果你决定：
> 
> ```text
> python packages → uv
> ```
> 
> 那就不要在 conda env 里再装 Python packages。
> 
> micromamba env 应该只提供：
> 
> ```
> python
> cuda runtime
> system libs
> ```
> 
> ---
> 
> # 四、为什么 `pip install torch` 会装错版本
> 
> 这个问题其实是 **wheel 分发机制**导致的。
> 
> 我们先看 **PyTorch** 的包结构。
> 
> PyTorch 在 PyPI 上并不只有一个版本。
> 
> 实际存在很多 wheel，例如：
> 
> ```
> torch-2.2.0+cpu
> torch-2.2.0+cu118
> torch-2.2.0+cu121
> ```
> 
> 但 PyPI 默认只提供：
> 
> ```
> CPU version
> ```
> 
> CUDA wheels 在 PyTorch 自己的 index 上。
> 
> 例如：
> 
> ```
> https://download.pytorch.org/whl/cu121
> ```
> 
> ---
> 
> # 五、pip 默认行为
> 
> 当你运行：
> 
> ```bash
> pip install torch
> ```
> 
> pip 会去：
> 
> ```
> pypi.org/simple
> ```
> 
> 搜索。
> 
> 结果是：
> 
> ```
> torch-2.x CPU wheel
> ```
> 
> 所以 **默认装的是 CPU 版**。
> 
> ---
> 
> # 六、安装 CUDA 版需要额外 index
> 
> 例如：
> 
> CUDA 12.1：
> 
> ```bash
> pip install torch --index-url https://download.pytorch.org/whl/cu121
> ```
> 
> 或者：
> 
> ```bash
> pip install torch torchvision torchaudio \
>     --index-url https://download.pytorch.org/whl/cu121
> ```
> 
> 否则 pip 根本看不到 CUDA wheels。
> 
> ---
> 
> # 七、为什么有时装到“错误 CUDA 版本”
> 
> 即使你指定 CUDA，也可能装错。
> 
> 原因是 wheel compatibility 规则。
> 
> pip 选择 wheel 时会匹配：
> 
> ```
> python version
> platform
> architecture
> ABI
> ```
> 
> 例如：
> 
> ```
> cp311
> manylinux
> x86_64
> ```
> 
> 如果没有完全匹配：
> 
> ```
> pip fallback
> ```
> 
> 可能选：
> 
> ```
> cpu wheel
> ```
> 
> 或者旧 CUDA wheel。
> 
> ---
> 
> # 八、conda 为什么更稳定
> 
> conda 的 solver 会同时考虑：
> 
> ```
> python version
> cuda runtime
> torch
> cudnn
> nccl
> ```
> 
> 例如：
> 
> ```bash
> micromamba install pytorch pytorch-cuda=12.1 -c pytorch -c nvidia
> ```
> 
> solver 会保证：
> 
> ```
> torch compatible with cuda
> ```
> 
> 而 pip 不会做这种系统级依赖解析。
> 
> ---
> 
> # 九、uv + pip 的正确 torch 安装方式
> 
> 如果你使用 uv 管 Python packages，推荐明确指定 index：
> 
> 例如：
> 
> ```bash
> uv add torch --index https://download.pytorch.org/whl/cu121
> ```
> 
> 或者在 `pyproject.toml`：
> 
> ```toml
> [[tool.uv.index]]
> name = "pytorch"
> url = "https://download.pytorch.org/whl/cu121"
> ```
> 
> 然后：
> 
> ```
> uv add torch
> ```
> 
> 这样 uv resolver 才能看到 CUDA wheels。
> 
> ---
> 
> # 十、一个 ML 环境的推荐结构
> 
> 最终你的机器上会是这样的：
> 
> ```text
> micromamba envs
> 
> torch-cu118
> torch-cu121
> cpu-py311
> ```
> 
> 每个 env 只包含：
> 
> ```
> python
> cuda runtime
> system libs
> ```
> 
> 而项目：
> 
> ```text
> projectA
>   pyproject.toml
>   uv.lock
>   .venv
> 
> projectB
>   pyproject.toml
>   uv.lock
>   .venv
> ```
> 
> `.venv` 中安装：
> 
> ```
> torch
> transformers
> datasets
> pandas
> ```
> 
> 运行：
> 
> ```
> uv run python train.py
> ```
> 
> VS Code / Jupyter 选择 `.venv`。
> 
> ---
> 
> # 十一、一个很多人第一次理解都会“顿悟”的点
> 
> 在 ML Python 生态里：
> 
> **Python 只是 orchestrator。**
> 
> 真正运行的是：
> 
> ```
> CUDA kernels
> C++ operators
> GPU runtime
> ```
> 
> Python 只是：
> 
> ```
> binding layer
> ```
> 
> 这也是为什么：
> 
> ```
> torch wheel = 700MB
> ```
> 
> 而：
> 
> ```
> transformers wheel = 1MB
> ```
> 
> ---
> 
> 如果你愿意，我可以再给你讲一个 **ML 环境里最隐蔽但最常见的问题**：
> 
> > 为什么有时候 **CUDA 明明安装了，torch.cuda.is_available() 仍然是 False**
> 
> 这个问题背后的机制其实非常有意思，而且理解之后你会彻底掌控 GPU 环境调试。

## Context
- Date captured: 2026-03-16 16:53
- Prompt: Not captured.
- Conversation link: none

## Related
- [[mamba]]
- [[uv]]

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
