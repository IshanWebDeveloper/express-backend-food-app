import jwt from 'jsonwebtoken';
import {
    generateAccessToken,
    verifyAccessToken,
} from '../../src/middlewares/jwt.service';

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
    verify: jest.fn(),
}));

describe('JWT Service', () => {
    const secretKey = 'test_secret';
    const payload = { userId: '123' };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('generateAccessToken should return a valid token', async () => {
        (jwt.sign as jest.Mock).mockReturnValue('mockedToken');

        const token = await generateAccessToken(payload, secretKey);

        expect(jwt.sign).toHaveBeenCalledWith(payload, secretKey);
        expect(token).toBe('Bearer mockedToken');
    });

    test('verifyAccessToken should return the correct payload when token is valid', async () => {
        (jwt.verify as jest.Mock).mockReturnValue(payload);

        const result = await verifyAccessToken('Bearer validToken', secretKey);

        expect(jwt.verify).toHaveBeenCalledWith('validToken', secretKey);
        expect(result).toEqual(payload);
    });

    test('verifyAccessToken should throw an error if token is invalid', async () => {
        (jwt.verify as jest.Mock).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        await expect(
            verifyAccessToken('Bearer invalidToken', secretKey),
        ).rejects.toThrow('Invalid token');
    });

    test('verifyAccessToken should throw an error if payload is a string', async () => {
        (jwt.verify as jest.Mock).mockReturnValue('InvalidPayload');

        await expect(
            verifyAccessToken('Bearer validToken', secretKey),
        ).rejects.toThrow('Invalid token payload');
    });
});
