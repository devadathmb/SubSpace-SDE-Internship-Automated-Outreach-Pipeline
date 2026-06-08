import * as readline from 'readline';
import runOcean from './ocean.js';
import runProspeo from './prospeo.js';
import runBrevo from './brevo.js';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("========================================");
console.log("🚀 AUTOMATED OUTREACH PIPELINE STARTED");
console.log("========================================\n");

rl.question("Enter seed domain (e.g., stripe.com): ", async (seedDomain) => {
    try {
        // --- STAGE 1: OCEAN.IO ---
        const lookalikeDomains = await runOcean(seedDomain);
        if (!lookalikeDomains || lookalikeDomains.length === 0) {
            console.log("Pipeline aborted at Stage 1.");
            process.exit(1);
        }

        // --- STAGE 2: PROSPEO ---
        const leads = await runProspeo(lookalikeDomains);
        if (!leads || leads.length === 0) {
            console.log("Pipeline aborted at Stage 2.");
            process.exit(1);
        }

        // --- STAGE 3: BREVO & SAFETY CHECKPOINT ---
        console.log("\n=======================================================");
        console.log(`🛑 SAFETY CHECKPOINT: ${leads.length} LEADS READY`);
        console.log(`🛡️  DEMO MODE ACTIVE: All emails will safely route to test inbox.`);
        console.log("=======================================================");
        
        // Displays a clean, professional table in the terminal
        console.table(leads, ['name', 'title', 'company', 'email']);

        rl.question("\nAre you sure you want to fire Demo emails? (Y/N): ", async (answer) => {
            if (answer.toLowerCase() === 'y') {
                console.log("\n[Stage 3] Initiating Brevo Demo Email Sequence...");
                
                for (const lead of leads) {
                    await runBrevo(lead);
                }
                
                console.log("\n✅ Pipeline execution completed successfully!");
            } else {
                console.log("\n🛑 Outreach aborted by user. No emails were sent.");
            }
            rl.close();
        });

    } catch (error) {
        console.error("Pipeline crashed:", error);
        rl.close();
    }
});