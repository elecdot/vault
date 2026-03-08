<%*
const promptValue = async (label, fallback = "") => {
  const value = await tp.system.prompt(label, fallback);
  return value ? value.trim() : "";
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const slugify = (value) => {
  const slug = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `study-summary-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
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

const courseName = await promptValue("Course name");
const summaryTitle = await promptValue("Summary title");
const title = summaryTitle || `${courseName || "course"} study summary`;
const source = await promptValue("Source link or note (optional)");
const scope = await promptValue("What does this summary cover?");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["course", "summary", ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");

await tp.file.rename(slugify(title));

tR += `---
title: "${yamlEscape(title)}"
tags:
${tagYaml}
kind: "resource"
format: "summary"
source: "${yamlEscape(source)}"
aliases: []
---

# ${title}

## Scope
${scope || "Not specified."}

## Core Takeaways
- 

## Important Links
- [[${courseName || "course overview"}]]

## Open Questions
- 

## Related Concepts
${bulletLinks(related)}
`;
-%>
