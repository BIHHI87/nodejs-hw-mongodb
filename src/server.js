import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import multer from 'multer';

import contactsRouter from './routers/contacts.js'; 

import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

const app = express();

const upload = multer();

app.use(upload.none()); 
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
    message: 'Hello World!',
  });
});

app.use(contactsRouter); 

app.use('*', notFoundHandler); 
app.use(errorHandler); 

export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
