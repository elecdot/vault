# AGENTS.md (Obsidian Vault)

This file defines the long-term conventions and workflows you (the Agent) must follow when creating/editing notes, adding links, and designing tags and Bases in this vault. The goal is to make archiving and connections maintainable, extensible, and reliably searchable via Bases.

## Scope

- Applies to the whole vault by default (`/mnt/p/vault`).
- If a subdirectory contains a more specific `AGENTS.md`, the deeper rules take precedence.

## Available Skills

When a task matches one of the domains below, the Agent SHOULD proactively look for and load the corresponding skill instructions before planning or editing. Treat the `skills/...` path as a logical skill identifier rather than a fixed filesystem path; each agent runtime may resolve it differently.

- `skills/obsidian-markdown.md`
  Use for Obsidian-flavored Markdown work: frontmatter, wikilinks, embeds, callouts, tags, note cleanup, and note restructuring.
  Trigger phrases include: "整理这篇笔记", "add frontmatter", "fix wikilinks", "convert to Obsidian note", "清理标签和双链"
- `skills/obsidian-bases.md`
  Use for Obsidian Bases work: `.base` files, views, filters, formulas, grouping, sorting, and archive dashboards.
  Trigger phrases include: "create a base", "设计一个 Bases 视图", "show inbox notes", "build a projects table", "做一个按状态分组的视图"
- `skills/obsidian-cli.md`
  Use for vault automation and operational tasks: searching notes, batch inspection, property queries, scripted maintenance, and CLI-driven workflows.
  Trigger phrases include: "scan the vault", "批量检查这些笔记", "find notes missing type", "run Obsidian CLI", "统计一下这个 vault"
- `skills/json-canvas.md`
  Use for Canvas work: creating or editing `.canvas` files, visual maps, node/edge layout, and concept graphs.
  Trigger phrases include: "make a canvas", "创建一张关系图", "edit this .canvas", "build a mind map", "连一下这些节点"

If a user request is short or underspecified, the Agent should still infer the relevant skill from the task language. Example: "整理 `obsidian-vault-git.md`，放入我的 vault 中" should trigger `skills/obsidian-markdown.md` first, then use vault conventions in this file to decide placement, metadata, and links.

`AGENTS.md` defines vault-wide policy. Skills should add task-specific execution guidance and should not redefine the global rules here.

## Long-Term Goals

This vault follows a Zettelkasten-inspired approach:

- **Atomic**: one note expresses one idea / one concept (avoid mixing multiple themes).
- **Retrievable**: any note can be reliably found via `tags + properties + Bases`, and related notes can be navigated via links (MOCs), without relying on folder paths.
- **Evolvable**: the management method (e.g., taxonomy) can grow over time without frequent tag refactors.
- **Low-noise**: avoid over-tagging and link spam; prioritize clarity and navigability.
- **Automatable**: store computable/filterable information in structured frontmatter so Bases (and later scripts) can work well.

## Safety & Change Principles (Agent MUST follow)

- **Scan before changing**: before any bulk edits (frontmatter/tags/links), provide a “change plan + scope + examples” and wait for confirmation.
- **Minimal edits**: do not rewrite prose or “normalize style”; only add necessary metadata and links.
- **No destructive refactors**: do not batch-rename, move, or delete content without explicit permission.
- **Reversible by default**: prefer additive changes; avoid irreversible replacements.

## Vault Structure

This vault uses PARA for file organization:

```vault
inbox/        # Capture temporary ideas/information
projects/     # P: active, time-bounded projects
areas/        # A: long-term responsibilities (no hard deadline), standards/checklists/reviews, etc.
knowledge/    # Curated “permanent notes” distilled from PARA; the searchable knowledge base
resources/    # R: external excerpts/resources not anchored to a project/system yet
archive/      # Archive: inactive/finished content (including closed projects)
daily/        # Daily logs and summaries (topics/thoughts/open items)
bases/        # Secondary organization via Obsidian Bases
templates/    # Note templates
```

