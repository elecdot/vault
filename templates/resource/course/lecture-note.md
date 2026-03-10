<%*
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
const courseSlug = slugify(courseName || "course");
const locationKind = await chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${courseSlug}`;
const targetFolder = locationKind === "custom"
  ? await promptValue("Target folder", `resources/${courseSlug}`)
  : defaultTargetFolder;
const projectNote = locationKind === "projects"
  ? await promptValue("Project note (wikilink target)", courseSlug)
  : "";
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

const allTags = [...new Set(["course", "lecture", courseSlug, ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const courseOverviewLink = courseName ? `[[${courseSlug}]]` : "[[course-overview]]";
const projectYaml = projectNote ? `project: "${yamlEscape(`[[${projectNote}]]`)}"\n` : "";
const noteSlug = slugify(title);

await tp.file.rename(noteSlug);
if (targetFolder) {
  await tp.file.move(`${targetFolder}/${noteSlug}`);
}

tR += `---
title: "${yamlEscape(title)}"
tags:
${tagYaml}
kind: "resource"
format: "note"
${projectYaml}source: "${yamlEscape(source)}"
---

# ${title}

## Focus
${focus || "Not specified."}

## Notes

## Related
- ${courseOverviewLink}
${related ? "\n" + bulletLinks(related) : ""}

## Next
- [ ] Clarify one open question
- [ ] Link this note to a summary or concept note
`;
-%>
