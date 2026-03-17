---
tags:
  - "java"
  - "env"
  - "cli"
  - "tool"
kind: "resource"
format: "note"
source: "[Offical Docs](https://sdkman.io/usage/)"
aliases:
  - "SDKMAN!"
---

# SDKMAN!

## Focus

Introduce SDKMAN!: Installation and basic usage. Captured from [Official Docs](https://sdkman.io/usage/) compose with my personal usage.

## Quick References

Use [[tldr]]

>[!note] Why is [Temurin](https://sdkman.io/jdks/tem/) the default JDK?
> We've chosen Eclipse Temurin as our default JDK because it's widely recognized as the de facto standard for OpenJDK distributions. Trusted for its reliability, stability, and performance, Temurin is ideal for production-grade development. We ensure our default version aligns with the latest stable release, so you're equipped with the best tools for your JVM projects.

### Default Version

Chose to make a given version the default:

```
sdk default scala 3.4.2
```

This will ensure that all subsequent shells will start with version 3.4.2 in use.

### Env command

Basically use this workflow:
```bash
sdk env init
sdk env
sdk env clear
sdk env install
```

### Self-Update

```bash
sdk selfupdate
# Re-installation
sdk selfupdate force
```

### Others

#### Flush

It should rarely be necessary to flush SDKMAN!'s local state. The flush command helps with this, so you don't need to delete any directories. **Manually deleting directories like the `.sdkman/tmp` directory will break SDKMAN! Always use the `flush` command instead!**

```bash
sdk flush
```

#### Home

When using SDKMAN in scripts, it is often useful to get the absolute path of where an SDK resides (similar to how the `java_home` command works on macOS). For this we have the `home` command.

```bash
sdk home java 21.0.4-tem/home/myuser/.sdkman/candidates/java/21.0.4-tem
```

#### Configuration

Configuration can be found in the `~/.sdkman/etc/config` file. To edit the configuration, the `sdk config` command may be issued to edit this file in the system editor. The following configurations are available:

```bash
# make sdkman non-interactive, preferred for CI environments
sdkman_auto_answer=true|false

# check for newer versions and prompt for update
sdkman_selfupdate_feature=true|false

# disables SSL certificate verification
# https://github.com/sdkman/sdkman-cli/issues/327
# HERE BE DRAGONS....
sdkman_insecure_ssl=true|false

# configure curl timeouts
sdkman_curl_connect_timeout=5
sdkman_curl_continue=true
sdkman_curl_max_time=10
sdkman_curl_retry=0
sdkman_curl_retry_max_time=60

# subscribe to the beta channel
sdkman_beta_channel=true|false

# enable verbose debugging
sdkman_debug_mode=true|false

# enable colour mode
sdkman_colour_enable=true|false

# enable automatic env
sdkman_auto_env=true|false

# enable bash or zsh auto-completion
sdkman_auto_complete=true|false
```

## Installation

```bash
curl -s "https://get.sdkman.io" | bash
```
This add a initialize snippet in `.bashrc`:
```bash
#THIS MUST BE AT THE END OF THE FILE FOR SDKMAN TO WORK!!!
export SDKMAN_DIR="$HOME/.sdkman"
[[ -s "$HOME/.sdkman/bin/sdkman-init.sh" ]] && source "$HOME/.sdkman/bin/sdkman-init.sh"
```
```bash
# Activate in your same shell
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

### Uninstallation

```bash
# Optionally backup
tar zcvf ~/sdkman-backup_$(date +%F-%kh%M).tar.gz -C ~/ .sdkman
rm -rf ~/.sdkman
```
Then remove the SDKMAN initialization snippet in your shell profile (see [[#Installation]] ).

>[!tip] Re-installation may be forced by passing the force parameter to the command:
>```bash
>sdk selfupdate force
>```

### CI Installation

Combine this with other parameters as needed:
```bash
curl -s "https://get.sdkman.io?ci=true&rcupdate=false" | bash
```

- `rcupdate=false`:
	- Install without modifying shell config (no initialization snippet):
- `ci=true`:
	- Answers all prompts (sets `sdkman_auto_answer=true`)
	- Disables colored output for cleaner logs (sets `sdkman_colour_enable=false`)
	- Turns off the self-update feature to prevent unexpected updates (sets `sdkman_selfupdate_feature=false`)

## Related

- [[tools]]
- [[environments-build-guide]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
