<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("course-overview cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
  tR += targetContent;
  return;
}

const promptValue = async (label, fallback = "") => {
  const value = await tp.system.prompt(label, fallback);
  return value ? value.trim() : "";
};

const chooseValue = async (label, options, fallback) => {
  const fallbackIndex = Math.max(options.indexOf(fallback), 0);
  const value = await tp.system.suggester(options, options, false, label, fallbackIndex);
  return value || fallback || options[0];
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const slugify = (value) => {
  const slug = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `course-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
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
const listItems = (value) => value
  ? value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : [];
const yamlList = (items) => {
  if (!items.length) {
    return " []";
  }

  return `\n${items.map((item) => `  - "${yamlEscape(item)}"`).join("\n")}`;
};

const courseName = await promptValue("Course name");
const canonicalName = courseName || `course overview ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const courseSlug = slugify(canonicalName);
const locationKind = await chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${courseSlug}`;
const targetFolder = locationKind === "custom"
  ? await promptValue("Target folder", `resources/${courseSlug}`)
  : defaultTargetFolder;
const source = await promptValue("Primary source link or note (optional)");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const aliasesInput = await promptValue("Aliases, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["course", courseSlug, ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const aliases = [...new Set([canonicalName, ...listItems(aliasesInput)])];
const noteSlug = slugify(canonicalName);

await tp.file.rename(noteSlug);
if (targetFolder) {
  await tp.file.move(`${targetFolder}/${noteSlug}`);
}

tR += `---
tags:
${tagYaml}
kind: "index"
format: "overview"
status: "active"
source: "${yamlEscape(source)}"
aliases:${yamlList(aliases)}
---

# ${canonicalName}

>An entry point for the course, its notes, and its related study material.

## Overview
- 

## Scope

- 

## Structure

>Notes that link back to this overview will appear here.

![[bases/course-structure.base#Linked Notes]]

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
${bulletLinks(related)}
`;
-%>
