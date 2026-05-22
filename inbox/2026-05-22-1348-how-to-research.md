---
tags:
  - inspiration
  - chatgpt
kind: resource
format: capture
status: fleeting
source: ChatGPT
aliases:
  - How to Research
---

# How to Research

## Why
Not specified.

## Excerpt
> [!quote] ChatGPT reply
> 不够，但**这是一个很好的起点**。
> 
> 如果你的目标是找“高性能、高效率”的模型，只看近五年的顶会文章会有几个盲区：
> 
> ## 1. 顶会论文 ≠ 当前最强工程模型
> 
> 顶会更偏向：
> 
> * 新方法
> * 新理论
> * 新 benchmark
> * 可发表的创新点
> 
> 但真正“高性能、高效率”的模型，很多来自：
> 
> * 工业界技术报告
> * 开源模型 release note
> * GitHub 实现
> * 推理框架优化
> * 硬件适配
> * 系统论文
> * leaderboard 和实际部署反馈
> 
> 比如一个模型论文看起来很强，但如果：
> 
> * 推理慢
> * 显存占用大
> * batch scaling 差
> * 没有成熟实现
> * 量化后掉点严重
> * 不支持你要的硬件
> 
> 那它对工程来说未必“高效”。
> 
> ---
> 
> ## 2. “高性能”和“高效率”要分开定义
> 
> 你需要先问：
> 
> **性能是指什么？**
> 
> * 准确率？
> * 推理质量？
> * 多模态能力？
> * 长上下文？
> * 代码能力？
> * reasoning？
> * 训练稳定性？
> * 泛化能力？
> 
> **效率是指什么？**
> 
> * 训练 FLOPs？
> * 推理 latency？
> * tokens/sec？
> * 显存占用？
> * 参数量？
> * 部署成本？
> * 能耗？
> * fine-tuning 成本？
> * 数据效率？
> 
> 不同目标下，“最优模型”完全不同。
> 
> 例如：
> 
> | 目标    | 你该关注                                |
> | ----- | ----------------------------------- |
> | 本地部署  | 小模型、量化、推理框架                         |
> | 云端高吞吐 | batching、KV cache、serving system    |
> | 代码生成  | HumanEval、SWE-bench、实际 IDE 集成       |
> | RAG   | embedding、reranker、context handling |
> | 多模态   | VQA、OCR、video understanding         |
> | 训练研究  | architecture、scaling law、optimizer  |
> 
> 所以不能只问“哪个模型最好”，而要问：
> 
> > 在我的任务、硬件、成本约束下，哪个模型的性能/效率 trade-off 最好？
> 
> 这是更工程化的问题。
> 
> ---
> 
> ## 3. 顶会文章应该看，但要分类看
> 
> 近五年顶会文章很有价值，尤其是这些方向：
> 
> ### 模型结构
> 
> 例如 Transformer 变体、MoE、state-space model、linear attention、diffusion、multimodal architecture。
> 
> 你看的是：
> 
> * 它为什么比旧结构更有效？
> * 复杂度从哪里降低？
> * 是否真的在大规模下成立？
> * 有没有被后续模型采用？
> 
> ### 训练方法
> 
> 包括：
> 
> * pretraining recipe
> * instruction tuning
> * RLHF / DPO / GRPO
> * curriculum learning
> * synthetic data
> * data filtering
> * tokenizer / optimizer / regularization
> 
> 很多性能提升不是来自 architecture，而是来自数据和训练策略。
> 
> ### 推理优化
> 
> 这对“效率”尤其关键：
> 
> * quantization
> * pruning
> * speculative decoding
> * KV cache compression
> * FlashAttention
> * continuous batching
> * vLLM-style serving
> * distillation
> 
> 如果你只看模型论文，不看系统优化，会严重低估工程效率的重要性。
> 
> ---
> 
> ## 4. 你还需要看这些来源
> 
> 更完整的路径是：
> 
> | 来源                   | 作用                     |
> | -------------------- | ---------------------- |
> | 顶会论文                 | 找核心思想和理论趋势             |
> | arXiv                | 获取最新方法，尤其是工业界报告        |
> | Papers with Code     | 看 benchmark 排名和复现情况    |
> | Hugging Face         | 看模型生态、下载量、license、实际使用 |
> | GitHub               | 看实现质量、issue、维护状态       |
> | Leaderboard          | 看相对性能，但不要盲信            |
> | 技术博客                 | 看工程部署经验                |
> | benchmark report     | 看真实场景表现                |
> | serving framework 文档 | 看部署效率                  |
> 
> 对于 AI infra / 模型系统方向，你尤其应该看：
> 
> * vLLM
> * TensorRT-LLM
> * llama.cpp
> * FlashAttention
> * DeepSpeed
> * Megatron-LM
> * Ray
> * Triton
> * SGLang
> * Hugging Face Transformers / TGI
> 
> 因为很多“高效率”不是模型本身，而是**模型 × 系统 × 硬件**共同决定的。
> 
> ---
> 
> ## 5. 一个更好的研究框架
> 
> 你可以用这个流程找高性能高效率模型：
> 
> ### 第一步：定义任务
> 
> 例如：
> 
> > 我要找一个适合本地运行的代码助手模型，显存不超过 16GB，主要用于 Python/C++，希望响应快。
> 
> 这比“找最强模型”清楚得多。
> 
> ### 第二步：确定指标
> 
> 例如：
> 
> * HumanEval / MBPP / SWE-bench
> * tokens/sec
> * VRAM usage
> * context length
> * quantization support
> * license
> * fine-tuning difficulty
> 
> ### 第三步：筛选候选模型
> 
> 从这些地方找：
> 
> * 近两年开源模型
> * Hugging Face trending
> * Papers with Code
> * LMSYS / Chatbot Arena
> * 相关 benchmark leaderboard
> * GitHub 社区反馈
> 
> ### 第四步：读论文和技术报告
> 
> 重点不是逐字读，而是看：
> 
> * architecture
> * data mixture
> * training recipe
> * evaluation setup
> * ablation study
> * compute cost
> * limitations
> 
> ### 第五步：实际跑 benchmark
> 
> 这是最关键的。
> 
> 论文里的 benchmark 往往不等于你的场景。你至少应该测：
> 
> * 你的数据
> * 你的硬件
> * 你的 batch size
> * 你的延迟要求
> * 你的精度要求
> 
> ---
> 
> ## 6. 我的建议：不要“追模型”，要“追范式”
> 
> 如果你只追近五年顶会模型，很容易陷入“论文收集癖”。
> 
> 更好的学习路径是抓住几个主线：
> 
> 1. **Architecture evolution**
>    Transformer → efficient attention → MoE → SSM/hybrid models
> 
> 2. **Scaling law**
>    参数、数据、计算量如何影响性能
> 
> 3. **Post-training**
>    SFT、RLHF、DPO、RLAIF、reasoning tuning
> 
> 4. **Inference optimization**
>    KV cache、quantization、speculative decoding、serving systems
> 
> 5. **Evaluation**
>    benchmark 的可靠性、数据污染、真实任务评估
> 
> 6. **Deployment trade-off**
>    latency、throughput、cost、reliability、observability
> 
> 这比单纯追“最强模型”更接近专业 AI systems 思维。
> 
> ---
> 
> ## 结论
> 
> 只研究近五年的顶会文章，**不够**。
> 
> 更准确地说：
> 
> > 顶会论文告诉你“什么思想可能重要”，但不一定告诉你“什么模型在你的场景下最好用”。
> 
> 你应该把顶会论文作为理论和趋势入口，然后结合：
> 
> * arXiv 最新报告
> * benchmark leaderboard
> * 开源实现
> * 推理框架
> * 硬件约束
> * 实际测试
> 
> 来判断模型是否真的高性能、高效率。
> 
> 一个更专业的问题会是：
> 
> > 在给定任务、硬件、成本和延迟约束下，哪些模型或架构位于最优 Pareto frontier 上？
> 
> 这才是研究“高性能、高效率模型”的核心。

## Context
- Date captured: 2026-05-22 13:48
- Prompt: Not captured.
- Conversation link: none

## Related
- none

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