Decision (v1): **do not add numeric prefixes to top-level folder names**. Rationale: this vault uses `links + Bases` as primary navigation; semantic folder names reduce long-term maintenance cost (Bases filters and path examples stay stable).

Note: if you choose numbered names anyway, update Bases `file.inFolder(...)` filters accordingly.

## File & Naming Conventions

- **Filenames**: use readable, lowercase English words; add a keyword if needed (e.g. `topic-keyword`); use `-` as a separator. Avoid overly long names, spaces, and special characters (especially `:`, `#`, `[]`). Avoid redundant names implied by the folder path (e.g. `obsidian/obsidian-bases`).
- **Date naming**: if a note uses a date name, standardize on `YYYY-MM-DD` (e.g. `2026-03-05`).
- **Attachments**: follow Obsidian's attachment settings: keep attachments in the note's attachment folder (e.g. `attachments/`) rather than scattered. Embed with `![[...]]`.

### Ordering Prefixes (Optional; Off by Default)

Some users add a numeric prefix to file/folder names (e.g. `01-...`) to get a fixed ordering in the filesystem. For this vault (primary navigation via `links + Bases`):

- **Do not add numeric prefixes to normal note filenames by default**: it adds noise and ongoing maintenance cost in `[[wikilink]]` and Bases `file.name/file.basename` displays.
- **If you truly need a linear sequence** (courses, book chapters, serialized lists, fixed process docs), enable numeric prefixes for that small series:
  - Prefer fixed-width prefixes (e.g. two digits): `01-...`, `02-...`, `10-...` to keep ordering stable and allow insertion.
  - See `obsidian-markdown` for note-level display and linking guidance when prefixes are used.

Detailed note-editing rules, note-linking heuristics, and examples live in `obsidian-markdown`.

## Minimal Note Structure (Recommended)

### Frontmatter (Structured Properties)

Keep the property set small and stable. Prefer properties over heavy tag usage for anything you want to filter/group in Bases.

Recommended minimal set (use as needed; not all notes must fill everything):

```yaml
---
title: ""
tags: []
type: ""        # note / concept / project / meeting / person / source / diary, etc.
status: ""      # fleeting / active / paused / done / archived (optional)
area: ""        # area of responsibility (optional)
project: ""     # related project (optional; prefer links or consistent strings)
source: ""      # source (book/article/video/conversation; optional)
aliases: []     # note aliases: friendlier display names; searchable (optional)
---
```

Rules:

- `type/status/area/project/source` are for **structured classification and filtering** (Bases and search).
- `tags` are **keywords/topics** (e.g. `openai`, `agent`, `coding`) for search and association. Avoid encoding “structured classification” into tags to reduce redundancy.
- Quote strings that contain special characters to keep YAML valid.

Field conventions (v1):

- `type`: the “primary type” used by Bases filters; the set may evolve, but avoid frequently changing a note’s type.
- `status`: optional; enable only when you need workflow management (e.g., project `active/paused/done`).
- `area` / `project`: prefer links (e.g. `[[areas/xxx]]`, `[[projects/yyy]]`) so structured fields also strengthen the graph.
- `source`: prefer links or URLs (e.g. `[[resources/xxx]]` or `"https://..."`).

### Meta callout

- Do **not** maintain `created/updated` properties. Use `file.ctime/file.mtime` as the single source of truth. For readers, add a small tail section to display dates (not indexed as properties).
  - The Meta display may use `Dataview` to read `file.ctime/file.mtime`; if Dataview is not installed, omit the block or write times manually.

### Body (Connections First)

- The opening should answer: what is this / why it matters / what it relates to.
- Use `[[wikilink]]` for internal references; use Markdown links for external URLs only.
- For notes of the same type (`type`), use consistent templates (under `templates/`) to reduce missing sections and improve readability (*template library is still evolving*).

### Templates (v1)

