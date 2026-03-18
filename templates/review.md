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

const reviewTarget = await h.promptValue("What are you reviewing?");
const homeLink = common.homeNote ? `[[${common.homeNote}]]` : "";

await h.moveNote(common);

tR += `${runtime.renderFrontmatter({ h, fields: common, format: "review", spec })}

# ${common.canonicalName}

## What I Reviewed

${reviewTarget || "Not specified."}

## What Stood Out

- 

## Assessment

## Changes
- 

## Related
${homeLink ? `- ${homeLink}` : "- none"}${common.related ? "\n" + h.bulletLinks(common.related) : ""}

## Next
- [ ] Distill one durable lesson into a concept, process, or project note
- [ ] Link this review to the note, area, or project it should inform
`;
-%>
