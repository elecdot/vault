---
name: obsidian-markdown
description: Create and edit Obsidian Flavored Markdown with wikilinks, embeds, callouts, properties, and other Obsidian-specific syntax. Use when working with .md files in Obsidian, or when the user mentions wikilinks, callouts, frontmatter, tags, embeds, or Obsidian notes.
---

# Obsidian Flavored Markdown Skill

Create and edit valid Obsidian Flavored Markdown for this vault. Use this skill when the task is about note creation, metadata cleanup, wikilinks, embeds, callouts, tags, note cleanup, or note restructuring.

This skill keeps task rules and vault-specific conventions in the main body. Syntax tables and longer examples live in `references/`.

## Workflow: Creating or Editing an Obsidian Note

1. **Inspect the note context**: identify the note type, intended folder, nearby linked notes, and whether a template already exists for this kind of note.
2. **look for relevant templates**: if a template exists for this note type, use it as the starting point. If not, create a new note following the vault's naming and folder rules.
2. **Add or update frontmatter**: prefer the vault's minimal property set. See [PROPERTIES.md](references/PROPERTIES.md) for property syntax details.
3. **Preserve prose**: make minimal edits; do not rewrite prose just to normalize style.
4. **Add semantic connections**: use wikilinks for internal notes (a unresolved link is allowed for future reference), Markdown links for external URLs, and add tags only when they improve retrieval.
5. **Use Obsidian features only when they serve the note**: embeds, callouts, comments, highlights, math, Mermaid, and footnotes are available but should not be added mechanically.
6. **Validate before finishing**: check YAML validity, wikilinks, embeds, callouts, and whether the note now follows the vault conventions below.

> When choosing between wikilinks and Markdown links: use `[[wikilinks]]` for notes within the vault (Obsidian tracks renames automatically) and `[text](url)` for external URLs only.

## Vault Policy

- Follow the vault-wide naming, metadata, tag, linking, and template rules defined in `AGENTS.md`.
- Use this skill to apply those rules while editing notes; do not redefine them here.

## Validation Checklist

- Frontmatter is valid YAML.
- `tags` are topical keywords, not structured categories.
- `type` is present when the note is meant to be maintained long-term.
- Internal references use wikilinks and external references use Markdown links.
- Links added are semantic rather than decorative.
- File naming and attachment placement still follow the vault rules.

## References

- [PROPERTIES.md](references/PROPERTIES.md)
- [EMBEDS.md](references/EMBEDS.md)
- [CALLOUTS.md](references/CALLOUTS.md)
- [WIKILINKS_AND_SYNTAX.md](references/WIKILINKS_AND_SYNTAX.md)
- [EXAMPLES.md](references/EXAMPLES.md)
- [Obsidian Flavored Markdown](https://help.obsidian.md/obsidian-flavored-markdown)
- [Internal links](https://help.obsidian.md/links)
- [Embed files](https://help.obsidian.md/embeds)
- [Callouts](https://help.obsidian.md/callouts)
- [Properties](https://help.obsidian.md/properties)
