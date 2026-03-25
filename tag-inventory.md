This is a vault-wide tag inventory created from `tamplates/index/tag-inventory`.

---

# Tag Inventory

This note is an embeddable tag inventory for the folder it lives in.

## Current Scope

- **Scope root:** `= this.file.folder`
- **Coverage:** current folder and all subfolders
- **Included tags:** frontmatter `tags` only
- **Excluded from stats:** this note, `templates/`, `bases/`, and any `AGENTS.md`
- **Intended use:** inspect dictionary-neighbor tags and low-frequency tags manually; no automatic synonym merging

>[!warning] This inventory use `dataviewjs`, which requires you have [[dataview|Dataview]] Obsidian plugin installed and enable the "JavaScipt queries" option in the settings.
## All Tags

```dataviewjs
const current = dv.current();
const currentFile = current?.file;

if (!currentFile) {
  dv.paragraph("Dataview context is not ready. Please refresh and try again.");
} else {
  const scopeFolder = currentFile.folder ?? "";

  function normalizeFrontmatterTags(value) {
    if (!value) return [];
    const raw = Array.isArray(value) ? value : [value];
    return [...new Set(raw
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/^#/, "").toLowerCase()))];
  }

  function isInScope(pageFolder, rootFolder) {
    if (rootFolder === "") return true;
    return pageFolder === rootFolder || pageFolder.startsWith(rootFolder + "/");
  }

  function getParentFolderName(pageFolder, rootFolder) {
    if (pageFolder === rootFolder || pageFolder === "") return "root";
    const segments = pageFolder.split("/").filter(Boolean);
    return segments[segments.length - 1] || "root";
  }

  function getFrontmatterTags(page) {
    const frontmatterTags = page?.file?.frontmatter?.tags;
    if (frontmatterTags) return normalizeFrontmatterTags(frontmatterTags);
    if (page?.tags) return normalizeFrontmatterTags(page.tags);
    return [];
  }

  function renderGroupedNotes(notes) {
    const grouped = new Map();

    for (const note of notes) {
      if (!grouped.has(note.parentFolderName)) {
        grouped.set(note.parentFolderName, []);
      }
      grouped.get(note.parentFolderName).push(note);
    }

    const groupNames = Array.from(grouped.keys()).sort((a, b) => {
      if (a === "root") return -1;
      if (b === "root") return 1;
      return a.localeCompare(b);
    });

    // Risk: this mixed array relies on current Dataview table rendering behavior
    // to display markdown labels and link objects as a grouped multi-line cell.
    return groupNames.flatMap((groupName) => {
      const links = grouped.get(groupName)
        .sort((a, b) => a.path.localeCompare(b.path))
        .map((note) => note.link);
      return [`*${groupName}:*`, ...links];
    });
  }

  const pages = dv.pages()
    .where((page) =>
      page.file.path !== currentFile.path &&
      page.file.name !== "AGENTS" &&
      isInScope(page.file.folder ?? "", scopeFolder) &&
      !page.file.path.startsWith("templates/") &&
      !page.file.path.startsWith("bases/")
    );

  const tagMap = new Map();

  for (const page of pages) {
    const tags = getFrontmatterTags(page);
    for (const tag of tags) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag).push({
        link: page.file.link,
        path: page.file.path,
        parentFolderName: getParentFolderName(page.file.folder ?? "", scopeFolder)
      });
    }
  }

  const rows = Array.from(tagMap.entries())
    .map(([tag, notes]) => ({
      tag,
      count: notes.length,
      notes: renderGroupedNotes(notes)
    }))
    .sort((a, b) => a.tag.localeCompare(b.tag));

  dv.table(
    ["Tag", "Count", "Notes"],
    rows.map((row) => [row.tag, row.count, row.notes])
  );
}
```

## Low Frequency Tags

```dataviewjs
const current = dv.current();
const currentFile = current?.file;

if (!currentFile) {
  dv.paragraph("Dataview context is not ready. Please refresh and try again.");
} else {
  const scopeFolder = currentFile.folder ?? "";
  const lowFrequencyThreshold = 2;

  function normalizeFrontmatterTags(value) {
    if (!value) return [];
    const raw = Array.isArray(value) ? value : [value];
    return [...new Set(raw
      .flatMap((item) => String(item).split(","))
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => item.replace(/^#/, "").toLowerCase()))];
  }

  function isInScope(pageFolder, rootFolder) {
    if (rootFolder === "") return true;
    return pageFolder === rootFolder || pageFolder.startsWith(rootFolder + "/");
  }

  function getParentFolderName(pageFolder, rootFolder) {
    if (pageFolder === rootFolder || pageFolder === "") return "root";
    const segments = pageFolder.split("/").filter(Boolean);
    return segments[segments.length - 1] || "root";
  }

  function getFrontmatterTags(page) {
    const frontmatterTags = page?.file?.frontmatter?.tags;
    if (frontmatterTags) return normalizeFrontmatterTags(frontmatterTags);
    if (page?.tags) return normalizeFrontmatterTags(page.tags);
    return [];
  }

  function renderGroupedNotes(notes) {
    const grouped = new Map();

    for (const note of notes) {
      if (!grouped.has(note.parentFolderName)) {
        grouped.set(note.parentFolderName, []);
      }
      grouped.get(note.parentFolderName).push(note);
    }

    const groupNames = Array.from(grouped.keys()).sort((a, b) => {
      if (a === "root") return -1;
      if (b === "root") return 1;
      return a.localeCompare(b);
    });

    // Risk: this mixed array relies on current Dataview table rendering behavior
    // to display markdown labels and link objects as a grouped multi-line cell.
    return groupNames.flatMap((groupName) => {
      const links = grouped.get(groupName)
        .sort((a, b) => a.path.localeCompare(b.path))
        .map((note) => note.link);
      return [`*${groupName}:*`, ...links];
    });
  }

  const pages = dv.pages()
    .where((page) =>
      page.file.path !== currentFile.path &&
      page.file.name !== "AGENTS" &&
      isInScope(page.file.folder ?? "", scopeFolder) &&
      !page.file.path.startsWith("templates/") &&
      !page.file.path.startsWith("bases/")
    );

  const tagMap = new Map();

  for (const page of pages) {
    const tags = getFrontmatterTags(page);
    for (const tag of tags) {
      if (!tagMap.has(tag)) {
        tagMap.set(tag, []);
      }
      tagMap.get(tag).push({
        link: page.file.link,
        path: page.file.path,
        parentFolderName: getParentFolderName(page.file.folder ?? "", scopeFolder)
      });
    }
  }

  const rows = Array.from(tagMap.entries())
    .map(([tag, notes]) => ({
      tag,
      count: notes.length,
      notes: renderGroupedNotes(notes)
    }))
    .filter((row) => row.count <= lowFrequencyThreshold)
    .sort((a, b) => a.count - b.count || a.tag.localeCompare(b.tag));

  dv.table(
    ["Tag", "Count", "Notes"],
    rows.map((row) => [row.tag, row.count, row.notes])
  );
}
```
