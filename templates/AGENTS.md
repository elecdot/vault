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
  <general-template>.md
  <kind>/
    <template>.md
  <kind>/<format-or-pattern>/
    <template>.md
```

Rules:

- Prefer `templates/<kind>/` when a template primarily serves one semantic note kind.
- The `templates/` root may host general templates that are reused across multiple kinds and do not justify a kind-specific home.
- Treat the root as the library's general template layer, not as a catch-all for uncategorized files.
- Use a second level such as `templates/<kind>/<format>/` or another descriptive subfolder only when one `kind` has multiple stable, high-frequency template families.
- Keep filenames readable and specific to the note shape they produce, such as `note.md`, `summary.md`, `reference.md`, or `weekly-review.md`.
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

- Design around the produced note's semantic role first.
- Keep `kind` as the core rule for note semantics and for templates that primarily serve one kind.
- Use the root level for broadly reusable templates whose body structure stays substantially the same across multiple kinds.
- Use subfolders only when they reflect a distinct semantic contract, workflow, or retrieval benefit.
- Do not create kind-specific variants when the difference is only a few frontmatter defaults, prompts, or destination choices.
- Prefer the simplest organization that keeps template selection predictable.

## Placement Rule

Choose a template home in this order:

1. If the template is a general entry point reused across multiple kinds with substantially the same note body, place it in `templates/`.
2. If the template primarily serves one semantic kind, place it under `templates/<kind>/`.
3. If one kind accumulates several stable template families, add one deeper subdivision only when it improves retrieval.

A template deserves kind-specific placement only when at least one of the following is materially different from a general version:

- its required sections
- its required metadata
- its post-creation workflow

## Templater Policy

- Use Templater only where prompts, computed values, or stable scaffolding materially reduce repeated work.
- Prefer small, readable scripts over large embedded programs.
- Keep JavaScript scoped to note creation rather than broad vault mutation.

Detailed syntax and command rules remain in the `obsidian-template-authoring` skill and its references.

## Output Discipline

- A rendered note should be immediately usable and require minimal cleanup.
- Keep visible boilerplate minimal; prefer structural placeholders over explanatory prose.
- Keep empty-state patterns consistent within a template family.
- Decide the note's semantic role before adding prompts, derived values, or template logic.
- Prefer the smallest amount of template logic that still removes repeated manual work.

## Quality Bar

A template is worth keeping when:

- the output note shape is stable enough to deserve standardization
- the chosen template home is justified either as a general cross-kind entry point or as a kind-specific family
- the rendered note will match vault metadata and linking conventions
- the semantic role and template contract are clear before automation details are added
- Templater logic is readable and limited to what actually varies
- the template reduces recurring friction rather than adding ceremony

## Library Governance

- New templates should earn their place through repeated use, not speculative completeness.
- Root-level templates are reserved for cross-kind default entry templates.
- Do not use the root as a temporary holding area for templates that have not been classified.
- When several root templates accumulate around one stable semantic family or workflow, extract a subfolder only if that grouping clearly improves retrieval and selection.
- If two templates differ only trivially, prefer one clearer general template over multiple near-duplicates.

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
