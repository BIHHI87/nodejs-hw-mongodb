import dotenv from 'dotenv';

dotenv.config();

console.log('Environment Variables:', process.env);

export function env(name, defaultValue) {
  console.log(`${name}:`, process.env[name]); 

  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}
