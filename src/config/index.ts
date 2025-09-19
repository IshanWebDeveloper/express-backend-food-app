import { config } from 'dotenv';

// Load env file by raw value (case-insensitive)
const rawNodeEnv = process.env.NODE_ENV || 'development';
config({ path: `.env.${rawNodeEnv}` });

function toBool(v?: string) {
    return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}
function toNumber(v?: string, fallback?: number) {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
}

export const NODE_ENV = (process.env.NODE_ENV || 'development').toLowerCase();

export const PORT = toNumber(process.env.PORT, 3000);
export const BASE_URL = process.env.BASE_URL;

export const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
export const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;

export const DB_PORT = toNumber(process.env.DB_PORT, 3306);
export const DB_USERNAME = process.env.DB_USERNAME as string;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME as string;
export const DB_HOST = process.env.DB_HOST as string;
export const DB_DIALECT = (process.env.DB_DIALECT as any) || 'mysql';

export const DB_SYNC = toBool(process.env.DB_SYNC);
export const DB_SYNC_ALTER = toBool(process.env.DB_SYNC_ALTER);
export const DB_SYNC_FORCE = toBool(process.env.DB_SYNC_FORCE);
