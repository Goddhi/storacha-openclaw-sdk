import { initAgent } from '../src/clients.js'
import { createHandoff, claimHandoff } from '../src/handoff.js'

async function runTest() {
  try {
    console.log('🚀 Starting Phase 1 Integration Test...')
    
    // 1. Setup Agent A (The Primary)
    // This agent must have been registered already via bootstrap.js
    console.log('\nInitializing Agent A (Primary)...')
    const agentA = await initAgent('openclaw-primary')
    const space = agentA.currentSpace()
    
    if (!space) {
      console.error('❌ Agent A has no space. Run node src/bootstrap.js first!')
      return
    }
    console.log(`Agent A is authorized for Space: ${space.did()}`)

    // 2. Setup Agent B (The Successor)
    // This agent starts with NO permissions.
    console.log('\nInitializing Agent B (Successor)...')
    const agentB = await initAgent('openclaw-successor')

    // 3. Perform Handoff (The "Baton Pass")
    console.log('\n--- Phase 1: Delegation (Creating Baton) ---')
    const handoffBuffer = await createHandoff(agentA, agentB.agent.did())
    
    console.log('--- Phase 1: Claiming (Receiving Baton) ---')
    await claimHandoff(agentB, handoffBuffer)
    
    // 4. Verification
    // Agent B now uses the delegated authority to act on Agent A's space
    console.log('\n--- Phase 1: Verification ---')
    
    const spaceDID = space.did()
    console.log(`Attempting to set Agent B context to: ${spaceDID}`)
    
    // This will now succeed because Agent B has the proof in its store
    await agentB.setCurrentSpace(spaceDID)
    
    console.log(`✅ Successor Agent B is now operating in Space: ${agentB.currentSpace().did()}`)
    
    // Perform a test upload to confirm write access
    console.log('Performing test upload as Agent B...')
    const files = [
      new File(['OpenClaw Hive Mind - Phase 1 Verified'], 'proof.txt', { type: 'text/plain' })
    ]
    
    const rootCID = await agentB.uploadDirectory(files)
    
    console.log('\n***************************************************')
    console.log('🎉 PHASE 1 SUCCESS: DECENTRALIZED FOUNDATION READY')
    console.log(`Memory Snapshot CID: ${rootCID.toString()}`)
    console.log('***************************************************')

  } catch (err) {
    console.error('\n❌ Test failed:', err.message)
    if (err.stack) console.error(err.stack)
  }
}

runTest()