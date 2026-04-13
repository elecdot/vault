---
tags:
  - concept
  - estimate
  - method
  - economy
kind: concept
format: card
status: fleeting
source: "[DiD method Google AI overview](https://share.google/aimode/ypB6BnEHffkvJzO6g)"
project: "[[statistic-modeling]]"
aliases:
  - DiD
  - Difference In Difference
---

# Difference In Difference

>[!tldr]
>The Difference-in-Differences (DiD) method is a quasi-experimental technique used to estimate causal effects in social sciences by comparing the pre/post-treatment changes in an outcome for a treatment group versus a control group. It eliminates biases from time-invariant differences between groups and time-related trends.

## Core Idea

- **Two Groups:** Treatment (receives intervention) and Control (no intervention).
- **Two Periods:** Pre-treatment and post-treatment time periods.
- **[[parallel-trends-assumption|Parallel Trends Assumption]]**: Crucial, non-testable assumption that, in the absence of treatment, both groups would have followed the same trend.

The Difference-in-Differences (DiD) method is ==a quasi-experimental technique used to estimate causal effects in social sciences by comparing the pre/post-treatment changes in an outcome for a treatment group versus a control group==. It eliminates biases from time-invariant differences between groups and time-related trends.

**The Calculation (The "Double Difference")**

The DiD estimate is calculated as:

$$
\mathrm{DiD} = \left( \bar{Y}_{T,\text{post}} - \bar{Y}_{T,\text{pre}} \right) - \left( \bar{Y}_{C,\text{post}} - \bar{Y}_{C,\text{pre}} \right)
$$

1. **Difference 1:** Changes in the treatment group over time.
2. **Difference 2:** Changes in the control group over time.
3. **Final DiD:** Subtracting the control change from the treatment change to isolate the causal effect. 
**Common Implementation Methods**

- **Regression Analysis:** $Y = \beta_0 + \beta_1 \cdot \text{Time} + \beta_2 \cdot \text{Treatment} + \beta_3 \cdot (\text{Time} \times \text{Treatment}) + \varepsilon$ The coefficient$\beta_3$​ of the interaction term is the **DiD estimate**.

- **Software Packages:** Commonly implemented using specialized packages like `diff` in R, `diffreg` in Python, or `didregress`/`xtdidregress` in [Stata](https://www.stata.com/features/overview/difference-in-differences-DID-DDD/). 

**Key Considerations**

- **Limitations:** It can still suffer from selection bias if the treatment was not chosen randomly, and requires parallel pre-treatment trends.
- **Best Practices:** [arXiv](https://arxiv.org/pdf/2503.13323) provides a detailed guide on best practices for using DiD.

_For more information on the methodology, you can refer to resources from [Princeton University](https://www.princeton.edu/~otorres/DID101.pdf) or the [Columbia University Mailman School of Public Health](https://www.publichealth.columbia.edu/research/population-health-methods/difference-difference-estimation)._

## Related
- [[staggered-did]]

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
