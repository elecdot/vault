<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("exercise-review cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
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
  return slug || `exercise-review-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
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

const courseName = await promptValue("Course name");
const reviewName = await promptValue("Canonical exercise or assignment name");
const canonicalName = reviewName || `${courseName || "course"} exercise review`;
const courseSlug = slugify(courseName || "course");
const locationKind = await chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${courseSlug}`;
const targetFolder = locationKind === "custom"
  ? await promptValue("Target folder", `resources/${courseSlug}`)
  : defaultTargetFolder;
const homeNote = await promptValue("Course home note (wikilink target)", courseSlug);
const source = await promptValue("Source link or note (optional)");
const task = await promptValue("Prompt or task summary");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["course", "exercise", courseSlug, ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const courseOverviewLink = homeNote ? `[[${homeNote}]]` : (courseSlug ? `[[${courseSlug}]]` : "[[course-overview]]");
const projectYaml = locationKind === "projects" && homeNote
  ? `project: "${yamlEscape(`[[${homeNote}]]`)}"\n`
  : "";
const aliases = [canonicalName];
const noteSlug = slugify(canonicalName);

await tp.file.rename(noteSlug);
if (targetFolder) {
  await tp.file.move(`${targetFolder}/${noteSlug}`);
}

tR += `---
tags:
${tagYaml}
kind: "resource"
format: "review"
${projectYaml}source: "${yamlEscape(source)}"
aliases:${yamlList(aliases)}
---

# ${canonicalName}

## Task
${task || "Not specified."}

## Approach

## Takeaways
- 

## Related
- ${courseOverviewLink}
${related ? "\n" + bulletLinks(related) : ""}

## Next
- [ ] Distill key lessons into a study summary
- [ ] Link this note to a related concept or project note
`;
-%>
