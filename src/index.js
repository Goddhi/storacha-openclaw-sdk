import { initStorachaClient } from './client.js';
import { MemoryManager } from './memory-manager.js';
import fs from 'fs';
import path from 'path';
import os from 'os';

/**
 * The main "Sync" function. 
 * This is what powers the decentralized storage layer.
 */
export async function syncAgentToStoracha(agentId) {
  console.log(`[SDK] Starting decentralized sync for agent: ${agentId}...`);

  // 1. Setup Auth
  const client = await initStorachaClient();

  // 2. Locate Memory
  const files = await MemoryManager.getFiles(agentId);

  // 3. Bundle & Upload
  const rootCID = await client.uploadDirectory(files);

  console.log(`[SDK] Sync Complete! Root CID: ${rootCID}`);
  return rootCID;
}

/**
 * Pulls the agent's memory from Storacha and restores it locally.
 */
export async function restoreAgentFromStoracha(agentId, cid) {
  console.log(`[SDK] Starting decentralized restore for agent: ${agentId}...`);
  
  const home = os.homedir();
  const workspaceDir = path.join(home, '.openclaw', 'workspaces', agentId);
  const memoryDir = path.join(home, '.openclaw', 'memory');

  // 1. Ensure the local OpenClaw directories exist on this machine
  fs.mkdirSync(workspaceDir, { recursive: true });
  fs.mkdirSync(memoryDir, { recursive: true });

  // 2. Define the files we expect to be in the CID bundle
  const filesToFetch = [
    { name: 'MEMORY.md', dest: path.join(workspaceDir, 'MEMORY.md') },
    { name: `${agentId}.sqlite`, dest: path.join(memoryDir, `${agentId}.sqlite`) }
  ];

  // 3. Download and restore each file
  for (const file of filesToFetch) {
    const url = `https://${cid}.ipfs.storacha.link/${file.name}`;
    console.log(`[SDK] Fetching ${file.name} from Gateway...`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 404 || response.status === 400) {
        console.log(`[SDK] Note: ${file.name} not found in this CID. Skipping.`);
        continue;
      }
      throw new Error(`Gateway returned ${response.status} for ${file.name}`);
    }

    // Read the file as a buffer and write it to the OpenClaw directory
    const arrayBuffer = await response.arrayBuffer();
    fs.writeFileSync(file.dest, Buffer.from(arrayBuffer));
    console.log(`[SDK] Restored -> ${file.dest}`);
  }

  return true;
}