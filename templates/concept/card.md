<%*
const promptValue = async (label, fallback = "", multiline = false) => {
  const value = await tp.system.prompt(label, fallback, false, multiline);
  return value ? value.trim() : "";
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

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

const titleInput = await promptValue("Card title / concept");
const title = titleInput || tp.file.title || `concept-card-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
const coreIdea = await promptValue("Core idea / tip", "", true);
const source = await promptValue("Source note, book, class, or URL (optional)");
const extraTagsInput = await promptValue("Tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["concept", ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const relatedBlock = bulletLinks(related);

tR += `---
title: "${yamlEscape(title)}"
tags:
${tagYaml}
kind: "concept"
format: "card"
status: "fleeting"
source: "${yamlEscape(source)}"
aliases: []
---

# ${title}

> A small reusable idea, tip, or side concept worth revisiting.

## Core Idea
${coreIdea || "- "}

## Related
${relatedBlock}

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
`;
-%>
