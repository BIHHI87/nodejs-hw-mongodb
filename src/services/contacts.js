import { Contact } from '../db/models/Contact.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current directory:', __dirname); 

export const getAllContacts = async () => {
  const contacts = await Contact.find(); 
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId); 
  return contact;
};
