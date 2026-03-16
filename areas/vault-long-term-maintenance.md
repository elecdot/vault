---
tags:
  - vault
  - knowledge-management
  - zettelkasten
  - para
kind: "area"
format: "reference"
aliases:
  - "Vault Long-Term Maintenance"
  - "vault maintenance warnings"
  - "long-term vault governance"
---

# Vault Long-Term Maintenance

This note records the long-term maintenance risks and operating mindset for this vault.

It is meant to protect the vault from slowly turning into a heavy system that is harder to maintain than the knowledge it stores. It relates closely to [[areas/vault-commit-convention|Vault Commit Convention]], [[PARA]], [[Zettelkasten]], and [[Obsidian]].

## Core Warning

If the system starts asking more of you than the notes are giving back, the system is too heavy.

## Main Risks

### Taxonomy creep

The vault already uses multiple organizing axes:

- PARA folders
- `kind`
- `format`
- tags
- links and MOCs
- Bases
- templates
- workflow-oriented commits

Each axis is useful on its own. The long-term risk is that they begin to overlap and encode the same distinctions in different ways.

Warning signs:

- a new edge case is solved by adding a new field, tag, folder, or template
- `tags` and properties begin to describe the same thing
- more and more distinctions need explanation before they can be used consistently

## Input friction

Capture must stay cheaper than postponement.

The vault will decay if adding a note starts to feel like filing paperwork. Long-term structure is only valuable if raw intake and early-stage writing remain easy.

Warning signs:

- you hesitate before creating a note because placement is unclear
- you avoid note creation because metadata feels mandatory
- capture notes pile up because distillation feels too expensive

## Retrieval theater

Bases, metadata, and dashboards are support systems, not the product.

The danger is building elegant retrieval machinery before enough durable notes exist to justify it.

Warning signs:

- more time is spent maintaining views than revisiting notes
- dashboards feel impressive but do not change review behavior
- metadata quality matters more than note usefulness

## Graph cosmetics

A dense graph is not the same thing as a useful graph.

Links should create navigability and synthesis, not visual complexity. A few strong hub notes are more valuable than many decorative links.

Warning signs:

- notes link to many places without improving navigation
- MOCs multiply faster than durable synthesis notes
- backlinks exist, but entry points remain weak

## History theater

Git history is a supporting record, not the main knowledge interface.

Workflow-aware commits are useful, but commit history should not become the primary way to understand what the vault means. That job belongs to notes, MOCs, and review documents.

Warning signs:

- commit semantics are maintained more carefully than synthesis notes
- git log explains changes better than the vault itself
- "recording work" starts to replace "improving notes"

## Operating Priorities

When tradeoffs appear, prefer this order:

1. keep capture friction low
2. keep durable note shapes stable
3. keep metadata sparse and consistent
4. keep MOCs meaningful and few
5. keep Bases focused on maintenance, not vanity
6. keep commits informative, but secondary to note quality

## Rules Of Restraint

- Every new axis must earn its existence.
- Every field added is a future maintenance burden.
- Every template is a promise to future you.
- Every taxonomy distinction will blur at the edges.
- Every retrieval system will decay unless it is cheaper to maintain than to ignore.

## What Future You Should Fear

- a vault where adding a note feels like paperwork
- a vault where folders, tags, properties, and links all repeat the same classification
- a vault with many templates but few reusable note shapes
- a vault with many linked notes but few real synthesis notes
- a vault whose rules are more consistent than its ideas are useful

## Healthy Target

Treat the vault as a garden, not a database.

The goal is not maximum structure. The goal is minimum structure that still compounds.
