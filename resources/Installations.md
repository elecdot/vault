---
tags:
  - tooling
  - package-manager
  - environment
kind: "resource"
format: "index"
status: "active"
source: ""
aliases:
  - "Installations"
  - "installation log"
---

# Installations

## Focus


>[!warning] legacy: In previous vault
>Legacy installation record created before this vault had a stable structure.
This note is retained as an index of installed tools and install methods.
Detailed tool links remain in the lists below.

# apt
## Usage
Install:
```bash
apt install <pkgname>
```
uninstall:
```bash
apt remove <pkgname>
```
purge uninstall:
```bash
apt purge <pkgname>
```
check useless dependency then remove
```bash
apt autoremove
```
## List:

| Package Name        | Date       | Version               | State   | Note                                  |
| ------------------- | ---------- | --------------------- | ------- | ------------------------------------- |
| [[build-essential]] | -          | -                     | alive   | `Linuxbrew`                           |
| [[gdb]]             | -          | -                     | alive   | with `build-essential`                |
| [[autojump]]        | 2025-09-14 | 22.5.1-1.1            | retired | see [[zoxide]]                        |
| [[tree]]            | 2025-09-14 | v2.1.1                | alive   |                                       |
| [[unzip]]           | 2025-09-21 | amd64 6.0-28ubuntu4.1 | alive   |                                       |
| [[zip]]             | 2025-11-23 | 3.0-13ubuntu0.2       | alive   |                                       |
| [[texlive-full]]    | 2025-12-26 | unknown               | alive   | work with [[VS Code Latex workspace]] |
| [[7zip]]            | 2026-04-17 | 23.01+dfsg-11         | alive   | `7z` for command alias                |
| [[unrar]]           | 2026-05-03 | 1:7.0.7-1build1       | alive   |                                       |

# Linuxbrew
>[!todo] More information like how `brew` behave is available on [Official Home Page](https://formulae.brew.sh/formula)
## Install
See [[Installations#Shell (curl)]]
Set Initialize for `brew`:
```bash
eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
```
Install dependencies:
```bash
sudo apt install build-essential
# Recommended: brew install gcc
```
## Usage
Search If a package is available on [Homebrew Formula](https://formulae.brew.sh)
## List:
| Package Name  | Date       | Version         | State | Note                                                                                                                                                                                                                                                                                         |
| ------------- | ---------- | --------------- | ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [[starship]]  | unknown    | 1.24.2          | alive |                                                                                                                                                                                                                                                                                              |
| [[codex]]     | 2025-09-05 | (casks) 0.107.0 | alive | [official webpage](https://developers.openai.com/codex/cli)                                                                                                                                                                                                                                  |
| [[fastfetch]] | 2025-10-06 | 2.59.0          | alive | [GitHub repo](https://github.com/fastfetch-cli/fastfetch)                                                                                                                                                                                                                                    |
| [[ripgrep]]   | 2025-11-19 | 15.1.0          | alive | come with codex                                                                                                                                                                                                                                                                              |
| [[tldr]]      | 2026-03-09 | 1.6.1           | alive | This is Rust clint for `tldr` see [tldr GitHub page](https://github.com/tldr-pages/tldr)                                                                                                                                                                                                     |
| [[zoxide]]    | 2026-03-25 | 0.9.9           | alive | Using `zoxide` and retire `autojump` on Linux.                                                                                                                                                                                                                                               |
| [[just]]      | 2026-04-08 | 1.49.0          | alive | [GitHub repo](https://github.com/casey/just); First used in [[statistic-modeling/workspace]] and alternative way to build might be [[cargo]]                                                                                                                                                 |
| [[chezmoi]]   | 2026-05-09 | 2.70.3          | alive | `chezmoi` is part of [[bootstrap]] workflow who bring the dotfiles when setup. The recommended workflow gonna be install [[brew]] first then introduce `chezmoi`. `chezmoi version v2.70.3, commit ff6317e356645f92976ac8695424735cadbd5a3b, built at 2026-05-07T20:57:19Z, built by Homebrew` | 

# Shell (curl)
## Usage
Typically paste a `curl` command line from a tool's official webpage
looks like:
```bash
# [Linuxbrew's curl](https://brew.sh/)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
## List:
| Package Name                             | Date       | Version                         | State | Note                                                          |
| ---------------------------------------- | ---------- | ------------------------------- | ----- | ------------------------------------------------------------- |
| [[Installations#`Linuxbrew`\|Linuxbrew]] | 2025-08-15 | Homebrew 4.6.3                  | alive |                                                               |
| [[uv]]                                   | 2025-12-11 | 0.9.17 x86_64-unknown-linux-gnu | alive | for agent usage, also have one in `uv` Micromamba environment |
| [[sdkman]]                               | 2026-03-17 | native: 0.7.21 (linux x86_64)   | alive |                                                               |

# Scoop

## Usage

-

## List:

| Package Name | Date | Version | State | Note |
| ------------ | ---- | ------- | ----- | ---- |
|              |      |         |       |      |

```powershell
#2026-05-08
❯ scoop list
Installed apps:

Name         Version       Source Updated             Info
----         -------       ------ -------             ----
7zip         26.01         main   2026-05-06 18:20:56
codex        0.128.0       main   2026-05-06 18:21:22
git          2.54.0        main   2026-04-23 14:19:22
grep         3.11          main   2026-03-10 11:02:15
innounp      2.67.9        main   2026-05-06 18:21:24
iverilog     12-20220611   main   2026-04-28 14:53:00
miniforge3   26.3.2-0      extras 2026-05-08 12:24:52
openjdk17    17.0.2-8      java   2026-03-23 14:45:53
putty        0.83          extras 2026-03-24 14:28:11
ripgrep      15.1.0        main   2026-04-08 08:14:17
starship     1.25.1        main   2026-05-06 18:21:27
tlrc         1.13.0        main   2026-04-23 14:19:34
vcredist2022 14.50.35719.0 extras 2026-04-08 08:31:56
vim          9.2.0390      main   2026-05-06 18:21:35
zoxide       0.9.9         main   2026-03-25 14:33:36
```

# uv tool

## Usage

```bash
uv tool install [--python] 3.10 ruff
uv tool upgrade
uv tool list
```

For more detail, check [[uv]].

## List:

| Package Name | Date       | Version | State | Note                                                                        |
| ------------ | ---------- | ------- | ----- | --------------------------------------------------------------------------- |
| [[aider]]    | 2026-05-08 | 0.86.2  | alive | ` uv tool install --force --python python3.12 --with pip aider-chat@latest` |

# Related
- [[tools]]
- [[bootstrap]]

# Next

- [ ] Plan to move this into a more concise note