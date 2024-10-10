import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import { ENV_VARS } from './constants/index.js';
import { notFoundMiddleware, errorHandlerMiddleware } from './middlewares/index.js';
import { studentService } from './services/index.js';
import { contactService } from './services/index.js'; 

const PORT = Number(env(ENV_VARS.PORT, '3000'));

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello, World!',
    });
  });

  app.get('/students', async (req, res) => {
    const students = await studentService.getAllStudents();
    res.status(200).json({
      students,
    });
  });

  app.get('/students/:studentId', async (req, res) => {
    const { studentId } = req.params;
    const student = await studentService.getStudentById(studentId);
    res.status(200).json({
      student,
    });
  });

  app.get('/contacts/:contactId', async (req, res) => {
    const { contactId } = req.params; 
    try {
      const contact = await contactService.getContactByID(contactId); 
      if (!contact) {
        return res.status(404).json({
          message: 'Contact not found',
        });
      }

      res.status(200).json({
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
