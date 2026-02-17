import { initAgent } from './clients.js';

async function bootstrap() {
  try {
    const client = await initAgent('openclaw-primary');
    const email = 'charlesgodwill22@gmail.com'; 

    console.log(`--- Logging in as ${email} ---`);
    // login() sends the email and waits for you to click the link
    const account = await client.login(email);
    console.log('✅ Identity verified! Now setting up the Space...');

    // Wait for a payment plan to be active (even the free tier)
    await account.plan.wait(); 

    console.log('\nCreating a new Space for OpenClaw...');
    const space = await client.createSpace('OpenClaw-Dev-Space');
    
    // LINK the space to your account so it has a provider
    await account.provision(space.did());
    
    await client.setCurrentSpace(space.did());
    console.log(`\n🎉 SUCCESS! Space ${space.did()} is provisioned and ready.`);
    console.log('You can now run: node test/phase1-verify.js');

  } catch (err) {
    console.error('❌ Bootstrap failed:', err.message);
    console.log('Ensure you have a plan selected at https://console.storacha.network');
  }
}

bootstrap();