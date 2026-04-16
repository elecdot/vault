## Open Loops

```dataview
TASK
FROM ""
WHERE
  !completed AND
  startswith(file.folder, this.file.folder) AND
  !contains(file.folder, "templates")
GROUP BY file.link
```