---
tags:
  - tooling
  - shell
  - qol
kind: resource
format: note
source: "[GitHub repo](https://github.com/ajeetdsouza/zoxide)"
aliases:
  - zoxide
---

# zoxide

## Focus
Introduce `zoxide`, a better `cd`.

## Quick References

see [[tldr]]. (specifically `tldr zoxide` and basically a `z` is a command interface for `__zoxide_z`, note you can disable `z` and `zi` command with `zoxide --no-cmd`)

>[!warning] Basically use `z path` for now, considering update the advance feature for future using is needed. (e.g., `zi`: cd with interactive selection using [[fzf]], a popular shell fuzzy finder)
```shell
z foo              # cd into highest ranked directory matching foo
z foo bar          # cd into highest ranked directory matching foo and bar
z foo /            # cd into a subdirectory starting with foo

z ~/foo            # z also works like a regular cd command
z foo/             # cd into relative path
z ..               # cd one level up
z -                # cd into previous directory

zi foo             # cd with interactive selection (using fzf)

z foo<SPACE><TAB>  # show interactive completions (bash 4.4+/fish/zsh only)
```

## Installation & Setup



| Env                  | Installed by:          | Note                                                                                                                          | Setup                                                                                                                                                              | 
| -------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Windows (PowerShell) | `scoop install zoxide` | Notes `_ZO_DATA_DIR` is located at `'$env:LOCALAPPDATA\zoxide' (e.g., C:\Users\26326\AppData\Local\zoxide)` by default        | The end of `~/.bashrc`: `eval "$(zoxide init bash)"`                                                                                                               |
| Linux (Bash)         | `brew install zoxide`  | Officially,  Since "Debian / Ubuntu derivatives update their packages very slowly, consider using the install script instead" | The end of `$PROFILE` (`C:\Users\26326\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`): `Invoke-Expression (& { (zoxide init powershell \| Out-String) })` |

>[!warning] Using `zoxide` and retire `autojump` on Linux.

## Related
- [[tools]]
- [[missing-semester/10-shell]]

## Next
- [ ] Continuously updated while in use
- [ ] Link this note to a summary, reference, or follow-up note
