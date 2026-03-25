<%*
const h = await tp.user.template_helpers(tp);

const canonicalNameInput = await h.promptValue("Canonical name / concept");
const canonicalName = canonicalNameInput || tp.file.title || `concept-card-${tp.date.now("YYYY-MM-DD-HH-mm")}`;
const coreIdea = await h.promptValue("Core idea / tip", "", true);
const source = await h.promptValue("Source note, book, class, or URL (optional)");
const extraTagsInput = await h.promptValue("Tags, comma-separated (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");
const related = await h.promptValue("Related note names, comma-separated (optional)");

const extraTags = h.normalizeTags(extraTagsInput);
const allTags = h.uniqueItems(["concept", ...extraTags]);
const relatedBlock = h.bulletLinks(related);
const aliases = h.uniqueItems([canonicalName, ...h.listItems(aliasesInput)]);

tR += `${h.yamlFrontmatter([
  { key: "tags", value: allTags, list: true, always: true },
  { key: "kind", value: "concept" },
  { key: "format", value: "card" },
  { key: "status", value: "fleeting" },
  { key: "source", value: source },
  { key: "aliases", value: aliases, list: true },
])}

# ${canonicalName}

> A small reusable idea, tip, or side concept worth revisiting.

## Core Idea
${coreIdea || "- "}

## Related
${relatedBlock}

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
`;
-%>
