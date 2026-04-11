---
tags:
  - inspiration
  - chatgpt
  - github
  - network
kind: resource
format: capture
status: fleeting
source: ChatGPT
aliases:
  - TUN mode on Clash effectively disable the GitHub Connenction
---

# TUN mode on Clash effectively disable the GitHub Connenction

## Why
You should know about how TUN mode on clash actually work.

## Excerpt
> [!quote] ChatGPT reply
> Yes — that is very likely the cause.
> 
> What happened is:
> 
> * **TUN mode** makes Clash/Mihomo capture traffic at the system network layer, not just apps that obey an HTTP/SOCKS proxy.
> * With **Fake-IP DNS mode**, it can answer DNS queries with a **synthetic IP** instead of the real public IP, then internally map that fake IP back to the real domain when the connection passes through Clash.
> * A very common default Fake-IP range is **`198.18.0.1/16`**, inside the broader reserved benchmarking block `198.18.0.0/15`. That is why your SSH debug showed `ssh.github.com [198.18.0.127]`. It was not GitHub’s real public address; it was Clash’s fake address. ([GitHub][1])
> 
> So the sequence was probably:
> 
> 1. You turned on **TUN**.
> 2. Clash started handling your system DNS.
> 3. `ssh.github.com` got resolved to a **fake IP** like `198.18.0.127`.
> 4. SSH authentication still worked because Clash could still map that fake IP back to GitHub.
> 5. But the actual Git transport path for `git push` was disrupted somewhere in that interception path, so the session closed after auth. That kind of “auth succeeds, Git operation fails” pattern is consistent with proxy/TUN/Fake-IP interference. GitHub also notes that SSH-over-443 can be affected by proxies. ([GitHub][1])
> 
> So in plain words: **nothing “mystical” happened to your repo**. Your network stack changed underneath Git when TUN mode was enabled.
> 
> ### Why `ssh -T` can pass but `git push` can fail
> 
> `ssh -T git@github.com` is a useful handshake test, but it is still only a narrow test. It proves:
> 
> * the key is valid
> * GitHub accepted the login
> * the SSH path is reachable enough for auth
> 
> It does **not** prove the whole Git data session will survive after authentication. TUN + Fake-IP can break that later stage.
> 
> ### What to do
> 
> The cleanest fixes are usually one of these:
> 
> **Option A: disable TUN when using Git**
> 
> * simplest
> * lowest debugging cost
> 
> **Option B: keep TUN on, but stop using Fake-IP for this case**
> 
> * switch DNS mode from `fake-ip` to something like `redir-host` if your client/kernel supports it
> * this avoids handing apps synthetic `198.18.x.x` addresses
> * many users choose this when some developer tools behave oddly under Fake-IP. ([Jie Li's Blog][2])
> 
> **Option C: add GitHub to the Fake-IP filter / DNS exclusion**
> 
> * exclude:
> 
>   * `github.com`
>   * `*.github.com`
>   * `ssh.github.com`
>   * possibly `*.githubusercontent.com`
> * then those domains resolve to real IPs instead of `198.18.x.x`
> 
> That is usually the best targeted fix if you want to keep TUN.
> 
> ### Practical debugging checklist
> 
> With TUN on, compare these:
> 
> ```powershell
> Resolve-DnsName ssh.github.com
> git ls-remote origin
> ```
> 
> Then turn TUN off and run the same two commands again.
> 
> If the TUN-off result no longer shows `198.18.x.x` and Git works again, you have essentially confirmed the root cause.
> 
> ### Good mental model
> 
> Think of Fake-IP mode as:
> 
> * **DNS lies on purpose**
> * then Clash remembers the lie
> * later it translates traffic back to the real destination
> 
> That works for most apps, but some protocols and tools are more fragile, especially when they combine:
> 
> * SSH
> * custom ports like 443-over-SSH
> * Git’s packet transport
> * Windows networking quirks
> * TUN interception
> 
> ### Recommendation
> 
> For developer workflows, the most stable setup is often:
> 
> * use **system proxy only** when possible, or
> * use **TUN + redir-host**, or
> * keep **TUN + fake-ip** but add GitHub-related domains to the fake-ip filter
> 
> A good next step is to show me your Clash DNS/TUN config block, especially these fields:
> 
> ```yaml
> tun:
> dns:
>   enhanced-mode:
>   fake-ip-range:
>   fake-ip-filter:
> ```
> 
> I can then suggest the minimal safe change.
> 
> [1]: https://github.com/openclaw/openclaw/issues/25215 "https://github.com/openclaw/openclaw/issues/25215"
> [2]: https://www.pupboss.com/post/2024/clash-tun-fake-ip-best-practice/ "https://www.pupboss.com/post/2024/clash-tun-fake-ip-best-practice/"

## Context
- Date captured: 2026-04-11 14:19
- Prompt: Not captured.
- Conversation link: none

## Related
- none

## Next
- [ ] Distill this into a permanent note
- [ ] Add one concrete link or follow-up
