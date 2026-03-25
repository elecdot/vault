---
tags:
  - inspiration
  - chatgpt
  - missing-semester
  - shell
kind: resource
format: capture
status: fleeting
source: ChatGPT
aliases:
  - missing-semester-learning-strategy
---

# missing-semester-learning-strategy

## Why
To better organize my notes so as to record the learning content and ensure that they can be effectively utilized later rather than forgotten.

## Excerpt
> [!quote] ChatGPT reply
````markdown
接下来我带你看三个**更成熟的工程师学习方法**。这些方法和 _executable notes_ 结合起来，会形成一个非常强的学习系统。很多系统工程师、研究人员和 Linux 开发者实际上都在用类似的方法。

我按**学习效率提升的顺序**来讲：

1️⃣ Terminal Session Recording（非常适合 Missing Semester）  
2️⃣ CLI Knowledge Base（工程师第二大脑）  
3️⃣ Research Notebook（研究型记录）

---

# 1. Terminal Session Recording（非常适合这门课）

Missing Semester 很多内容发生在 **shell 里**。  
如果只写笔记，其实会丢失大量上下文：

- 输入了什么命令
    
- 输出是什么
    
- 中间试错过程
    
- 调试过程
    

所以很多 Linux 开发者会直接 **记录整个 terminal session**。

Linux 自带一个工具：

script (Unix)

### 基本用法

开始记录：

```bash
script session.log
```

接下来你做的所有事情：

```
$ ls
$ grep error log.txt
$ vim script.sh
```

都会记录到：

```
session.log
```

结束：

```
exit
```

---

### 回放 session

```bash
scriptreplay session.log
```

可以像录像一样回放整个终端操作。

---

### 为什么这很强

假设你在学：

- pipes
    
- sed
    
- awk
    

你的记录会变成：

```
$ cat log.txt
INFO start
ERROR fail

$ grep ERROR log.txt
ERROR fail

$ grep ERROR log.txt | wc -l
1
```

这个记录：

- **100%真实**
    
- **可复现**
    
- **包含思考过程**
    

很多 debugging 都靠这种记录。

---

# 2. 进阶版本：漂亮的 terminal recording

很多开发者用：

asciinema

效果类似：

```
terminal screencast
```

但比视频更好：

- 文本可复制
    
- 文件很小
    
- 可以嵌入网页
    

示例：

```
asciinema rec pipes.cast
```

然后：

```
asciinema play pipes.cast
```

很多开源文档都用这个。

---

# 3. CLI Knowledge Base（工程师第二大脑）

随着时间你会积累很多命令。

问题是：

> 人脑记不住 1000 个 CLI 命令。

解决方法：

建立一个 **CLI 知识库**。

结构：

```
cli-knowledge/

shell/
grep.md
find.md
sed.md

git/
rebasing.md
bisect.md

network/
ssh.md
curl.md
```

示例：

```
grep.md
```

```markdown
# grep

Search text in files.

## Recursive search

grep -r "TODO" .

## Show line numbers

grep -n "TODO" file.txt

## Ignore case

grep -i "error" log.txt
```

当你忘记时：

```
grep TODO cli-knowledge -r
```

你自己的知识库会回答。

很多工程师维护这种 repo **十几年**。

---

# 4. 更强的 CLI 知识工具

有个非常好的工具：

tldr

它是社区维护的 **简化 man pages**。

例如：

```
tldr tar
```

输出：

```
Extract archive

tar -xvf archive.tar
```

比 man page 好用很多。

建议安装：

```
npm install -g tldr
```

或

```
brew install tldr
```

---

# 5. Research Notebook（研究型笔记）

MIT、Google Research、DeepMind 的研究人员通常使用：

**Research Notebook**

结构：

```
research-log/

2026-03-04-shell-notes.md
2026-03-05-pipes.md
2026-03-06-git.md
```

每个文件是一天。

示例：

```markdown
# 2026-03-04

Topic: Pipes

Goal
understand how pipes connect processes

Experiment

grep ERROR log.txt | wc -l

Observation

pipes connect stdout to stdin

Questions

how does buffering work?
```

这种方式记录：

- 实验
    
- 想法
    
- 疑问
    

它非常适合 **深度学习技术**。

---

# 6. 把所有方法组合起来

一个非常强的结构：

```
missing-semester/

notes/
01-shell.md
02-pipes.md

sessions/
2026-03-04-shell.log

cli-knowledge/
grep.md
sed.md
awk.md

experiments/
pipes.sh
git-rebase.sh
```

学习流程：

```
看课程
   ↓
做实验
   ↓
terminal recording
   ↓
写 notes
   ↓
提炼 commands
```

这样：

- session = 原始数据
    
- notes = 理解
    
- cli knowledge = 精华
    

---

# 7. Missing Semester 特别推荐记录的东西

建议你建立一个：

```
unix-recipes.md
```

比如：

```
Find largest files

du -h | sort -h | tail

Find files with extension

find . -name "*.py"

Count lines of code

find . -name "*.py" | xargs wc -l
```

