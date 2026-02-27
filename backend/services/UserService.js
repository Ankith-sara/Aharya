import userModel from '../models/UserModel.js';
import logger from '../config/logger.js';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutes

const checkAccountLock = (user) => {
    if (user.lockUntil && user.lockUntil > Date.now()) {
        const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
        return { locked: true, minutesLeft };
    }
    return { locked: false };
};

const handleFailedLogin = async (user) => {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + LOCK_TIME);
        logger.warn(`Account locked for user ${user.email} after ${MAX_LOGIN_ATTEMPTS} failed attempts`);
    }
    await user.save();
};

const resetLoginAttempts = async (user) => {
    if (user.loginAttempts > 0 || user.lockUntil) {
        user.loginAttempts = 0;
        user.lockUntil = undefined;
        await user.save();
    }
};

export { checkAccountLock, handleFailedLogin, resetLoginAttempts };