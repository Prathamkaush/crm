import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';


export interface AuthRequest extends Request {
user?: any;
}


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
const auth = req.headers.authorization;
if (!auth) return res.status(401).json({ success: false, error: 'No token' });
const token = auth.replace('Bearer ', '');
try {
const payload = verifyAccessToken(token) as any;
req.user = payload;
next();
} catch (err: any) {
return res.status(401).json({ success: false, error: 'Invalid token' });
}
};