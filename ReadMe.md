### Storacha Hive Mind" Skill. 
This enables Storacha to be the state management & memory layer for autonomous agents.

Core Features:
State Sync : Agents can dump their context window/memory to Storacha and restore it later. This solves the "local-only" limitation of OpenClaw and allows agents to persist across reboots.

Secure Handoffs (UCANs): Agent A can complete a task, save the state, and generate a UCAN delegation for Agent B to pick up exactly where A left off. This unlocks multi-agent coordination.