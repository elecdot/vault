<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("workspace");
if (start.blocked) {
  tR += start.content;
  return;
}

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

const projectName = await h.promptValue("Project name");
const defaultSlug = h.slugify(projectName, "project");
const projectSlug = await h.promptValue("Project slug", defaultSlug) || defaultSlug;
const localRepoPath = await h.promptValue("Local repo path (optional)");
const remoteRepo = await h.promptValue("Remote repo URL (optional)");
const tagsInput = await h.promptValue("Tags, comma-separated (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");
const relatedInput = await h.promptValue("Related note names, comma-separated (optional)");

const folderPath = `projects/${projectSlug}`;
if (!app.vault.getAbstractFileByPath(folderPath)) {
  await app.vault.createFolder(folderPath);
}

const extraTags = h.normalizeTags(tagsInput);
const allTags = h.uniqueItems(["workspace", ...extraTags]);
const sourceItems = [
  markdownLink("local repo", toFileUrl(localRepoPath)),
  markdownLink("remote repo", remoteRepo),
].filter(Boolean);
const workspaceName = `${projectName || projectSlug} Workspace`;
const aliases = h.uniqueItems([workspaceName, ...h.listItems(aliasesInput)]);

await tp.file.rename("workspace");
await tp.file.move(`${folderPath}/workspace`);

tR += `---
tags:${h.yamlTags(allTags)}
kind: "project"
format: "workspace"
status: "active"
project: "${h.yamlEscape(`[[${projectSlug}]]`)}"
source:${h.yamlList(sourceItems)}
aliases:${h.yamlList(aliases)}
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

${h.bulletLinks(relatedInput).replace("- none", "- ")}
`;
-%>
