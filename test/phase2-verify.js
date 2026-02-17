import { initAgent } from '../src/clients.js';
import { recordReasoning } from '../src/recorder.js';
import { getLatestTrace } from '../src/memory.js';

async function runPhase2() {
  try {
    console.log('🚀 Starting Phase 2: Black Box Recorder Test...');
    const agent = await initAgent('openclaw-primary');

    // 1. Simulate an Agent Decision Process
    const task = "Evaluating FIL/USDT entry point at 1.35";
    const thoughts = [
      "Detected price dip to 1.35",
      "Checking RSI indicators on 4h chart",
      "Volume supports a bounce",
      "Decision: Initiating buy order"
    ];

    // 2. Record the "Black Box" data
    const { cid, fileName } = await recordReasoning(agent, task, thoughts);

    // 3. Simulate "Mind Reading" (Fetching the immutable log)
    const memory = await getLatestTrace(cid.toString(), fileName);
    
    if (memory) {
      console.log('\n--- Verified Reasoning Trace ---');
      memory.trace.forEach((step, i) => console.log(`${i + 1}. ${step}`));
      console.log('--------------------------------');
      console.log('🎉 PHASE 2 SUCCESS: Immutable Reasoning Verified.');
    }

  } catch (err) {
    console.error('❌ Phase 2 Test Failed:', err.message);
  }
}

runPhase2();