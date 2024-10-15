import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import multer from 'multer';

import contactsRouter from './routers/contacts.js'; // Імпортуємо роутер
import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

const PORT = Number(env('PORT', '3000'));

const app = express();

// Налаштування multer
const upload = multer(); // Зробіть налаштування за потреби

app.use(upload.none()); // Додайте цей рядок перед app.use(express.json())
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

app.use(contactsRouter); // Додаємо роутер для контактів

app.use('*', notFoundHandler); // Обробка неіснуючих маршрутів
app.use(errorHandler); // Обробка помилок

// Експортуємо функцію для запуску сервера
export const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
