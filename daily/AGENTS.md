# AGENTS.md (`daily/`)

This file defines the local rules for `/mnt/p/vault/daily`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `daily/`.

## Scope

`daily/` is the vault's time-coordinate and cognitive-cache layer.

Use it to record day-bound context, running logs, what is currently open, what was touched, and thinking that matters because of when it happened.

Do not use `daily/` as a topic container, a permanent knowledge store, a source archive, or the main home for stable project documentation.

## Local Model

Default structure:

```vault
daily/
  AGENTS.md
  YYYY/
    YYYY-MM-DD.md
    YYYY-W01.md
    YYYY-MM.md
```

Rules:

- Use yearly folders only as storage partitioning.
- Keep each year flat by default; do not add topic subfolders inside `daily/`.
- Use `YYYY-MM-DD` for daily journals, `YYYY-Www` for weekly reviews, and `YYYY-MM` for monthly indexes.
- Treat the daily family as a time layer, not as a thematic hierarchy.
- If a daily note references substantial material, link outward to the proper maintained note instead of expanding the daily note indefinitely.

## System Goal

The primary job of `daily/` is to lower cognitive load during capture while preserving enough historical context for later review and distillation.

The goal is not to make each time note comprehensive. The goal is to make it cheap to record, easy to revisit through period notes, and easy to distill into the right long-term container later.

## Entry Rule

A note belongs in `daily/` when its main future value depends on the date or period it belongs to.

Typical signals:

- it is a day log, work log, journal entry, or period review
- it tracks today's or this week's open loops, decisions, observations, or touched notes
- it preserves context that would be awkward to file directly into a stable container in the moment
- the most natural future retrieval key is "when did this happen?" rather than "what topic is this?"

## Exit Rule

Daily notes usually remain in `daily/`, but important content should not remain trapped there.

Distill or move content out of `daily/` when any of the following become true:

- it recurs across multiple days or weeks
- it has value independent of the date it was written
- it needs ongoing maintenance as a concept, project artifact, resource note, or operating rule

Typical exits from a daily note:

- distill reusable ideas into `knowledge/`
- move source-bound material into `resources/`
- move active execution material into `projects/`
- move long-lived standards or responsibilities into `areas/`

The daily note should keep the historical record and link to the distilled destination. Distillation should not erase the original log.

## Allowed Note Types

The daily family uses one stable note kind:

- `kind: "daily"`

Allowed `format` values in V1:

- `journal` for day pages
- `review` for week pages
- `index` for month pages

Do not use `kind: "resource"` or `kind: "concept"` for daily-family notes. If the content has matured into one of those roles, it should leave `daily/`.

## Daily Family Roles

### Daily Journal

The daily journal is the default capture page.

Its job is to preserve day-bound context with low friction and link outward aggressively.

Expected content usually includes some combination of:

- `Today`
- `Open Loops`
- `Touched`

Suggested role split:

- `Today`: the main narrative area for the day
- `Open Loops`: what still needs closure, follow-up, or continuation
- `Touched`: which notes, projects, people, or topics were involved that day

`Captured` and `Highlights` are lenses inside `Today`, not separate permanent responsibilities of the journal template.

### Weekly Review

The weekly review compresses the week.

Its job is to:

- carry forward unresolved open loops
- surface what is still alive
- point to the daily pages that hold the detailed context
- identify candidates for distillation into stable notes

### Monthly Index

The monthly note is the retrieval layer for the month.

Its job is to:

- act as the month-level entry point
- link to relevant weekly reviews
- collect notable outputs, notes, or events for later lookup
- provide a lightweight review surface without duplicating the week pages

## Daily Notes

Recommended defaults:

```yaml
---
tags: []
kind: "daily"
format: "journal"
aliases: []
---
```

Rules:

- use the date or period string as the stable file identity
- keep frontmatter minimal; do not add workflow properties unless repeated real usage proves they are needed
- a daily-family note usually does not need `status`
- if a template uses a canonical display name beyond the period string, include it in `aliases`

## Writing Rules

The daily family should stay lightweight and link outward aggressively.

Preferred behavior:

- capture first, organize later
- summarize, then link
- record context, not final knowledge
- keep temporary decisions close to the day or period they happened
- create or link proper notes when an item starts to deserve stable maintenance

Allowed in daily notes:

- rough lists
- open loops
- quick reflections
- short embedded context for the day

Avoid:

- building permanent topic essays inside a daily note
- leaving important insights only in daily notes after they have become distillation candidates
- turning old daily pages into the only place where task state lives

## Append-Only Rule

Daily journals are append-only by default.

Allowed later edits:

- adding links to stable notes
- adding short clarifications
- marking that something has been distilled or moved elsewhere

Avoid rewriting an old daily note into timeless prose. The value of the page is its historical context.

## Task Boundary

`daily/` is context-bearing, not task-authoritative.

Rules:

- daily notes may contain open loops, reminders, and next actions
- daily notes should not become the only source of truth for task management
- unresolved daily open loops should be reviewed in the weekly note and either carried forward or moved to a maintained container

This keeps open loops useful without turning old journal pages into stale task dashboards.

## Relationship To Other Containers

Preferred split:

- `daily` records date-bound context and period review material
- `inbox` is a fast intake buffer when the final home is unclear and the date is not the main retrieval key
- `projects` holds maintained active execution context
- `resources` preserves source-bound material
- `knowledge` preserves distilled reusable ideas
- `areas` preserves ongoing operating responsibilities

`daily/` is the primary home for date-bound cognition. `inbox/` remains the fallback buffer for rough intake that has not yet earned a clearer anchor.

## Editing Rules For Agents

When editing notes inside `daily/`:

- preserve the day-bound or period-bound context; do not rewrite the note into a timeless summary
- prefer adding links to stable notes over expanding the daily note itself
- preserve the append-only nature of journal pages unless the user explicitly asks for cleanup
- do not mass-extract content from many daily notes without a user-approved batch plan
- treat the agent's job as assisting organization and distillation, not "completing" the note into a polished final artifact
