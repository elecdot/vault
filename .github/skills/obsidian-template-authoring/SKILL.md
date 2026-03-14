---
name: obsidian-template-authoring
description: 'Create and edit reusable Obsidian note templates using the Templater plugin syntax and Templater JavaScript. Use when building daily, meeting, project, resource, or other note templates, converting notes into reusable templates, adding dynamic frontmatter or prompts, or organizing a repository-level template library under templates/.'
---

# Obsidian Template Authoring Skill

Create and edit reusable template files for this vault with Obsidian Templater syntax.

Keep the main skill procedural and load references only when needed:

- Read [TEMPLATER.md](./references/TEMPLATER.md) when writing or checking Templater syntax, commands, prompts, or JavaScript execution blocks.
- Read [EXAMPLES.md](./references/EXAMPLES.md) when the user wants a concrete template pattern or when the workflow shape is still unclear.

## Workflow

1. **Inspect the target workflow**: identify what repeated task the template should support, what note it should produce, and whether the vault already has a nearby template or naming pattern to extend.
2. **Choose the template subfolder**: prefer `templates/<kind>/` as the default home for a template. When one `kind` has multiple recurring expression shapes or stable template patterns, use a second level such as `templates/<kind>/<format>/` or another descriptive subfolder.
3. **Decide note semantics first**: determine the note's `kind`, optional `format`, intended folder, and graph role before designing prompts or automation. The template contract is downstream of note semantics; do not let implementation convenience weaken the semantic decision.
4. **Define the template contract**: classify each important value or section as one of:
   - `prompted`: unknown at creation time and worth capturing immediately
   - `derived`: reliably computed from note context, path, date, or other stable inputs
   - `manual`: better filled in after note creation inside the rendered note
   - `fixed`: stable boilerplate that should remain constant across uses

   Prefer `derived` over `prompted` when the value can be computed reliably. Prefer `manual` over `prompted` when the value is optional, subjective, or usually refined after creation.
5. **Design the output note shape**: define the filename, target folder, frontmatter, main sections, expected wikilinks, and only the prompts or computed values justified by the contract above. Use the vault's `kind`/`format` model when structured properties are helpful, and avoid reintroducing the old overloaded `type` field.
6. **Author with Templater**: use `tp.*` helpers for values that genuinely vary between runs. Prefer interpolation commands for simple output and execution blocks for prompts, branching, async work, or multi-step JavaScript.
7. **Match vault conventions**: keep filenames readable and lowercase, store reusable templates under `templates/`, and align frontmatter and links with the vault rules in `AGENTS.md`.
8. **Validate the rendered result**: confirm YAML validity, check that Templater expressions are correct, and make sure the produced note shape is plausible without additional manual cleanup.

## Foldering Strategy

- Prefer `templates/<kind>/` as the stable default organization.
- Use a second level such as `templates/<kind>/<format>/` or another descriptive subfolder only when one `kind` has multiple high-frequency template families.
- Keep filenames specific to the produced note shape, for example `summary.md`, `outline.md`, `reference.md`, or `weekly-review.md`.
- If the right second-level subdivision is unclear, prefer a flatter `templates/<kind>/` layout until repeated usage justifies more structure.
- If a template could plausibly fit multiple places, choose the folder that best matches the note's `kind`; use the filename or second-level folder to express the format or local pattern difference.

## Templater Authoring Rules

- Use Templater for computed links, metadata, relative dates, prompts, conditionals, and reusable note scaffolding logic.
- Prefer documented plugin APIs such as `tp.file`, `tp.date`, `tp.system`, and `tp.frontmatter`.
- Prefer small expressions over large embedded scripts.
- Keep JavaScript local to note creation needs.
- Use `await` only inside execution blocks.
- Avoid assuming nonstandard helper functions unless they are already documented in the vault or explicitly configured in Templater.
- Treat dynamic commands and system commands as advanced features; use them only when the workflow actually depends on them.

## Automation Boundary

- Do not add a prompt unless it clearly saves repeated effort at creation time.
- Prefer derived values over prompts when the value can be computed reliably from existing context.
- Prefer manual placeholders when the value is usually refined after creation or is not worth interrupting the user for.
- If a manual field is important for first-use completeness, add a lightweight `Next` step or day-0 reminder in the rendered note rather than forcing another prompt.
- Avoid decorative scaffolding that often survives as noise in the final note.
- If a template introduces a new field shape or body convention, check nearby templates and local `AGENTS.md` rules before finalizing it.

## Output Discipline

- Optimize for low cleanup after creation: a rendered note should be immediately usable.
- Keep visible boilerplate minimal; prefer structural placeholders over explanatory prose.
- Use one consistent empty-state pattern within a template family.
- Prefer conventions that are stable across repeated use over one-off task-specific formatting.
- When a field supports multiple valid shapes, choose the simplest shape that matches the expected use of that template, and leave family-specific conventions to local `AGENTS.md` or nearby template precedent.

## Quality Criteria

- The chosen subfolder is justified by `kind` first, with `format` or a descriptive local pattern name used only as needed for retrieval.
- The semantic decision (`kind` / `format` / folder / graph role) is clear before automation details are added.
- Frontmatter stays valid after template expansion.
- The template produces a note that matches the vault's note and linking conventions.
- Dynamic fields are limited to values that genuinely vary between uses.
- Templater code is simple, readable, and scoped to note creation rather than broad vault mutation.
- Manual placeholders and day-0 reminders are used deliberately rather than as leftover boilerplate.

## Completion Checklist

- Template saved under `templates/` and usually under a `kind` subfolder, optionally with one deeper `format` or descriptive-pattern subdivision.
- Filename is readable and stable.
- Templater syntax uses valid command forms such as `<% ... %>`, `<%* ... %>`, or other documented Templater tags only.
- Internal references are written as wikilinks.
- Frontmatter and section structure are still valid Markdown and YAML.
- Prompts, derived values, and manual placeholders follow an explicit contract rather than being mixed ad hoc.

## References

- [TEMPLATER.md](./references/TEMPLATER.md)
- [EXAMPLES.md](./references/EXAMPLES.md)
- [Templater Introduction](https://silentvoid13.github.io/Templater/introduction.html)
