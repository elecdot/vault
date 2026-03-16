---
tags:
  - git
  - obsidian
  - workflow
kind: "area"
format: "reference"
aliases:
  - "Vault Commit Convention"
  - "vault conventional commits"
---

# Vault Commit Convention

This note defines a Git commit convention for this Obsidian vault.

The goal is not only to describe file changes, but also to preserve the meaning of the vault workflow itself: capture, distill, organize, connect, and archive knowledge across a PARA + Zettelkasten-inspired system.

Related topics: [[Git]], [[Obsidian]], [[Conventional Commits]], [[PARA]], [[Zettelkasten]].

## Why

Standard Conventional Commits are oriented toward software repositories, where changes are usually framed as features, fixes, and infrastructure work.

This vault has a different kind of lifecycle. Daily work here often means:

- capturing rough material into `inbox/` or `resources/`
- distilling source material into more durable notes
- reorganizing MOCs, semantic links, and PARA placement
- archiving inactive notes, projects, or processed resources
- evolving templates, Bases, agent rules, and Obsidian configuration

Because of that, a practical vault convention should preserve workflow meaning, not only file category.

## Core Model

This convention follows the full Conventional Commits shape when that format is required:

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

Where:

- `type` expresses the workflow action
- `scope` optionally expresses the workflow object, repository area, or knowledge container
- `description` expresses the outcome in the commit header
- `body` and `footer(s)` remain available whenever explanation, breaking-change detail, or tracking metadata is needed

The design goal is that commit history should let you reconstruct how knowledge moved through the vault over time. The vault convention is about choosing meaningful `type` and `scope`, not about forcing all commits into a fixed one-line subject template.

In practice, the common header in this vault is still:

```text
<type>(<scope>): <description>
```

But that is the usual case, not the whole rule. `scope` is optional, `!` is allowed, and body/footer sections should be used when they clarify intent.

## Quick Start

If you already think in Conventional Commits, adapt with this mapping:

- `feat` often splits into `capture`, `distill`, or `system`
- `refactor` usually becomes `organize`
- `fix` stays `fix`
- `docs` stays `docs`
- `chore` stays `chore`

Fast mental model:

- intake or import -> `capture`
- synthesis into durable notes -> `distill`
- restructuring or reclassification -> `organize`
- support-system changes -> `system`
- lifecycle closure -> `archive`

Examples:

```text
feat: add lecture notes
-> capture(inbox): add notes from llm serving lecture

feat: summarize paper
-> distill(knowledge): extract dqn paper claims into permanent notes

refactor: reorganize note graph
-> organize(linking): connect exploration, exploitation, and bandit notes

feat: add automation script
-> system(scripts): add frontmatter validation script

docs!: revise repository workflow contract
-> docs(repo)!: revise vault workflow contract
```

If more context is needed, keep the same header semantics and add a body/footer instead of overloading the header:

```text
organize(moc): rebuild machine learning navigation

- split the previous hub into theory, systems, and practice
- reconnect entry notes to the new hubs

Refs: #vault-review
```

## Types

Use these core types:

- `capture`: collect or import raw material, quick notes, or early-stage content
- `distill`: turn source material or rough notes into clearer, more durable notes
- `organize`: restructure notes, links, MOCs, folders, or PARA placement without mainly adding new knowledge
- `fix`: correct errors, broken links, metadata, formulas, or invalid structure
- `system`: change templates, Bases, scripts, agent workflows, Zotero workflows, or Obsidian configuration
- `archive`: archive or retire notes, projects, or processed material
- `docs`: update repository documentation or workflow instructions
- `chore`: low-level maintenance that does not deserve a stronger semantic type

### `capture`

Use `capture` when the main action is intake rather than synthesis.

Typical cases:

- importing reading notes
- adding rough lecture notes
- collecting prompts, references, or snippets
- moving raw material into `inbox/` or `resources/`

Examples:

```text
capture(inbox): add notes from llm serving discussion
capture(resources): import rl lecture notes and references
```

### `distill`

Use `distill` when the change reflects actual understanding, synthesis, or durable note creation.

Typical cases:

- extracting claims from a paper
- turning course notes into atomic notes
- rewriting rough notes into clearer concept notes
- producing a stable MOC summary from scattered sources

Examples:

```text
distill(knowledge): turn course notes into atomic transformer notes
distill(permanent): derive a standalone note on continuation-passing style
```

### `organize`

Use `organize` when the main value is structural change rather than new knowledge.

Typical cases:

- splitting or merging notes
- rebuilding a MOC
- adding semantic links
- moving notes across PARA containers
- reclassifying notes after review

Examples:

```text
organize(moc): rebuild ai learning map around systems and theory
organize(linking): connect exploration, exploitation, and bandit notes
organize(projects): move capstone notes from inbox to projects
```

### `fix`

Use `fix` for corrections, not for content growth.

Typical cases:

- broken wikilinks
- wrong formulas
- invalid frontmatter
- bad metadata imports

Examples:

```text
fix(linking): repair broken wikilinks in llm notes
fix(metadata): correct frontmatter in imported literature notes
```

### `system`

Use `system` for changes to the vault support system.

Typical cases:

- templates
- Bases views and formulas
- agent instructions and skills
- Obsidian configuration
- scripts and automation
- Zotero workflow mechanics

Examples:

```text
system(template): refine study summary template
system(bases): add inbox triage view for notes missing kind
system(agent): update archiving workflow guidance
system(metadata): refine alias migration rules
system(obsidian): enable git and dataview plugins
system(scripts): add frontmatter validation script
```

