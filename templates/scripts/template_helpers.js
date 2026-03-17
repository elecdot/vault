module.exports = async function(tp) {
  const promptValue = async (label, fallback = "", multiline = false) => {
    const value = await tp.system.prompt(label, fallback, false, multiline);
    return value ? value.trim() : "";
  };

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

  const requireChoice = async (label, options, fallback) => {
    const value = await promptValue(`${label} (${options.join(" / ")})`, fallback);
    const normalized = value.toLowerCase();
    if (!options.includes(normalized)) {
      new Notice(`Invalid ${label.toLowerCase()}. Use one of: ${options.join(", ")}`);
      return "";
    }

    return normalized;
  };

  const chooseValue = async (label, options, fallback) => {
    const fallbackIndex = Math.max(options.indexOf(fallback), 0);
    const value = await tp.system.suggester(options, options, false, label, fallbackIndex);
    return value || fallback || options[0];
  };

  const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  const listItems = (value) => value
    ? value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : [];

  const uniqueItems = (items) => [...new Set(items.filter(Boolean))];

  const normalizeTags = (value) => uniqueItems(
    listItems(value).map((tag) => tag.toLowerCase().replace(/\s+/g, "-"))
  );

  const slugify = (value, fallbackPrefix) => {
    const slug = String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug || `${fallbackPrefix}-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
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

  const renderYamlList = (items, mapper = (item) => `"${yamlEscape(item)}"`) => {
    if (!items.length) {
      return " []";
    }

    return `\n${items.map((item) => `  - ${mapper(item)}`).join("\n")}`;
  };

  const yamlList = (items) => {
    return renderYamlList(items);
  };

  const yamlTags = (items) => {
    return renderYamlList(items);
  };

  const beginTemplate = async (templateName) => {
    const runMode = tp.config.run_mode;
    const targetFile = tp.config.target_file;
    const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
    if (runMode !== 0 && targetContent) {
      new Notice(`${templateName} template cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.`);
      return { blocked: true, content: targetContent };
    }

    return { blocked: false, content: "" };
  };

  const collectCommonFields = async ({
    spec,
    canonicalLabel,
    canonicalDefault,
    slugPrefix,
  }) => {
    const resolvedSpec = getValidatedSpec(spec, "collectCommonFields");
    const allowedKinds = resolvedSpec.allowedKinds;
    const defaultKind = resolvedSpec.defaultKind || allowedKinds[0];

    const noteKind = await requireChoice("Note kind", allowedKinds, defaultKind);
    if (!noteKind) {
      return null;
    }

    const allowedFolders = resolvedSpec.allowedFoldersByKind[noteKind] || [];
    if (!allowedFolders.length) {
      failSpec(`collectCommonFields requires allowedFoldersByKind.${noteKind}.`);
    }

    const defaultFolderByKind = resolvedSpec.defaultFolderByKind || {};
    const defaultFolder = defaultFolderByKind[noteKind] || allowedFolders[0] || "";
    const targetFolder = await requireChoice("Store in folder", allowedFolders, defaultFolder);
    if (!targetFolder) {
      return null;
    }

    const contextName = await promptValue("Context name (optional)");
    const canonicalInput = await promptValue(canonicalLabel);
    const canonicalName = canonicalInput || canonicalDefault({ contextName, noteKind, now: tp.date.now("YYYY-MM-DD HH:mm") });
    const noteSlug = slugify(canonicalName, slugPrefix);
    const homeNoteDefault = contextName ? slugify(contextName || canonicalName, slugPrefix) : "";
    const homeNote = await promptValue("Home or index note (wikilink target, optional)", homeNoteDefault);
    const source = await promptValue("Source link or note (optional)");
    const tagsInput = await promptValue("Tags, comma-separated (optional)");
    const related = await promptValue("Related note names, comma-separated (optional)");

    const tags = normalizeTags(tagsInput);

    return {
      noteKind,
      targetFolder,
      contextName,
      canonicalName,
      noteSlug,
      homeNote,
      source,
      tags,
      related,
      aliases: [canonicalName],
    };
  };

  const moveNote = async ({ noteSlug, targetFolder }) => {
    await tp.file.rename(noteSlug);
    if (targetFolder) {
      await tp.file.move(`${targetFolder}/${noteSlug}`);
    }
  };

  const renderFrontmatter = ({ fields, format, spec }) => {
    const resolvedSpec = getValidatedSpec(spec, "renderFrontmatter");
    const frontmatterConfig = resolvedSpec.frontmatter || {};
    const includeProjectKinds = frontmatterConfig.includeProjectFromHomeNoteKinds || [];
    const includeSource = frontmatterConfig.includeSource !== false;
    const { noteKind, homeNote, source, aliases, tags } = fields;

    const projectYaml = includeProjectKinds.includes(noteKind) && homeNote
      ? `project: "${yamlEscape(`[[${homeNote}]]`)}"\n`
      : "";
    const sourceYaml = includeSource ? `source: "${yamlEscape(source)}"\n` : "";

    return `---
tags:${yamlTags(tags)}
kind: "${noteKind}"
format: "${format}"
${projectYaml}${sourceYaml}aliases:${yamlList(aliases)}
---`;
  };

  return {
    beginTemplate,
    bulletLinks,
    chooseValue,
    collectCommonFields,
    getValidatedSpec,
    listItems,
    moveNote,
    promptValue,
    normalizeTags,
    renderFrontmatter,
    renderYamlList,
    requireChoice,
    slugify,
    uniqueItems,
    yamlEscape,
    yamlList,
    yamlTags,
  };
};
