---
tags:
  - course
  - crafting-interpreters
  - compile
  - interpreter
kind: index
format: overview
status: active
source:
  - "[Web Page](https://craftinginterpreters.com)"
  - "[GitHub Code Repo](https://github.com/munificent/craftinginterpreters)"
aliases:
  - "Crafting Interpreters"
---

# Crafting Interpreters

>An entry point for the course, its notes, and its related study material.

## Overview

Build a durable course-study space for *Crafting Interpreters*, keeping notes, follow-up work, and distilled concepts connected without mixing them into the vault's permanent semantic layer too early.

>[!cite] In these pages, we will walk step-by-step through two complete interpreters for a full-featured language. I assume this is your first foray into languages, so I’ll cover each concept and line of code you need to build a complete, usable, fast language implementation.

## Scope

This project covers the book itself, chapter notes, local follow-up questions, and project-bound concept cards that still depend on the study context.

## Structure

>Notes that link back to this overview will appear here.

![[bases/course-structure.base#Linked Notes]]

## Open Loops

```dataview
TASK
FROM ""
WHERE
  !completed AND
  startswith(file.folder, this.file.folder) AND
  !contains(file.folder, "templates")
GROUP BY file.link
```

## Related

- [[crafting-interpreters/workspace]]
