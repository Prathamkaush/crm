import { Router } from 'express';
import { signup, login, refreshToken, logout } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { signupSchema, loginSchema } from './auth.schema';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({ windowMs: 60 * 1000, max: 6 });
const signupLimiter = rateLimit({ windowMs: 60 * 1000, max: 3 });

router.post('/signup', signupLimiter, validate(signupSchema), signup);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);

export default router;
