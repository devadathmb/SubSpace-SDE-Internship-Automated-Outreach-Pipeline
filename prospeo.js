import dotenv from 'dotenv';
dotenv.config();

export default async function runProspeo(domains) {
    console.log(`\n[Stage 2] Starting Prospeo Lead Generation & Enrichment...`);
    const API_KEY = process.env.PROSPEO_API_KEY;
    const validLeads = [];

    if (!API_KEY) {
        console.error("❌ Missing PROSPEO_API_KEY in .env file.");
        return validLeads;
    }

    if (!domains || domains.length === 0) {
        console.log("⚠️ No domains provided to Prospeo.");
        return validLeads;
    }

    try {
        console.log(`🔍 Searching for C-Suite/VP executives at ${domains.length} domains...`);

        // STEP 1: Search Person API
        const searchResponse = await fetch('https://api.prospeo.io/search-person', {
            method: 'POST',
            headers: {
                'X-KEY': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filters: {
                    company: {
                        websites: { include: domains }
                    },
                    person_seniority: { include: ["C-Suite", "Vice President", "Founder/Owner"] }
                }
            })
        });

        const searchData = await searchResponse.json();
        console.log("Raw Prospeo Response:", JSON.stringify(searchData, null, 2));
        if (searchData.error || !searchData.results || searchData.results.length === 0) {
            console.log("⚠️ No executives found for these domains.");
            return validLeads;
        }

        console.log(`✅ Found ${searchData.results.length} potential executives. Starting enrichment...`);

        // STEP 2: Enrich Person API
        for (const lead of searchData.results) {
            const personId = lead.person.person_id;
            const name = lead.person.full_name;
            const title = lead.person.current_job_title;
            const linkedin = lead.person.linkedin_url;
            const company = lead.company ? lead.company.name : "Unknown Company";

            console.log(`   -> Enriching ${name} (${title} at ${company})...`);

            const enrichResponse = await fetch('https://api.prospeo.io/enrich-person', {
                method: 'POST',
                headers: {
                    'X-KEY': API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    only_verified_email: true,
                    data: {
                        person_id: personId
                    }
                })
            });

            const enrichData = await enrichResponse.json();

            // Extract the email if the request was successful and the email exists
            if (!enrichData.error && enrichData.person && enrichData.person.email && enrichData.person.email.email) {
                const email = enrichData.person.email.email;
                console.log(`      ✔️ Verified Email Found: ${email}`);
                validLeads.push({
                    name,
                    title,
                    company,
                    linkedin,
                    email
                });
            } else {
                console.log(`      ✖️ No verified email found for ${name}. Skipping.`);
            }
        }

    } catch (error) {
        console.error("❌ Prospeo API Error:", error.message);
    }

    console.log(`\n✅ Stage 2 Complete: ${validLeads.length} highly qualified leads ready for outreach.`);
    return validLeads;
}
