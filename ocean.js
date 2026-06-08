// ocean.js
import dotenv from 'dotenv';
dotenv.config();
/**
 * Stage 1: Ocean.io
 * Expands a single seed domain into a list of lookalike company domains.
 * @param {string} seedDomain - The input domain (e.g., 'apple.com')
 * @returns {Promise<string[]>} - Array of similar company domains
 */
async function runOcean(seedDomain) {
    console.log(`\n[Stage 1] Ocean.io: Finding   lookalikes for ${seedDomain}...`);
    
    const url = 'https://api.ocean.io/v3/search/companies';
    const apiKey = process.env.OCEAN_API_KEY; // We will set this up in a .env file later

    if (!apiKey) {
        console.error("❌ ERROR: Ocean API key is missing from environment variables.");
        return [];
    }

    const payload = {
        size: 5, // Limit to 5 companies for a snappy demo and to save credits
        companiesFilters: {
            lookalikeDomains: [seedDomain]
        }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-api-token': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Ocean.io API returned status: ${response.status}`);
        }

        const data = await response.json();

        // Check if we got results
        if (!data.companies || data.companies.length === 0) {
            console.log("⚠️ No lookalike companies found for this domain.");
            return [];
        }

        // Map through the complex response to extract just the clean string domains
        // Based on docs: data.companies[].company.domain
        const lookalikeDomains = data.companies.map(item => item.company.domain);
        
        console.log(`✅ Success! Found ${lookalikeDomains.length} lookalike domains.`);
        return lookalikeDomains;

    } catch (error) {
        // Graceful degradation: log the error but don't crash the pipeline
        console.error(`❌ [Ocean.io] Request failed: ${error.message}`);
        return [];
    }
    
}

// Export the module so our master index.js can use it
export default runOcean;