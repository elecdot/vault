<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("course-overview");
if (start.blocked) {
  tR += start.content;
  return;
}

const courseName = await h.promptValue("Course name");
const canonicalName = courseName || `course overview ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const courseSlug = h.slugify(canonicalName, "course");
const locationKind = await h.chooseValue("Store under", ["resources", "projects", "custom"], "resources");
const defaultTargetFolder = `${locationKind === "projects" ? "projects" : "resources"}/${courseSlug}`;
const targetFolder = locationKind === "custom"
  ? await h.promptValue("Target folder", `resources/${courseSlug}`)
  : defaultTargetFolder;
const source = await h.promptValue("Primary source link or note (optional)");
const extraTagsInput = await h.promptValue("Extra tags, comma-separated (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");
const related = await h.promptValue("Related note names, comma-separated (optional)");

const extraTags = h.normalizeTags(extraTagsInput);
const allTags = h.uniqueItems(["course", courseSlug, ...extraTags]);
const aliases = h.uniqueItems([canonicalName, ...h.listItems(aliasesInput)]);
const noteSlug = h.slugify(canonicalName, "course");

await tp.file.rename(noteSlug);
if (targetFolder) {
  await tp.file.move(`${targetFolder}/${noteSlug}`);
}

tR += `---
tags:${h.yamlTags(allTags)}
kind: "index"
format: "overview"
status: "active"
source: "${h.yamlEscape(source)}"
aliases:${h.yamlList(aliases)}
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
${h.bulletLinks(related)}
`;
-%>
