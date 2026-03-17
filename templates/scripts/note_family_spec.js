const NOTE_FAMILY_SPEC = Object.freeze({
  familyName: "note_family",
  allowedKinds: Object.freeze(["resource", "project"]),
  defaultKind: "resource",
  allowedFoldersByKind: Object.freeze({
    resource: Object.freeze(["resources", "inbox", "archive"]),
    project: Object.freeze(["projects", "inbox", "archive"]),
  }),
  defaultFolderByKind: Object.freeze({
    resource: "resources",
    project: "projects",
  }),
  frontmatter: Object.freeze({
    includeProjectFromHomeNoteKinds: Object.freeze(["project"]),
    includeSource: true,
  }),
});

module.exports = function() {
  return NOTE_FAMILY_SPEC;
};
