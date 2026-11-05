import {
    signUpService,
    signInService,
} from '../../../src/modules/auth/auth.service';
import { CustomError } from '../../../src/utils/custom-error';
import repo from '../../../src/modules/auth/auth.repo';
import { User } from '../../../src/interfaces/user.interfaces';
import { DB } from '../../../src/database';
import { hash, compareSync } from 'bcrypt';
import {
    validateSignUp,
    validateSignIn,
} from '../../../src/modules/auth/auth.validator';
import {
    generateAccessToken,
    generateRefreshToken,
} from '../../../src/middlewares/jwt.service';

jest.mock('../../../src/modules/auth/auth.repo');
jest.mock('../../../src/database', () => ({
    DB: {
        sequelize: {
            close: jest.fn(),
            authenticate: jest.fn(),
        },
    },
}));

jest.mock('bcrypt', () => ({
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
    compareSync: jest.fn(() => true),
}));

jest.mock('../../../src/modules/auth/auth.validator', () => ({
    validateSignUp: jest.fn(),
    validateSignIn: jest.fn(() => ({ error: null })),
}));

jest.mock('../../../src/middlewares/jwt.service');

afterAll(async () => {
    await DB.sequelize.close();
});

describe('signUpService', () => {
    it('should throw error if email already exists', async () => {
        const userData: User = {
            email: 'mary2@example.com',
            name: 'Existing User',
            username: 'existinguser',
            password: 'Password123!',
            is_Social_login: false,
            created_at: undefined,
            updated_at: undefined,
        };

        (repo.findUserByEmail as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'mary3@example.com',
        });

        (validateSignUp as jest.Mock).mockReturnValue({ error: null });

        await expect(signUpService(userData)).rejects.toThrow(
            new CustomError(`Email ${userData.email} already exists`, 409),
        );
    });

    it('should throw error if validation fails', async () => {
        const userData: User = {
            email: 'invalid-email',
            name: 'Invalid User',
            username: 'invaliduser',
            password: 'Password123!',
            is_Social_login: false,
            created_at: undefined,
            updated_at: undefined,
        };

        const validationError = {
            details: [{ message: 'Email format is invalid' }],
        };
        (validateSignUp as jest.Mock).mockReturnValue({
            error: validationError,
        });

        await expect(signUpService(userData)).rejects.toThrow(
            new CustomError('Email format is invalid', 400),
        );
    });

    it('should create new user if email is available', async () => {
        const userData: User = {
            email: 'new@example.com',
            name: 'New User',
            username: 'newuser',
            password: 'Password123!',
            is_Social_login: false,
            created_at: undefined,
            updated_at: undefined,
        };

        (repo.findUserByEmail as jest.Mock).mockResolvedValue(null);
        (validateSignUp as jest.Mock).mockReturnValue({ error: null });

        const newUser = {
            id: 1,
            email: 'new@example.com',
            username: 'new-username',
            password: 'hashedPassword',
        };

        (repo.createUser as jest.Mock).mockResolvedValue(newUser);

        (generateAccessToken as jest.Mock).mockResolvedValue('access_token');
        (generateRefreshToken as jest.Mock).mockResolvedValue('refresh_token');

        const result = await signUpService(userData);
        expect(result).toEqual({
            user: {
                id: 1,
                name: undefined,
                email: 'new@example.com',
                username: 'new-username',
                delivery_address: undefined,
                phone_number: undefined,
            },
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
        });
        expect(result.user).not.toHaveProperty('password');
        expect(repo.saveRefreshToken).toHaveBeenCalledWith(1, 'refresh_token');
        expect(hash).toHaveBeenCalledWith(userData.password, 10);
    });
});

describe('signInService', () => {
    const mockUser: User = {
        email: 'test@example.com',
        name: 'Test User',
        username: 'testuser',
        password: 'hashed_password',
        is_Social_login: false,
        created_at: undefined,
        updated_at: undefined,
    };

    it('should return user and accessToken if credentials are correct', async () => {
        (repo.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        (generateAccessToken as jest.Mock).mockResolvedValue(
            'mocked_access_token',
        );
        (generateRefreshToken as jest.Mock).mockResolvedValue(
            'mocked_refresh_token',
        );
        jest.spyOn(require('bcrypt'), 'compareSync').mockReturnValue(true);

        const result = await signInService({
            email: 'test@example.com',
            password: 'correct_password',
            name: 'Test User',
            username: 'testuser',
            is_Social_login: false,
            created_at: undefined,
            updated_at: undefined,
        });

        expect(repo.findUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(generateAccessToken).toHaveBeenCalled();
        expect(result).toEqual({
            user: {
                id: undefined,
                name: 'Test User',
                email: 'test@example.com',
                username: 'testuser',
                delivery_address: undefined,
                phone_number: undefined,
            },
            accessToken: 'mocked_access_token',
            refreshToken: 'mocked_refresh_token',
        });
        expect(result.user).not.toHaveProperty('password');
    });

    it('should throw 401 error if user is not found', async () => {
        (repo.findUserByEmail as jest.Mock).mockResolvedValue(null);

        await expect(
            signInService({
                email: 'test@example.com',
                password: 'wrong_password',
                name: 'Test User',
                username: 'testuser',
                is_Social_login: false,
                created_at: undefined,
                updated_at: undefined,
            }),
        ).rejects.toThrow('Email or password is invalid');
    });

    it('should throw 401 error if password is incorrect', async () => {
        (repo.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
        jest.spyOn(require('bcrypt'), 'compareSync').mockReturnValue(false);

        await expect(
            signInService({
                email: 'test@example.com',
                password: 'wrong_password',
                name: 'Test User',
                username: 'testuser',
                is_Social_login: false,
                created_at: undefined,
                updated_at: undefined,
            }),
        ).rejects.toThrow('Email or password is invalid');
    });

    it('should throw 400 error if validation fails', async () => {
        (validateSignIn as jest.Mock).mockReturnValue({
            error: {
                details: [{ message: 'Email and password are required' }],
            },
        });

        await expect(
            signInService({
                email: '',
                password: '',
                name: '',
                username: '',
                is_Social_login: false,
                created_at: undefined,
                updated_at: undefined,
            }),
        ).rejects.toThrow('Email and password are required');
    });
});
