// src/handoff.js
import * as Signer from '@storacha/client/principal/ed25519';
import * as Proof from '@storacha/client/proof';
import { delegate } from '@ucanto/client';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Generates a scoped UCAN delegation for another agent.
 * @param {string} audienceDid - The DID of the receiving agent (Agent B).
 * @param {number} expirationHours - How long the token is valid.
 */
export async function generateHandoffToken(audienceDid, expirationHours = 24) {
  const encodedKey = process.env.STORACHA_AGENT_KEY;
  const encodedProof = process.env.STORACHA_PROOF;

  if (!encodedKey || !encodedProof) {
    throw new Error("Missing master credentials in .env to sign a delegation.");
  }

  console.log(`[SDK] Generating Handoff Token for: ${audienceDid}`);

  // 1. Load Agent A's Identity (The Issuer)
  const issuer = Signer.parse(encodedKey);

  // 2. Load the Master Proof (The Authority to delegate)
  const proof = await Proof.parse(encodedProof);
  const spaceDid = proof.capabilities[0].with;

  // 3. Create the Delegation for Agent B (The Audience)
  // We restrict this to just 'blob/add' and 'index/add' for safety.
  const expiration = Math.floor(Date.now() / 1000) + (expirationHours * 60 * 60);

  const delegation = await delegate({
    issuer,
    audience: { did: () => audienceDid }, // Agent B's identity
    capabilities: [
      {
        can: 'space/blob/add',
        with: spaceDid
      },
      {
        can: 'space/index/add',
        with: spaceDid
      }
    ],
    proofs: [proof],
    expiration
  });

  // 4. Export the token as a base64pad string for easy transport
  const archive = await delegation.archive();
  const base64Token = `M${Buffer.from(archive.ok).toString('base64')}`;

  return base64Token;
}