---
tags:
  - concept
  - shell
  - gnu
kind: concept
format: card
status: fleeting
source: "[GNU redirections manpage](https://www.gnu.org/software/bash/manual/html_node/Redirections.html)"
aliases:
  - shell redirections
  - redirecting
---

# shell redirections

> A small reusable idea, tip, or side concept worth revisiting.

## Core Idea

Redirection = **rewiring where input/output streams go**.

Every process has 3 default streams:

* `0` → stdin (input)
* `1` → stdout (normal output)
* `2` → stderr (errors)

---

## Most Useful Patterns (90% of real usage)

### 1. Redirect output to a file

```bash
command > file
```

* stdout → file (overwrite)

```bash
command >> file
```

* stdout → file (append)

---

### 2. Redirect errors

```bash
command 2> error.log
```

* stderr → file

---

### 3. Redirect both stdout + stderr

```bash
command > file 2>&1
```

* `2>&1` = “stderr goes where stdout goes”

Modern shorthand:

```bash
command &> file
```

---

### 4. Input redirection

```bash
command < input.txt
```

* file → stdin

---

### 5. Pipe (most important abstraction)

```bash
command1 | command2
```

* stdout of `command1` → stdin of `command2`

---

## Slightly More Advanced (worth knowing)

### 6. Use another file descriptor

```bash
command 3> file
```

* open FD 3 for writing

Useful in scripting, not everyday CLI.

---

### 7. Redirect and discard output

```bash
command > /dev/null 2>&1
```

* silence everything

---

### 8. Here document (multiline input)

```bash
command << EOF
line1
line2
EOF
```

---

### 9. Here string (quick input)

```bash
command <<< "text"
```

---

## Mental Model (important)

Think of it as:

> You are **rewiring file descriptors before the process starts**

Order matters:

```bash
command > file 2>&1   # correct
command 2>&1 > file   # NOT the same
```

---

## Minimal Cheat Sheet

```
>    stdout overwrite
>>   stdout append
2>   stderr
&>   stdout + stderr
<    stdin
|    pipe
```

## Related
- [[missing-semester/10-shell]]

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
