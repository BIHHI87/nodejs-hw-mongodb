import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';

export const getContactsController = async (req, res, next) => {
  try {
    const { page = 1, perPage = 10, sortBy = '_id', sortOrder = 'asc', ...filter } = req.query;
    const contacts = await getAllContacts({
      page: Number(page),
      perPage: Number(perPage),
      sortBy,
      sortOrder,
      filter,
    });
    res.json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data: contacts.data,
        page: Number(page),
        perPage: Number(perPage),
        totalItems: contacts.totalItems,
        totalPages: contacts.totalPages,
        hasPreviousPage: contacts.hasPreviousPage,
        hasNextPage: contacts.hasNextPage,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
    res.json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const createContactController = async (req, res, next) => {
  try {
    const contact = await createContact(req.body);
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
    res.json({
      status: 200,
      message: 'Successfully updated the contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await deleteContact(contactId);
    if (!contact) {
      return next(createHttpError(404, 'Contact not found'));
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
