---
tags:
  - "concept"
  - "shell"
kind: "concept"
format: "card"
status: "fleeting"
source: "[GNU manpage](https://www.gnu.org/software/bash/manual/html_node/Arithmetic-Expansion.html)"
aliases:
  - "Arithmetic Expansion"
---

# Arithmetic Expansion

> A small reusable idea, tip, or side concept worth revisiting.

## Core Idea

Arithmetic expansion lets Bash **evaluate integer expressions inline**.

```bash
$(( expression ))
```

→ evaluated result replaces the expression.

---

## What it actually does

```bash
echo $((1 + 2))
# → 3
```

Think:

> Bash parses → computes → substitutes result (as a string)

---

## Variables (no `$` needed inside)

```bash
x=5
echo $((x + 3))
# → 8
```

Inside `$(( ))`, variables are treated as numbers automatically.

---

## Assignment works inside

```bash
x=5
echo $((x = x + 2))
# → 7
```

Also updates `x`.

---

## Supported operators (C-like)

### Arithmetic

```bash
+  -  *  /  %   # basic math
```

### Comparison (result = 0 or 1)

```bash
<  >  <=  >=  ==  !=
```

### Logical

```bash
&&  ||  !
```

### Bitwise (rare but powerful)

```bash
&  |  ^  ~  <<  >>
```

---

## Increment / decrement

```bash
((x++))
((++x))
```

Works like C:

- `x++` → use then increment
    
- `++x` → increment then use
    

---

## Two related forms (important distinction)

### 1. Expansion (returns value)

```bash
echo $((x + 1))
```

### 2. Arithmetic command (returns exit status)

```bash
((x + 1))
```

- No `$`
    
- Used for conditions
    

```bash
if ((x > 0)); then
  echo "positive"
fi
```

---

## Exit status behavior (very important)

```bash
((expression))
```

- result ≠ 0 → exit status **0 (true)**
    
- result = 0 → exit status **1 (false)**
    

So:

```bash
((5))   # true
((0))   # false
```

---

## Base / number formats

```bash
echo $((2#1010))   # binary → 10
echo $((16#FF))    # hex → 255
echo $((010))      # octal → 8 (watch out!)
```

---

## Common gotchas

### 1. Integer only

```bash
echo $((3 / 2))
# → 1  (not 1.5)
```

Use `bc` if you need floats.

---

### 2. No `$` inside

```bash
echo $((x))     # correct
echo $(($x))    # works, but unnecessary
```

---

### 3. Unset variables → treated as 0

```bash
echo $((undefined + 1))
# → 1
```

---

## Mental Model (this is the key)

Think of `$(( ))` as:

> “Embed a tiny C-like integer evaluator inside Bash, then substitute the result”

---

## Minimal Cheat Sheet

```bash
$((a + b))     # compute
((a++))        # mutate
((a > b))      # condition
```

---

## If you want to go deeper

The next concepts that really unlock power:

- difference between `(( ))` vs `[ ]` vs `[[ ]]`
    
- arithmetic in loops: `for ((i=0; i<10; i++))`
    
- interaction with shell parsing (expansion order)
    

---

If you want, I can connect this to **how Bash parses and evaluates expressions internally vs external tools like `expr`/`bc`** — that’s where the subtle rules become intuitive.

## Related
- [[10-shell]]

## Next
- [ ] Link this card to one broader note or MOC
- [ ] Distill it further if it keeps recurring
