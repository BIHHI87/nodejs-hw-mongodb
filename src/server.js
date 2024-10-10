import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { notFoundMiddleware, errorHandlerMiddleware } from './middlewares/index.js';
import { contactService } from './services/index.js'; 

const PORT = Number(env(ENV_VARS.PORT, '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(pino({
    transport: {
      target: 'pino-pretty',
    },
  }));

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, World!',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await contactService.getAllContacts(); 
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts, 
      });
    } catch (error) {
      console.error('Error retrieving contacts:', error); 
      res.status(500).json({
        message: 'An error occurred while retrieving contacts',
        error: error.message, 
      });
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params; 
    console.log('Contact ID from request:', contactId); 

    try {
      const contact = await contactService.getContactByID(contactId); 
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.status(200).json({
        status: 200,
        message: 'Successfully found contact!',
        data: contact, 
      });
    } catch (error) {
      console.error('Error retrieving contact:', error); 
      res.status(500).json({
        message: 'An error occurred while retrieving the contact',
        error: error.message, 
      });
    }
  });

  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
