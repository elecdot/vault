# AGENTS.md (`archive/`)

This file defines the local rules for `/mnt/p/vault/archive`.

All general vault rules still come from the parent [AGENTS.md](/mnt/p/vault/AGENTS.md). This file only adds the local rules that are specific to `archive/`.

## Scope

`archive/` is the vault's cold-storage layer for inactive material that should be retained but is no longer part of active navigation or maintenance.

Use it for finished projects, retired standards, inactive resource collections, and notes whose historical context still matters even though they are no longer active working material.

It may also hold retired support-layer artifacts such as obsolete Bases or templates when historical retention is preferable to deletion.

Do not use `archive/` as a second `resources/` folder or as a vague dumping ground for unclear notes.

## Local Model

Default structure:

```vault
archive/
  AGENTS.md
  projects/
  resources/
  areas/
  daily/
  bases/
  templates/
```

Rules:

- Preserve origin context when archiving.
- Prefer mirroring the source container path under `archive/`, for example `archive/projects/...` or `archive/resources/...`.
- Keep archived material readable and relocatable; avoid inventing new archive-only taxonomies unless a real retrieval need appears.
- Do not reorganize archived material aggressively just to make it look neat.

## Entry Rule

A note or folder belongs in `archive/` when it is no longer part of active use, but should still be retained for reference, provenance, or historical continuity.

Typical signals:

- the project is done, paused indefinitely, or no longer active
- the resource collection is no longer under active review
- the area or operating rule has been retired or replaced
- the daily or temporary material should be kept historically but does not belong in active folders
- a Base or template has been retired, replaced, or kept only for historical reference

## Exit Rule

Archived material usually remains archived.

Exceptional exits:

- restore a project or note to an active container when work resumes
- distill still-valuable reusable ideas from archived material into `knowledge/`
- permanently delete material only with explicit user approval

Archive is a resting state, not a normal staging area.

## Allowed Note Types

`archive/` may contain many `kind` values because archive preserves former working context rather than defining a new semantic class.

Local rule:

- do not mass-rewrite frontmatter just because a note was archived
- preserve the note's existing `kind` and `format` unless a specific correction is needed
- use `status: "archived"` only when it adds value and can be applied consistently

## Archiving Rules

- Preserve the note or folder's original meaning.
- Prefer moving whole project or resource clusters together rather than scattering their parts.
- Keep supporting attachments with their archived notes.
- Do not rewrite prose while archiving; archive should be mostly a location change, not a content rewrite.
- For support-layer artifacts, mirror the source path as `archive/bases/...` or `archive/templates/...` when retention is useful.

## Relationship To Other Containers

Preferred split:

- active work stays in `projects/`, `resources/`, `areas/`, or `daily/`
- active support artifacts stay in `bases/` and `templates/`
- durable semantic notes stay in `knowledge/`
- inactive historical material moves to `archive/`

`archive/` should reduce active noise, not absorb unresolved ambiguity. If the right active container is still unclear, the note likely belongs in `inbox/`, not `archive/`.

## Retrieval Rules

- Archived material should remain linkable and searchable.
- Preserve enough folder context that future you can tell where the note came from.
- Do not rely on archive as the main navigation interface; it is a retention layer.

## Editing Rules For Agents

When editing notes inside `archive/`:

- prefer minimal changes; archive should remain historically legible
- do not batch-rename, flatten, or normalize archived notes without explicit approval
- do not delete archived notes or attachments without explicit approval
- when restoring archived material, move it back to the correct active container instead of treating archive as an editable workspace
