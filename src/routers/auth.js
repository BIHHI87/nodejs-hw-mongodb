import express from 'express';
import { register, login, refresh, logout } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createUserSchema, loginSchema } from '../validation/auth.js';

const router = express.Router();

router.post('/register', validateBody(createUserSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/refresh', refresh);
router.post('/logout', logout);

export default router;
