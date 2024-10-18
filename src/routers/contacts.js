import express from 'express';
import { getContactsController, createContactController } from '../controllers/contacts.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = express.Router();

router.get('/', authenticate, getContactsController);
router.post('/', authenticate, createContactController);

export default router;
