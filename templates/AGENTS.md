# AGENTS.md (`templates/`)

This file defines the local rules for `/mnt/p/vault/templates`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `templates/`.

## Scope

`templates/` is the vault's note-factory layer.

Use it for reusable note scaffolds, Templater-powered creation flows, and stable note shapes that are expected to be used repeatedly across the vault.

Do not use `templates/` as a scratch area for one-off drafts, ordinary notes, or policy explanations that belong in `areas/`.

## Local Model

Default structure:

```vault
templates/
  AGENTS.md
  <kind>/
    <template>.md
  <kind>/<format-or-pattern>/
    <template>.md
```

Rules:

- Prefer `templates/<kind>/` as the default organization.
- Use a second level such as `templates/<kind>/<format>/` or another descriptive subfolder only when one `kind` has multiple stable, high-frequency template families.
- Keep filenames readable and specific to the note shape they produce, such as `summary.md`, `reference.md`, or `weekly-review.md`.
- Do not add deeper nesting unless it clearly improves retrieval and template selection.

## Entry Rule

A file belongs in `templates/` when it defines a note shape or creation workflow that is expected to be reused.

Typical signals:

- the same note pattern has appeared repeatedly
- the note requires consistent frontmatter and sections
- the creation workflow benefits from prompts, computed values, or standard links
- keeping the pattern in one template will reduce drift across many notes

## Exit Rule

Retire or replace a template when it no longer reflects a stable workflow.

Typical exits:

- archive obsolete templates when the note pattern is no longer used
- replace a template when a cleaner stable successor exists
- move rationale or governance text into `areas/` if the file becomes more about policy than template output

## Allowed File Types

Common file types here:

- Markdown templates
- Templater-powered Markdown templates using documented Templater syntax

Avoid keeping non-template notes here. If you need examples or policy notes, prefer linking to them from a proper note elsewhere.

## Template Design Principles

- Design around the produced note's `kind` first.
- Use `format` or a descriptive local pattern name only when it improves selection and reuse.
- Keep frontmatter aligned with the vault's `kind` / `format` / `status` model.
- Decide the note's semantic role before adding prompts, derived values, or template logic.
- Use dynamic fields only where values genuinely vary between uses.
- Prefer the smallest amount of template logic that still removes repeated manual work.

## Template Contract

Before expanding a template with Templater logic, classify important fields or sections as:

- `prompted`: worth collecting immediately at note creation time
- `derived`: reliably computed from stable context such as title, path, date, or known links
- `manual`: better filled in after creation inside the rendered note
- `fixed`: stable boilerplate that should not vary between uses

Rules:

- Prefer `derived` over `prompted` when the value can be computed reliably.
- Prefer `manual` over `prompted` when the value is optional, subjective, or usually refined after note creation.
- If a manual field matters for first-use completeness, prefer a lightweight `Next` step or day-0 reminder in the rendered note rather than another prompt.
- Do not let implementation convenience weaken the note's `kind` / `format` / folder / graph-role decision.

## Templater Policy

- Use Templater for prompts, computed links, metadata, dates, conditionals, and note scaffolding logic.
- Prefer documented APIs such as `tp.file`, `tp.date`, `tp.system`, and `tp.frontmatter`.
- Prefer small, readable scripts over large embedded programs.
- Keep JavaScript scoped to note creation rather than broad vault mutation.
- Treat system commands and advanced dynamic actions as exceptional, not default template behavior.

Detailed syntax and command rules remain in the `obsidian-template-authoring` skill and its references.

## Output Discipline

- A rendered note should be immediately usable and require minimal cleanup.
- Keep visible boilerplate minimal; prefer structural placeholders over explanatory prose.
- Keep empty-state patterns consistent within a template family.
- Use `source` as a string when the template normally captures one primary source.
- Use `source` as a list when the template normally captures multiple distinct sources or source types.
- When a field supports multiple valid shapes, choose the simplest shape that matches the expected use of that template.
- Family- or field-specific formatting conventions should live in local rules or nearby template precedent, not be improvised case by case.
- Use `Next` or another lightweight day-0 reminder only when manual follow-up materially improves first-use completeness; do not force it into every template.

## Quality Bar

A template is worth keeping when:

- the output note shape is stable enough to deserve standardization
- the chosen folder is justified by `kind` first
- the rendered note will match vault metadata and linking conventions
- the semantic role and template contract are clear before automation details are added
- Templater logic is readable and limited to what actually varies
- the template reduces recurring friction rather than adding ceremony

## Library Governance

- New templates should earn their place through repeated use, not speculative completeness.
- Prefer extracting a new template pattern after repeated reuse rather than creating many templates upfront.
- When two templates differ only trivially, prefer one template with a clearer prompt or a better default shape.
- If a template could plausibly fit multiple places, choose the folder that best matches the produced note's `kind`.

## Relationship To Other Layers

Preferred split:

- `templates` stores reusable creation scaffolds
- content notes live in their proper PARA or knowledge containers
- `areas` may explain why a workflow exists
- `templates` implements the note-creation shape for that workflow

Templates should reduce note-creation friction. They should not become a parallel taxonomy or a source of system weight.

## Editing Rules For Agents

When editing files inside `templates/`:

- preserve existing template intent unless the user is intentionally redesigning the workflow
- avoid adding prompts or logic that do not materially improve the resulting note
- keep template code readable for future maintenance
- do not introduce new taxonomy axes through template frontmatter
- use the `obsidian-template-authoring` skill for Templater syntax, code structure, and validation details
