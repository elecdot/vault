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
    const value = await tp.system.suggester(options, options, false, label);
    return value || fallback || options[0];
  };

  const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

  // Decision: this helper targets the vault's current template inputs, which are
  // intentionally kept to controlled single-line metadata. We quote common
  // Obsidian/YAML-sensitive cases to reduce normalize noise, but we do not try to
  // fully support every edge-case scalar form here. If future templates start
  // accepting arbitrary text, leading reserved indicators (for example "@" or
  // backticks) or multiline frontmatter values should be handled explicitly
  // instead of relying on this lightweight path.
  const yamlNeedsQuotes = (value) => {
    const text = String(value);
    if (text === "") {
      return true;
    }

    if (text.trim() !== text) {
      return true;
    }

    if (/[\[\]{}#,&*?|>%!]/.test(text)) {
      return true;
    }

    if (text.includes(":")) {
      return true;
    }

    if (/^[-?:](?:\s|$)/.test(text)) {
      return true;
    }

    if (/\[\[[^\]]+\]\]/.test(text)) {
      return true;
    }

    if (/\[[^\]]+\]\([^)]+\)/.test(text)) {
      return true;
    }

    if (/^[a-z]+:\/\//i.test(text) || /^file:\/\//i.test(text)) {
      return true;
    }

    if (/^(?:true|false|yes|no|on|off|null|~)$/i.test(text)) {
      return true;
    }

    if (/^[+-]?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text)) {
      return true;
    }

    if (/^\d{4}-\d{2}-\d{2}(?:[ tT]\d{2}:\d{2}(?::\d{2})?)?$/.test(text)) {
      return true;
    }

    return false;
  };

  const yamlScalar = (value) => {
    const text = String(value);
    return yamlNeedsQuotes(text) ? `"${yamlEscape(text)}"` : text;
  };

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

  const renderYamlList = (items, options = {}) => {
    const { always = false } = options;
    if (!items.length) {
      return always ? " []" : "";
    }

    return `\n${items.map((item) => `  - ${yamlScalar(item)}`).join("\n")}`;
  };

  const yamlList = (items, options = {}) => {
    return renderYamlList(items, options);
  };

  const yamlTags = (items, options = {}) => {
    return renderYamlList(items, { always: true, ...options });
  };

  const yamlField = (key, value, options = {}) => {
    const {
      always = false,
      list = false,
    } = options;

    if (list) {
      const items = Array.isArray(value) ? uniqueItems(value.map((item) => String(item)).filter(Boolean)) : [];
      const rendered = renderYamlList(items, { always });
      if (!rendered && !always) {
        return "";
      }

      return `${key}:${rendered || " []"}`;
    }

    if (value == null) {
      return always ? `${key}: ""` : "";
    }

    const text = String(value);
    if (!text && !always) {
      return "";
    }

    return `${key}: ${yamlScalar(text)}`;
  };

  const yamlFrontmatter = (fields) => {
    const lines = fields
      .map((field) => yamlField(field.key, field.value, field))
      .filter(Boolean);

    return `---\n${lines.join("\n")}\n---`;
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
    yamlField,
    yamlFrontmatter,
    yamlList,
    yamlNeedsQuotes,
    yamlScalar,
    yamlTags,
  };
};
