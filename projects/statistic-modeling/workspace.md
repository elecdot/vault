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

- [x] Initialized the whole repo including: `docs/` and `src/,stata/` placeholders; general research flow declaration; simple smoke test; agent initialize.

### Current Focus

- [ ] Day-1 setup to take a quick understanding about what we are going to do. (See Open Loops in README.md)

## Notes

- A decision should make: do I really need a "test" since this is not actually a engineering project...

## Related

- [[statistic-modeling/00-roadmap]]
- [[statistic-modeling/01-workspace-plan]]
