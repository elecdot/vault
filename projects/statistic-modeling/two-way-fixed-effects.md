---
tags:
  - concept
  - econometric
  - regression
  - data
  - statistic
  - estimate
kind: concept
format: card
status: fleeting
project: "[[statistic-modeling]]"
aliases:
  - Two-way Fixed Effects
  - TWFE
---

# Two-way Fixed Effects

>[!summary] Two-way fixed effects (TWFE) is a standard econometric regression method used in [[panel-data|Panel Data]] to estimate causal effects by controlling for unobserved unit-specific ($\alpha_i$) and time-specific ($\lambda_i$) heterogeneity.
>It estimates a treatment effect by comparing changes over time between treated and control groups, effectively implementing a [[difference-in-difference|Difference-in-Differences (DiD)]] framework.

## Core Idea

### Model Specification

Two-way fixed effects (TWFE) extends the [[panel-data|panel data]] framework by controlling for both unit-level and time-level heterogeneity:

$$Y_{it} = \alpha_i + \lambda_t + \beta D_{it} + X_{it}' \gamma + \varepsilon_{it}$$

where:
- $Y_{it}$: Outcome for unit $i$ at time $t$
- $\alpha_i$: Unit fixed effect (absorbs time-invariant heterogeneity)
- $\lambda_t$: Time fixed effect (absorbs time-varying common shocks)
- $D_{it}$: Treatment indicator (1 if unit $i$ is treated at time $t$, 0 otherwise)
- $\beta$: Causal treatment effect of interest
- $X_{it}$: Additional time-varying controls
- $\varepsilon_{it}$: Idiosyncratic error

### Usage Context

TWFE is commonly applied when:
- Data covers multiple entities (units) over several time periods
- A policy shock, reform, or intervention affects different units at different (or same) times
- Goal is to identify the **causal effect** of the intervention by comparing treated vs. control units before/after treatment
- Classic example: state-level policy changes, where some states adopt a policy in year $t$ and others do not

By removing time-invariant unit differences ($\alpha_i$) and time-common shocks ($\lambda_t$), TWFE isolates the treatment effect through a [[difference-in-difference|DiD]] comparison.

## Limitations in Staggered Designs

### The Problem: Heterogeneous Treatment Effects

Recent research has revealed that TWFE can produce **biased estimates** when treatment effects are heterogeneous across time or across units. This bias arises particularly in **staggered adoption** designs, where units are treated at different times (e.g., state $A$ reforms in 2010, state $B$ reforms in 2012).

### Forbidden Comparisons

In staggered settings, early-treated units can inadvertently serve as **"controls"** for later-treated units. This creates:
- **Negative weights**: Some TWFE coefficients receive negative weights, which are difficult to interpret
- **Bias**: If units treated in different periods experience different treatment effects, the pooled TWFE estimate becomes a complicated (and potentially negative-weighted) average of pairwise comparisons

Example: Comparing early-treated states (2010) vs. late-treated states (2012) as if they were control/treatment pairs, even though both are ultimately treated.

## Solutions to TWFE Bias

When treatment effects are not constant across time or units, alternative estimators are recommended over standard TWFE:

**Callaway and Sant'Anna (CS) Estimator**
- Focuses on **group-time average treatment effects** (heterogeneous effects by cohort and time relative to treatment)
- Pools effects transparently, avoiding negative weights
- Recommended for staggered designs

**Stacked Regression**
- Creates a **standardized dataset** where groups are aligned to the same "treatment time"
- Compares pairs of cohorts (e.g., cohort treated in 2010 vs. untreated in 2010) at equivalent time horizons
- Avoids forbidden comparisons by design

**Dynamic Event-Study Approach (Sun and Abraham 2021)**
- Accounts for **heterogenous timing** and dynamic effects explicitly
- Estimates effects relative to cohort-specific treatment times
- Handles longer-term post-treatment dynamics more cleanly

## Implementation Note

For robust results in staggered designs, modern estimators such as those provided in the `did` R package are preferred over traditional TWFE, as they avoid the bias introduced by heterogeneous treatment effects and late-treating comparisons.

## Related

- [[panel-data]] — Foundation: panel data structure and concepts
- [[difference-in-difference|Difference-in-Difference (DiD)]] — Foundational causal identification strategy
- [[staggered-did|Staggered Difference-in-Differences]] — Extensions for staggered treatment timing


## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
