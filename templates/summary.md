<%*
const h = await tp.user.template_helpers(tp);
const spec = tp.user.note_family_spec();
const runtime = await tp.user.note_family_runtime(tp);
const start = await h.beginTemplate("summary");
if (start.blocked) {
  tR += start.content;
  return;
}

const common = await runtime.collectCommonFields({
  h,
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

tR += `${runtime.renderFrontmatter({ h, fields: common, format: "summary", spec })}

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
