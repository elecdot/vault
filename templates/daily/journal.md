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

tR += `${daily.renderFrontmatter(h, "journal")}

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
