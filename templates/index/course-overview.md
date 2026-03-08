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

const courseName = await promptValue("Course name");
const title = courseName || `course overview ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const source = await promptValue("Primary source link or note (optional)");
const whyStudy = await promptValue("Why study this course?");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["course", ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");

await tp.file.rename(slugify(title));

tR += `---
title: "${yamlEscape(title)}"
tags:
${tagYaml}
kind: "index"
format: "overview"
source: "${yamlEscape(source)}"
aliases: []
---

# ${title}

## What This Is
An entry point for the course, its notes, and its related study material.

## Why Study It
${whyStudy || "Not specified."}

## Source
${source || "none"}

## Structure
- [[${title} lecture 01]]
- [[${title} study summary 01]]
- [[${title} exercise review 01]]

## Key Notes
- 

## Related
${bulletLinks(related)}
`;
-%>
