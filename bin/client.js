#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk'; 
import dotenv from 'dotenv';
import { syncAgentToStoracha, restoreAgentFromStoracha } from '../src/index.js';
import { generateHandoffToken } from '../src/handoff.js';

dotenv.config();

const program = new Command();

program
  .name('openclaw-sync')
  .description('Sync OpenClaw agent memory to the Storacha decentralized network')
  .version('1.0.0');

program
  .command('push')
  .description('Push local agent memory to Storacha')
  .argument('<agentId>', 'The ID of the OpenClaw agent/workspace')
  .action(async (agentId) => {
    console.log(chalk.blue(`\n🚀 Initializing OpenClaw-Storacha Bridge...`));
    
    try {
      const cid = await syncAgentToStoracha(agentId);
      
      console.log(chalk.green(`\n✅ Success!`));
      console.log(chalk.bold(`Agent ID: `) + agentId);
      console.log(chalk.bold(`Root CID: `) + chalk.cyan(cid));
      console.log(chalk.dim(`View on IPFS gateway: `) + chalk.underline(`https://${cid}.ipfs.storacha.link/`));
      console.log(chalk.dim(`View in Storacha's Console: `) + chalk.underline(`https://console.storacha.network`));
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Sync Failed:`));
      console.error(chalk.yellow(error.message));
      
      if (error.message.includes('STORACHA_PROOF')) {
        console.log(chalk.dim('\nTip: Ensure STORACHA_PROOF is set in your .env file.'));
      }
      
      process.exit(1);
    }
  });

  program
  .command('pull')
  .description('Restore local agent memory from a Storacha CID')
  .argument('<agentId>', 'The ID of the OpenClaw agent to restore')
  .argument('<cid>', 'The Storacha Root CID')
  .action(async (agentId, cid) => {
    console.log(chalk.blue(`\n📥 Connecting to Storacha Gateway...`));
    
    try {
      await restoreAgentFromStoracha(agentId, cid);
      
      console.log(chalk.green(`\n✅ Restore Complete!`));
      console.log(chalk.bold(`Agent ID: `) + agentId);
      console.log(chalk.dim(`The agent's memory has been successfully written to ~/.openclaw/\n`));
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Restore Failed:`));
      console.error(chalk.yellow(error.message));
      process.exit(1);
    }
  });
  
program
  .command('delegate')
  .description('Generate a scoped UCAN for another agent to upload memory')
  .argument('<audienceDid>', 'The DID of the receiving agent (Agent B)')
  .option('-e, --expires <hours>', 'Hours until the token expires', '24')
  .action(async (audienceDid, options) => {
    console.log(chalk.blue(`\n🔐 Forging UCAN Delegation...`));
    
    try {
      const token = await generateHandoffToken(audienceDid, parseInt(options.expires));
      
      console.log(chalk.green(`\n✅ Handoff Token Generated!`));
      console.log(chalk.bold(`Audience: `) + audienceDid);
      console.log(chalk.bold(`Expires in: `) + options.expires + ` hours`);
      console.log(chalk.dim(`\nPass this string to Agent B as their STORACHA_PROOF:`));
      console.log(chalk.yellow(token) + `\n`);
      
    } catch (error) {
      console.error(chalk.red(`\n❌ Delegation Failed:`));
      console.error(chalk.yellow(error.message));
      process.exit(1);
    }
  });
program.parse();