<%*
const runMode = tp.config.run_mode;
const targetFile = tp.config.target_file;
const targetContent = targetFile ? (await app.vault.cachedRead(targetFile)).trim() : "";
if (runMode !== 0 && targetContent) {
  new Notice("chatgpt-inspiration cannot run into a non-empty note. Use 'Create new note from template' or start from an empty note.");
  tR += targetContent;
  return;
}

const promptValue = async (label, fallback = "", multiline = false) => {
  const value = await tp.system.prompt(label, fallback, false, multiline);
  return value ? value.trim() : "";
};

const yamlEscape = (value) => String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

const slugify = (value) => {
  const slug = String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || `chatgpt-inspiration-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
};

const quoteCallout = (text) => {
  if (!text) {
    return "> [!quote] ChatGPT reply\n> Not captured.";
  }

  const lines = text.split(/\r?\n/);
  return ["> [!quote] ChatGPT reply", ...lines.map((line) => `> ${line}`)].join("\n");
};

const bulletLine = (value, formatter = (item) => item) => `- ${value ? formatter(value) : "none"}`;
const canonicalNameInput = await promptValue("Canonical name / cue phrase");
const canonicalName = canonicalNameInput || `chatgpt inspiration ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const whyItMatters = await promptValue("Why does this matter?");
const questionPrompt = await promptValue("What question produced this answer?");
const excerpt = await promptValue("Paste the useful ChatGPT excerpt", "", true);
const conversationLink = await promptValue("Conversation link (optional)");
const extraTagsInput = await promptValue("Extra tags, comma-separated (optional)");
const related = await promptValue("Related note names, comma-separated (optional)");

const extraTags = extraTagsInput
  ? extraTagsInput
      .split(",")
      .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean)
  : [];

const allTags = [...new Set(["inspiration", "chatgpt", ...extraTags])];
const tagYaml = allTags.map((tag) => `  - ${tag}`).join("\n");
const aliases = [canonicalName];
const filename = `${tp.date.now("YYYY-MM-DD-HHmm")}-${slugify(canonicalName)}`;
const relatedBlock = related
  ? related
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => bulletLine(item, (note) => `[[${note}]]`))
      .join("\n")
  : "- none";

await tp.file.move(`inbox/${filename}`);

tR += `---
tags:
${tagYaml}
kind: "resource"
format: "capture"
status: "fleeting"
source: "ChatGPT"
aliases:
${aliases.map((alias) => `  - "${yamlEscape(alias)}"`).join("\n")}
---

# ${canonicalName}

## Why
${whyItMatters || "Not specified."}

## Excerpt
${quoteCallout(excerpt || "Not captured.")}

## Context
- Date captured: ${tp.date.now("YYYY-MM-DD HH:mm")}
- Prompt: ${questionPrompt || "Not captured."}
- Conversation link: ${conversationLink || "none"}

## Related
${relatedBlock}

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
`;
-%>
