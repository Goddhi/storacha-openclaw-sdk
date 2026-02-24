# Storacha OpenClaw SDK (openclaw-sync)

A decentralized memory bridge and multi-agent coordination layer for OpenClaw.

This SDK solves the "local-only" limitation of OpenClaw agents by allowing them to dump their context window, vector databases, and long-term memory into immutable Content Archives (CARs), push them to the **Storacha** network, and securely delegate access to other agents using **UCANs** (User Controlled Authorization Networks).

---

## 🌟 Core Features

* **State Sync (Push/Pull):** Backup an agent's `MEMORY.md` and RAG SQLite index to the decentralized web. Restore an agent on a completely fresh machine using just a Root CID.
* **Secure Multi-Agent Handoffs:** Agent A can sign a time-bound, cryptographically secure UCAN token permitting Agent B to upload to Agent A's space—without ever sharing master private keys.
* **Headless & DevOps Ready:** Designed specifically for CI/CD pipelines, Docker containers, and automated LLM skill execution. No interactive browser logins required.

---

## 📦 Installation

Ensure you are using Node.js (v18+ recommended) and have initialized your project with ES Modules (`"type": "module"` in `package.json`).

```bash
# Clone the repository
git clone https://github.com/goddhi/storacha-openclaw-sdk.git
cd storacha-openclaw-sdk

# Install dependencies
npm install

# Make the CLI executable globally (optional but recommended)
npm link

```

---

## ⚙️ Configuration

The SDK requires a `.env` file at the root of the project to authenticate headlessly with Storacha.

1. Generate your agent's identity and proof using the `@storacha/cli`:

```bash
npm install -g @storacha/cli
storacha login

# Generate the agent's private key
storacha key create --json > openclaw-key.json

# Generate the Delegation Proof (Replace <AUDIENCE_DID> with the DID from openclaw-key.json)
storacha delegation create <AUDIENCE_DID> -c 'space/blob/add' -c 'space/index/add' -c 'upload/add' --base64

```

2. Create your `.env` file:

```env
# The private key generated in step 1 (Starts with Mg...)
STORACHA_AGENT_KEY="Mg..." 

# The base64 delegation string generated in step 1 (Starts with M...)
STORACHA_PROOF="M0qJl..." 

```

*Note: Ensure your `STORACHA_PROOF` is a single continuous string with no line breaks.*

---

## 🚀 CLI Usage

### 1. Push (Backup Memory)

Scans `~/.openclaw/workspaces/<agent-id>` and `~/.openclaw/memory/`, bundles the state, and pushes to Storacha.

```bash
openclaw-sync push <agent-id>
# Example: openclaw-sync push goddhi-dev

```

*Outputs a verifiable Root CID (e.g., `bafy...`) and Gateway link.*

### 2. Pull (Restore Memory)

Fetches an agent's historical state from a Storacha CID and safely restores it to the local OpenClaw directories.

```bash
openclaw-sync pull <agent-id> <cid>
# Example: openclaw-sync pull goddhi-dev bafybeig...

```

### 3. Delegate (Secure Agent Handoff)

Generates a scoped UCAN token granting another agent upload rights for a specific duration.

```bash
# Generates a token valid for 24 hours for the target DID
openclaw-sync delegate <target-agent-did> -e 24

```

*Pass the resulting output to Agent B to use as their `STORACHA_PROOF`.*

---

## 🤖 OpenClaw Integration (SKILL.md)

To give your OpenClaw LLM the ability to trigger these commands autonomously, copy the provided `SKILL.md` file into your OpenClaw agent's `skills/` directory.

```bash
cp skills/SKILL.md ~/.openclaw/skills/storacha-sync.md

```

Once installed, you can naturally prompt your agent:

> *"I'm spinning down this server. Save your state to Storacha."*
> *"Task complete. Generate a 12-hour handoff token for Agent B (did:key:z6Mk...)."*

---
