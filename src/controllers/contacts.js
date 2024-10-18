import createHttpError from 'http-errors';
import { Contact } from '../db/models/Contact.js';

export const getContactsController = async (req, res, next) => {
    try {
        const contacts = await Contact.find({ userId: req.user._id }); 
        res.status(200).json({ status: 'success', data: contacts });
    } catch (error) {
        next(createHttpError(500, 'Internal Server Error'));
    }
};

export const createContactController = async (req, res, next) => {
    try {
        const { name, phone } = req.body; 
        const newContact = new Contact({ name, phone, userId: req.user._id }); 
        await newContact.save();
        res.status(201).json({
            status: 'success',
            message: 'Contact created successfully',
            data: newContact
        });
    } catch (error) {
        next(createHttpError(500, 'Internal Server Error'));
    }
};
