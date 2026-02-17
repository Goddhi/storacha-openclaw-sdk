import * as DID from '@ipld/dag-ucan/did'
import { extract } from '@web3-storage/w3up-client/delegation'

export async function createHandoff(client, agentBDIDString) {
  const audience = DID.parse(agentBDIDString)
  
  // Standard Storacha capabilities Agent A actually possesses
  const abilities = [
    'upload/add', 
    'store/add', 
    'space/info',
    'blob/add',
    'index/add'
  ]

  const delegation = await client.createDelegation(
    audience,
    abilities,
    { expiration: Math.floor(Date.now() / 1000) + 86400 } 
  )

  const archive = await delegation.archive()
  if (archive.error) throw new Error(archive.error.message)
  
  return archive.ok 
}

export async function claimHandoff(client, archiveBuffer) {
  // 1. Extract the Delegation from the CAR buffer
  const result = await extract(archiveBuffer)
  if (result.error) throw new Error(result.error.message)

  // 2. addProof stores the UCAN in the agent's local state
  const delegation = result.ok
  await client.addProof(delegation)
  
  // 3. IMPORTANT: You must 'claim' the delegated access from the network.
  // This syncs the delegation we just added locally with the Storacha service.
  await client.capability.access.claim() 
  
  console.log('✅ Handoff accepted and authority claimed.')
  return delegation
}