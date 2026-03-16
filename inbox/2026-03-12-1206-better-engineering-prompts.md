---
tags:
  - inspiration
  - chatgpt
  - engineering
  - prompting
kind: "resource"
format: "capture"
status: "fleeting"
source: "ChatGPT"
aliases:
  - "Better Engineering Prompts"
---

# Better Engineering Prompts

## Why
This captures how to ask for context-aware engineering judgment instead of receiving only generic default advice.

## Excerpt
> [!quote] ChatGPT reply
> 下次如果你希望我不只是“答对”，而是“做出高质量工程判断”，最好在请求里明确要求：
> 
> `结合当前上下文做最优决策，并解释 why，而不是只给默认可行方案。`
> 
> 最有效的是把“你要我回答到哪一层”说清楚。
> 
> 你可以直接加一句：
> 
> - 不要只给默认建议，请结合这个仓库的约定和这次改动的语义做判断。
> - 我想知道最佳实践，不只是可行做法。
> - 请区分通用默认规则和这次具体情境下的最佳选择。
> - 如果这是一个有设计取舍的问题，请优先解释你的决策理由。
> - 请按 code review / senior engineer 的标准给建议，不要只给保守默认值。
> 
> 如果是 Git / commit 这类问题，尤其推荐你这样问：
> 
> - 按这个仓库的 commit convention，帮我判断这次哪些 commit 应该写 body，哪些不用，并解释原因。
> - 不要只生成 commit message，请先判断提交边界和信息密度是否需要 body。
> - 我想提升 Git 专业性，请从“为什么这样提交更好”来回答。
> 
> 更广义地说：
> 
> - 请给我“默认做法”和“本次上下文下的最佳做法”，并说明差异。
> - 如果你的建议依赖取舍，请把取舍展开，不要只给结论。
> - 优先做情境化判断，不要先套通用模板。

## Context
- Date captured: 2026-03-12 12:06
- Prompt: 如何在类似上下文中更清楚地要求 context-aware、professional engineering judgment，而不是得到过于通用的默认回答
- Conversation link: none

## Related
- [[knowledge/AGENTS|Knowledge Rules]]
- [[README-GIT]]

## Next
- [ ] Distill this into one permanent note about asking for context-aware engineering judgment
- [ ] Reuse these prompt patterns when discussing commit strategy, architecture, or vault conventions
