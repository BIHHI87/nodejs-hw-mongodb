import * as authServices from "../services/auth.js";
import { requestResetToken, resetPassword } from "../services/auth.js";
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';

const JWT_SECRET = env('JWT_SECRET');
const JWT_SECRET_REFRESH = env('JWT_SECRET_REFRESH');

if (!JWT_SECRET || !JWT_SECRET_REFRESH) {
  throw new createHttpError(500, 'Missing JWT secrets in environment variables');
}

const setupSession = (res, session) => {
    res.cookie("refreshToken", session.refreshToken, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUntil),
    });

    res.cookie("sessionId", session._id, {
        httpOnly: true,
        expire: new Date(Date.now() + session.refreshTokenValidUntil),
    });
};

export const registerController = async (req, res) => {
    const newUser = await authServices.register(req.body);

    res.status(201).json({
        status: 201,
        message: "Successfully registered a user!",
        data: newUser,
    });
};

export const loginController = async (req, res) => {
    const session = await authServices.login(req.body);

    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully logged in",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const refreshController = async (req, res) => {
    const { refreshToken, sessionId } = req.cookies;
    const session = await authServices.refreshSession({ refreshToken, sessionId });
    
    setupSession(res, session);

    res.json({
        status: 200,
        message: "Successfully refreshed session",
        data: {
            accessToken: session.accessToken,
        }
    });
};

export const logoutController = async (req, res) => {
    const { sessionId } = req.cookies;
    if (sessionId) {
        await authServices.logout(sessionId);
    }

    res.clearCookie("sessionId");
    res.clearCookie("refreshToken");

    res.status(204).send();
};

export const requestResetEmailController = async (req, res, next) => {
    try {
        await requestResetToken(req.body.email);
      
        res.status(200).json({
            status: 200,
            message: 'Reset password email was successfully sent!',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
  
export const resetPasswordController = async (req, res, next) => {
    try {
        await resetPassword(req.body);
      
        res.status(200).json({
            status: 200,
            message: 'Password was successfully reset!',
            data: {},
        });
    } catch (error) {
        next(error);
    }
};
