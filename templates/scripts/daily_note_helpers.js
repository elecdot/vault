module.exports = async function(tp) {
  const pad = (value) => String(value).padStart(2, "0");

  const cloneDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const parseDateTitle = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(year, month - 1, day);
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  const parseMonthTitle = (value) => {
    const match = /^(\d{4})-(\d{2})$/.exec(value || "");
    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    if (month < 1 || month > 12) {
      return null;
    }

    return new Date(year, month - 1, 1);
  };

  const parseWeekTitle = (value) => {
    const match = /^(\d{4})-W(\d{2})$/.exec(value || "");
    if (!match) {
      return null;
    }

    const isoYear = Number(match[1]);
    const isoWeek = Number(match[2]);
    if (isoWeek < 1 || isoWeek > 53) {
      return null;
    }

    return { isoYear, isoWeek };
  };

  const formatDate = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  };

  const formatMonth = (date) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  };

  const startOfIsoWeek = (date) => {
    const result = cloneDate(date);
    const weekday = (result.getDay() + 6) % 7;
    result.setDate(result.getDate() - weekday);
    return result;
  };

  const addDays = (date, days) => {
    const result = cloneDate(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const getIsoWeekInfo = (date) => {
    const target = cloneDate(date);
    const weekday = (target.getDay() + 6) % 7;
    target.setDate(target.getDate() + 3 - weekday);

    const isoYear = target.getFullYear();
    const firstThursday = new Date(isoYear, 0, 4);
    const firstWeekday = (firstThursday.getDay() + 6) % 7;
    firstThursday.setDate(firstThursday.getDate() + 3 - firstWeekday);

    const diffWeeks = Math.round((target - firstThursday) / (7 * 24 * 60 * 60 * 1000));
    return { isoYear, isoWeek: diffWeeks + 1 };
  };

  const formatWeek = (date) => {
    const { isoYear, isoWeek } = getIsoWeekInfo(date);
    return `${isoYear}-W${pad(isoWeek)}`;
  };

  const weekStartFromTitle = (isoYear, isoWeek) => {
    const jan4 = new Date(isoYear, 0, 4);
    const weekOneStart = startOfIsoWeek(jan4);
    return addDays(weekOneStart, (isoWeek - 1) * 7);
  };

  const renderFrontmatter = (format) => {
    return `---
tags: []
kind: "daily"
format: "${format}"
aliases: []
---`;
  };

  const ensureFolder = async (path) => {
    const parts = String(path).split("/").filter(Boolean);
    let current = "";

    for (const part of parts) {
      current = current ? `${current}/${part}` : part;
      if (!app.vault.getAbstractFileByPath(current)) {
        await app.vault.createFolder(current);
      }
    }
  };

  const moveToDailyYear = async (fileName, year) => {
    await ensureFolder(`daily/${year}`);
    await tp.file.rename(fileName);
    await tp.file.move(`daily/${year}/${fileName}`);
  };

  const unique = (items) => [...new Set(items)];

  const resolveDaily = () => {
    const fromTitle = parseDateTitle(tp.file.title);
    const date = fromTitle || cloneDate(new Date());

    return {
      date,
      fileName: formatDate(date),
      year: String(date.getFullYear()),
      week: formatWeek(date),
      month: formatMonth(date),
    };
  };

  const resolveWeekly = () => {
    const weekTitle = parseWeekTitle(tp.file.title);
    const weekStart = weekTitle
      ? weekStartFromTitle(weekTitle.isoYear, weekTitle.isoWeek)
      : startOfIsoWeek(new Date());
    const weekEnd = addDays(weekStart, 6);
    const fileName = formatWeek(weekStart);
    const year = String(getIsoWeekInfo(weekStart).isoYear);
    const monthLinks = unique([formatMonth(weekStart), formatMonth(weekEnd)]);
    const dailyLinks = Array.from({ length: 7 }, (_, index) => formatDate(addDays(weekStart, index)));

    return {
      weekStart,
      weekEnd,
      fileName,
      year,
      monthLinks,
      dailyLinks,
    };
  };

  const resolveMonthly = () => {
    const fromTitle = parseMonthTitle(tp.file.title);
    const monthStart = fromTitle || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const fileName = formatMonth(monthStart);
    const year = String(monthStart.getFullYear());
    const weekTitles = [];
    let cursor = startOfIsoWeek(monthStart);

    while (cursor <= monthEnd) {
      weekTitles.push(formatWeek(cursor));
      cursor = addDays(cursor, 7);
    }

    return {
      monthStart,
      monthEnd,
      fileName,
      year,
      weekTitles: unique(weekTitles),
    };
  };

  return {
    formatDate,
    formatMonth,
    formatWeek,
    moveToDailyYear,
    renderFrontmatter,
    resolveDaily,
    resolveMonthly,
    resolveWeekly,
  };
};
