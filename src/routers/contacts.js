import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContacts);
router.get('/:contactId', getContactById);
router.post('/', createContact);
router.put('/:contactId', updateContact);
router.delete('/:contactId', deleteContact);

export default router;
