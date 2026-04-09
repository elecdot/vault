---
tags:
  - shell
kind: resource
format: note
source: "[Textbook](https://missing.csail.mit.edu/2026/course-shell/)"
aliases:
  - Shell
---

# Shell

## Focus
Not specified.

## Notes

### Operating With Shell

- `bash` - Bourne Again SHell
- `date`
- `cd` is actually built into the shell, and isn't a separate program (i.e., `which cd` will say "no cd found") (even `which pwd` is a program thou)
- `pwd` or `$PWD`

>[!tip] Consider installing and using [`zoxide`](https://github.com/ajeetdsouza/zoxide) to speed up your `cd`ing. `z` will remember the paths you frequently visit and let you access with less typing.

Try `ls /bin` then you will find lot of programs you use in your daily life.

>[!tip] Consider installing and using [`eza`](https://eza.rocks/) for a more human-friendly `ls`.

---

- `cat file`, which prints the contents of `file`.
- `sort file`, which prints out the lines of `file` in sorted order.
- `uniq file`, which eliminates consecutive duplicate lines from `file`.
- `head file` and `tail file`, which respectively print the first and last few lines of `file`.
- There's also `grep pattern file`, which finds lines matching `pattern` in `file`.

You can also specify a directory instead of a file (or leave it off for `.`) and pass `-r` to recursively search all the files in a directory.

>[!tip] Consider installing and using [`bat`](https://github.com/sharkdp/bat) over `cat` for syntax highlighting and scrolling.

>[!tip] Consider installing and using [`ripgrep`](https://github.com/BurntSushi/ripgrep) over `grep` for a faster and more human-friendly (but less portable) alternative. `ripgrep` will also recursively search the current working directory by default.

---

> More useful tools with a slightly more complicated interface:

`sed` - *a programmatic file editor*. It has its own programming language for making automated edits to files, but the most common use of it it:

```bash
$ sed -i 's/pattern/replacement/g' file
# -i: performs in-place editing rather than writing to standard output.
# s/: express in the sed programming language that we want to do a substitution.
# / separates the pattern from the replacement.
# the trailing /g indicates that we want to replace all occurrences on each line rather than just the first.
#
```

> Regular expression substitutions also allow `replacement` to refer back to parts of the matched pattern; we'll see an example of that in a second.

---

`find`

Examples for `find` use case:

```bash
$ find ~/Downloads -type f -name "*.zip" -mtime +30
# Finds ZIP files in the download directory that are older than 30 days.
$ find ~ -type f -size +100M -exec ls -lh {} \;
# Finds files larger than 100M in your home directory and lists them. Note that `-exec` takes a command terminated with a stand-alone `;` (which we need to escape much like a space) where `{}` is replaced with each matching file path by `find`.
$ find . -name "*.py" -exec grep -l "TODO" {} \;
# Finds any `.py` files with TODO items in them.
```

>[!important] I may need a `find` usage grabbing note.
> The syntax of `find` can be a little daunting.

>[!tip] Consider installing and using [`fd`](https://github.com/sharkdp/fd) instead of `find` for a more human-friendly (but less portable) experience.

---

`awk` - like `sed`, has its own programming language. Where `sed` is built for editing files, `awk` is built for parsing them.

>[!tldr]- `awk`
> By far the most common use of `awk` is for data files with a regular syntax (like CSV files) where you want to extract only certain parts of every record (i.e., line):
> ```bash
> $ awk '{print $2}' file
> ```
> Prints the second whitespace-separated column of every line of `file`. If you add `-F,`, it'll print the second comma-separated column of every line.
> `awk` can do much more - filtering rows, computing aggregates, and more - see the [[#exercises]] for a taste.

---

>[!example]- Putting these tools together, we can do fancy things like:
> ```bash
> $ ssh myserver 'journalctl -u sshd -b-1 | grep "Disconnected from"' \
>   | sed -E 's/.*Disconnected from .* user (.*) [^ ]+ port.*/\1/' \
>   | sort | uniq -c \
>   | sort -nk1,1 | tail -n10 \
>   | awk '{print $2}' | paste -sd,
> # postgres,mysql,oracle,dell,ubuntu,inspur,test,admin,user,root
> ```
> This grabs SSH logs from a remote server (we'll talk more about `ssh` in the next lecture), searches for disconnect messages, extracts the username from each such message, and prints the top 10 usernames comma-separated. All in one command! We'll leave dissecting each step as an exercise.

### The Shell language (bash)

>[!quote]- In fact, most shells implement a full programming language (like bash), just like Python or Ruby.
> It has variables, conditionals, loops, and functions. When you run commands in your shell, you are really writing a small bit of code that your shell interprets.

We won't teach you all of bash today, but there are some bits you'll find particularly useful:

#### redirects

`> file` / `>> file` / `< file` / `|` (pipes)
> See [[redirections|shell redirections]] for more practical use and deeper ideas.

>[!note] `tee` (program) will print standard input to standard output (just like `cat`), but will also write it to a file. So `verbose cmd | tee verbose.log | grep CRITICAL` will preserve the full verbose log to a file while keeping your terminal clean.

---

#### conditionals & loops

`if command1; then command2; command3; fi`
> Execute `command1`, and if it doesn't result in an error, will run `command2` and `command3`. You can also have an `else` branch if you wish:

```bash
if command1; then
    command2
    command3
else
    command4
    command5
fi
```

The most common command to use as `command1` is the `test` command, often abbreviated simply as `[`, which lets you evaluate conditions like:

- "does a file exist" - `test -f file` / `[ -f file ]`
- "does a string equal another" - `[ "$var" = "string" ]`

>[!note] In bash, there's also `[[]]`, which is a "safer" built-in version of `test` that has fewer odd behaviors^[bahaviours is a wrong typing] around quoting.

>[!quote] [[2026-03-20-1028-shell-test-commands]]
> * `test` -> builtin
> * `[` -> builtin
> * `[[` -> keyword

---

`while command1; do command2; command3; done`
> Except that it will re-execute the whole thing over and over for as long as `command1` does not error.

`for <var> in a b c d; do command; done`
> executes `command` four times, each time with `$varname` set to one of `a`, `b`, `c`, and `d`.

Instead of listing the items explicitly, you'll often use "command substitution":

```bash
for i in $(seq 1 10); do
```

---

#### Shell Programming

>[!quote] A shell scripts `workspace/10-shell/only-failed-log.sh`
> here's a script that will run a program in a loop until it fails, printing the output only of the failed run, while stressing your CPU in the background (useful to reproduce flaky tests for example)

- `&` - background jobs to run programs concurrently.
- [[arithmetic-expansion|Arithmetic Expansion]]

---

- `#!/path` - "shebang"
> When a file that starts with the magic incantation is executed, the shell will **start the program at `/path`**, and **pass it the contents of the file as input**.
> shell scripts to `/bin/bash`
> Python scripts to `/usr/bin/python3` (indicate with `which`)

>[!tip] Preferred use `#!/usr/bin/env python3`, this called a `env` command:
> Then `env`:
> - searches `$PATH`
> - finds the first `python3`
> - executes it
>
> *Like you are calling a python3 interpreter in "your environment" (`venv`, `conda` aware), not the fixed one.*

---

Bash Strict Mode:

```bash
#!/usr/bin/env bash
## -e: exit on error (interrupt)
## -u: treat unset variables as an error
## -o pipefail: return the exit status (instead of passing exit code), fail if any command in a pipeline fails
set -euo pipefail
```

>[!warning] Highly recommend making heavy use of [shellcheck](https://www.shellcheck.net/) when writing script. OR let LLMs writing and debugging and [use](https://agentskills.io/skill-creation/using-scripts) shell scripts. ^[how to make sure Agent do it well ?] As well as **translating them to a "real" programming language (like Python) when they've grown too unwieldy for bash (100+ lines)**

### Exercises

>[!summary] Shell takeaways
> These exercises are really about one thing: the shell is a small programming language for composing programs through arguments, quoting, streams, exit codes, and text pipelines.

#### Environment and file listing

- Use a real Unix shell such as `bash` or `zsh`.
- On Windows, prefer WSL when following Unix-shell material.
- `echo $SHELL` shows which shell program is currently in use.
- `ls -l` means long listing format.
- In `ls -l`, the first character is the file type, and the next 9 characters are permissions for `user/group/others` in `rwx` triples.

#### Globs and quoting

- A glob is a shell-side filename pattern expansion, not a regular expression.
- `*.txt`: any filename ending in `.txt`
- `file?.txt`: exactly one character in place of `?`
- `{a,b,c}.txt`: brace expansion producing `a.txt`, `b.txt`, `c.txt`
- `'single quotes'` preserve text literally.
- `"double quotes"` still allow expansions like `$var` and `$(...)`.
- `$'ANSI quotes'` allow escaped characters such as `\n` and `\t`.

```bash
printf '%s\n' '$' '!' 'line 2'
```

#### Streams and control flow

- Standard streams: `stdin=0`, `stdout=1`, `stderr=2`.
- Redirect `stdout` with `> file`.
- Redirect `stderr` with `2> file`.
- Redirect both to the same file with `> file 2>&1`.
- `$?` stores the previous command's exit status.
- `0` means success; nonzero means failure.
- `cmd1 && cmd2`: run `cmd2` only if `cmd1` succeeded.
- `cmd1 || cmd2`: run `cmd2` only if `cmd1` failed.

```bash
[ -d /tmp/mydir ] || mkdir /tmp/mydir
```

#### Why `cd` is a builtin

- A standalone program runs in a child process.
- A child process cannot change the working directory of its parent shell.
- Therefore `cd` must be built into the shell itself.

#### Basic scripting

- Use `$1`, `$2`, ... for positional arguments.
- Use `$@` to forward all arguments while preserving argument boundaries.
- Use `test -f file` or `[ -f file ]` to check whether a regular file exists.

```bash
#!/usr/bin/env bash
if [ -f "$1" ]; then
  echo "file exists"
else
  echo "file not found"
fi
```

- `chmod +x check.sh` adds the executable bit so `./check.sh` can run directly.
- Without execute permission, the file may be readable but not executable.
- `set -x` prints commands as the shell executes them, which is useful for debugging.

#### Substitution and arguments

- `$(...)` performs command substitution.
- Typical use: generate dated filenames.

```bash
cp notes.txt "notes_$(date +%Y-%m-%d).txt"
```

- Prefer `"$@"` over `$1` when a script should accept an arbitrary command plus its arguments (when passing a command like `./run.sh grep "hello world" file.txt`).

#### Pipelines as data processing

- The shell becomes powerful when small tools are chained through pipes.
- Typical roles:
  - `find`: discover files
  - `sort` + `uniq -c`: aggregate frequencies
  - `head`: keep top results
  - `grep`: filter by pattern
  - `sed`: rewrite text
  - `awk`: filter and reshape columns
  - `xargs`: turn stdin into command arguments

#### Safe filenames with `find` and `xargs`

- Plain newline-separated pipelines break on filenames with spaces or newlines.
- Use `find -print0` with `xargs -0` for robust handling.

```bash
find . -name "*.sh" -print0 | xargs -0 wc -l
```

#### `curl`, `grep`, `jq`, and `awk`

- `curl -s URL` fetches a resource quietly.
- `grep` is often enough for quick counting tasks in HTML or plain text.
- `jq` is the right tool when the input is JSON.
- `jq '.[] | select(.version > 6) | .name'` means iterate, filter, then extract.
- `awk` is ideal for line-oriented, column-based text.

```bash
printf 'a 50 x\nb 150 y\nc 200 z\n' | awk '$2 > 100 {print $3, $2, $1}'
```

#### Reading pipelines

- To understand a long pipeline, inspect one stage at a time:
  - what comes in
  - what gets filtered or extracted
  - what format is passed onward
- Good shell work is mostly about tracking data shape through each pipe.
- A strong practice task is summarizing shell history into "most used commands" with `awk`, `sort`, `uniq -c`, and `head`.

## Related

- [[missing-semester]]

## Next
- [ ] In the next lecture, we will talk about how to perform and automate more complex tasks using the shell and the many handy command-line programs out there
- [ ] Write "Focus" section
- [ ] Complete frontmatter and links
- [ ] Link this note to a summary, reference, or follow-up note
