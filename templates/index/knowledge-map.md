<%*
const h = await tp.user.template_helpers(tp);
const start = await h.beginTemplate("knowledge-map");
if (start.blocked) {
  tR += start.content;
  return;
}

const canonicalNameInput = await h.promptValue("Canonical name / domain");
const canonicalName = canonicalNameInput || tp.file.title || `knowledge map ${tp.date.now("YYYY-MM-DD HH:mm")}`;
const scope = await h.promptValue("Scope", "", true);
const why = await h.promptValue("Why does this domain matter?", "", true);
const startingPoints = await h.promptValue("Starting points, comma-separated (optional)");
const distinctions = await h.promptValue("Key distinctions, one per line (optional)", "", true);
const tagsInput = await h.promptValue("Tags, comma-separated (optional)");
const aliasesInput = await h.promptValue("Aliases, comma-separated (optional)");

const tags = h.normalizeTags(tagsInput);
const aliases = h.uniqueItems([canonicalName, ...h.listItems(aliasesInput)]);

const noteSlug = h.slugify(canonicalName, "knowledge-map");
await tp.file.rename(noteSlug);
await tp.file.move(`knowledge/indexes/${noteSlug}`);

tR += `${h.yamlFrontmatter([
  { key: "tags", value: tags, list: true, always: true },
  { key: "kind", value: "index" },
  { key: "format", value: "map" },
  { key: "aliases", value: aliases, list: true },
])}

# ${canonicalName}

## Scope
${scope || "- "}

## Why
${why || "- "}

## Key Distinctions
${distinctions ? distinctions.split(/\r?\n/).map((line) => `- ${line}`).join("\n") : "- "}

## Starting Points
${h.bulletLinks(startingPoints)}

## Concepts
![[bases/knowledge-domain.base#Domain Concepts]]

## Recently Updated
![[bases/knowledge-domain.base#Recently Updated]]

## Gaps
\`\`\`dataview
TASK
FROM "knowledge"
WHERE !completed AND (file.link = this.file.link OR contains(indexes, this.file.link))
GROUP BY file.link
\`\`\`
`;
-%>