### `archive`

Use `archive` for explicit lifecycle transitions into inactive or completed state.

Typical cases:

- archiving a finished project
- moving processed resources out of active areas
- retiring obsolete working notes

Examples:

```text
archive(projects): archive finished capstone planning notes
archive(resources): move processed reading notes to archive
```

### `docs`

Use `docs` for repository documentation rather than the knowledge graph itself.

Typical cases:

- `README` updates
- workflow instructions
- contribution guides
- explanations of vault conventions

Examples:

```text
docs(repo): clarify vault commit convention
docs(workflow): describe literature processing flow
```

### `chore`

Use `chore` for low-level maintenance that has weak workflow meaning.

Typical cases:

- line-ending normalization
- repository cleanup
- low-signal housekeeping

Examples:

```text
chore(repo): normalize line endings to lf
chore(repo): clean obsolete temporary files list
```

## Scope Rules

Prefer scopes that reflect the vault workflow model instead of arbitrary labels.

`scope` should capture the single primary retrieval axis for the commit, not every valid classification of the notes involved.

Recommended scope families:

### PARA Containers

Use a container scope when the commit is mainly about lifecycle placement:

This is the default scope family for normal note work.

```text
capture(inbox): ...
organize(projects): ...
archive(resources): ...
```

Recommended values:

- `inbox`
- `projects`
- `areas`
- `resources`
- `knowledge`
- `archive`

### Zettelkasten Objects

Use a graph-oriented scope when the commit is mainly about note form or graph structure:

Use this family only when note form or maturity is the primary retrieval key and is more informative than the PARA container.

```text
distill(permanent): ...
organize(moc): ...
organize(linking): ...
```

Recommended values:

- `fleeting`
- `literature`
- `permanent`
- `moc`
- `linking`
- `index`

### System Modules

Use a support-system scope when the change is infrastructure:

```text
system(template): ...
system(bases): ...
system(agent): ...
system(obsidian): ...
```

Recommended values:

- `template`
- `bases`
- `agent`
- `obsidian`
- `zotero`
- `scripts`
- `repo`
- `metadata`

### Topic Scope

Use a topic scope only when the topic itself is the clearest retrieval key:

```text
distill(llm): summarize kv-cache tradeoffs
organize(rl): split exploration notes by algorithm family
```

## Decision Rules

To keep commit history readable over time, follow these rules consistently:

1. Keep one commit focused on one workflow meaning.
   Do not mix new distilled notes, `.obsidian` changes, template edits, and archive moves unless there is a strong reason.
2. Prefer workflow semantics over file-category semantics.
   Ask what happened in the knowledge lifecycle, not only which files changed.
3. Prefer one primary scope over complete classification.
   Do not try to encode container, note maturity, and topic all at once unless one axis would otherwise hide the meaning.
4. Prefer PARA scope over Zettelkasten scope by default.
   Reach for `projects`, `resources`, or `knowledge` before `literature` or `permanent` unless the Zettelkasten object is clearly the main retrieval key.
5. Prefer `organize` over `distill` when the main value is restructuring.
6. Prefer `distill` over `capture` when the change reflects actual synthesis.
7. Use compound scopes only when one axis would materially hide the meaning.
8. Use `archive` only for explicit lifecycle transitions.
9. Do not overfit everything into the header line.
   If rationale, migration detail, or tracking references matter, use the commit body and footer.
10. Treat header length as a practical guideline, not part of the syntax.
   Prefer keeping the commit header within about 50 characters when practical, and wrap body lines around 72 characters if you use a body.

## Examples

Knowledge intake:

```text
capture(inbox): add notes from prompt engineering session
capture(resources): import operating systems lecture notes
```

Knowledge distillation:

```text
distill(knowledge): turn course notes into atomic transformer notes
distill(llm): summarize speculative decoding tradeoffs
```

Knowledge organization:

```text
organize(moc): rebuild ai learning map around systems and theory
organize(linking): connect bandit, exploration, and policy notes
organize(projects): move capstone notes from inbox to projects
```

Zettelkasten-oriented examples:

```text
distill(permanent): derive a standalone note on continuation-passing style
organize(linking): connect bandit, exploration, and policy notes
```

Corrections:

```text
fix(linking): repair broken wikilinks in llm notes
fix(metadata): correct imported literature frontmatter
```

Support system:

```text
system(template): refine study summary template
system(bases): add triage view for notes missing kind
system(agent): update note archiving workflow guidance
system(obsidian): enable git and dataview plugins
system(scripts): add note link consistency checker
```

Archival work:

```text
archive(projects): archive finished capstone planning notes
archive(resources): move processed reading notes to archive
```

Repository docs and maintenance:

```text
docs(repo): clarify vault commit convention
docs(workflow): document para review process
chore(repo): normalize line endings to lf
```

## Large Commits

When a commit is broad, add a body:

```text
organize(moc): rebuild machine learning navigation

- split broad ml map into theory, systems, and practice
- reconnect entry notes to the new hubs
- remove duplicate navigation paths
```

Use the body to carry a secondary axis when it matters; do not force every dimension into the scope.

## Recommended Baseline

If you want the smallest practical starting point, begin with this set:

```text
capture
distill
organize
fix
system
archive
docs
chore
```

This is intentionally not identical to standard software-oriented Conventional Commits. It is designed to make vault history legible as a knowledge-workflow record.

## Related

The execution-oriented repository guide is [[README-GIT]]. This note keeps the design rationale and boundary decisions; `README-GIT.md` is meant for quick day-to-day reference while committing.
