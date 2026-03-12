# AGENTS.md (`bases/`)

This file defines the local rules for `/mnt/p/vault/bases`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `bases/`.

## Scope

`bases/` is the vault's operational view layer.

Use it for `.base` files that help review, triage, inspect, and maintain notes across the vault. Bases are support surfaces for retrieval and maintenance; they are not the knowledge itself.

Do not use `bases/` to store prose notes, policy notes, or long-form explanations that belong in another content container.

## Local Model

Default structure:

```vault
bases/
  AGENTS.md
  <view-name>.base
```

Rules:

- Keep `.base` files directly under `bases/` by default.
- Use clear, stable filenames such as `inbox.base`, `projects.base`, or `knowledge.base`.
- Only add subfolders if the number or type of Bases grows enough that a real grouping need appears.
- Treat each `.base` file as a reusable operational surface, not a one-off ad hoc experiment unless the user explicitly wants a temporary view.

## Entry Rule

A file belongs in `bases/` when its main purpose is to expose a reusable review or maintenance view over notes.

Typical signals:

- the view helps triage, review, or audit a class of notes
- the view groups notes by structured properties such as `kind`, `format`, `status`, `project`, `area`, or `source`
- the view is meant to be revisited as part of ongoing vault maintenance
- the logic is operational rather than semantic

## Exit Rule

Move or retire a Base when it no longer serves an ongoing operational role.

Typical exits:

- archive obsolete Bases when the workflow they support has been retired
- replace a Base with a simpler one when the old logic has become too heavy or redundant
- move explanation or policy text into `areas/` if the file has become more about governance than view logic

## Allowed File Types

The primary file type here is:

- `.base`

Do not store ordinary Markdown notes here unless the user explicitly wants design notes next to a Base. Even then, prefer keeping the policy or rationale in `areas/` and the executable view here.

## Design Principles

- Define scope first with `filters`.
- Prefer structured properties such as `kind`, `format`, `status`, `area`, `project`, and `source` when they match the retrieval need.
- Keep views small and reusable; usually 1–3 views per `.base` file is enough.
- Prefer table views by default unless cards, lists, or maps materially improve the use case.
- Add formulas only when the computation is reusable or materially improves review quality.
- Split complex logic into multiple small formulas instead of one dense expression when that improves readability.

## Recommended Base Families

Common long-lived Base categories in this vault:

- inbox triage
- unresolved or missing links
- orphans / weakly connected notes
- projects overview
- recently updated notes
- knowledge indexes and domain views

These are support views for maintenance rhythm, not an invitation to build dashboards for their own sake.

## Formula Policy

- Prefer formulas for reusable derived values, not for showing off cleverness.
- Guard against missing properties when a formula may run across mixed note types.
- Keep formula names stable and descriptive.
- If a formula becomes hard to understand at a glance, simplify or split it.

Detailed syntax, quoting, and troubleshooting rules remain in the `obsidian-bases` skill and its references.

## View Policy

- `filters` define the note population first.
- `properties` and `order` should show only what materially helps review.
- `groupBy` and `sort` should make maintenance decisions easier, not merely prettier.
- Limit noisy derived columns unless they directly support action.

## Relationship To Other Layers

Preferred split:

- `bases` enumerates and inspects notes
- `knowledge`, `projects`, `resources`, `areas`, `daily`, and `archive` hold the notes themselves
- `areas` may explain why a maintenance workflow exists
- `bases` implements the reusable operational view for that workflow

Base files should help you act on the vault, not become the main interface for understanding what the vault means.

## Quality Bar

A Base is maintainable when:

- its scope is clear from filename and filters
- it relies on stable properties where possible
- formulas are limited, readable, and actually useful
- the views help a recurring task, not just provide a snapshot
- the YAML is valid and the view can render without manual cleanup

## Editing Rules For Agents

When editing files inside `bases/`:

- keep operational intent explicit; do not add complexity without a recurring use case
- prefer extending an existing Base when the new view belongs to the same maintenance surface
- do not duplicate similar Bases with only trivial differences unless the user explicitly wants separate files
- keep policy in `areas/` and implementation in `.base` files
- use the `obsidian-bases` skill for syntax details, formulas, and validation workflow
