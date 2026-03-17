<%*
const h = await tp.user.template_helpers(tp);
const spec = tp.user.note_family_spec();
const start = await h.beginTemplate("note");
if (start.blocked) {
  tR += start.content;
  return;
}

const common = await h.collectCommonFields({
  spec,
  canonicalLabel: "Canonical note name",
  canonicalDefault: ({ contextName, noteKind, now }) => `${contextName || noteKind} note ${now}`,
  slugPrefix: "note",
});
if (!common) {
  return;
}

const focus = await h.promptValue("Main focus of this note");
const homeLink = common.homeNote ? `[[${common.homeNote}]]` : "";

await h.moveNote(common);

tR += `${h.renderFrontmatter({ fields: common, format: "note", spec })}

# ${common.canonicalName}

## Focus
${focus || "Not specified."}

## Notes

## Related
${homeLink ? `- ${homeLink}` : "- none"}${common.related ? "\n" + h.bulletLinks(common.related) : ""}

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
`;
-%>
