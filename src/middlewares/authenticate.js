import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import { Session } from '../db/models/Session.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createHttpError(401, 'No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ userId: decoded.id, accessToken: token });
    
    if (!session || session.accessTokenValidUntil < new Date()) {
      return next(createHttpError(401, 'Access token expired'));
    }

    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return next(createHttpError(401, 'Invalid token'));
  }
};
