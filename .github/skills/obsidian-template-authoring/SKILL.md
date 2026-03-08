---
name: obsidian-template-authoring
description: 'Create and edit reusable Obsidian note templates using the Templater plugin syntax and Templater JavaScript. Use when building daily, meeting, project, source, or other note templates, converting notes into reusable templates, adding dynamic frontmatter or prompts, or organizing a repository-level template library under templates/.'
---

# Obsidian Template Authoring Skill

Create and edit reusable template files for this vault with Obsidian Templater syntax.

Keep the main skill procedural and load references only when needed:

- Read [TEMPLATER.md](./references/TEMPLATER.md) when writing or checking Templater syntax, commands, prompts, or JavaScript execution blocks.
- Read [EXAMPLES.md](./references/EXAMPLES.md) when the user wants a concrete template pattern or when the workflow shape is still unclear.

## Workflow

1. **Inspect the target workflow**: identify what repeated task the template should support, what note it should produce, and whether the vault already has a nearby template or naming pattern to extend.
2. **Choose the template subfolder**: prefer `templates/<workflow-family>/` such as `templates/daily/`, `templates/projects/`, or `templates/meetings/`. Do not derive the folder mechanically from the note `type` field; prefer stable workflow families the user will recognize later.
3. **Design the output note shape**: define the filename, target folder, frontmatter, main sections, expected wikilinks, and any prompts or computed values. Only add `type` or other structured properties when they are clearly useful and already align with vault practice.
4. **Author with Templater**: use `tp.*` helpers for values that genuinely vary between runs. Prefer interpolation commands for simple output and execution blocks for prompts, branching, async work, or multi-step JavaScript.
5. **Match vault conventions**: keep filenames readable and lowercase, store reusable templates under `templates/`, and align frontmatter and links with the vault rules in `AGENTS.md`.
6. **Validate the rendered result**: confirm YAML validity, check that Templater expressions are correct, and make sure the produced note shape is plausible without additional manual cleanup.

## Foldering Strategy

- Prefer subfolders under `templates/` for archive-by-type or archive-by-workflow organization.
- Use workflow families that are easy to recognize from the user's request, such as `daily`, `meetings`, `projects`, `sources`, or `people`.
- If the vault does not yet have a stable family for the template, choose a descriptive folder name tied to the repeated workflow rather than forcing a stronger `type` taxonomy.
- If a template could fit multiple families, choose the folder that best matches how the user will look for it later.

## Templater Authoring Rules

- Use Templater for computed links, metadata, relative dates, prompts, conditionals, and reusable note scaffolding logic.
- Prefer documented plugin APIs such as `tp.file`, `tp.date`, `tp.system`, and `tp.frontmatter`.
- Prefer small expressions over large embedded scripts.
- Keep JavaScript local to note creation needs.
- Use `await` only inside execution blocks.
- Avoid assuming nonstandard helper functions unless they are already documented in the vault or explicitly configured in Templater.
- Treat dynamic commands and system commands as advanced features; use them only when the workflow actually depends on them.

## Quality Criteria

- The chosen subfolder is justified by workflow family, not by a forced taxonomy.
- Frontmatter stays valid after template expansion.
- The template produces a note that matches the vault's note and linking conventions.
- Dynamic fields are limited to values that genuinely vary between uses.
- Templater code is simple, readable, and scoped to note creation rather than broad vault mutation.

## Completion Checklist

- Template saved under `templates/` and usually under a descriptive subfolder.
- Filename is readable and stable.
- Templater syntax uses valid command forms such as `<% ... %>`, `<%* ... %>`, or other documented Templater tags only.
- Internal references are written as wikilinks.
- Frontmatter and section structure are still valid Markdown and YAML.

## References

- [TEMPLATER.md](./references/TEMPLATER.md)
- [EXAMPLES.md](./references/EXAMPLES.md)
- [Templater Introduction](https://silentvoid13.github.io/Templater/introduction.html)
