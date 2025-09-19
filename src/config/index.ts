import { config } from 'dotenv';

const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
config({ path: envFile });

// Helpers to normalize env values
const toBool = (v: string | undefined, def = false): boolean => {
    if (v == null) return def;
    const s = String(v).trim().toLowerCase();
    return s === '1' || s === 'true' || s === 'yes' || s === 'on';
};

export const {
    PORT,
    NODE_ENV,
    BASE_URL,
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
} = process.env;

// Keep these mostly as strings to avoid broad downstream changes
export const {
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_HOST,
    DB_DIALECT,
} = process.env as Record<string, string | undefined>;

// Export booleans for sync flags to avoid '"false" being truthy' bugs
export const DB_SYNC: boolean = toBool(process.env.DB_SYNC, false);
export const DB_SYNC_ALTER: boolean = toBool(process.env.DB_SYNC_ALTER, false);
export const DB_SYNC_FORCE: boolean = toBool(process.env.DB_SYNC_FORCE, false);
