<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("chatgpt-inspiration");
if (start.blocked) {
  tR += start.content;
  return;
}

const quoteCallout = (text) => {
  if (!text) {
    return "> [!quote] ChatGPT reply\n> Not captured.";
  }

  const lines = text.split(/\r?\n/);
  return ["> [!quote] ChatGPT reply", ...lines.map((line) => `> ${line}`)].join("\n");
};

const bulletLine = (value, formatter = (item) => item) => `- ${value ? formatter(value) : "none"}`;
const canonicalNameInput = await h.promptValue("Canonical name / cue phrase");
const canonicalName = canonicalNameInput || `chatgpt inspiration ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const whyItMatters = await h.promptValue("Why does this matter?");
const questionPrompt = await h.promptValue("What question produced this answer?");
const excerpt = await h.promptValue("Paste the useful ChatGPT excerpt", "", true);
const conversationLink = await h.promptValue("Conversation link (optional)");
const extraTagsInput = await h.promptValue("Extra tags, comma-separated (optional)");
const related = await h.promptValue("Related note names, comma-separated (optional)");

const extraTags = h.normalizeTags(extraTagsInput);
const allTags = h.uniqueItems(["inspiration", "chatgpt", ...extraTags]);
const aliases = [canonicalName];
const filename = `${tp.date.now("YYYY-MM-DD-HHmm")}-${h.slugify(canonicalName, "chatgpt-inspiration")}`;
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
tags:${h.yamlTags(allTags)}
kind: "resource"
format: "capture"
status: "fleeting"
source: "ChatGPT"
aliases:
${aliases.map((alias) => `  - "${h.yamlEscape(alias)}"`).join("\n")}
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
