# AGENTS.md (`inbox/`)

This file defines the local rules for `/mnt/p/vault/inbox`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `inbox/`.

## Scope

`inbox/` is the vault's low-friction intake layer.

Use it for quick capture, rough imports, undeclared ideas, and material that has entered the system but has not yet earned a stable long-term home.

`inbox/` is intentionally temporary. It optimizes for getting material into the vault with low hesitation.

## Local Model

Default structure:

```vault
inbox/
  AGENTS.md
  <timestamp>-<slug>.md
```

Rules:

- Keep `inbox/` flat by default.
- Prefer timestamp-based filenames for captures, for example `2026-03-12-1206-better-engineering-prompts.md`.
- Do not build long-term topic hierarchies inside `inbox/`.
- If attachments are needed during capture, keep them local and move them together during later triage.

## Entry Rule

A note belongs in `inbox/` when speed matters more than final classification.

Typical signals:

- the idea is worth keeping, but its final container is not yet clear
- the note is a quick capture from a conversation, reading session, or moment of insight
- the material may later become a project note, resource note, area note, or knowledge note
- delaying capture would cost more than imperfect structure

## Exit Rule

Every inbox note should eventually be triaged.

Typical exits:

- move source-bound captures into `resources/`
- move project-bound captures into `projects/`
- move durable governance or responsibility notes into `areas/`
- distill stable reusable ideas into `knowledge/`
- archive low-value or obsolete captures into `archive/`

`inbox/` is not a permanent folder. Notes that remain here long-term should be the exception and should still have a clear reason.

## Allowed Note Types

`inbox/` is permissive by design.

Common note shapes here:

- `kind: "resource"` with `format: "capture"`
- partially structured notes with incomplete frontmatter
- rough notes with unresolved links and incomplete sections

Allowed exceptions:

- a note may briefly exist here without full metadata if that keeps capture friction low
- a note may contain open questions, placeholders, and partial wording

Not expected here:

- fully matured durable concept notes
- stable project dashboards
- long-term area standards

## Frontmatter Guidance

When using a capture template, the recommended default is:

```yaml
---
tags: []
kind: "resource"
format: "capture"
status: "fleeting"
source: ""
aliases: []
---
```

Rules:

- frontmatter is recommended, not mandatory at capture time
- if metadata is omitted during capture, add it during triage rather than blocking note creation
- `status: "fleeting"` is the normal default when status is used in `inbox/`
- keep tags sparse; the capture should not become filing work
- if a capture template asks for a canonical name, use it for the H1 and auto-write it into `aliases`; the timestamped filename remains the long-term file identity
- do not add extra alias prompts to low-friction capture templates unless variant names are materially important at capture time

## Writing Rules

The note only needs enough structure to be recoverable and triageable later.

Good capture usually includes:

- what this is
- why it seemed worth saving
- source or context if known
- at least one clue for future retrieval, such as tags, links, aliases, or a descriptive opening

Allowed in `inbox/`:

- messy prose
- excerpts without full synthesis
- unresolved `[[wikilinks]]`
- follow-up tasks in `Next`

## Triage Standard

An inbox note is ready to leave `inbox/` when:

- its primary container is clear
- `kind` is clear enough for long-term maintenance
- it has at least one meaningful retrieval hook, such as tags, links, or a project/source relationship

It does not need to be polished before leaving `inbox/`. It only needs to stop being ambiguous.

## Relationship To Other Containers

Preferred split:

- `inbox` captures first
- `resources` preserves source-bound notes
- `projects` holds active execution material
- `areas` holds long-lived operating responsibilities
- `knowledge` holds durable reusable ideas

The goal of `inbox/` is not to stay organized. The goal is to prevent good material from staying uncaptured.

## Editing Rules For Agents

When editing notes inside `inbox/`:

- preserve the speed advantage of capture; do not impose heavy structure too early
- prefer additive triage edits over rewriting the note
- do not mass-reclassify inbox notes without a user-approved batch plan
- do not treat unresolved links or incomplete metadata as errors by default
- when a note clearly belongs elsewhere, move it only after its destination is evident
