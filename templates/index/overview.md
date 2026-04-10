<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("overview");
if (start.blocked) {
  tR += start.content;
  return;
}

const contextName = await h.promptValue("Context name");
const canonicalName = contextName || `overview ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const contextSlug = h.slugify(canonicalName, "overview");
const locationKind = await h.chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${contextSlug}`;
const targetFolder = locationKind === "custom"
  ? await h.promptValue("Target folder", `resources/${contextSlug}`)
  : defaultTargetFolder;
const source = await h.promptValue("Primary source link or note (optional)");
const extraTagsInput = await h.promptValue("Extra tags, comma-separated (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");
const related = await h.promptValue("Related note names, comma-separated (optional)");

const extraTags = h.normalizeTags(extraTagsInput);
const allTags = h.uniqueItems(extraTags);
const aliases = h.uniqueItems([canonicalName, ...h.listItems(aliasesInput)]);
const noteSlug = h.slugify(canonicalName, "overview");

await h.moveNote({ noteSlug, targetFolder });

tR += `${h.yamlFrontmatter([
  { key: "tags", value: allTags, list: true, always: true },
  { key: "kind", value: "index" },
  { key: "format", value: "overview" },
  { key: "status", value: "active" },
  { key: "source", value: source },
  { key: "aliases", value: aliases, list: true },
])}

# ${canonicalName}

>An entry point for this context, its notes, and its related working material.

## Overview
- 

## Scope

- 

## Structure

>Notes that link back to this overview will appear here.

![[bases/overview-structure.base#Linked Notes]]

## Open Loops

\`\`\`dataview
TASK
FROM ""
WHERE
  !completed AND
  startswith(file.folder, this.file.folder) AND
  !contains(file.folder, "templates")
GROUP BY file.link
\`\`\`

## Related
${h.bulletLinks(related)}
`;
-%>
