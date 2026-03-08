---
title: "Vault Commit Convention"
tags:
  - git
  - obsidian
  - workflow
kind: "area"
format: "reference"
aliases:
  - "vault conventional commits"
---

# Vault Commit Convention

This note defines a Git commit convention for this Obsidian vault. The goal is to preserve the readability of [[Conventional Commits]] while extending it to cover the kinds of changes that happen frequently in a knowledge vault: content growth, structural reorganization, template maintenance, plugin configuration, and automation workflows.

The goal is not only to describe file changes, but also to preserve the meaning of the vault workflow itself: capture, distill, organize, connect, and archive knowledge across a PARA + Zettelkasten-inspired system.

Related topics: [[Git]], [[Obsidian]], [[conventional-commit|Conventional Commits]], [[PARA]], [[Zettelkasten]].

## Why

Standard Conventional Commits are oriented toward software repositories, where changes are usually framed as features, fixes, and build-related work. In a vault, daily changes also include:

- adding and expanding knowledge notes
- reorganizing MOCs and navigation structure
- evolving templates
- managing Zotero and literature workflows
- updating `.obsidian` configuration
- organizing attachments and assets
- improving scripts and automation queries

Because of that, the most practical approach is not to copy the standard convention verbatim, but to keep its structure and add a knowledge-vault-specific semantic layer.

## Format

Use:

```text
<type>(<scope>): <summary>
```

Optional body:

```text
<body>
```

Optional footer:

```text
<footer>
```

Rules:

- use lowercase `type`
- use a short lowercase `scope`
- start `summary` with a verb
- keep `summary` within roughly 72 characters when practical
- make `summary` describe the outcome, not the process
- use a single short scope by default; when a change truly spans two tightly coupled subsystems, a comma-separated compound scope is acceptable

Examples:

```text
note(ml): add retrieval-augmented generation notes
moc(ai): reorganize llm learning hub
vault(obsidian): update plugin and theme settings
agent(skills): add obsidian-template-authoring
zotero(rl): add metadata notes for Sutton and Barto
chore(repo): normalize line endings
```

## Recommended Types

Start with a small but complete set of commit types:

- `note`: add or expand regular knowledge notes
- `moc`: create or reorganize MOCs, index pages, and navigation pages
- `lit`: add or refine literature notes
- `template`: change templates
- `asset`: change attachments and other resources
- `vault`: change Obsidian configuration, plugins, theme, or hotkeys
- `agent`: upgrade the repository's agent system, skills, instructions, or behavior
- `zotero`: change Zotero workflows, metadata, or import behavior
- `refactor`: reorganize structure without adding core new content
- `fix`: correct errors, broken links, frontmatter, or incorrect references
- `docs`: change repository documentation or workflow guides
- `chore`: do general maintenance, cleanup, or normalization
- `feat`: add automation, scripts, or tooling capability

### `note`

Use `note` when adding or substantially expanding regular notes.

Typical cases:

- new knowledge points
- study summaries
- concept explanations
- technical syntheses

Examples:

```text
note(ml): add gradient descent intuition note
note(os): expand process vs thread comparison
note(llm): summarize kv-cache basics
```

### `moc`

Use `moc` for MOCs, index pages, navigation pages, and topic maps.

Typical cases:

- creating a new MOC
- restructuring topic navigation
- strengthening index entry points

Examples:

```text
moc(ai): create llm systems map of content
moc(cs): reorganize systems learning index
```

### `lit`

Use `lit` for notes on papers, books, lectures, and other literature sources.

Typical cases:

- paper reading notes
- book summaries
- literature review entries

Examples:

```text
lit(rl): summarize dqn paper contributions
lit(agent): add notes on multi-agent coordination survey
```

### `template`

Use `template` for changes to note templates or template workflows under `templates/`.

Examples:

```text
template(daily): simplify reflection prompts
template(lit): add methodology and limitations sections
```

### `asset`

Use `asset` for images, PDFs, diagrams, Canvas files, and other attached resources.

Examples:

```text
asset(diagram): add transformer attention sketch
asset(attachments): reorganize project images
```

### `vault`

Use `vault` for `.obsidian` configuration, plugins, theme, hotkeys, and other environment-level vault changes.

Examples:

```text
vault(obsidian): enable dataview and templater
vault(theme): tweak minimal theme appearance
vault(plugins): add homepage plugin configuration
```

### `agent`

Use `agent` for upgrades to the repository's agent system itself, rather than ordinary note content or general vault configuration.

Typical cases:

- updating rules in `AGENTS.md`
- adding, splitting, renaming, or improving skills
- adjusting agent workflows, prompts, or collaboration constraints
- changing templates or folder strategies that primarily serve the agent system

How it differs from nearby types:

- `agent` is for agent-system design and capability changes
- `vault` is for Obsidian configuration, plugins, and theme changes
- `template` is for ordinary note-template changes; if a template change primarily serves the agent workflow, `agent` is usually the better fit

Examples:

```text
agent(skills): add obsidian-template-authoring
agent(vault,skills): update taxonomy strategy and templates foldering
agent(workflow): refine agent note-archiving rules
```

