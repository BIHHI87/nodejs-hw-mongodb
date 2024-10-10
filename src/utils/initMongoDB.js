import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const initMongoDB = async () => {
  try {
    const user = process.env.MONGO_USER;
    const password = process.env.MONGO_PASSWORD;
    const url = process.env.MONGO_URL;
    const dbName = process.env.MONGO_DB;

    const connectionString = `mongodb+srv://${user}:${password}@${url}/${dbName}?retryWrites=true&w=majority`;

    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection failed:', error);
    process.exit(1);
  }
};

export { initMongoDB }; 