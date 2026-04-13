<%*
const h = await tp.user.template_helpers(tp);
const daily = await tp.user.daily_note_helpers(tp);
const start = await h.beginTemplate("weekly review");
if (start.blocked) {
  tR += start.content;
  return;
}

const info = daily.resolveWeekly();
await daily.moveToDailyYear(info.fileName, info.year);

const monthLinks = info.monthLinks.map((item) => `- [[${item}]]`).join("\n");
const dailyLinks = info.dailyLinks.map((item) => `- [[${item}]]`).join("\n");
const aliases = [`Weekly Review ${info.fileName}`];

tR += `${daily.renderFrontmatter(h, "review", { aliases })}

# ${info.fileName}

- Week: ${info.fileName}
- Range: ${daily.formatDate(info.weekStart)} to ${daily.formatDate(info.weekEnd)}
- Months:
${monthLinks}

## This Week

## Takeaways

## Carry Forward

## Daily Pages

${dailyLinks}
`;
-%>
