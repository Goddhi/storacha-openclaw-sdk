/**
 * Phase 2: The Black Box Recorder
 * Implements immutable reasoning logs for OpenClaw agents.
 */

export async function recordReasoning(client, taskContext, reasoningSteps) {
  const agentDID = client.agent.did();
  const spaceDID = client.currentSpace()?.did();

  const logEntry = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    agent: agentDID,
    space: spaceDID,
    context: taskContext, // e.g., "Analyzing Filecoin price dip"
    trace: reasoningSteps, // Array of thought strings
    entropy: Math.random().toString(36).substring(7)
  };

  const fileName = `trace-${Date.now()}.json`;
  const files = [
    new File([JSON.stringify(logEntry, null, 2)], fileName, { type: 'application/json' })
  ];

  console.log(`\n📝 Recording reasoning trace to Storacha...`);
  const cid = await client.uploadDirectory(files);
  
  console.log(`✅ Trace Immutable: ipfs://${cid.toString()}/${fileName}`);
  return { cid, fileName };
}