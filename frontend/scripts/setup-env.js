import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Créer .env.production si les variables sont définies
const envContent = `VITE_API_URL=${process.env.VITE_API_URL || 'https://happy-hope-production.up.railway.app/api'}
VITE_SOCKET_URL=${process.env.VITE_SOCKET_URL || 'https://happy-hope-production.up.railway.app'}
`;

fs.writeFileSync(path.join(__dirname, '..', '.env.production'), envContent);
console.log('✅ .env.production créé avec:', envContent);

