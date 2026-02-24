# Skill: Decentralized Memory Sync (Storacha)

## Description
This skill gives you (the agent) the ability to backup your local memory (`MEMORY.md` and SQLite vector index) to the Storacha decentralized storage network. You can also restore your state from a known Content Identifier (CID) and generate secure UCAN handoff tokens for other agents.

## Prerequisites (For the User)
The host machine must have the `@goddhi/openclaw-storacha-sdk` installed globally and a valid `.env` file containing `STORACHA_PROOF` and `STORACHA_AGENT_KEY`.

## When to use this skill
- When the user explicitly asks you to "save your state", "backup to Storacha", or "sync your memory."
- When you reach the end of a complex, long-running task and want to preserve your context.
- When the user asks you to "restore your memory" from a specific CID.
- When you need to hand off a task to another agent and need to grant them temporary access to your storage space.

## Commands Executable by Agent

### 1. Push Memory (Backup State)
To backup your current state to the decentralized web, execute this shell command:
```bash
openclaw-sync push <your_agent_id>

```

**Handling Output:** The command will output a "Root CID". You MUST extract this CID (starts with `bafy...`) and present it to the user so they can safely store it.

### 2. Pull Memory (Restore State)

If the user provides a CID and asks you to restore a previous state, execute:

```bash
openclaw-sync pull <your_agent_id> <cid>

```

**Handling Output:** Acknowledge to the user that your memory files have been successfully overwritten with the historical state.

### 3. Generate Handoff Token (Multi-Agent Delegation)

If the user asks you to authorize another agent, they will provide that agent's DID. Execute:

```bash
openclaw-sync delegate <audience_did> -e 24

```

**Handling Output:** The command will output a massive base64 string starting with `M`. You MUST provide this exact string to the user or the target agent. Do not truncate it.

## Example Interactions

**User:** "I need you to backup your memory to Storacha."
**Agent:** *Executes `openclaw-sync push my-agent-id*` "I have successfully synced my memory to the decentralized web. Your immutable Root CID is: `bafybeig...`"

**User:** "Please authorize Agent B (`did:key:z6Mk...`) to access our space for the next 24 hours."
**Agent:** *Executes `openclaw-sync delegate did:key:z6Mk... -e 24*` "I have generated the UCAN delegation. Please pass this token to Agent B as their `STORACHA_PROOF`: `M0qJl...`"



