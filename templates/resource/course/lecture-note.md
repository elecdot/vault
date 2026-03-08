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
  return slug || `lecture-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
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
const lectureTitle = await promptValue("Lecture title");
const title = lectureTitle || `${courseName || "course"} lecture ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const source = await promptValue("Source link or note (optional)");
const focus = await promptValue("Main focus of this lecture");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["course", "lecture", ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");

await tp.file.rename(slugify(title));

tR += `---
title: "${yamlEscape(title)}"
tags:
${tagYaml}
kind: "resource"
format: "note"
source: "${yamlEscape(source)}"
aliases: []
---

# ${title}

## Focus
${focus || "Not specified."}

## Key Ideas
- 

## Notes

## Questions
- 

## Related
- [[${courseName || "course overview"}]]
${related ? "\n" + bulletLinks(related) : ""}

## Next
- [ ] Clarify one open question
- [ ] Link this note to a summary or concept note
`;
-%>
