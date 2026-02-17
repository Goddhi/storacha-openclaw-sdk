/**
 * Phase 2: Memory Retrieval
 * Fetches previous reasoning traces to maintain context across agents.
 */

export async function getLatestTrace(cid, fileName) {
  const gatewayUrl = `https://${cid}.ipfs.w3s.link/${fileName}`;
  
  console.log(`\n🔍 Retrieving previous reasoning from: ${gatewayUrl}`);
  
  try {
    const response = await fetch(gatewayUrl);
    if (!response.ok) throw new Error('Failed to fetch memory from gateway');
    
    const traceData = await response.json();
    console.log(`🧠 Memory Restored: "${traceData.context}"`);
    return traceData;
  } catch (err) {
    console.error('❌ Memory Retrieval Failed:', err.message);
    return null;
  }
}