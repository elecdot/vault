---
tags:
  - shell
  - debug
  - tooling
kind: resource
format: note
source: "[Textbook](https://missing.csail.mit.edu/2026/debugging-profiling/)"
aliases:
  - Debugging and Profiling
---

# Debugging and Profiling

## Focus
Not specified.

## Notes

>[!quote] A golden rule in programming is that code does not do what you expect it to do, but what you tell it to do.
>Bridging that gap can sometimes be a quite difficult feat.

### Debugging

#### Printf Debugging and Logging

> The most effective debugging tool is still careful thought, coupled with judiciously placed print statements -- Brian Kernighan, _Unix for Beginners_.

Logging is usually done through a logging framework that includes built-in support for things like:

- the ability to **direct the logs** (or subsets of the logs) to other output locations;
- setting **severity levels** (such as INFO, DEBUG, WARN, ERROR, etc.) and allow you to **filter** the output according to those; and
- support for **structured logging** of data related to the log entries, which can then be extracted more easily after the fact.

Basically:
1. You proactively put in logging statements while programming  so that the data you need to debug may already be there.
2. Once you've found and fixed a problem using print statements, it's often worthwhile to convert those prints into proper log statements before removing them.

> This way, if similar bugs occur in the future, you’ll already have the diagnostic information you need without modifying the code.

>[!hint] Debugging a third-party tools with their logs:
>Many programs support the `-v` or `--verbose` flag to print more information when they run. This can be useful for discovering why a given command fails. Some even allow repeating the flag for more details. When debugging issues with services (databases, web servers, etc.), check their logs—often in `/var/log/` on Linux. Use `journalctl -u <service>` to view logs for systemd services. For third-party libraries, check if they support debug logging via environment variables or configuration.

#### Debuggers

Debuggers are programs that let you interact with the execution of a program as it happens, allowing you to:

- Halt execution when it reaches a certain line.
- Step through one instruction at a time.
- Inspect values of variables after a crash.
- Conditionally halt execution when a given condition is met.
- And many more advanced features.

