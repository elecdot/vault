# Templater

Use Templater when a note template needs logic, prompts, file-aware behavior, or JavaScript.

## Common Syntax

- `<% ... %>`: inline expression output
- `<%* ... %>`: execution block for statements and async prompts
- `<%+ ... %>`: dynamic command evaluated in preview mode; prefer Dataview instead unless preview-time rendering is explicitly needed
- `tp.file.*`: title, creation date, modification date, file moves, and related helpers
- `tp.date.*`: formatted current or offset dates
- `tp.system.*`: user prompts and system-level helper functions
- `tp.frontmatter.*`: read frontmatter values already present on the current file
- `tp.user.*`: call configured user scripts or system command functions when the vault already defines them

## Foldering Guidance

- Save reusable templates under `templates/<workflow-family>/` when possible.
- Prefer folder names based on repeated workflows such as `daily`, `meetings`, `projects`, or `sources`.
- Do not assume the vault's `type` property is complete enough to drive template taxonomy on its own.
- If a template introduces a new recurring workflow, create a clear subfolder for that workflow rather than overloading an existing one.

## Good Fits

- daily or periodic notes with previous and next links
- prompts for note metadata or section headings
- conditional blocks based on user choices
- templates that compute links, aliases, or dynamic sections
- templates that rename or move a note as part of creation
- templates that call existing user scripts from the configured Templater script folder

## Execution Guidance

- Use interpolation commands for single values that should appear in the final note.
- Use execution blocks for `await tp.system.prompt(...)`, branching, loops, note moves, or multiple statements.
- Keep YAML quoting in the template when dynamic values may contain punctuation.
- Use whitespace control when execution tags would otherwise leave blank lines.

Whitespace control forms from the official docs:

- `<%_`: trim whitespace before a command
- `_%>`: trim whitespace after a command
- `<%-`: trim one newline before a command
- `-%>`: trim one newline after a command

## Example

```md
---
title: '<% tp.file.title %>'
type: "diary"
status: "active"
date: '<% tp.date.now("YYYY-MM-DD") %>'
tags:
  - daily
---

<< [[<% tp.date.now("YYYY-MM-DD", -1) %>]] | [[<% tp.date.now("YYYY-MM-DD", 1) %>]] >>

# <% tp.file.title %>

## Focus
<%* const focus = await tp.system.prompt("Focus for today") %>
<% focus %>

## Notes

## Follow-up
- 
```

## Constraints

- Prefer small expressions over large embedded scripts
- Keep JavaScript local to note creation needs
- Avoid assuming nonstandard helper functions unless they are already documented in the vault
- Do not use system command user functions unless the user already relies on them and understands the security implications
