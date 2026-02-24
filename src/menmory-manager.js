import path from 'path';
import os from 'os';
import fs from 'fs';
import { filesFromPaths } from 'files-from-path';

export class MemoryManager {
  /**
   * Resolves the local paths for an agent's memory files.
   * @param {string} agentId - The ID of the agent/workspace.
   */
  static async getFiles(agentId) {
    const home = os.homedir();
    // Path mapping based on OpenClaw's standard structure
    const workspaceDir = path.join(home, '.openclaw', 'workspaces', agentId);
    
    const filesToSync = [
      path.join(workspaceDir, 'MEMORY.md'),
      path.join(home, '.openclaw', 'workspaces', agentId, 'SOUL.md'),
      path.join(workspaceDir, 'agent.sqlite') 
    ];

    // Filter only existing files to avoid errors
    const existingFiles = filesToSync.filter(f => fs.existsSync(f));
    
    if (existingFiles.length === 0) {
      throw new Error(`No memory files found for agent: ${agentId}`);
    }

    return await filesFromPaths(existingFiles);
  }
}