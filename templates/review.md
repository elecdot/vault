<%*
const h = await tp.user.template_helpers(tp);
const spec = tp.user.note_family_spec();
const runtime = await tp.user.note_family_runtime(tp);
const start = await h.beginTemplate("review");
if (start.blocked) {
  tR += start.content;
  return;
}

const common = await runtime.collectCommonFields({
  h,
  spec,
  canonicalLabel: "Canonical review name",
  canonicalDefault: ({ contextName, noteKind }) => `${contextName || noteKind} review`,
  slugPrefix: "review",
});
if (!common) {
  return;
}

const task = await h.promptValue("Prompt or task summary");
const homeLink = common.homeNote ? `[[${common.homeNote}]]` : "";

await h.moveNote(common);

tR += `${runtime.renderFrontmatter({ h, fields: common, format: "review", spec })}

# ${common.canonicalName}

## Task

${task || "Not specified."}

## Approach

## Takeaways
- 

## Related
${homeLink ? `- ${homeLink}` : "- none"}${common.related ? "\n" + h.bulletLinks(common.related) : ""}

## Next
- [ ] Distill one key lesson into a summary, concept, or project note
- [ ] Link this review to a related note or follow-up action
`;
-%>