这个文件会变成：

**你自己的 Unix cookbook**。

---

# 8. 一个我非常推荐的习惯

每周做一次：

```
knowledge distillation
```

把：

```
sessions
notes
```

提炼成：

```
cheatsheets
```

例如：

```
shell-cheatsheet.md
```

内容：

```
pipes
grep
sed
awk
```

长期会形成你的 **个人标准库**。

---

# 9. 一个非常关键的工程师思维

学习工具时：

不要只记录：

```
command
```

还要记录：

```
workflow
```

例如：

```
debugging workflow

1 find logs
2 grep errors
3 isolate pattern
4 write script
```

工具只是 workflow 的组成部分。

---

✅ **总结**

你现在可以建立一个 **非常强的学习系统**：

```
Git repo

notes/          理解
sessions/       terminal recording
experiments/    scripts
cli-knowledge/  命令库
cheatsheets/    精华
```

这种方法非常接近：

- MIT CSAIL
    
- Linux kernel 开发者
    
- DevOps 工程师
    

的学习方式。

---

如果你愿意，我可以再带你看一个 **非常有意思但很多 CS 学生不知道的东西**：

> **Unix Philosophy 学习法**

它会彻底改变你学习 shell / CLI / 工具链 的方式，而且和 Missing Semester 完美契合。

---

**Unix Philosophy 学习法**其实不是一个正式课程方法，而是把经典的 **Unix philosophy** 当作学习工具链的**思维框架**。  
这套思想来自早期的 **Unix** 系统设计传统，并被记录在 **The Art of Unix Programming** 等书里。

核心不是“记命令”，而是**理解工具为什么这样设计**。

---

# 1. Unix Philosophy 的四条核心原则

### 1️⃣ 一个程序只做一件事，但做到最好

例子：

|工具|职责|
|---|---|
|grep|搜索文本|
|sort|排序|
|uniq|去重|
|wc|统计|

每个工具都很小，但组合起来很强。

---

### 2️⃣ 程序要能组合

这是 **pipe (`|`)** 的意义。

例子：

```bash
grep ERROR log.txt | sort | uniq | wc -l
```

流程：

```
grep  → 过滤
sort  → 排序
uniq  → 去重
wc    → 统计
```

每个工具只负责一段处理。

---

### 3️⃣ 使用文本作为通用接口

Unix 世界大量工具都用 **纯文本流**：

```
stdin → program → stdout
```

这让工具可以任意组合。

例如：

```bash
ps aux | grep python
```

---

### 4️⃣ 小工具 > 巨型工具

Unix 系统偏好：

```
many small tools
```

而不是：

```
one huge tool
```

现代软件有时反其道而行。

---

# 2. 用这种哲学来学习 Missing Semester

当你学习一个命令时，不要只问：

```
这个命令怎么用？
```

而要问三个问题：

```
1 这个工具解决什么问题？
2 输入输出是什么？
3 它能和什么组合？
```

例如学习 `grep`：

```
Input: text stream
Output: filtered text
```

可以组合：

```
grep → sort
grep → wc
grep → sed
```

---

# 3. 一个典型 Unix pipeline 思维

假设任务：

> 找出 repo 中最常出现的函数名

思考过程：

```
1 找代码
2 提取函数名
3 排序
4 统计
```

对应 pipeline：

```bash
grep -r "def " . \
| sed 's/def //' \
| sort \
| uniq -c \
| sort -nr
```

你会发现：

每一步都是 **单一工具**。

---

# 4. 用 Unix Philosophy 写笔记

当你学一个工具时，写四件事：

```markdown
Tool: grep

Purpose
search lines matching pattern

Input
text stream

Output
matching lines

Common pipelines
grep | wc
grep | sort
grep | sed
```

这样笔记会更像 **工具系统图**。

---

# 5. 工程师常用一个思维练习

给自己一个问题：

> 我能用 pipeline 解决吗？

例如：

统计文件类型：

```bash
ls | sed 's/.*\.//' | sort | uniq -c
```

这种练习会让你越来越熟练。

---

# 6. 为什么 Missing Semester 强调这些

课程作者来自 **MIT CSAIL**。  
他们的目标其实不是教命令，而是教：

```
tool composability
```

也就是：

> 用简单工具构建复杂能力。

这正是 Unix 哲学的核心。

---

✅ **一句话总结**

Unix Philosophy 学习法就是：

```
学习工具
    ↓
理解输入输出
    ↓
练习组合
    ↓
构建 pipelines
```

你最后掌握的不是命令，而是 **工具系统思维**。

---

如果你愿意，我可以再给你一个 **非常有意思的练习系统**：

> **30 个 Unix pipeline 挑战（从简单到工程级）**

很多人做完这套练习之后，对 shell 的理解会直接提升一个层级。
````

## Context
- Date captured: 2026-03-09 14:10
- Conversation link: none

## Related
- none

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
	
