import { CustomError } from '@/utils/custom-error';
import jwt from 'jsonwebtoken';
export const generateAccessToken = async (payload: any, secretKey: string) => {
    try {
        const token = `${jwt.sign(payload, secretKey, {
            expiresIn: '15m',
        })}`;
        return token;
    } catch (error: any) {
        throw new CustomError(error.message, 500);
    }
};

export const verifyAccessToken = async (
    token: string,
    secretKey: string,
): Promise<jwt.JwtPayload> => {
    try {
        const cleanedToken = token.replace('Bearer ', '');
        const data = jwt.verify(cleanedToken, secretKey);

        if (typeof data === 'string') {
            throw new Error('Invalid token payload');
        }

        return data as jwt.JwtPayload;
    } catch (error: any) {
        throw new CustomError(error.message, 401);
    }
};

export const generateRefreshToken = async (
    payload: any,
    secretKey: string,
    expiresIn: jwt.SignOptions['expiresIn'] = '7d',
) => {
    try {
        const token = `${jwt.sign(payload, secretKey, {
            expiresIn,
        })}`;
        return token;
    } catch (error: any) {
        throw new CustomError(error.message, 500);
    }
};

export const verifyRefreshToken = async (
    token: string,
    secretKey: string,
): Promise<jwt.JwtPayload> => {
    try {
        const cleanedToken = token.replace('Bearer ', '');
        const data = jwt.verify(cleanedToken, secretKey);
        if (typeof data === 'string') {
            throw new Error('Invalid token payload');
        }
        return data as jwt.JwtPayload;
    } catch (error: any) {
        throw new CustomError(error.message, 401);
    }
};
