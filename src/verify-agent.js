import { create } from '@web3-storage/w3up-client'

async function verify() {
  try {
    const client = await create()
    console.log('✅ Storacha Client Initialized')
    
    // FIX: Access .agent as a property, and call .did() on that
    const agentDID = client.agent.did() 
    
    console.log('Agent DID:', agentDID)
    console.log('Setup looks good for Phase 1!')
  } catch (err) {
    console.error('❌ Initialization failed:', err.message)
  }
}

verify()