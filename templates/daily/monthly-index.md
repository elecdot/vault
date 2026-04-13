<%*
const h = await tp.user.template_helpers(tp);
const daily = await tp.user.daily_note_helpers(tp);
const start = await h.beginTemplate("monthly index");
if (start.blocked) {
  tR += start.content;
  return;
}

const info = daily.resolveMonthly();
await daily.moveToDailyYear(info.fileName, info.year);

const weekLinks = info.weekTitles.map((item) => `- [[${item}]]`).join("\n");
const aliases = [`Monthly Index ${info.fileName}`];

tR += `${daily.renderFrontmatter(h, "index", { aliases })}

# ${info.fileName}

- Month: ${info.fileName}
- Range: ${daily.formatDate(info.monthStart)} to ${daily.formatDate(info.monthEnd)}

## Weekly Reviews

${weekLinks}

## Highlights

## Distilled Notes

## Look Back

`;
-%>
