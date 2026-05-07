---
tags:
  - workspace
  - statistic-modeling
  - python
  - stata
kind: project
format: workspace
status: active
project: "[[statistic-modeling]]"
source:
  - "[local repo](file://wsl.localhost/Ubuntu/home/elecdot/dev/labs/statistic-modeling)"
  - "[remote repo](https://github.com/elecdot/statistic-modeling)"
aliases:
  - Statistic Modeling Workspace
---

# Statistic Modeling Workspace

> Scope: This keep tracking the workspace: supports a statistics modeling project on the causal effect of the 专精特新 policy on enterprise innovation.

## Overview

### Environment

- Setup: `Python` (managed by uv) is responsible for capturing, cleaning, feature engineering, panel construction, visualization, and exporting Stata input.  `Stata` (on scheduled) is responsible for formal quantitative regression, robustness tests, and review of the results of papers/competition standards.
- Tooling: [[uv]],[[just]]
- Branch: `main`
- Run: `uv run python <.py> --config configs/<.toml>`
- Test: `uv run pytest`

### Milestones

- [x] Initialized the whole repo including: `docs/` and `src/` placeholders
- [x] Day-1 setup to take a quick understanding about what we are going to do. (See Open Loops in README.md)

### Current Focus

- [ ] Crawl policies for policy-level research.

可以把当前工作写成一个自然的方法演进：

1. 首先基于手工收集数据构造政策强度；
2. 使用透明词典做探索性文本测度；
3. 发现全文词典显著提高召回，但存在高覆盖词和类别饱和；
4. 因此不直接用词典命中作为最终政策工具分类；
5. 转而使用词典辅助分层抽样，并结合大模型银标与 MacBERT 多标签分类，构造更稳健的政策工具概率指标。

## Notes

- A decision should make: do I really need a "test" since this is not actually a engineering project...

## Related

- [[statistic-modeling/00-roadmap]]
- [[statistic-modeling/01-workspace-plan]]
