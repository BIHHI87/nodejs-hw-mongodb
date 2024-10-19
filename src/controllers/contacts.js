import { Contact } from '../db/models/Contact.js';

export const getAllContacts = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const contacts = await Contact.find({ userId });
    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
};

export const getContactById = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const contact = await Contact.findOne({ _id: contactId, userId });

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { _id: userId } = req.user;
    const newContact = await Contact.create({ ...req.body, userId });
    res.status(201).json({ contact: newContact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create contact' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId, userId },
      req.body,
      { new: true }
    );

    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { _id: userId } = req.user;
    const deletedContact = await Contact.findOneAndDelete({
      _id: contactId,
      userId,
    });

    if (!deletedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact' });
  }
};
