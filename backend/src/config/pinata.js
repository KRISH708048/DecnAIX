// config/pinata.js
import pinataSDK from '@pinata/sdk';

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Verify credentials are loaded
if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
  throw new Error('Pinata credentials missing from .env file');
}

const pinata = new pinataSDK(
  process.env.PINATA_API_KEY, 
  process.env.PINATA_SECRET_API_KEY
);

pinata.testAuthentication()
  .then(() => console.log('Pinata authentication successful'))
  .catch(err => console.error('Pinata authentication failed:', err));

export default pinata;
