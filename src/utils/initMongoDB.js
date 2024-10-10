import mongoose from 'mongoose';
import { env } from './env.js';
import { MONGO_DB_VARS } from '../constants/index.js';

export const initMongoDB = async () => {
  try {
    const user = env(MONGO_DB_VARS.MONGO_USER);
    const password = env(MONGO_DB_VARS.MONGO_PASSWORD);
    const db = env(MONGO_DB_VARS.MONGO_DB);

    // Формуємо правильний URL без зайвих частин
    const url = `mongodb+srv://${BIHHI87}:${WfJdChrlQoSkDDBz}@bihhi87.7q1o4.mongodb.net/${db}?retryWrites=true&w=majority`;

    await mongoose.connect(url);

    console.log('MongoDB connection successfuly');
  } catch (error) {
    console.log('Error while connection to MongoDB', error);
    throw error;
  }
};
