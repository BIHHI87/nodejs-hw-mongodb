import Contact from '../db/models/Contact.js';

export const getAllContactsController = async (req, res, next) => {
  const userId = req.user.id; 

  try {
    const contacts = await Contact.find({ userId }); 
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; 

  try {
    const contact = await Contact.findOne({ _id: id, userId }); 
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const createContactController = async (req, res, next) => {
  const userId = req.user.id; 
  const contactData = { ...req.body, userId }; 

  try {
    const newContact = await Contact.create(contactData);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContactController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id; 

  try {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: id, userId }, 
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    next(error);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const deletedContact = await Contact.findOneAndDelete({ _id: id, userId }); 

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.status(204).send(); 
  } catch (error) {
    next(error);
  }
};
