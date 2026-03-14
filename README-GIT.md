# README-GIT

This document defines the Git commit convention for this Obsidian vault.

For the longer rationale and design notes, see [[areas/vault-commit-convention|Vault Commit Convention]].

## Format

Use:

```text
<type>[optional scope][optional !]: <description>

[- optional body]

[optional footer(s)]
```

Rules:

- use lowercase `type`
- make `scope` optional; use it when it improves retrieval
- use short lowercase `scope` when present
- start `description` with a verb
- keep the header concise and outcome-focused
- prefer keeping the commit header within about 50 characters when practical; if detail is needed, move it to the body
- prefer one scope by default
- use compound scopes only when one axis would materially hide the meaning
- use body/footer when the change needs rationale, migration detail, or references

The vault customizes Conventional Commits mainly through the meaning of `type` and recommended `scope` values. It does not require every commit to be compressed into a fixed subject-only pattern.

Example:

```text
organize(moc): rebuild ai learning map around systems and theory
```

Also valid:

```text
docs(repo)!: revise vault workflow contract

Refs: #vault-review
```

## Quick Start

If you are used to Conventional Commits, adapt with this mapping:

- `feat` often becomes `capture`, `distill`, or `system`
- `refactor` usually becomes `organize`
- `fix` stays `fix`
- `docs` stays `docs`
- `chore` stays `chore`

Practical shortcut:

- if you added raw or early-stage material, use `capture`
- if you turned material into clearer durable knowledge, use `distill`
- if you mainly reorganized notes, links, MOCs, or PARA placement, use `organize`
- if you changed templates, Bases, scripts, agent rules, or Obsidian config, use `system`

## Types

- `capture`: collect or import raw or early-stage material
- `distill`: turn rough material into clearer durable knowledge
- `organize`: restructure notes, links, MOCs, folders, or PARA placement
- `fix`: correct errors, broken links, metadata, formulas, or invalid structure
- `system`: change templates, Bases, scripts, agent workflows, or Obsidian configuration
- `archive`: archive or retire notes, projects, or processed material
- `docs`: update repository documentation or workflow instructions
- `chore`: low-level maintenance that does not deserve a stronger semantic type

## Scope

Prefer scopes that reflect the vault workflow model.

`scope` is the primary retrieval axis for this commit, not a complete classification of the notes involved.

- PARA containers: `inbox`, `projects`, `areas`, `resources`, `knowledge`, `archive` (default for normal note work)
- Zettelkasten objects: `fleeting`, `literature`, `permanent`, `moc`, `linking`, `index` (use when note form, graph structure, or maturity is the clearer retrieval key)
- system modules: `template`, `bases`, `agent`, `obsidian`, `zotero`, `scripts`, `repo`
- topic scopes: use only when the topic itself is the clearest retrieval key

## Examples

Knowledge intake and synthesis:

```text
capture(inbox): add notes from llm serving lecture
capture(resources): import rl lecture notes and references
distill(knowledge): turn course notes into atomic transformer notes
distill(permanent): derive a standalone note on continuation-passing style
```

Structure and graph work:

```text
organize(moc): rebuild ai learning map around systems and theory
organize(linking): connect bandit, exploration, and policy notes
organize(projects): move capstone notes from inbox to projects
```

Corrections and support system:

```text
fix(linking): repair broken wikilinks in llm notes
fix(metadata): correct frontmatter in imported literature notes
system(template): refine study summary template
system(bases): add inbox triage view for notes missing kind
system(obsidian): enable git and dataview plugins
```

Lifecycle and repository docs:

```text
archive(projects): archive finished capstone planning notes
archive(resources): move processed reading notes to archive
docs(repo): clarify vault commit convention
chore(repo): normalize line endings to lf
```

## Working Rules

- keep one commit focused on one workflow meaning
- separate knowledge changes from system changes whenever possible
- prefer one scope that captures the main retrieval axis
- avoid combining PARA and ZK scopes unless both are genuinely required
- prefer `organize` over `distill` when the main value is restructuring
- prefer `distill` over `capture` when the change reflects actual synthesis
- use `archive` only for explicit lifecycle transitions
- do not use `chore` when a more meaningful type fits

See [[areas/vault-commit-convention|Vault Commit Convention]] for boundaries, rationale, and detailed examples.
