<%*
const h = await tp.user.template_helpers(tp);
const spec = tp.user.note_family_spec();
const start = await h.beginTemplate("summary");
if (start.blocked) {
  tR += start.content;
  return;
}

const common = await h.collectCommonFields({
  spec,
  canonicalLabel: "Canonical summary name",
  canonicalDefault: ({ contextName, noteKind }) => `${contextName || noteKind} summary`,
  slugPrefix: "summary",
});
if (!common) {
  return;
}

const scope = await h.promptValue("What does this summary cover?");
const homeLink = common.homeNote ? `[[${common.homeNote}]]` : "";

await h.moveNote(common);

tR += `${h.renderFrontmatter({ fields: common, format: "summary", spec })}

# ${common.canonicalName}

## Scope
${scope || "Not specified."}

## Takeaways
- 

## Related
${homeLink ? `- ${homeLink}` : "- none"}${common.related ? "\n" + h.bulletLinks(common.related) : ""}

## Next
- [ ] Distill one key takeaway into a concept, reference, or project note
- [ ] Link this summary to a related note or next step
`;
-%>
