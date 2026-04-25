---
tags:
  - concept
  - git
  - git-remote
kind: concept
format: card
status: fleeting
aliases:
  - Git Remote Branch Managing
---

# Git Remote Branch Managing

> A small reusable idea, tip, or side concept worth revisiting.

## Core Idea
• Yes. Right now main is tracking template/main.

  I confirmed it locally:

  - @{u} resolves to template/main
  - branch.main.remote is template
  - branch.main.merge is refs/heads/main

  So plain git pull on main will pull from template/main, not origin/main.

  A few corrections to your plan:

  - git pull -u main origin is not the right command.
  - -u is for setting upstream on git push, not for git pull.
  - To change what main tracks, use:
      - git branch --set-upstream-to=origin/main main
      - or shorter: git branch -u origin/main main

  If you want to preserve template/main, that is fine. Tracking origin/main on main does not remove the template remote. You can still keep the template remote
  around and fetch it whenever you want to inspect updates:

  git fetch template
  git log --oneline main..template/main

  So the clean mental model is:

  - main tracks one upstream branch at a time
  - the template remote can still exist independently
  - switching main to track origin/main does not lose access to template updates

  If your goal is to keep your repo init commit on main but also keep watching template changes, the usual setup is:

  1. Add origin
  2. Set main to track origin/main
  3. Keep template as a separate remote for reference

  If you want, I can give you the exact command sequence for that setup.

## Related
- none

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