- Store all templates under `templates/`.
- Organize templates by type structure. Each type should have at least one (possibly multiple) templates; create notes of that type from a template first.
- If no template fits, prefer extracting a new template pattern.

## Tags Rules (Keywords First)

Goal: few, stable, and reusable keywords that improve recall and search, while leaving structured classification to properties.

Conventions:

- Tags express “what this note is about” (keywords/topics), e.g. `openai`, `agent`, `coding`, `zettelkasten`.
- Prefer lowercase + kebab-case (e.g. `project-management`) to reduce duplicates due to case/synonyms.
- Avoid near-duplicates; fewer common tags beat many rare tags.
- Typically keep **1–5 tags** per note; if you exceed that, consider properties (e.g. `area/project/source`) or links (`[[related concept]]`) instead.

## Linking Rules (Connections)

- Internal links are a core part of retrieval and note connection in this vault, not just Markdown syntax.
  - a unresolved link is allowed for future reference.
  - Inline Internal links (with real semantic meaning) is recommended when taking note e.g., `here is suppose to be a [[keyword]]`(although for better management, a `Related` block is needed)
- Notes should usually have at least one meaningful semantic connection (`[[...]]`) or be included in a hub / MOC.
- Detailed note-linking heuristics, red-link policy, and hub guidance live in `obsidian-markdown`.

## Bases Rules (Archival Views)

### File Organization

- Keep Bases in `bases/` and use clear names, e.g.:
  - `bases/inbox.base`
  - `bases/projects.base`
  - `bases/orphans.base`

### Design Principles

- Define scope first via `filters` (tag / folder / property).
- Keep views small: usually 1–3 views (table/list/cards), prefer tables.
- Put only reusable, general computations into `formulas`; split complex logic into multiple formulas.
- Follow YAML quoting rules; quote any strings containing special characters.

### Recommended Long-Term Views (Iterate into them)

- **inbox / to-triage**: notes missing `type` or key properties; recently created but not classified.
- **missing / unresolved links**: list notes with missing/unresolved links (and which links are missing). Common formulas: `.agents/skills/obsidian-bases/references/COMMON_FORMULAS.md`.
- **orphans / orphans**: notes with no outgoing links and no backlinks (or very few); used to add connections.
- **projects / projects overview**: `type=project`, grouped by `status`.
- **recently-updated / recently updated**: sorted by `file.mtime` as the review entry point.

Detailed `.base` schema, formulas, syntax, and examples live in `obsidian-bases`.

## Definition of Done (DoD)

A note can be considered “maintainable long-term” (moved out of inbox / no longer just a draft) when:

- `type` is filled (the type set may evolve over time).
- `tags` ≤ 5 and reflect the note’s keywords.
- It has at least 1 semantic link (`[[...]]`) OR it is included in an MOC/Hub.
- If red links start to accumulate, resolve them in batches using the Missing view to prevent long-term drift.

## Maintenance Rhythm (Suggested)

- Weekly: clear Inbox (fill `type/tags`, add 1–3 key links). Use the Missing view to pick and resolve items, avoid Missing exploding.
- Monthly: handle Orphans (add hubs for important notes, merge duplicate concepts, clean up tag synonyms).

## Agent Workflow (Suggested)

When the user asks to “improve archiving and connections”, follow:

1) **Scan**: summarize current tags, common properties, folder structure, orphans/high-frequency terms (summary only; no big edits yet).
2) **Propose taxonomy**: propose core properties (e.g. `type/status/area/project/source`) plus a recommended keyword tag list; only add namespace tags if explicitly requested.
3) **Design 2–5 key Bases**: draft filters/views/key formulas for `.base` files.
4) **Pilot small batch**: apply to one domain or 20–50 notes, then review.
5) **Scale**: after confirmation, apply in bulk and keep maintaining.

---

Note: when creating/editing `.base` files, follow the in-vault `obsidian-bases` Skill; when editing normal notes, follow `obsidian-markdown`; when doing bulk stats/management/operations (or leveraging built-in features), follow `obsidian-cli`.
