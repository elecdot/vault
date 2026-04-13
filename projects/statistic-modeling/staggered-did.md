---
tags:
  - concept
  - estimate
  - method
  - economy
kind: concept
format: card
status: fleeting
project: "[[statistic-modeling]]"
aliases:
  - Staggered DiD
  - Staggered Difference-in-Differences
  - 渐进式 DiD
  - 分批处理 DID
---

# Staggered DiD

> Difference-in-differences when treatment starts in different periods across units.

>[!summary] Staggered DiD basically assume each sample has its own "event time" and align it into single time line.

## Core Idea
- Compare each treated cohort to units that are not yet treated in the same calendar period.
- Re-express the effect in event time so you can inspect dynamic pre-trends and post-adoption changes.
- The identifying assumption is cohort-specific parallel trends: absent treatment, treated cohorts and not-yet-treated controls would have followed similar paths.

$$
Y_{it} = \alpha_i + \lambda_t + \sum_{k \neq -1}\beta_k\mathbf{1}[t-T_i = k] + X_{it}\gamma + \varepsilon_{it}
$$

The event-time coefficients $\beta_k$ describe the treatment path relative to the period just before adoption.

## Why It Matters
- Plain two-way fixed effects can be biased when treatment effects differ across cohorts or over time.
- For staggered adoption designs, estimators like Sun and Abraham or Callaway and Sant'Anna are usually safer than a naive TWFE regression.

## Related
- [[difference-in-difference|DID]]
- [[2026-04-12-2218-staggered-did]]

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
- [ ] Check [[2026-04-12-2218-staggered-did]] for further more study
