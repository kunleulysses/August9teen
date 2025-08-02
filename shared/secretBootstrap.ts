import { loadSecret } from './loadSecret';
const secretNames = [
  'OPENAI_API_KEY',
  'GEMINI_API_KEY',
  'VENICE_API_KEY',
  'POSTGRES_PASSWORD',
  'API_JWT_SECRET',
  'CLOUDFLARE_API_TOKEN',
  'GF_SECURITY_ADMIN_PASSWORD'
];
secretNames.forEach(loadSecret);