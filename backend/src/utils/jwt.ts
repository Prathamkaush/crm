import jwt from 'jsonwebtoken';
import { JWT_SECRET, REFRESH_SECRET } from '../config/env';


export function signAccessToken(payload: object) {
return jwt.sign(payload, JWT_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' });
}


export function signRefreshToken(payload: object) {
return jwt.sign(payload, REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' });
}


export function verifyAccessToken(token: string) {
return jwt.verify(token, JWT_SECRET);
}


export function verifyRefreshToken(token: string) {
return jwt.verify(token, REFRESH_SECRET);
}