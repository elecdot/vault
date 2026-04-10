---
title: "00-introduction"
tags:
  - course
  - lecture
  - crafting-interpreters
  - compile
  - interpreter
kind: "resource"
format: "note"
project: "[[crafting-interpreters]]"
source: "[Textbook](https://craftinginterpreters.com/introduction.html)"
---

# 00-introduction

## Focus

What and how will the book will include.

## Notes

### How the Book Is Organized


**first part:**
get you oriented teach you some of the lingo that language hackers use, and introduce you to [[lox|Lox]], the language we'll be implementing

**second & third:**
Each chapter is structured the same way. The chapter takes a single language feature, teaches you the concept and walks you through an implementation

### The First Interpreter jlox

We'll write our first interpreter, `jlox`, in Java.

The focus is on _concepts_. We’ll write the simplest, cleanest code we can to correctly implement the semantics of the language. This will get us comfortable with the basic techniques and also hone our understanding of exactly how the language is supposed to behave.

> While academic language folks sometimes look down on object-oriented languages, the reality is that they are widely used even for language work. **[[gcc|GCC]] and LLVM are written in C++, as are most JavaScript virtual machines.** Object-oriented languages are ubiquitous, and the tools and compilers _for_ a language are often written _in_ the same language.

I use the diamond operator from `Java 7` to make things a little more terse, but that’s about it as far as “advanced” features go.

>[!tip] **self-hosting** vs **bootstrapping**: There are orthogonal (正交的) concepts
> - Implementation language: You can implement a compiler in any language, including the same language it compiles, a process called [[self-hosting]].
> - Progress ([[bootstrapping]]): If you have another compiler for your language written in some other language, you use _that_ one to compile your compiler (or at least part of it) once. Now you can use the compiled version of your own compiler to compile future versions of itself, and you can discard the original one compiled from the other compiler.
> ![*Pulling yourself up by your own bootstraps*:](https://craftinginterpreters.com/image/introduction/bootstrap.png)

### The Second Interpreter clox

We'll write our own dynamic array and hash table. We'll decide how objects are represented in memory, and build a garbage collector to reclaim them.

Our C interpreter will contain a compiler that translates Lox to an efficient [[bytecode]] representation (don’t worry, I’ll get into what that means soon), which it then executes. This is the same technique used by implementations of Lua, Python, Ruby, PHP, and many other successful languages.

#### Why C

C is the perfect language for understanding how an implementation _really_ works, all the way down to the bytes in memory and the code flowing through the CPU.

That’s useful given how many language implementations are written in C: Lua, CPython, and Ruby’s MRI, to name a few.

## Related
- [[crafting-interpreters]]


## Next
- [ ] Clarify one open question
- [ ] Link this note to a summary or concept note
