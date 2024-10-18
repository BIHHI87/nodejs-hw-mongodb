import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../db/models/user.js';
import { Session } from '../db/models/session.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hashedPassword });

  res.status(201).json({
    status: 'success',
    message: 'Successfully registered a user!',
    data: { name: newUser.name, email: newUser.email },
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

  await Session.deleteMany({ userId: user._id });
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', refreshToken, { httpOnly: true });
  res.status(200).json({
    status: 'success',
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
};

export const refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  const session = await Session.findOne({ refreshToken });
  if (!session || session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Invalid or expired refresh token');
  }

  const accessToken = jwt.sign({ id: session.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });

  res.status(200).json({
    status: 'success',
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw createHttpError(401, 'No refresh token provided');
  }

  await Session.deleteMany({ refreshToken });
  res.clearCookie('refreshToken');
  res.status(204).send();
};
