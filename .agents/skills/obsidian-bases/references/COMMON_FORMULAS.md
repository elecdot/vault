# Common Bases Formulas

This file is a short, copy-paste friendly collection of commonly used Obsidian Bases formulas.

## Missing (Unresolved) Links

**Goal:** find links in `file.links` that do not resolve to an existing file.

### List missing links (as Link list)

```yaml
formulas:
  missing_links: 'file.links.filter(!value.asFile().isTruthy())'
```

### Count missing links

```yaml
formulas:
  missing_links_count: 'file.links.filter(!value.asFile().isTruthy()).length'
```

### Boolean flag

```yaml
formulas:
  has_missing_links: 'file.links.filter(!value.asFile().isTruthy()).length > 0'
```

**Notes**

- `list.filter(expression)` evaluates the expression using `value` (and `index`) for each list element.
- `link.asFile()` returns a file object when resolvable; if not, the result is falsy and `isTruthy()` becomes `false`.

## Link / Backlink Counts

```yaml
formulas:
  out_links_count: "file.links.length"
  back_links_count: "file.backlinks.length"
  total_links: "file.links.length + file.backlinks.length"
```

## Orphans (No Links)

```yaml
formulas:
  is_orphan: "file.links.length == 0 && file.backlinks.length == 0"
```

