---
title: "Concept Linking And Distillation"
tags:
  - obsidian
  - knowledge-management
  - zettelkasten
  - linking
  - distillation
kind: "area"
format: "reference"
aliases:
  - "concept note decision model"
  - "red link and permanent note model"
  - "term naming and aliases"
---

# Concept Linking And Distillation

This note records the working model for deciding when a concept should stay inline, when it should become a `[[wikilink]]`, and when it should be distilled into a durable note under `knowledge/`.

It is meant to keep capture and reading friction low while still letting the graph grow around concepts that prove reusable. Related topics: [[areas/vault-long-term-maintenance|Vault Long-Term Maintenance]], [[Zettelkasten]], [[Obsidian]], and [[crafting-interpreters]].

## Core Model

Think in three layers:

- word
- node
- note

The decision is not "is this concept large enough for its own note?"

The first decision is:

**Is this a potential connection point?**

If yes, `[[link it]]`.

A wikilink is not a promise that the target note must exist now. It is a marker that this term may become a reusable semantic node later.

## Three Layers

### 1. Word

A word is only local prose material inside the current paragraph or explanation.

It does not need to become part of the graph.

Examples:

- "written in Java"
- "advanced features"
- "clean code"

Default action:

- leave as plain text

### 2. Node

A node is a term with semantic weight that may be reused, contrasted, or searched for later.

Examples:

- `[[self-hosting]]`
- `[[bootstrapping]]`
- `[[bytecode]]`
- `[[garbage-collection]]`

Default action:

- add a wikilink
- allow it to remain unresolved
- do not force immediate distillation

### 3. Note

A note is a stable graph entry point that already carries retrieval value on its own.

Examples:

- `[[lox|Lox]]`
- `[[cpython|CPython]]`
- `[[interpreter]]`
- `[[abstract-syntax-tree|abstract syntax tree]]`

Default action:

- create or distill a durable note when the concept proves reusable

## Default Workflow

Use this sequence:

1. first ask whether the term is a potential connection point
2. if yes, add `[[...]]` even if the concept is still small
3. allow unresolved links to accumulate in moderation
4. periodically review repeated red links
5. distill only the concepts that have started to earn stable note status

Short version:

**link first, filter later, distill last**

## When To Add `[[...]]`

Add a wikilink when the term has semantic weight and at least one of these is true:

- it helps distinguish one idea from another
- it may recur in later notes
- it may become a future retrieval key
- it could later anchor a concept note, hub, or comparison

Do not require the term to be "big enough". Size is not the criterion. Reusability is.

## When Not To Add `[[...]]`

Do not link terms that are only stylistic, local, or disposable.

Examples:

- "perfect language"
- "advanced feature"
- one-off phrasing that will not recur

The goal is semantic navigation, not visual graph density.

## Avoid One-Mention Links

- Keep links that preserve a structural relationship in the current note.
- Remove or avoid links that are only passing examples, background mentions, or weak future possibilities.
  - Do not keep a link only because the target may be useful later.
- Prefer explanatory edges over one-mention associations.

## When A Red Link Is Enough

Leave the link unresolved when:

- the concept is only needed in the current source note
- there is not yet enough understanding to write a durable note
- the term may recur later, but has not earned its own entry point yet

This is the default state for many early concepts in reading notes.

Example from interpreter notes:

- `[[self-hosting]]` can stay a red link at first
- `[[bootstrapping]]` can stay a red link at first

They already work as semantic anchors even before separate notes exist.

## When To Distill Into `knowledge/`

Create a durable concept note when one or more of these becomes true:

- the concept appears across multiple notes
- it needs contrast with nearby concepts
- you can state its definition, boundary, and examples in your own words
- other notes would benefit from linking to one stable explanation
- it is becoming a reusable entry point in a project, course, or MOC

The trigger is not note length. The trigger is that the concept has begun doing graph work.

## Example: Interpreter Notes

In [[projects/crafting-interpreters/00-introduction|00-introduction]]:

- `[[lox|Lox]]` and `[[cpython|CPython]]` are concrete entities and are strong candidates for standalone notes
- `[[self-hosting]]` and `[[bootstrapping]]` are concept terms and can begin as red links

This means:

- entity-like targets often deserve notes earlier
- concept-like targets often deserve links earlier than notes

These examples assume vault-style canonical filenames with lowercase kebab-case. At creation time, collect one canonical human-readable name, use it for the H1, write it into `aliases`, and let the filename remain the long-term graph identity. Display text may still stay reader-friendly through link aliases such as `[[cpython|CPython]]`.

## Naming Model For English Terms

When naming a concept note, prefer the form that works best as a stable dictionary-style entry point. Use that form as the canonical name, derive the filename from it, and store it in `aliases` alongside other meaningful variants.

Priority:

1. a standard concept noun
2. the most common term-like form
3. the form you can reliably remember and reuse

Example:

- canonicalName: `self-hosting`
- filename: `self-hosting.md`
- H1: `self-hosting`
- aliases: `self-hosting`, `self-hosted`, `self-host`, `self hosted`

Why:

- `self-hosting` behaves like a concept label
- `self-hosted` behaves more like an adjective inside sentences
- `self-host` is less stable as a standalone concept name

The goal is not linguistic perfection. The goal is stable retrieval.

## Naming Rules Of Thumb

- prefer nouns or term-like `-ing` forms for concept notes
- avoid adjective forms as the primary note name unless that form is clearly dominant
- use `aliases` to normalize natural-language links and absorb spelling variants, adjective forms, abbreviations, and spacing variants
- choose the form you are most likely to remember consistently

Examples:

- `self-hosting` with aliases `self-hosted`, `self-host`
- `bootstrapping` with aliases `bootstrap`, `bootstrapped`
- `garbage-collection` with alias `gc`
- `abstract-syntax-tree` with alias `ast`

## Decision Cheatsheet

Use these quick rules:

1. if a term has semantic weight, consider `[[...]]`
2. if it is only local wording, keep it plain
3. if it may recur, keep the red link
4. if it starts recurring or needs a stable explanation, distill it
5. if naming is uncertain, pick the most stable concept form and capture variants in `aliases`

## Healthy Target

The graph should grow by marking potential nodes cheaply, then promoting only the ones that prove useful.

A good note system does not demand that every linked term immediately become a note. It lets durable concepts emerge from repeated use.
