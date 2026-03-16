# AGENTS.md (`resources/`)

This file defines the local rules for `/mnt/p/vault/resources`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `resources/`.

## Scope

`resources/` is the vault's source-oriented layer for material whose value still primarily depends on an external source.

Use it for reading notes, excerpts, summaries, references, annotations, and source tracking that are worth keeping, but are not yet distilled into durable semantic notes.

Do not use `resources/` for raw inbox capture, active project coordination, or already-distilled permanent concept notes.

## Local Model

Default structure:

```vault
resources/
  AGENTS.md
  <topic-or-source-slug>/
    <note>.md
    attachments/
```

Rules:

- Group resource notes by source, topic, course, or collection only when the grouping meaningfully reduces retrieval cost.
- Keep structures shallow by default.
- Use `attachments/` only for non-Markdown assets tied to the resource notes in that folder.

## Entry Rule

A note belongs in `resources/` when it is maintainable enough to keep, but its main job is still to preserve or organize source material.

Typical signals:

- the note explains or excerpts a book, article, course, paper, video, or conversation
- the note is still best understood through its source context
- the note has some local synthesis, but not enough independence to act as a durable graph entry point
- the note may later feed multiple projects or concept notes

Course note sets should usually live here by default. Move a course into `projects/` only when the course is being used as an active project-driven work context.

## Exit Rule

Move or distill a resource note out of `resources/` when source-preservation stops being its primary role.

Typical exits:

- distill stable reusable ideas into `knowledge/`
- move project-bound material into `projects/` when its main value becomes local to one active effort
- archive inactive source collections into `archive/`

The resource note may remain even after distillation if it still serves as the source trail or reading record.

## Allowed Note Types

The main note type here is:

- `kind: "resource"`

Occasionally allowed:

- `kind: "index"` for a source map or collection overview inside `resources/`
- `kind: "person"` when the note is primarily a source dossier about a person rather than a durable relationship note

Avoid storing durable `kind: "concept"` notes here unless they are intentionally temporary holding notes awaiting distillation review.

## Resource Notes

Recommended default:

```yaml
---
tags: []
kind: "resource"
format: ""
status: ""
project: ""
source: ""
aliases: []
---
```

Common `format` values here:

- `capture`
- `note`
- `summary`
- `reference`
- `outline`
- `review`

Rules:

- `kind` stays `resource`; use `format` to describe the note shape
- use `status` only when it adds workflow value, such as `fleeting`, `active`, or `archived`
- use `project` only when a source note is materially tied to one active project
- use `source` to preserve the actual origin, preferably as a URL or a link to a source-tracking note
- when a template creates the note, use the canonical display name for the H1 and include it in `aliases`
- do not introduce a parallel `resources` field just to mirror the container; folder placement and ordinary links already express that context

Expected sections for resource notes usually include some combination of:

- `Why`
- `Source`
- `Excerpt`, `Notes`, or `Claims`
- `Related`
- `Next`

## Distillation Boundary

`resources/` is allowed to contain interpretation, but it should not become a second `knowledge/`.

Decision rule:

- if the note still answers "what does this source say?" it belongs in `resources/`
- if the note now answers "what is the durable idea in my own system?" it likely belongs in `knowledge/`

A good resource note may contain candidate concept links and red links. It does not need to resolve them immediately.

## Grouping Rules

- Group by stable retrieval need, not by aesthetic symmetry.
- A source series, course, or book can justify its own folder.
- Do not create many tiny folders until repeated volume proves they help.
- If a resource note naturally serves multiple projects, keep it in `resources/` and link outward rather than duplicating it.

## Relationship To Other Containers

Preferred split:

- `inbox` captures rough intake
- `resources` preserves and organizes source-bound material
- `projects` uses resources in active execution contexts
- `knowledge` receives distilled reusable ideas

`resources/` is the bridge between raw intake and durable knowledge, but it is not required to be a temporary stop for every note.

## Editing Rules For Agents

When editing notes inside `resources/`:

- preserve provenance and source context
- do not over-distill a resource note just to make it look more "permanent"
- prefer adding `Related` links and future concept links over rewriting the note into a concept note
- do not mass-move resource collections without a user-approved batch plan
- do not use tags to duplicate source type, folder meaning, or workflow state when properties already cover them
