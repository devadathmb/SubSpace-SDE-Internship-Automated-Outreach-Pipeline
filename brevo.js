import dotenv from 'dotenv';
dotenv.config();

export default async function runBrevo(lead) {
    const API_KEY = process.env.BREVO_API_KEY;
    
    // 1. BREVO SENDER EMAIL 
    const SENDER_EMAIL = "hello@devadath-pipeline.xyz"; 
    
    // 2. PERSONAL GMAIL FOR DEMO ROUTING
    const DEMO_RECIPIENT_EMAIL = "devadathmb98@gmail.com"; 

    if (!API_KEY) {
        console.error("❌ Missing BREVO_API_KEY in .env file.");
        return false;
    }

    /* ===================================================================
    🚨 REAL MODE PAYLOAD (COMMENTED OUT FOR SAFETY) 🚨
    WARNING: Uncommenting this block will send actual emails to the 
    scraped executives (lead.email). Do not use this during the demo!
    ===================================================================
    
    const payload = {
        sender: { name: "Devadath M B", email: SENDER_EMAIL },
        to: [{ email: lead.email, name: lead.name }], 
        subject: `Partnership Inquiry for ${lead.company}`,
        htmlContent: `
            <p>Hi ${lead.name},</p>
            <p>I noticed your incredible work as ${lead.title} at ${lead.company}. I am currently building an automated outreach pipeline and would love to connect!</p>
            <p>Best regards,<br>Devadath</p>
        `
    };
    */


    // ===================================================================
    // 🛡️ DEMO MODE PAYLOAD 🛡️
    // Safely overrides the recipient to your personal inbox and adds a banner.
    // ===================================================================
    const payload = {
        sender: { name: "Devadath M B", email: SENDER_EMAIL },
        to: [{ email: DEMO_RECIPIENT_EMAIL, name: "Demo User" }], 
        subject: `[DEMO] Partnership Inquiry for ${lead.company}`,
        htmlContent: `
            <div style="background-color: #f8d7da; color: #721c24; padding: 15px; border-radius: 5px; margin-bottom: 20px; font-family: sans-serif;">
                <h3 style="margin-top: 0;">🚨 DEMO MODE INTERCEPT 🚨</h3>
                <p style="margin-bottom: 0;">This email was successfully generated but caught by the safety override. It was originally intended for:</p>
                <ul style="margin-top: 5px;">
                    <li><strong>Name:</strong> ${lead.name}</li>
                    <li><strong>Title:</strong> ${lead.title}</li>
                    <li><strong>Company:</strong> ${lead.company}</li>
                    <li><strong>Original Scraped Email:</strong> ${lead.email}</li>
                </ul>
            </div>
            <hr>
            <p>Hi ${lead.name},</p>
            <p>I noticed your incredible work as ${lead.title} at ${lead.company}. I am currently building an automated outreach pipeline and would love to connect!</p>
            <p>Best regards,<br>Devadath</p>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': API_KEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            // Updated console log to handle both modes dynamically based on the payload subject
            const modeTag = payload.subject.includes("[DEMO]") ? "[DEMO MODE]" : "[LIVE MODE]";
            const targetEmail = payload.subject.includes("[DEMO]") ? "test inbox" : lead.email;
            console.log(`      📧 ${modeTag} Email for ${lead.name} safely routed to ${targetEmail}.`);
            return true;
        } else {
            const errorData = await response.json();
            console.error(`      ❌ Failed to send for ${lead.name}:`, errorData.message);
            return false;
        }
    } catch (error) {
        console.error(`      ❌ Brevo API Error for ${lead.name}:`, error.message);
        return false;
    }
}