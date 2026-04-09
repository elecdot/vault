---
tags:
  - "shell"
kind: "resource"
format: "note"
source: "[Textbook](https://missing.csail.mit.edu/2026/command-line-environment/)"
aliases:
  - "Command-line Environment"
---

# Command-line Environment

## Focus
Not specified.

## Notes

>[!quote] In shell scripting everything is designed around running programs and getting them to communicate with each other simply and efficiently.
>In particular, shell scripting is tightly bound by _conventions_. For a command line interface (CLI) program to play nicely within the broader shell environment **there are some common patterns that it needs to follow**. We will now cover many of the concepts required to understand how command line programs work as well as ubiquitous conventions on how to use and configure them.

### The Command Line Interface

When shell programs communicate with each other or with the shell environment, they use the concepts of:

- [[#Arguments]]
- [[#Streams]]
- [[#Environment variables]]
- [[#Return codes]]
- [[#Signals]]

>instead simply a function explicitly clarify its input and output

#### Arguments

>[!tldr]
>- Arguments are plain strings passed to a program.
>- Example: `ls -l folder/` means program `/bin/ls` gets `['-l', 'folder/']`.
>- In scripts: `$1..$9` are positional args, `$@` is all args, `$#` is arg count, `$0` is script/program name.
>- Flags usually start with `-` or `--`, and mainly modify behavior (unlike a regular string).

**Script argument quick ref**

| Syntax        | Meaning                     |
| ------------- | --------------------------- |
| `$0`          | Program or script name      |
| `$1` ... `$9` | Positional arguments 1 to 9 |
| `$@`          | All arguments as a list     |
| `$#`          | Number of arguments         |

**Flag quick ref**

| Pattern                | Example                            | Note                              |
| ---------------------- | ---------------------------------- | --------------------------------- |
| Long flag              | `--all`                            | Usually more descriptive          |
| Short flag             | `-a`                               | Usually one-letter shorthand      |
| Equivalent long/short  | `ls -a` = `ls --all`               | Same option, different spelling   |
| Grouped short flags    | `ls -la` = `ls -l -a`              | Short flags can often be combined |
| Order often irrelevant | `ls -la` = `ls -al`                | Most CLIs treat order the same    |
| Common utility flags   | `--help`, `--verbose`, `--version` | Frequently available across tools |

>[!note]- Flags are a first good example of shell conventions.
>The shell language does not require that our program uses `-` or `--` in this particular way. Nothing prevents us from writing a program with syntax `myprogram +myoption myfile`, but it would lead to confusion since the expectation is that we use dashes. In practice, most programming languages provide CLI flag parsing libraries (e.g. `argparse` in python to parse arguments with the dash syntax).

##### Variable number of arguments and globbing

>[!tldr] When you are using globbing match, you are actually calling two features:
>1. Many CLI commands accept multiple arguments of the same type in one call.
>	- For example: `mkdir src docs` is equivalent to running `mkdir src` and `mkdir docs` separately.
>2. Globbing lets the shell expand patterns before running the command.

>[!example] `rm *.py` expands to matching files (e.g. `main.py utils.py`) instead of passing literal `'*.py'`.

**Globbing quick ref**

| Pattern | Meaning |
| --- | --- |
| `*` | Zero or more characters |
| `?` | Exactly one character |
| `{a,b,c}` | Comma-separated alternatives expanded into multiple args |

**Expansion examples**

```bash
touch folder/{a,b,c}.py
# -> touch folder/a.py folder/b.py folder/c.py

convert image.{png,jpg}
# -> convert image.png image.jpg

cp /path/to/project/{setup,build,deploy}.sh /newpath
# -> cp /path/to/project/setup.sh /path/to/project/build.sh /path/to/project/deploy.sh /newpath

mv *{.py,.sh} folder
# moves all *.py and *.sh files
```

>[!note] Shell differences
>Some shells (for example `zsh`) support advanced globbing like `**` for recursive matches, e.g. `rm **/*.py`.

#### Streams

>[!tldr] (In a pipeline) The shell spawns all processes and connects their streams before any of them finish.
```bash
$ (sleep 15 && cat numbers.txt) | grep -P '^\d$' | sort | uniq  &
[1] 12345
$ ps | grep -P '(sleep|cat|grep|sort|uniq)'
  32930 pts/1    00:00:00 sleep
  32931 pts/1    00:00:00 grep
  32932 pts/1    00:00:00 sort
  32933 pts/1    00:00:00 uniq
  32948 pts/1    00:00:00 grep
# we can see that all processes but `cat` running right away.
```

Within a script, many programs accept `-` as a filename to mean “read from stdin”:
```bash
# These are equivalent when data comes from a pipe
echo "hello" | grep "hello"
echo "hello" | grep "hello" -
```

The shell provides syntax for [[redirections|redirecting]] these streams.

>[!tip]- Another powerful tool that exemplifies the Unix philosophy is [`fzf`](https://github.com/junegunn/fzf), a fuzzy finder. It reads lines from stdin and provides an interactive interface to filter and select:
>
>```bash
>$ ls | fzf
>$ cat ~/.bash_history | fzf
>```
>
>`fzf` can be integrated with many shell operations. We’ll see more uses of it when we discuss [[#shell customization]].

#### Environment variables




## Related
- [[missing-semester]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
