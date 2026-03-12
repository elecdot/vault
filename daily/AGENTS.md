# AGENTS.md (`daily/`)

This file defines the local rules for `/mnt/p/vault/daily`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `daily/`.

## Scope

`daily/` is the vault's time-coordinate layer for day-bound activity, temporary context, and running logs.

Use it to record what happened on a given day, what is currently open, what was captured, and which other notes or containers were touched.

Do not use `daily/` as the long-term home for reusable knowledge, source preservation, or stable project documentation.

## Local Model

Default structure:

```vault
daily/
  AGENTS.md
  YYYY-MM-DD.md
```

Rules:

- Keep daily notes flat by default.
- Use date-based filenames in `YYYY-MM-DD` format.
- Treat the daily note as a time anchor, not a topic folder.
- If a daily note references substantial material, link out to the proper note instead of expanding the daily note indefinitely.

## Entry Rule

A note belongs in `daily/` when its primary value depends on the date it was written.

Typical signals:

- it is a day log, journal, work log, or daily review
- it tracks today's open loops, decisions, or observations
- it serves as a temporal entry point into notes created or touched that day
- it contains context that would be awkward to file directly into a stable container during the moment of writing

## Exit Rule

Daily notes usually remain in `daily/`, but their important content should not remain trapped there.

Typical exits from a daily note:

- extract reusable ideas into `knowledge/`
- move source-bound notes into `resources/`
- move active work material into `projects/`
- move long-lived standards or responsibilities into `areas/`
- archive old daily notes only if you later choose to cold-store them as a historical layer

The daily note may keep links to all of these, but it should not become the only place where important information exists.

## Allowed Note Types

The main note type here is:

- `kind: "daily"`

Common `format` values here:

- `journal`
- `log`
- `review`
- `planning`

Avoid using `kind: "resource"` or `kind: "concept"` for the daily note itself. If the content has matured into one of those roles, it should move into its proper container.

## Daily Notes

Recommended default:

```yaml
---
title: ""
tags: []
kind: "daily"
format: "journal"
status: ""
aliases: []
---
```

Rules:

- use the date as the stable file identity
- use `format` only when it clarifies the daily note's specific role, such as `review` or `planning`
- use `status` sparingly; a daily note usually does not need one

Expected sections for daily notes usually include some combination of:

- `Today`
- `Captured`
- `Open Loops`
- `Notes`
- `Links` or `Touched`

## Writing Rules

The daily note should stay lightweight and link outward aggressively.

Preferred behavior:

- summarize, then link
- record context, not final knowledge
- keep temporary decisions close to the day they happened
- create or link proper notes when an item starts to deserve stable maintenance

Allowed in daily notes:

- rough lists
- open tasks
- quick reflections
- short embedded context for the day

Avoid:

- building permanent topic essays inside a daily note
- leaving important insights only in daily notes when they should be extracted

## Relationship To Other Containers

Preferred split:

- `daily` records when something happened
- `inbox` captures material whose final home is still unclear
- `projects` records active execution context
- `resources` preserves source-bound notes
- `knowledge` preserves reusable ideas
- `areas` preserves ongoing operating responsibilities

Daily notes can point to everything else, but they should not replace those containers.

## Editing Rules For Agents

When editing notes inside `daily/`:

- preserve the day-bound context; do not rewrite the note into a timeless summary
- prefer adding links to stable notes over expanding the daily note itself
- do not mass-extract content from many daily notes without a user-approved batch plan
- keep edits additive and lightweight unless the user explicitly asks for a structured daily-note cleanup
