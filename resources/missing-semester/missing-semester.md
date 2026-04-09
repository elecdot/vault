---
tags:
  - course
  - missing-semester
  - shell
  - environment
  - tooling
  - general
kind: index
format: overview
status: active
source:
  - "[Web Page](https://missing.csail.mit.edu/)"
  - "[local exercise repo](file:///home/elecdot/dev/labs/missing-semester)"
aliases:
  - Missing Semester
---

# Missing Semester

>An entry point for the course, its notes, and its related study material.

## Overview

- [ ] Since its a general topic course, Each 1-hours lectures centering on a [particular topic](https://missing.csail.mit.edu/2026/). I will file this overview after finish the course

## Scope

- **1/12**: [Course Overview + Introduction to the Shell](https://missing.csail.mit.edu/2026/course-shell/)
- **1/13**: [Command-line Environment](https://missing.csail.mit.edu/2026/command-line-environment/)
- **1/14**: [Development Environment and Tools](https://missing.csail.mit.edu/2026/development-environment/)
- **1/15**: [Debugging and Profiling](https://missing.csail.mit.edu/2026/debugging-profiling/)
- **1/16**: [Version Control and Git](https://missing.csail.mit.edu/2026/version-control/)
- **1/20**: [Packaging and Shipping Code](https://missing.csail.mit.edu/2026/shipping-code/)
- **1/21**: [Agentic Coding](https://missing.csail.mit.edu/2026/agentic-coding/)
- **1/22**: [Beyond the Code](https://missing.csail.mit.edu/2026/beyond-code/)
- **1/23**: [Code Quality](https://missing.csail.mit.edu/2026/code-quality/)

## Structure

>Notes that link back to this overview will appear here.

![[bases/course-structure.base#Linked Notes]]

## Open Loops

```dataview
TASK
FROM ""
WHERE
  !completed AND
  startswith(file.folder, this.file.folder) AND
  !contains(file.folder, "templates")
GROUP BY file.link
```

## Related

- [OSSU](https://ossu.dev/)
