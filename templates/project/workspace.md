<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("workspace cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
  tR += targetContent;
  return;
}

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
  return slug || `project-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
};

const yamlList = (items) => {
  if (!items.length) {
    return " []";
  }

  return `\n${items.map((item) => `  - "${yamlEscape(item)}"`).join("\n")}`;
};
const listItems = (value) => value
  ? value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : [];

const bulletLinks = (value) => {
  if (!value) {
    return "- ";
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => `- [[${item}]]`)
    .join("\n");
};

const toFileUrl = (value) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^[a-z]+:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (/^[A-Za-z]:[\\/]/.test(trimmed)) {
    return `file:///${encodeURI(trimmed.replace(/\\/g, "/"))}`;
  }

  if (/^\\\\/.test(trimmed)) {
    return `file://${encodeURI(trimmed.replace(/^\\\\/, "").replace(/\\/g, "/"))}`;
  }

  if (trimmed.startsWith("/")) {
    return `file://${encodeURI(trimmed)}`;
  }

  return trimmed;
};

const markdownLink = (label, target) => target ? `[${label}](${target})` : "";

const projectName = await promptValue("Project name");
const defaultSlug = slugify(projectName);
const projectSlug = await promptValue("Project slug", defaultSlug) || defaultSlug;
const localRepoPath = await promptValue("Local repo path (optional)");
const remoteRepo = await promptValue("Remote repo URL (optional)");
const tagsInput = await promptValue("Tags, comma-separated (optional)");
const aliasesInput = await promptValue("Aliases, comma-separated (optional)");
const relatedInput = await promptValue("Related note names, comma-separated (optional)");

const folderPath = `projects/${projectSlug}`;
if (!app.vault.getAbstractFileByPath(folderPath)) {
  await app.vault.createFolder(folderPath);
}

const extraTags = tagsInput
  ? tagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];
const allTags = [...new Set(["workspace", ...extraTags])];
const sourceItems = [
  markdownLink("local repo", toFileUrl(localRepoPath)),
  markdownLink("remote repo", remoteRepo),
].filter(Boolean);
const workspaceName = `${projectName || projectSlug} Workspace`;
const aliases = [...new Set([workspaceName, ...listItems(aliasesInput)])];

await tp.file.rename("workspace");
await tp.file.move(`${folderPath}/workspace`);

tR += `---
tags:
${allTags.map((tag) => `  - ${tag}`).join("\n")}
kind: "project"
format: "workspace"
status: "active"
project: "${yamlEscape(`[[${projectSlug}]]`)}"
source:${yamlList(sourceItems)}
aliases:${yamlList(aliases)}
---

# ${workspaceName}

> Scope:

## Overview

### Environment

- Setup: \`\`
- Tooling: \`\`
- Branch:
- Run:
- Test:

### Milestones

- [ ] 

### Current Focus

- [ ] Fill in scope, environment, notes, and related links for this workspace.

## Notes

- 

## Related

${bulletLinks(relatedInput)}
`;
-%>
