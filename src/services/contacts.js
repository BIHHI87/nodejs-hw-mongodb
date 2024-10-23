import ContactCollection from '../db/models/Contact.js';

export const getContacts = async ({ perPage, page, sortBy, sortOrder, filter }) => {
  const contacts = await ContactCollection.find({ userId: filter.userId })
    .sort({ [sortBy]: sortOrder })
    .skip((page - 1) * perPage)
    .limit(perPage);

  return contacts;
};

export const getContact = async (filter) => {
  return ContactCollection.findOne(filter);
};

export const createContact = async (data) => {
  const newContact = new ContactCollection(data);
  return await newContact.save();
};

export const updateContact = async (filter, update, options = {}) => {
  const updatedContact = await ContactCollection.findOneAndUpdate(filter, update, {
    new: true,
    ...options,
  });
  
  return {
    isNew: options.upsert && updatedContact ? false : true,
    data: updatedContact,
  };
};

export const deleteContact = async (filter) => {
  return ContactCollection.findOneAndDelete(filter);
};
