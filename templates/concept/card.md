<%*
const promptValue = async (label, fallback = "", multiline = false) => {
  const value = await tp.system.prompt(label, fallback, false, multiline);
  return value ? value.trim() : "";
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const listItems = (value) => value
  ? value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : [];
const uniqueItems = (items) => [...new Set(items.filter(Boolean))];

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

const canonicalNameInput = await promptValue("Canonical name / concept");
const canonicalName = canonicalNameInput || tp.file.title || `concept-card-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
const coreIdea = await promptValue("Core idea / tip", "", true);
const source = await promptValue("Source note, book, class, or URL (optional)");
const extraTagsInput = await promptValue("Tags, comma-separated (optional)");
const aliasesInput = await promptValue("Aliases, comma-separated (optional)");
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
const aliases = uniqueItems([canonicalName, ...listItems(aliasesInput)]);

tR += `---
tags:
${tagYaml}
kind: "concept"
format: "card"
status: "fleeting"
source: "${yamlEscape(source)}"
aliases:
${aliases.map((alias) => `  - "${yamlEscape(alias)}"`).join("\n")}
---

# ${canonicalName}

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
