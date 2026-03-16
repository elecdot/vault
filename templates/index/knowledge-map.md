<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("knowledge-map cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
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
  return slug || `knowledge-map-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
};

const bulletLinks = (value) => {
  if (!value) {
    return "- none";
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- [[${item}]]`)
    .join("\n");
};

const yamlList = (items) => {
  if (!items.length) {
    return " []";
  }

  return `\n${items.map((item) => `  - "${yamlEscape(item)}"`).join("\n")}`;
};

const canonicalNameInput = await promptValue("Canonical name / domain");
const canonicalName = canonicalNameInput || tp.file.title || `knowledge map ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const scope = await promptValue("Scope", "", true);
const why = await promptValue("Why does this domain matter?", "", true);
const startingPoints = await promptValue("Starting points, comma-separated (optional)");
const distinctions = await promptValue("Key distinctions, one per line (optional)", "", true);
const tagsInput = await promptValue("Tags, comma-separated (optional)");
const aliasesInput = await promptValue("Aliases, comma-separated (optional)");

const tags = tagsInput
  ? tagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];
const aliases = [...new Set([canonicalName, ...aliasesInput.split(",").map((item) => item.trim()).filter(Boolean)])];

const noteSlug = slugify(canonicalName);
await tp.file.rename(noteSlug);
await tp.file.move(`knowledge/indexes/${noteSlug}`);

tR += `---
tags:${yamlList(tags)}
kind: "index"
format: "map"
aliases:${yamlList(aliases)}
---

# ${canonicalName}

## Scope
${scope || "- "}

## Why
${why || "- "}

## Key Distinctions
${distinctions ? distinctions.split(/\r?\n/).map((line) => `- ${line}`).join("\n") : "- "}

## Starting Points
${bulletLinks(startingPoints)}

## Concepts
![[bases/knowledge-domain.base#Domain Concepts]]

## Recently Updated
![[bases/knowledge-domain.base#Recently Updated]]

## Gaps
\`\`\`dataview
TASK
FROM "knowledge"
WHERE !completed AND (file.link = this.file.link OR contains(indexes, this.file.link))
GROUP BY file.link
\`\`\`
`;
-%>
