---
tags: []
kind: "index"
format: "map"
aliases:
  - "Knowledge Index"
---

# Knowledge Index

## Scope
This note is the root entry point for `knowledge/`. It should stay lightweight: point to domain maps, show recent movement, and expose maintenance gaps without duplicating every concept note by hand.

## Why
`knowledge/` is the durable semantic layer of the vault. It holds distilled concepts and the index notes that organize them. Reading notes, captures, and project material should usually mature elsewhere first.

## Starting Points
- [[knowledge/AGENTS|Knowledge Rules]]
- [[areas/concept-linking-and-distillation|Concept Linking And Distillation]]

## Domain Indexes
![[bases/knowledge.base#Domain Indexes]]

## Concepts
![[bases/knowledge.base#Concepts]]

## Recently Updated Concepts
![[bases/knowledge.base#Recently Updated]]

## Unindexed Concepts
![[bases/knowledge.base#Unindexed Concepts]]

## Open Follow-up
```dataview
TASK
FROM "knowledge"
WHERE !completed AND file.path != "knowledge/AGENTS.md"
GROUP BY file.link
```
