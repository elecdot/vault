---
name: obsidian-bases
description: Create and edit Obsidian Bases (.base files) with views, filters, formulas, and summaries. Use when working with .base files, creating database-like views of notes, or when the user mentions Bases, table views, card views, filters, or formulas in Obsidian.
---

# Obsidian Bases Skill

Use this skill for `.base` files, archive dashboards, filters, formulas, grouping, sorting, and other Bases work in this vault.

This skill keeps workflow, vault-specific rules, and high-frequency pitfalls in the main body. Schema details, syntax tables, and longer examples live in `references/`.

## Workflow

1. **Create the file**: create a `.base` file in the vault with valid YAML content.
2. **Define scope**: add `filters` to select which notes appear (by tag, folder, property, or date).
3. **Add formulas**: define computed properties in the `formulas` section only when the computation is reusable or materially improves the view.
4. **Configure views**: add one or more views (`table`, `cards`, `list`, or `map`) with `order` specifying which properties to display.
5. **Validate**: verify the file is valid YAML with no syntax errors. Check that all referenced properties and formulas exist.
6. **Test in Obsidian**: open the `.base` file in Obsidian to confirm the view renders correctly.

## Vault Policy

- Follow the vault-wide Bases organization and view strategy defined in `AGENTS.md`.
- When filtering or grouping vault notes, prefer the vault's structured properties such as `kind`, `format`, `status`, `area`, `project`, and `source` when they match the view.
- Use this skill to implement `.base` files, formulas, views, and validation for those policies; do not redefine them here.

## Validation and Troubleshooting

### YAML Quoting Rules

- Use single quotes for formulas containing double quotes: `'if(done, "Yes", "No")'`
- Use double quotes for simple strings: `"My View Name"`
- Escape nested quotes properly in complex expressions

### YAML Syntax Errors

**Unquoted special characters**: strings containing `:`, `{`, `}`, `[`, `]`, `,`, `&`, `*`, `#`, `?`, `|`, `-`, `<`, `>`, `=`, `!`, `%`, `@`, `` ` `` must be quoted.

```yaml
# WRONG - colon in unquoted string
displayName: Status: Active

# CORRECT
displayName: "Status: Active"
```

**Mismatched quotes in formulas**: when a formula contains double quotes, wrap the entire formula in single quotes.

```yaml
# WRONG - double quotes inside double quotes
formulas:
  label: "if(done, "Yes", "No")"

# CORRECT - single quotes wrapping double quotes
formulas:
  label: 'if(done, "Yes", "No")'
```

### Common Formula Errors

**Duration math without field access**: subtracting dates returns a Duration, not a number. Always access `.days`, `.hours`, etc.

```yaml
# WRONG - Duration is not a number
"(now() - file.ctime).round(0)"

# CORRECT - access .days first, then round
"(now() - file.ctime).days.round(0)"
```

**Missing null checks**: properties may not exist on all notes. Use `if()` to guard.

```yaml
# WRONG - crashes if due_date is empty
"(date(due_date) - today()).days"

# CORRECT - guard with if()
'if(due_date, (date(due_date) - today()).days, "")'
```

**Referencing undefined formulas**: ensure every `formula.X` in `order` or `properties` has a matching entry in `formulas`.

```yaml
# This will fail silently if 'total' is not defined in formulas
order:
  - formula.total

# Fix: define it
formulas:
  total: "price * quantity"
```

## References

- [SCHEMA.md](references/SCHEMA.md)
- [EXAMPLES.md](references/EXAMPLES.md)
- [COMMON_FORMULAS.md](references/COMMON_FORMULAS.md)
- [FUNCTIONS_REFERENCE.md](references/FUNCTIONS_REFERENCE.md)
- [Bases Syntax](https://help.obsidian.md/bases/syntax)
- [Functions](https://help.obsidian.md/bases/functions)
- [Views](https://help.obsidian.md/bases/views)
- [Formulas](https://help.obsidian.md/formulas)
