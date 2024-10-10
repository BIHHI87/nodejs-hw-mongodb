import { contactCollection } from '../db/models/Contact.js';

export const getAllContacts = async () => {
  return await contactCollection.find();
};

export const getContactByID = async (contactId) => {
  return await contactCollection.findById(contactId);
};
