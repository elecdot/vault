# AGENTS.md (`projects/`)

This file defines the local rules for `/mnt/p/vault/projects`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `projects/`.

## Scope

`projects/` is the vault's execution layer for active, time-bounded work.

Use it for work that has a concrete outcome, a meaningful active state, and a point at which it can be considered finished or paused.

Do not use `projects/` as the default home for raw capture, durable concept notes, or long-term governance documents.

## Local Model

Default structure:

```vault
projects/
  AGENTS.md
  <project-slug>/
    <project-slug>.md
    attachments/
    <supporting-note>.md
```

Rules:

- Each active project should usually have its own folder.
- The project home note should usually have the same slug as the folder.
- Keep project-specific working notes in the project folder rather than scattering them across the vault.
- Use `attachments/` only for non-Markdown assets that belong to the project.
- Do not store standalone Markdown notes under `attachments/`.

## Entry Rule

A note belongs in `projects/` when its primary value is helping an active project move forward.

Typical signals:

- the note is specific to a named project
- the note would lose context if separated from the project
- the note tracks execution, decisions, meetings, milestones, or project-bound study material
- the note is still too local or too provisional to deserve a durable place in `knowledge/`

If a course or study collection is stored here, it should be because it is currently being used as an active project-driven work context, not merely because it is a course.

## Exit Rule

Move or distill project material out of `projects/` when the project is no longer the right primary container.

Typical exits:

- distill reusable ideas into `knowledge/`
- move source-oriented material that still matters beyond the project into `resources/`
- move durable standards or repeatable operating rules into `areas/`
- archive inactive or finished project material into `archive/`

A note may stay in `projects/` after completion if it is part of the archived project record, but it should stop being treated as active working material.

## Allowed Note Types

`projects/` is a mixed working container. The folder is project-scoped; the note kinds inside it may vary.

Common note types here:

- `kind: "project"` for execution dashboards or plans with a clear completion condition
- `kind: "index"` for local entry points, collections, or navigation pages inside the folder
- `kind: "resource"` for project-bound reading notes, lecture notes, or source summaries
- `kind: "meeting"` for conversations tied to the project

Avoid using `kind: "concept"` for durable standalone ideas here unless the concept is intentionally temporary or project-local. Reusable concepts should usually be distilled into `knowledge/`.

## Home Notes

The folder home note is the canonical entry point for the project folder.

Recommended base:

```yaml
---
title: ""
tags: []
kind: ""
format: "overview"
status: "active"
area: ""
source: ""
aliases: []
---
```

Rules:

- choose `kind` from the note's semantic role rather than from the folder alone
- use `format` to describe the home-note shape, such as `overview`, `plan`, or `dashboard`
- use `status` for workflow state when the folder is being actively worked
- use `area` when the effort clearly belongs to an ongoing responsibility

Decision rule:

- if the note fundamentally answers "this is the entry point for this note cluster", prefer `kind: "index"`
- if the note fundamentally answers "this is the active effort being managed toward completion", prefer `kind: "project"`
- being stored under `projects/` does not by itself force `kind: "project"`

Expected sections for a home note:

- `Overview`
- `Scope`
- `Structure` or `Working Notes`
- `Open Loops` or `Next`

Local rule:

- if `status` is already clear in frontmatter, do not repeat it in the body unless a narrative status explanation is useful
- prefer `Overview` as the main human-facing introduction to the home note

## Supporting Notes

Supporting notes should remain clearly subordinate to the project context.

Typical shapes:

- lecture or reading note: `kind: "resource"`
- execution checklist: `format: "checklist"`
- meeting record: `kind: "meeting"`
- synthesis written only for this project: `kind: "resource"` or `kind: "index"` depending on function

Use the `project` property when a supporting note benefits from an explicit graph connection to the project home note.

Example:

```yaml
project: "[[crafting-interpreters]]"
```

Local rule:

- the `project` field may point to a home note whose `kind` is `index`; the field expresses execution context, not the target note's semantic class

## Linking Rules Inside A Project

Project-local links should be readable, stable, and easy to migrate if the project folder later moves or is archived.

Preferred rule:

- for notes inside the same project, use the project-local path form such as `[[crafting-interpreters/00-introduction]]`
- do not include the top-level `projects/` prefix in normal project-local wikilinks
- when linking to the project home note itself, use the short home-note form such as `[[crafting-interpreters]]`

Rationale:

- keeping the project slug in the link helps distinguish notes from similarly named notes in other project folders
- omitting the top-level PARA folder keeps links less coupled to later container moves

## Local Frontmatter Guidance

Use the parent vault's minimal frontmatter as the base.

Recommended local fields:

- `kind`
- `format`
- `status` when workflow state matters
- `project` for supporting notes
- `area` when the project belongs to a long-term responsibility
- `source` for source-bound material

Local rule:

- Do not use tags to encode project status or container membership.
- Prefer the folder path plus `project` property over inventing project-specific tag namespaces.
- Do not introduce a parallel `projects` field or other container-mirroring fields.

## Foldering Rules

- One folder per active project by default.
- Keep project files shallow unless a subfolder clearly reduces maintenance cost.
- Add subfolders only for stable high-volume clusters such as `attachments/`, `meetings/`, or `references/`.
- Do not create deep nested structures just to mirror a curriculum or source hierarchy unless the project genuinely needs it.

## Relationship To Other Containers

Preferred split:

- `project` notes coordinate work
- `index` notes provide local navigation when the folder needs it
- `resource` notes preserve project-bound material
- `knowledge` notes hold reusable concepts extracted from the project
- `areas` notes hold durable standards that outlive the project

The project folder is where work happens. It is not the final semantic home for every idea produced by the work.

## Editing Rules For Agents

When editing notes inside `projects/`:

- preserve execution context; do not strip away project-specific detail just to make notes look cleaner
- prefer adding links from project notes to durable concepts rather than prematurely moving content into `knowledge/`
- do not mass-move project notes across folders without a user-approved batch plan
- do not rename a project folder or its home note without explicit approval
- do not place Markdown working notes inside `attachments/`
