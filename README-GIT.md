# README-GIT

This document defines the Git commit convention for this Obsidian vault.

For the longer rationale and design notes, see [[areas/vault-commit-convention|Vault Commit Convention]].

## Format

Use:

```text
<type>(<scope>): <summary>
```

Rules:

- use lowercase `type`
- use short lowercase `scope`
- start `summary` with a verb
- keep `summary` concise and outcome-focused
- use a single scope by default
- use comma-separated scopes only when one change genuinely spans two tightly coupled subsystems

Example:

```text
agent(vault,skills): update taxonomy strategy and templates foldering
```

## Types

- `note`: add or expand regular knowledge notes
- `moc`: create or reorganize MOCs, indexes, and navigation pages
- `lit`: add or refine literature notes
- `template`: change note templates
- `asset`: change attachments, diagrams, PDFs, Canvas files, or other resources
- `vault`: change Obsidian configuration, plugins, theme, or hotkeys
- `agent`: upgrade the repository's agent system, including `AGENTS.md`, skills, prompts, and agent workflows
- `zotero`: change Zotero-related workflows, metadata, or import behavior
- `refactor`: reorganize existing content without adding core new knowledge
- `fix`: correct errors, broken links, formulas, or frontmatter
- `docs`: change repository documentation or workflow instructions
- `chore`: perform general maintenance or normalization work
- `feat`: add automation, scripts, or tooling capability

## Scope

Prefer one of these scope sources:

- topic domain: `ml`, `os`, `llm`, `rl`
- vault module: `obsidian`, `workflow`, `daily`, `repo`, `skills`
- project or area name: `capstone`, `thesis`

Use compound scopes sparingly:

```text
agent(vault,skills): update taxonomy strategy and templates foldering
```

## Examples

Knowledge notes:

```text
note(ml): add backpropagation intuition note
note(llm): expand notes on speculative decoding
```

Navigation:

```text
moc(ai): create learning map for llm systems
refactor(moc): merge duplicate ai index pages
```

Vault and agent system:

```text
vault(obsidian): enable git and dataview plugins
agent(skills): add obsidian-template-authoring
agent(workflow): refine note-archiving rules
```

Templates and automation:

```text
template(daily): simplify reflection prompts
feat(scripts): add frontmatter validation script
```

Documentation and maintenance:

```text
docs(repo): add vault contribution guide
chore(repo): normalize line endings to lf
```

## Working Rules

- keep one commit focused on one kind of change
- do not use `note` for pure restructures; use `refactor` or `moc`
- do not use `feat` for ordinary notes
- separate content changes from vault or agent infrastructure changes whenever possible
