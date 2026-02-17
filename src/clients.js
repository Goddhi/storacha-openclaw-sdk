import { create } from '@web3-storage/w3up-client'
import { StoreConf } from '@web3-storage/w3up-client/stores/conf'

export async function initAgent(profileName = 'openclaw-agent') {
  const client = await create({
    store: new StoreConf({ profile: profileName })
  })
  console.log(`Agent identity loaded: ${client.agent.did()}`)
  return client
}