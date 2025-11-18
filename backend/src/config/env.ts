import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const PORT = process.env.PORT || 4000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const JWT_SECRET = process.env.JWT_SECRET || 'change_this';
export const REFRESH_SECRET = process.env.REFRESH_SECRET || 'change_refresh';
export const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '15m';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// ❌ REMOVED: Not needed anymore
// export const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
// export const FROM_EMAIL = process.env.FROM_EMAIL || "";
// export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
