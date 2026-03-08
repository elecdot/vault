# Examples

## Example Prompts

- Create a Templater template for daily notes with previous and next links and a prompt for the day's focus.
- Convert this existing note into a reusable Templater template under `templates/` and keep the vault's frontmatter rules.
- Build a project template library for this vault under `templates/project/`, using deeper format or descriptive subfolders only where repeated usage justifies them.
- Create a meeting template under `templates/meeting/` and only use frontmatter fields that clearly match the vault's current conventions.
- Create a repository-level template set under `templates/project/` and `templates/resource/` using Templater JavaScript for prompts and computed links.
- Turn this plain Markdown scaffold into an Obsidian Templater template that renames the file and fills frontmatter from prompts.

## Validation Heuristics

- If the template needs `await`, `tp.*`, branching, prompts, or offset dates, it should use Templater.
- If the right folder is unclear, prefer a flatter `templates/<kind>/` layout before adding `format` or descriptive subfolders.
- If frontmatter quotes are needed around dynamic values, keep them in the template so the rendered YAML stays valid.
- If execution tags introduce blank lines, use documented whitespace control instead of manual cleanup.
