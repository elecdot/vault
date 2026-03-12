# AGENTS.md (`areas/`)

This file defines the local rules for `/mnt/p/vault/areas`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `areas/`.

## Scope

`areas/` is the vault's stewardship layer for ongoing responsibilities, operating standards, decision criteria, and recurring review frames.

Use it for material that remains relevant across multiple projects, resources, or time periods, but is not best modeled as a durable concept note in `knowledge/`.

Do not use `areas/` as a default home for raw capture, source-bound reading notes, or inactive storage.

## Local Model

Default structure:

```vault
areas/
  AGENTS.md
  <area-or-standard>.md
```

Rules:

- Keep `areas/` flat by default.
- Prefer one stable note per responsibility, standard, or review frame.
- Do not create deep subfolder trees unless one area becomes large enough to justify a stable local cluster.
- If a repeated pattern would be better expressed as a template, Base, or script, keep the operational rule here and move the mechanism into its proper support layer.

## Entry Rule

A note belongs in `areas/` when its primary value is guiding repeated decisions or stewardship over time.

Typical signals:

- the note defines a long-lived operating rule, convention, or review standard
- the note applies across multiple projects or sources
- the note records an ongoing responsibility without a clear finish line
- the note explains how this vault or one of its recurring workflows should be maintained

## Exit Rule

Move or distill area material out of `areas/` when its primary role changes.

Typical exits:

- distill reusable semantic ideas into `knowledge/` when the note becomes more about a durable concept than an operating responsibility
- move implementation details into `templates/`, `bases/`, or scripts when the rule has stabilized into support tooling
- archive obsolete standards or retired responsibilities into `archive/`

The area note may remain after implementation work exists elsewhere if it still serves as the governing rationale or operating reference.

## Allowed Note Types

Common note types here:

- `kind: "area"` for ongoing responsibilities, standards, governance notes, and recurring review frames
- `kind: "index"` when an area genuinely needs a local hub or navigation page

Avoid using `kind: "resource"` here for source preservation. If the note is still mainly about what an external source says, it belongs in `resources/`.

Avoid using `kind: "concept"` here for durable knowledge claims. If the note is mainly a reusable idea rather than an operating responsibility, it likely belongs in `knowledge/`.

## Area Notes

Recommended default:

```yaml
---
title: ""
tags: []
kind: "area"
format: "reference"
status: ""
aliases: []
---
```

Common `format` values here:

- `reference`
- `checklist`
- `review`
- `policy`

Rules:

- `kind` should usually remain `area`
- use `format` to describe whether the note is a reference, checklist, review frame, or other recurring operational shape
- use `status` only when it adds real workflow meaning, such as `active`, `paused`, or `archived`

Expected sections for area notes usually include some combination of:

- `Why`
- `Scope`
- `Rules`, `Criteria`, or `Checklist`
- `Failure Modes`, `Warnings`, or `Boundaries`
- `Related`

## Decision Boundary With `knowledge/`

`areas/` is not the vault's semantic end-state.

Decision rule:

- if the note mainly answers "how should I operate, maintain, or evaluate this over time?" it belongs in `areas/`
- if the note mainly answers "what is the durable idea or distinction?" it likely belongs in `knowledge/`

Many area notes may reference knowledge notes, but they should not collapse into general concept libraries.

## Decision Boundary With Support Layers

`areas/` may govern templates, Bases, scripts, and workflows, but it should not absorb their implementation files.

Preferred split:

- `areas` holds policy, rationale, criteria, and recurring stewardship notes
- `templates` holds reusable note scaffolds
- `bases` holds operational views
- scripts or configuration hold automation details

## Relationship To Other Containers

Preferred split:

- `inbox` captures ambiguous material
- `resources` preserves source-bound notes
- `projects` handles time-bounded active work
- `areas` holds ongoing responsibilities and operating rules
- `knowledge` holds durable semantic notes

An area note may link widely across the vault, but it should stay grounded in stewardship rather than source capture or concept distillation.

## Editing Rules For Agents

When editing notes inside `areas/`:

- preserve the governing intent of the note; do not reduce a standard note into a generic summary
- prefer additive clarification over rewriting existing operating language
- do not introduce new taxonomy axes or workflow fields casually; area notes are where system weight can quietly accumulate
- do not mass-move governance notes into other containers without a user-approved batch plan
- when a rule implies tooling changes elsewhere, keep the policy note here and implement the mechanics in the proper support layer
