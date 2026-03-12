# AGENTS.md (`knowledge/`)

This file defines the local rules for `/mnt/p/vault/knowledge`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `knowledge/`.

## Scope

`knowledge/` is the vault's durable semantic layer.

Use it for notes that already have stable retrieval value. It is not the default home for raw capture, reading notes, or transient project material.

## Local Model

Default structure:

```vault
knowledge/
  AGENTS.md
  index.md
  indexes/
    <domain>.md
  <concept>.md
```

Rules:

- Keep permanent notes flat in `knowledge/` by default.
- Keep domain and hub pages under `knowledge/indexes/`.
- The main note types here are:
  - `kind: "concept"`
  - `kind: "index"`

## Entry Rule

A note belongs in `knowledge/` when it is stable enough to serve as a reusable entry point.

Typical signals:

- it recurs across multiple notes
- it needs contrast with nearby concepts
- other notes benefit from linking to one stable explanation
- you can define it in your own words, even if some sections are still incomplete

## Local Frontmatter

Use the parent vault's minimal frontmatter as the base.

Recommended local frontmatter for concept notes:

```yaml
---
title: ""
tags: []
kind: "concept"
format: "note"
aliases: []
source: ""
indexes: []
---
```

Local rule:

- `indexes` is a `knowledge/`-only extension field.
- `indexes` stores the index notes that organize this concept.
- Use wikilinks only, for example:

```yaml
indexes:
  - "[[knowledge/indexes/agent-systems]]"
```

- Use `indexes` only for index membership.
- Do not introduce a parallel `index` field.

## Naming

- Use stable English kebab-case filenames for concept notes.
- Use `aliases` for Chinese names, abbreviations, and wording variants.
- Avoid casual renames once a note is acting as a graph entry point.

## Concept Notes

Use the permanent note template at [templates/concept/permanent-note.md](/mnt/p/vault/templates/concept/permanent-note.md) as the default implementation.

Minimum bar for a concept note in `knowledge/`:

- `kind: "concept"`
- a stable title
- a non-empty `Core`
- at least one meaningful internal link

Expected semantic sections:

- `Core` for the stable explanation
- `Connections` for the note's graph edges, typically through `Parent`, `Related`, or `Contrast`
- optional sections such as `Boundaries`, `Examples`, and `Source Trail`
- an optional `Next` section for follow-up maintenance work

Allowed to remain incomplete:

- `Boundaries`
- `Examples`
- `Source Trail`
- sparse `tags`, `aliases`, or `source`

Connection semantics:

- `Parent`: the higher-level entry point, index, or broader concept that organizes this note
- `Related`: nearby concepts that are meaningfully connected but not primarily contrasted
- `Contrast`: concepts that are easiest to confuse with this one, or are most useful to compare against it

## `Next` Policy

`Next` is allowed here, but it is a maintenance layer, not part of the note's semantic core.

Rules:

- the note must still make sense if `Next` is removed
- use `Next` only for knowledge-maintenance follow-ups
- typical `Next` items:
  - add an example
  - clarify a contrast
  - link the note from a relevant index
  - consider compressing a neighboring cluster

## Index Notes

Index notes are human-authored entry points with embedded passive views.

Rules:

- store domain maps under `knowledge/indexes/`
- use `kind: "index"` and usually `format: "map"`
- hand-write judgment-heavy sections such as:
  - `Scope`
  - `Why`
  - `Key Distinctions`
  - `Starting Points`
- use `Base` for passive note lists
- use `Dataview` for lightweight gap/task views when needed

Preferred split:

- `index` explains
- `Base` enumerates
- `concept` notes carry the knowledge

## Evolution Rule

When a cluster of neighboring notes becomes expensive to maintain:

1. create or strengthen a shared index note
2. add or clean up `indexes`
3. clarify `Parent`, `Related`, and `Contrast`
4. only then consider merging notes

## Editing Rules For Agents

When editing notes inside `knowledge/`:

- preserve the author's wording unless a rewrite is explicitly requested
- prefer additive changes over structural churn
- do not mass-add `indexes`, tags, or links without a user-approved batch plan
- do not move or rename many knowledge notes without explicit approval