### `zotero`

Use `zotero` for Zotero import workflows, metadata handling, and synchronization behavior, not for literature content itself.

Distinction:

- `lit` represents literature content
- `zotero` represents the literature management system and its workflow

Examples:

```text
zotero(workflow): update literature note import template
zotero(metadata): normalize citation keys for ml papers
```

### `refactor`

Use `refactor` when reorganizing existing material rather than adding core new content.

Typical cases:

- splitting or merging notes
- renaming titles
- adjusting folder layout
- reorganizing link structure

Examples:

```text
refactor(notes): split transformer note into architecture and training
refactor(moc): merge duplicate ai index pages
```

### `fix`

Use `fix` for corrections, not for content growth.

Typical cases:

- incorrect formulas
- incorrect references
- broken links
- frontmatter errors

Examples:

```text
fix(note): correct q-learning update equation
fix(vault): repair broken internal links in homepage
```

### `docs`

Use `docs` for repository documentation rather than the knowledge notes themselves.

Typical cases:

- `README.md`
- collaboration instructions
- workflow documents

Examples:

```text
docs(repo): add vault contribution guide
docs(workflow): describe zotero import process
```

### `chore`

Use `chore` for maintenance work that does not directly change the core knowledge content.

Typical cases:

- `.gitignore`
- `.gitattributes`
- line-ending normalization
- repository cleanup

Examples:

```text
chore(repo): add obsidian-specific gitignore rules
chore(repo): normalize line endings to lf
```

### `feat`

Use `feat` only when adding actual tooling capability. It should not be used for ordinary notes.

Typical cases:

- new scripts
- new automation workflows
- new Dataview or Templater capabilities

Examples:

```text
feat(templater): add project note generator
feat(scripts): add frontmatter validation script
```

## Scope Rules

`scope` should not become an arbitrary free-form label. Keep it limited to a small number of stable dimensions.

Recommended scope sources:

### Topic Domain

Use a subject area:

```text
note(ml): ...
note(os): ...
moc(ai): ...
lit(rl): ...
```

### Vault Module

Use a vault subsystem:

```text
vault(obsidian): ...
template(daily): ...
zotero(workflow): ...
docs(repo): ...
```

If one change genuinely spans two tightly coupled scopes, you may use a compound scope:

```text
agent(vault,skills): update taxonomy strategy and templates foldering
```

This should be used sparingly, only when splitting the change into two commits would clearly weaken the meaning.

### Project Name

Use a project or responsibility area:

```text
note(capstone): ...
docs(group-project): ...
asset(thesis): ...
```

## Decision Rules

To keep commit history readable over time, follow these rules consistently:

1. Separate content changes from configuration changes.
   Prefer `note(ml): add optimization notes` over vague messages like `chore: update stuff`.
2. Do not use `note` for pure restructuring.
   If the change is mainly structural, prefer `refactor(...)` or `moc(...)`.
3. Keep each commit focused on one kind of change.
   Do not mix new notes, `.obsidian` changes, attachment renames, and template edits in one commit unless there is a strong reason.

## Examples

Daily knowledge notes:

```text
note(ml): add backpropagation intuition note
note(os): summarize virtual memory translation flow
note(llm): expand notes on speculative decoding
```

MOCs:

```text
moc(ai): create learning map for llm systems
moc(cs): reorganize computer systems hub
```

Literature:

```text
lit(rl): summarize dqn paper contributions
lit(agent): add notes on multi-agent coordination survey
```

Zotero and literature workflow:

```text
zotero(workflow): update literature note import template
zotero(metadata): normalize citation keys for ml papers
```

Vault configuration:

```text
vault(obsidian): enable git and dataview plugins
vault(theme): tweak minimal theme appearance
```

Templates:

```text
template(lit): add methodology and limitations sections
template(daily): simplify reflection prompts
```

Refactors:

```text
refactor(notes): split ml overview into supervised and unsupervised
refactor(moc): merge duplicate ai index pages
```

Fixes:

```text
fix(note): correct cross-entropy formula
fix(vault): repair broken internal links in homepage
```

Repository maintenance:

```text
chore(repo): add obsidian-specific gitignore rules
docs(repo): add vault contribution guide
```

Automation:

```text
feat(templater): add daily note generator
feat(scripts): add note link consistency checker
```

## Large Commits

When a commit is broad, add a body:

```text
refactor(moc): reorganize machine learning navigation

- split broad ml index into theory, systems, and practice
- update backlinks to new hub pages
- remove duplicate entry points
```

## Recommended Baseline

If you want the smallest practical starting point, begin with this set:

```text
note
moc
lit
vault
agent
template
refactor
fix
docs
chore
```

Introduce `asset`, `zotero`, and `feat` later when the vault actually grows into attachment management, literature workflows, or automation scripting. If you already maintain `AGENTS.md` and skills as a first-class part of the repository, it also makes sense to include `agent` from the start.

## Related

The execution-oriented repository guide is [[README-GIT]]. This note keeps the design rationale and boundary decisions; `README-GIT.md` is meant for quick day-to-day reference while committing.
