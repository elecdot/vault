---
tags:
  - "workspace"
  - "java"
  - "c"
  - "lox"
  - "compile"
  - "interpreter"
kind: "project"
format: "workspace"
status: "active"
project: "[[crafting-interpreters]]"
source:
  - "[local repo](file://wsl.localhost/Ubuntu/home/elecdot/dev/labs/crafting-interpreters)"
  - "[remote repo](https://github.com/elecdot/crafting-interpreters)"
aliases:
  - "Crafting Interpreters Workspace"
  - "Lox"
---

# Crafting Interpreters Workspace

> Scope: Track the implementation and learning status of the engineering-oriented [[crafting-interpreters|Crafting Interpreters]] practice repository across both `jlox` and `clox`.

## Overview

### Environment

- Setup: `Local repo at /home/elecdot/dev/labs/crafting-interpreters; Java managed via SDKMAN (.sdkmanrc -> 17.0.8-tem)`
- Tooling: `make`, `gcc`, `java`, `javac`, `SDKMAN`( `.sdkmanrc`)
- Branch: `main`
- Run: `make run-clox`, `make run-jlox`
- Test: `make test-clox`, `make test-jlox`

### Milestones

- [x] Initialize project scaffold for `jlox` and `clox`
- [x] Add `AGENTS.md` guidance for teaching-first collaboration
- [ ] Start `jlox` scanner/token implementation
- [ ] Start `clox` chunk/VM module implementation
- [ ] Expand regression tests and engineering automation

### Current Focus

- [ ] Get comfortable with Java debugger and dev environment
- [ ] Keep this workspace note in sync with meaningful repository milestones

## Notes

- Repository status is clean on `main`.
- Current repo history includes scaffold initialization and teaching-first `AGENTS.md` guidance.
- Both `jlox` and `clox` have runnable smoke paths through the root `Makefile`.
- `jlox` uses a project-local SDKMAN Java configuration via `.sdkmanrc`.
- `clox` uses native c build environemnt.

## Related

- [[crafting-interpreters]]
- [Crafting Interpreters Web Page](https://craftinginterpreters.com)
- [Crafting Interpreters GitHub Repo](https://github.com/munificent/craftinginterpreters)
- [local repo](file://wsl.localhost/Ubuntu/home/elecdot/dev/labs/crafting-interpreters)
- [remote repo](https://github.com/elecdot/crafting-interpreters)
