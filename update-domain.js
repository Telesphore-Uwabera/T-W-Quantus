import { NetlifyAPI } from 'netlify';
import fs from 'fs';

const client = new NetlifyAPI(process.env.NETLIFY_AUTH_TOKEN || '');

async function updateDomain() {
  try {
    const siteId = '9999ea8a-90f9-424b-a3f2-98c72805c2ed';
    const result = await client.updateSite({
      site_id: siteId,
      body: {
        custom_domain: 'twquantus.com'
      }
    });
    console.log('Successfully updated domain:', result.custom_domain);
    
    // Also check if we can add www alias if it's not automatic
    // Actually Netlify usually handles www if the naked domain is added.
  } catch (error) {
    console.error('Error updating domain:', error);
    process.exit(1);
  }
}

updateDomain();
