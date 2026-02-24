import { create } from '@storacha/client';
import { StoreMemory } from '@storacha/client/stores/memory';
import * as Proof from '@storacha/client/proof';
import { Signer } from '@storacha/client/principal/ed25519';
import dotenv from 'dotenv';

dotenv.config();

export async function initStorachaClient() {
  const encodedProof = process.env.STORACHA_PROOF;
  const encodedKey = process.env.STORACHA_AGENT_KEY;

  if (!encodedProof) {
    throw new Error("Missing STORACHA_PROOF in environment variables.");
  }
  if (!encodedKey) {
    throw new Error("Missing STORACHA_AGENT_KEY in environment variables.");
  }

  // 1. Parse the Principal (Agent Identity)
  const principal = Signer.parse(encodedKey);

  // 2. Initialize the Memory Store
  const store = new StoreMemory();

  // 3. Create the Base Client
  const client = await create({ principal, store });

  // 4. Parse the Delegation Proof
  // No more 'M' prefix hacking! The official parser handles the 'm' perfectly.
  const proof = await Proof.parse(encodedProof);

  // 5. Apply the Proof and Set the Space
  const space = await client.addSpace(proof);
  await client.setCurrentSpace(space.did());

  return client;
}