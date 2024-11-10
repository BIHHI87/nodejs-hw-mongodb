import createHttpError from 'http-errors';
import swaggerUI from 'swagger-ui-express';
import fs from 'node:fs';
import { SWAGGER_PATH } from '../constants/index.js';

export const swaggerDocuments = (req, res, next) => {
  try {
    const swaggerFileContent = fs.readFileSync(SWAGGER_PATH, 'utf-8');
    const swaggerDoc = JSON.parse(swaggerFileContent); 
    swaggerUI.setup(swaggerDoc)(req, res, next);
  } catch (error) {
    console.error("Failed to load Swagger documentation:", error.message);
    next(createHttpError(500, "Can't load swagger docs"));
  }
};

export const swaggerDocs = [swaggerUI.serve, swaggerDocuments];
