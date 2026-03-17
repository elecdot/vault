module.exports = async function(tp) {
  const promptValue = async (label, fallback = "", multiline = false) => {
    const value = await tp.system.prompt(label, fallback, false, multiline);
    return value ? value.trim() : "";
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

  const moveNote = async ({ noteSlug, targetFolder }) => {
    await tp.file.rename(noteSlug);
    if (targetFolder) {
      await tp.file.move(`${targetFolder}/${noteSlug}`);
    }
  };

  return {
    beginTemplate,
    bulletLinks,
    chooseValue,
    listItems,
    moveNote,
    promptValue,
    normalizeTags,
    renderYamlList,
    requireChoice,
    slugify,
    uniqueItems,
    yamlEscape,
    yamlList,
    yamlTags,
  };
};
