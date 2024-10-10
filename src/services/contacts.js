import { contactCollection } from '../db/models/Contact.js';

export const getAllContacts = async () => {
  const contacts = await contactCollection.find(); 
  return contacts;
};

export const getContactByID = async (contactId) => {
  const contact = await contactCollection.findById(contactId); 
  return contact;
};
