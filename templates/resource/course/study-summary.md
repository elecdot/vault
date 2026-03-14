<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("study-summary cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
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
const courseSlug = slugify(courseName || "course");
const locationKind = await chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${courseSlug}`;
const targetFolder = locationKind === "custom"
  ? await promptValue("Target folder", `resources/${courseSlug}`)
  : defaultTargetFolder;
const homeNote = await promptValue("Course home note (wikilink target)", courseSlug);
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

const allTags = [...new Set(["course", "summary", courseSlug, ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const courseOverviewLink = homeNote ? `[[${homeNote}]]` : (courseSlug ? `[[${courseSlug}]]` : "[[course-overview]]");
const projectYaml = locationKind === "projects" && homeNote
  ? `project: "${yamlEscape(`[[${homeNote}]]`)}"\n`
  : "";
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
format: "summary"
${projectYaml}source: "${yamlEscape(source)}"
---

# ${title}

## Scope
${scope || "Not specified."}

## Takeaways
- 

## Related
- ${courseOverviewLink}
${related ? "\n" + bulletLinks(related) : ""}

## Next
- [ ] Distill one key takeaway into a concept or project note
- [ ] Link this summary to a follow-up reading, lecture, or exercise note
`;
-%>
