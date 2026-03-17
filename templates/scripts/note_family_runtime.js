module.exports = async function(tp) {
  const failSpec = (message) => {
    new Notice(message);
    throw new Error(message);
  };

  const getValidatedSpec = (spec, consumerName) => {
    if (!spec || typeof spec !== "object") {
      failSpec(`${consumerName} requires an explicit spec object.`);
    }

    const allowedKinds = Array.isArray(spec.allowedKinds) ? spec.allowedKinds : [];
    if (!allowedKinds.length) {
      failSpec(`${consumerName} requires spec.allowedKinds.`);
    }

    if (spec.defaultKind && !allowedKinds.includes(spec.defaultKind)) {
      failSpec(`${consumerName} requires spec.defaultKind to be included in spec.allowedKinds.`);
    }

    if (!spec.allowedFoldersByKind || typeof spec.allowedFoldersByKind !== "object") {
      failSpec(`${consumerName} requires spec.allowedFoldersByKind.`);
    }

    for (const kind of allowedKinds) {
      const folders = spec.allowedFoldersByKind[kind];
      if (!Array.isArray(folders) || !folders.length) {
        failSpec(`${consumerName} requires spec.allowedFoldersByKind.${kind} to be a non-empty array.`);
      }
    }

    if (spec.defaultFolderByKind != null && typeof spec.defaultFolderByKind !== "object") {
      failSpec(`${consumerName} requires spec.defaultFolderByKind to be an object when provided.`);
    }

    const defaultFolderByKind = spec.defaultFolderByKind || {};
    for (const [kind, folder] of Object.entries(defaultFolderByKind)) {
      if (!allowedKinds.includes(kind)) {
        failSpec(`${consumerName} requires spec.defaultFolderByKind.${kind} to target an allowed kind.`);
      }

      const allowedFolders = spec.allowedFoldersByKind[kind] || [];
      if (!allowedFolders.includes(folder)) {
        failSpec(`${consumerName} requires spec.defaultFolderByKind.${kind} to be included in spec.allowedFoldersByKind.${kind}.`);
      }
    }

    if (spec.frontmatter != null && (typeof spec.frontmatter !== "object" || Array.isArray(spec.frontmatter))) {
      failSpec(`${consumerName} requires spec.frontmatter to be an object when provided.`);
    }

    const frontmatter = spec.frontmatter || {};
    if (frontmatter.includeProjectFromHomeNoteKinds != null) {
      if (!Array.isArray(frontmatter.includeProjectFromHomeNoteKinds)) {
        failSpec(`${consumerName} requires spec.frontmatter.includeProjectFromHomeNoteKinds to be an array when provided.`);
      }

      for (const kind of frontmatter.includeProjectFromHomeNoteKinds) {
        if (!allowedKinds.includes(kind)) {
          failSpec(`${consumerName} requires spec.frontmatter.includeProjectFromHomeNoteKinds to contain only allowed kinds.`);
        }
      }
    }

    if (frontmatter.includeSource != null && typeof frontmatter.includeSource !== "boolean") {
      failSpec(`${consumerName} requires spec.frontmatter.includeSource to be a boolean when provided.`);
    }

    return spec;
  };

  const collectCommonFields = async ({
    h,
    spec,
    canonicalLabel,
    canonicalDefault,
    slugPrefix,
  }) => {
    const resolvedSpec = getValidatedSpec(spec, "collectCommonFields");
    const allowedKinds = resolvedSpec.allowedKinds;
    const defaultKind = resolvedSpec.defaultKind || allowedKinds[0];

    const noteKind = await h.requireChoice("Note kind", allowedKinds, defaultKind);
    if (!noteKind) {
      return null;
    }

    const allowedFolders = resolvedSpec.allowedFoldersByKind[noteKind] || [];
    if (!allowedFolders.length) {
      failSpec(`collectCommonFields requires allowedFoldersByKind.${noteKind}.`);
    }

    const defaultFolderByKind = resolvedSpec.defaultFolderByKind || {};
    const defaultFolder = defaultFolderByKind[noteKind] || allowedFolders[0] || "";
    const targetFolder = await h.requireChoice("Store in folder", allowedFolders, defaultFolder);
    if (!targetFolder) {
      return null;
    }

    const contextName = await h.promptValue("Context name (optional)");
    const canonicalInput = await h.promptValue(canonicalLabel);
    const canonicalName = canonicalInput || canonicalDefault({
      contextName,
      noteKind,
      now: tp.date.now("YYYY-MM-DD HH:mm"),
    });
    const noteSlug = h.slugify(canonicalName, slugPrefix);
    const homeNoteDefault = contextName ? h.slugify(contextName || canonicalName, slugPrefix) : "";
    const homeNote = await h.promptValue("Home or index note (wikilink target, optional)", homeNoteDefault);
    const source = await h.promptValue("Source link or note (optional)");
    const tagsInput = await h.promptValue("Tags, comma-separated (optional)");
    const related = await h.promptValue("Related note names, comma-separated (optional)");

    return {
      noteKind,
      targetFolder,
      contextName,
      canonicalName,
      noteSlug,
      homeNote,
      source,
      tags: h.normalizeTags(tagsInput),
      related,
      aliases: [canonicalName],
    };
  };

  const renderFrontmatter = ({ h, fields, format, spec }) => {
    const resolvedSpec = getValidatedSpec(spec, "renderFrontmatter");
    const frontmatterConfig = resolvedSpec.frontmatter || {};
    const includeProjectKinds = frontmatterConfig.includeProjectFromHomeNoteKinds || [];
    const includeSource = frontmatterConfig.includeSource !== false;
    const { noteKind, homeNote, source, aliases, tags } = fields;

    const projectYaml = includeProjectKinds.includes(noteKind) && homeNote
      ? `project: "${h.yamlEscape(`[[${homeNote}]]`)}"\n`
      : "";
    const sourceYaml = includeSource ? `source: "${h.yamlEscape(source)}"\n` : "";

    return `---
tags:${h.yamlTags(tags)}
kind: "${noteKind}"
format: "${format}"
${projectYaml}${sourceYaml}aliases:${h.yamlList(aliases)}
---`;
  };

  return {
    getValidatedSpec,
    collectCommonFields,
    renderFrontmatter,
  };
};
