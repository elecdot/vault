<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("permanent-note");
if (start.blocked) {
  tR += start.content;
  return;
}

const normalizeIndexLink = (value) => {
  const trimmed = value.trim().replace(/^\[\[|\]\]$/g, "");
  if (!trimmed) {
    return "";
  }

  if (trimmed === "knowledge/indexes/" || trimmed === "indexes/") {
    return "";
  }

  if (trimmed.startsWith("knowledge/indexes/")) {
    return `[[${trimmed}]]`;
  }

  if (trimmed.startsWith("indexes/")) {
    return `[[knowledge/${trimmed}]]`;
  }

  if (trimmed.includes("/")) {
    return `[[${trimmed}]]`;
  }

  return `[[knowledge/indexes/${trimmed}]]`;
};

const canonicalNameInput = await h.promptValue("Canonical name");
const canonicalName = canonicalNameInput || tp.file.title || `concept ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const core = await h.promptValue("Core statement (2-6 sentences)", "", true);
const indexesInput = await h.promptValue("Index notes, comma-separated (optional)", "knowledge/indexes/");
const parent = await h.promptValue("Parent note (optional)");
const related = await h.promptValue("Related notes, comma-separated (optional)");
const contrast = await h.promptValue("Contrast notes, comma-separated (optional)");
const tagsInput = await h.promptValue("Tags, comma-separated (optional)");
const source = await h.promptValue("Source note or URL (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");

const aliases = h.uniqueItems([canonicalName, ...h.listItems(aliasesInput)]);
const tags = h.normalizeTags(tagsInput);
const indexNotes = h.listItems(indexesInput).map(normalizeIndexLink).filter(Boolean);
const relatedLinks = h.listItems(related).map((item) => `[[${item}]]`).join(", ");
const contrastLinks = h.listItems(contrast).map((item) => `[[${item}]]`).join(", ");
const parentLink = parent ? `[[${parent}]]` : (indexNotes[0] || "");
const hasMeaningfulConnection = Boolean(parentLink || relatedLinks || contrastLinks);

if (!hasMeaningfulConnection) {
  new Notice("permanent-note requires at least one connection: provide an index, parent, related, or contrast note.");
  return;
}

const noteSlug = h.slugify(canonicalName, "concept");
await tp.file.rename(noteSlug);
await tp.file.move(`knowledge/${noteSlug}`);

tR += `${h.yamlFrontmatter([
  { key: "tags", value: tags, list: true, always: true },
  { key: "kind", value: "concept" },
  { key: "format", value: "note" },
  { key: "aliases", value: aliases, list: true },
  { key: "source", value: source },
  { key: "indexes", value: indexNotes, list: true },
])}

# ${canonicalName}

## Core
${core || "- "}

## Connections
- Parent: ${parentLink}
- Related: ${relatedLinks}
- Contrast: ${contrastLinks}

## Boundaries
- 

## Examples
- 

## Source Trail
- ${source || "none"}

## Next
- [ ] Add one concrete example
- [ ] Clarify one boundary or contrast
`;
-%>
