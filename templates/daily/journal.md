<%*
const h = await tp.user.template_helpers(tp);
const daily = await tp.user.daily_note_helpers(tp);
const start = await h.beginTemplate("daily journal");
if (start.blocked) {
  tR += start.content;
  return;
}

const info = daily.resolveDaily();
await daily.moveToDailyYear(info.fileName, info.year);

const moodTag = await h.chooseValue("How is your mood today?", ["mood-light", "mood-steady", "mood-heavy"], "mood-steady");
const workTag = await h.chooseValue("How is your work today?", ["work-flowing", "work-steady", "work-stuck", "work-paused"], "work-steady");
const tags = h.uniqueItems([moodTag, workTag]);
const aliases = [`Daily ${info.fileName}`];

tR += `${daily.renderFrontmatter(h, "journal", { tags, aliases })}

# ${info.fileName}

- [[${info.month}]]
- [[${info.week}]]

## Today

<!-- Optional inside Today:
### Captured
### Highlights
-->

## Open Loops

## Touched

- none
`;
-%>
