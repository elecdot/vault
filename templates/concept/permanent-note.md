<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("permanent-note cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
  tR += targetContent;
  return;
}

const promptValue = async (label, fallback = "", multiline = false) => {
  const value = await tp.system.prompt(label, fallback, false, multiline);
  return value ? value.trim() : "";
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const slugify = (value) => {
  const slug = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `concept-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
};

const listItems = (value) => value
  ? value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : [];
const uniqueItems = (items) => [...new Set(items.filter(Boolean))];

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

const yamlList = (items, mapper = (item) => item) => {
  if (!items.length) {
    return " []";
  }

  return `\n${items.map((item) => `  - ${mapper(item)}`).join("\n")}`;
};

const wikilinkList = (items) => yamlList(items, (item) => `"${yamlEscape(item)}"`);
const quotedList = (items) => yamlList(items, (item) => `"${yamlEscape(item)}"`);

const canonicalNameInput = await promptValue("Canonical name");
const canonicalName = canonicalNameInput || tp.file.title || `concept ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const core = await promptValue("Core statement (2-6 sentences)", "", true);
const indexesInput = await promptValue("Index notes, comma-separated (optional)", "knowledge/indexes/");
const parent = await promptValue("Parent note (optional)");
const related = await promptValue("Related notes, comma-separated (optional)");
const contrast = await promptValue("Contrast notes, comma-separated (optional)");
const tagsInput = await promptValue("Tags, comma-separated (optional)");
const source = await promptValue("Source note or URL (optional)");
const aliasesInput = await promptValue("Aliases, comma-separated (optional)");

const aliases = uniqueItems([canonicalName, ...listItems(aliasesInput)]);
const tags = listItems(tagsInput).map((tag) => tag.toLowerCase().replace(/\s+/g, "-"));
const indexNotes = listItems(indexesInput).map(normalizeIndexLink).filter(Boolean);
const relatedLinks = listItems(related).map((item) => `[[${item}]]`).join(", ");
const contrastLinks = listItems(contrast).map((item) => `[[${item}]]`).join(", ");
const parentLink = parent ? `[[${parent}]]` : (indexNotes[0] || "");
const hasMeaningfulConnection = Boolean(parentLink || relatedLinks || contrastLinks);

if (!hasMeaningfulConnection) {
  new Notice("permanent-note requires at least one connection: provide an index, parent, related, or contrast note.");
  return;
}

const noteSlug = slugify(canonicalName);
await tp.file.rename(noteSlug);
await tp.file.move(`knowledge/${noteSlug}`);

tR += `---
tags:${yamlList(tags)}
kind: "concept"
format: "note"
aliases:${quotedList(aliases)}
source: "${yamlEscape(source)}"
indexes:${wikilinkList(indexNotes)}
---

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
