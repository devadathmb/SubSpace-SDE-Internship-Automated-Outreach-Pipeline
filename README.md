# Automated B2B Outreach Pipeline

A high-performance, modular, and resilient CLI-based outreach automation tool developed as part of the **SubSpace Project**. This project streamlines the entire lead generation-to-outreach process using a sophisticated 3-stage asynchronous pipeline.

## 🚀 Overview
This tool automates the manual effort of identifying high-value B2B prospects. It maps competitive landscapes, extracts key decision-maker contacts with verified emails, and executes personalized outreach, all managed through a human-in-the-loop safety checkpoint.

## 🏗️ Architecture
The system is built as a modular Node.js pipeline:

1.  **Stage 1: Ocean.io (Domain Expansion)**
    - Takes a seed domain (e.g., `company.com`).
    - Uses Ocean.io API to identify similar competitors in the market.
2.  **Stage 2: Prospeo (Lead Generation & Enrichment)**
    - Scans competitor domains for C-Suite/VP-level executives.
    - Uses advanced filtering and email verification to ensure high-quality lead data.
3.  **Stage 3: Brevo (Outreach Execution)**
    - Executes personalized outreach campaigns via transactional SMTP.
    - Features a **"Demo Mode" safety interceptor** to prevent accidental mass-emailing during presentations.

## 🛠️ Key Engineering Features
- **Asynchronous Pipeline:** Built with `async/await` for efficient, non-blocking API communication.
- **Safety First:** Includes a blocking terminal-based confirmation checkpoint (`readline`) before any outreach is executed.
- **Resilient Error Handling:** Implements `try/catch` blocks at every stage to ensure one API failure doesn't crash the entire pipeline.
- **Environment Security:** Uses `dotenv` to ensure sensitive API credentials are kept out of version control.
- **Demo-Safe:** Integrated interceptor allows for end-to-end live testing by routing emails to a secure test inbox rather than real recipients.

## 📋 Getting Started

### Prerequisites
- Node.js installed
- API Keys for Ocean.io, Prospeo, and Brevo

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-folder>
Install dependencies:

Bash
npm install
Configure environment variables:

Create a .env file in the root directory.

Add your keys:

#### Code snippet (.env) :
OCEAN_API_KEY=your_key
PROSPEO_API_KEY=your_key
BREVO_API_KEY=your_key

Execution
Run the pipeline:

Bash:
node index.js

🛡️ Security Note

This project uses .gitignore to protect sensitive configuration files. Ensure your .env and node_modules are never committed to your repository.