>[!info] Most programming languages support (or come with) some form of debugger. The most versatile are **general-purpose debuggers** like [`gdb`](https://www.gnu.org/software/gdb/) (GNU Debugger) and [`lldb`](https://lldb.llvm.org/) (LLVM Debugger), which can debug any native binary. Many languages also have **language-specific debuggers** that integrate more tightly with the runtime (like Python’s pdb or Java’s jdb).

---

**`gdb`**

`gdb` is the de-facto standard debugger for C, C++, Rust, and other compiled languages. It lets you probe pretty much any process and get its current machine state: registers, stack, program counter, and more.

Some useful GDB commands:

- `run` - Start the program
- `b {function}` or `b {file}:{line}` - Set a breakpoint
- `c` - Continue execution
- `step` / `next` / `finish` - Step in / step over / step out
- `p {variable}` - Print value of variable
- `bt` - Show backtrace (call stack)
- `watch {expression}` - Break when the value changes

>[!tip] GDB's TUI mode
>Consider using GDB’s TUI mode (`gdb -tui` or press `Ctrl-x a` inside GDB) for a split-screen view showing source code alongside the command prompt.

---

#### Record-replay debugging

>[!help]- SAY MY NAME -- *Heisenbugs*
> Bugs that seem to disappear or change behavior when you try to observe them.
> Race conditions, timing-dependent bugs, and issues that only appear under certain system conditions fall into this category.
> [Gemini AI summary](https://share.google/aimode/6fnr3XUFFNPA66btH)

For *Heisenbugs* Record-replay debugging solves this by recording a program's execution and allowing you to replay it deterministically as many times as you need. Even better, you can _reverse_ through the execution to find exactly where things went wrong.

---

**`rr`**

>[!tip] [rr](https://rr-project.org/) is a powerful tool for Linux that records program execution and allows deterministic replay with full debugging capabilities. It works with GDB, so you already know the interface.

>[!tldr] **TL;DR**: `rr` records a run and lets you replay it deterministically with reverse debugging in GDB. It is excellent for hard-to-reproduce crashes and flaky failures on Linux, but for timing-sensitive races you may need multiple recordings. Also mention that It requires hardware performance counters which may need setup on VMs (instances may not support).

>[!note]- Details: `rr`
>
>Basic usage:
>
>```bash
># Record a program execution
>rr record ./my_program
>
># Replay the recording (opens GDB)
>rr replay
>```
>
>The magic happens during replay. Because the execution is deterministic, you can use **reverse debugging** commands:
>
>- `reverse-continue` (`rc`) - Run backwards until hitting a breakpoint
>- `reverse-step` (`rs`) - Step backwards one line
>- `reverse-next` (`rn`) - Step backwards, skipping function calls
>- `reverse-finish` - Run backwards until entering the current function
>
>This is incredibly powerful for debugging. Say you have a crash—instead of guessing where the bug is and setting breakpoints, you can:
>
>1. Run to the crash
>2. Inspect the corrupted state
>3. Set a watchpoint on the corrupted variable
>4. `reverse-continue` to find exactly where it was corrupted
>
>**When to use rr:**
>
>- Flaky tests that fail intermittently
>- Race conditions and threading bugs
>- Crashes that are hard to reproduce
>- Any bug where you wish you could “go back in time”
>
>Note: rr only works on Linux and requires hardware performance counters. It doesn’t work in VMs that don’t expose these counters, such as on most AWS EC2 instances, and it doesn’t support GPU access. For macOS, check out [Warpspeed](https://warpspeed.dev/).
>
>**rr and concurrency**: Because rr records execution deterministically, it serializes thread scheduling. This means some race conditions may not manifest under rr if they depend on specific timing. rr is still useful for debugging races—once you capture a failing run, you can replay it reliably—but you may need multiple recording attempts to catch an intermittent bug. For bugs that don’t involve concurrency, rr shines brightest: you can always reproduce the exact execution and use reverse debugging to hunt down corruption.

---

#### System Call Tracing

>[!tldr] **TL;DR**: `strace` is the fastest way to see what a process is asking the kernel to do.
>Use it first when diagnosing “why did this command fail?” questions on Linux, especially for missing files, permission errors, and unexpected subprocess behavior. It is easy to start with and very practical for one-process investigations; use `-f` when child processes matter and `-T` when syscall latency matters. On macOS/BSD, use `dtruss` for a similar workflow.

>[!note]- Details: `strace`
> [`strace`](https://www.man7.org/linux/man-pages/man1/strace.1.html) lets you observe every system call a program makes:
>
> ```bash
> # Trace all system calls
> strace ./my_program
>
> # Trace only file-related calls
> strace -e trace=file ./my_program
>
> # Follow child processes (important for programs that start other programs)
> strace -f ./my_program
>
> # Trace a running process
> strace -p <PID>
>
> # Show timing information
> strace -T ./my_program
> ```
>
> On macOS and BSD, use [`dtruss`](https://www.manpagez.com/man/1/dtruss/) (which wraps `dtrace`) for similar functionality.
>
> For deeper dives into `strace`, check out Julia Evans' excellent [strace zine](https://jvns.ca/strace-zine-unfolded.pdf).

>[!tldr] **TL;DR**: `bpftrace` (on top of eBPF) is the higher-power option when you need low-overhead, system-wide tracing and aggregated answers (counts/latency distributions), not just a raw syscall stream.
>Reach for it after `strace` if you need kernel-level visibility, filtering, or summaries at scale. Trade-offs: usually requires `root`, has a steeper syntax, and defaults to observing the whole system unless you filter by `comm`/`pid` or launch with `-c`.

>[!note]- Details: `eBPF` and `bpftrace`
> [eBPF](https://ebpf.io/) (extended Berkeley Packet Filter) is a powerful Linux technology that allows running sandboxed programs in the kernel. [`bpftrace`](https://github.com/iovisor/bpftrace) provides a high-level syntax for writing eBPF programs. These are arbitrary programs running in the kernel, and thus have huge expressive power (though also a somewhat clumsy awk-like syntax). The most common use-case for them is to investigate what system calls are being invoked, including aggregations (like counts or latency statistics) or introspecting (or even filtering on) system call arguments.
>
> ```bash
> # Trace file opens system-wide (prints immediately)
> sudo bpftrace -e 'tracepoint:syscalls:sys_enter_openat { printf("%s %s\n", comm, str(args->filename)); }'
>
> # Count system calls by name (prints summary on Ctrl-C)
> sudo bpftrace -e 'tracepoint:syscalls:sys_enter_* { @[probe] = count(); }'
> ```
>
> However, you can also write eBPF programs directly in C using a toolchain like [`bcc`](https://github.com/iovisor/bcc), which also ships with [many handy tools](https://www.brendangregg.com/blog/2015-09-22/bcc-linux-4.3-tracing.html) like `biosnoop` for printing latency distributions for disk operations or `opensnoop` for printing all open files.
>
> Where `strace` is useful because it's easy to "just get up and running", `bpftrace` is what you should reach for when you need lower overhead, want to trace through kernel functions, need to do any kind of aggregation, etc. Note that `bpftrace` has to run as `root` though, and that it generally monitors the entire kernel, not just a particular process. To target a specific program, you can filter by command name or PID:
>
> ```bash
> # Filter by command name (prints summary on Ctrl-C)
> sudo bpftrace -e 'tracepoint:syscalls:sys_enter_* /comm == "bash"/ { @[probe] = count(); }'
>
> # Trace a specific command from startup using -c (cpid = child PID)
> sudo bpftrace -e 'tracepoint:syscalls:sys_enter_* /pid == cpid/ { @[probe] = count(); }' -c 'ls -la'
> ```
>
> The `-c` flag runs the specified command and sets `cpid` to its PID, which is useful for tracing a program from the moment it starts. When the traced command exits, bpftrace prints the aggregated results.

#### Network Debugging

For network issues, [`tcpdump`](https://www.man7.org/linux/man-pages/man1/tcpdump.1.html) and [Wireshark](https://www.wireshark.org/) let you capture and analyze network packets:

```bash
# Capture packets on port 80
sudo tcpdump -i any port 80

# Capture and save to file for Wireshark analysis
sudo tcpdump -i any -w capture.pcap
```

For HTTPS traffic, the encryption makes tcpdump less useful. Tools like [mitmproxy](https://mitmproxy.org/) can act as an intercepting proxy to inspect encrypted traffic. Browser developer tools (Network tab) are often the easiest way to debug HTTPS requests from web applications—they show decrypted request/response data, headers, and timing.

#### Memory Debugging



## Related
- [[missing-semester]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
