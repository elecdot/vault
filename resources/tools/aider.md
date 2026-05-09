---
tags:
  - agent
  - tooling
kind: resource
format: note
source: "[Aider Docs](https://aider.chat/docs/)"
aliases:
  - aider
---

# aider

## Focus
Practical operating guide for using aider in daily development: installation with uv tool, core chat workflow, and interruption/multiline input patterns. Focuses on productive file-driven usage with --watch-files and AI comments (AI/AI!/AI?), plus safe and compatible configuration patterns for models and API settings.

## Notes

### Prerequisite

aider is recommended install via `uv tool`:
```shell
# --force: force install if there any
# --python: 3.12 is recommended for stability
# --with: bundled aider with pip environment
uv tool install --force --python python3.12 --with pip aider-chat@latest
```

### Quick start

As everything start, read [Usage Tips From Aider Docx](https://aider.chat/docs/usage/tips.html)
```shell
# Add needed files
/add
/drop
# Discuss a plan first
/ask command
# Discard the chat history and make a fresh start
/clear
# Run outputs
/run
/test
```

#### Interrupting & inputting

Use Control-C to interrupt aider if it isn’t providing a useful response. The partial response remains in the conversation, so you can refer to it when you reply with more information or direction.

You can send long, multi-line messages in the chat in a few ways:

- Paste a multi-line message directly into the chat.
- Enter `{` alone on the first line to start a multiline message and `}` alone on the last line to end it.
    - Or, start with `{tag` (where “tag” is any sequence of letters/numbers) and end with `tag}`. This is useful when you need to include closing braces `}` in your message.
- Use Meta-ENTER to start a new line without sending the message (Esc+ENTER in some environments).
- Use `/paste` to paste text from the clipboard into the chat.
- Use the `/editor` command (or press `Ctrl-X Ctrl-E` if your terminal allows) to open your editor to create the next chat message. See [editor configuration docs](https://aider.chat/docs/config/editor.html) for more info.
- Use multiline-mode, which swaps the function of Meta-Enter and Enter, so that Enter inserts a newline, and Meta-Enter submits your command. To enable multiline mode:
    - Use the `/multiline-mode` command to toggle it during a session.
    - Use the `--multiline` switch.

Example with a tag:

```
{python
def hello():
    print("Hello}")  # Note: contains a brace
python}
```

>[!note] People often ask for SHIFT-ENTER to be a soft-newline. Unfortunately there is no portable way to detect that keystroke in terminals.

### Aider's `--watch-files` mode

This provide a convenient way to interact with Aider, you can generally put a [[#AI comments]] in your files and a Aider running in `--watch-files` mode will looks for it.

Aider achieve this method via a context send to LLMs along with each change request from the user called [repo map](https://aider.chat/docs/repomap.html)

#### AI comments

Aider will take note of all the comments that start or end with `AI`.

**Trigger**:
Comments that include `AI!` with an exclamation point or `AI?` with a question mark are special.
They trigger aider to take action to collect _all_ the AI comments and use them as your instructions.

- `AI!` triggers aider to make changes to your code.
- `AI?` triggers aider to answer your question

**Comment Styles**:
Aider only watches for these types of one-liner comments:
```code
# Python and bash style
// Javascript style
-- SQL style
```

#### More uses

- **In-context instructions**: You basically put [[#AI comments]] inside a function.
- **Multiple comments across lines and files before trigger**: Since Aider notice all comment start or end with "AI" but only take react when a *Triger* appears, you can add multiple comments without the `!`, before triggering aider with a final `AI!`. ALSO, you can spread the AI comments across multiple files.
- **Long form instructions**: You can add a block of comments, with longer instructions. Just be sure to start or end one of the lines with `AI` or `AI!` to draw aider’s attention to the block:
```python
# Make these changes: AI!
# - Add a proper main() function
# - Use Click to process cmd line args
# - Accept --host and --port args
# - Print a welcome message that includes the listening url

if __name__ == "__main__":
    app.run(debug=True)

```
- **Add file comment**: Rather than using `/add` to add a file inside the aider chat, you can simply put an `#AI` comment in it and save the file. You can undo/remove the comment immediately if you like, the file will still be added to the aider chat.

>[!cite] Also use aider chat in the terminal
>The chat has the history of the AI comments you just made, so you can continue on naturally from there.
>
>You can also use the normal aider chat in your terminal to work with many of aider’s more advanced features:
>
>- Use `/undo` to revert changes you don’t like. Although you may also be able to use your IDE’s undo function to step back in the file history.
>- Use [chat modes](https://aider.chat/docs/usage/modes.html) to ask questions or get help.
>- Manage the chat context with `/tokens`, `/clear`, `/drop`, `/reset`. Adding an AI comment will add the file to the chat. Periodically, you may want remove extra context that is no longer needed.
>- [Fix lint and test errors](https://aider.chat/docs/usage/lint-test.html).
>- Run shell commands.
>- Etc

>[!tip] Be lazy, appropriately
>When the context clearly implies the needed action, `ai!` might be all you need.

### Configuration

#### YAML config file

>[!cite] official sample YAML config file is stored at ![[sample.aider.config.yml]]

Most of aider’s options can be set in an `.aider.conf.yml` file. Aider will look for a this file in these locations:

- Your home directory.
- The root of your git repo.
- The current directory.

If the files above exist, they will be loaded in that order. Files loaded last will take priority.

You can also specify the `--config <filename>` parameter, which will only load the one config file.

##### Note on lists

Lists of values can be specified either as a bulleted list:
```yaml
read:
  - CONVENTIONS.md
  - anotherfile.txt
  - thirdfile.py
```

#### API key configuration

DeepSeek V4 probably should use OpenAI style API setting for best compatibility:

>[!warning] DO NOT modify environment variable without thinking:
>`OPENAI_API_BASE` and `OPENAI_API_KEY` would probably ruin or at least confuse Codex.
```yaml
########################
# API Keys and settings:

## Specify the OpenAI API key
openai-api-key: xxx

## Specify the api base url
openai-api-base: https://api.deepseek.com
```
Then call DeepSeek via  `--model openai/deepseek-v4-pro`

#### Setting models

Settings now alive in `~/.aider.conf.yml`, `~/.aider.model.settings.yml`, `~/.aider.model.metadata.json`.

## Related
- [[tooling]]

## Next
- [ ] Clarify one related concept
- [ ] Link this note to a summary, reference, or follow-up note
