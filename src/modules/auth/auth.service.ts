import { User } from '@/interfaces/user.interfaces';
import {
    validateOauthSignIn,
    validateSignIn,
    validateSignUp,
    validateUpdateUser,
} from './auth.validator';
import repo from './auth.repo';
import { compareSync, hash } from 'bcrypt';
import {
    generateAccessToken,
    generateRefreshToken,
} from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';
import { CustomError } from '@/utils/custom-error';

export const signUpService = async (userData: User) => {
    const { error } = validateSignUp(userData);
    if (error) {
        console.log(error);
        throw new CustomError(error.details[0].message, 400);
    }

    const findUser = await repo.findUserByEmail(userData.email);
    if (findUser) {
        throw new CustomError(`Email ${userData.email} already exists`, 409);
    }

    const findUserByName = await repo.findUserByName(userData.name);
    if (findUserByName) {
        throw new CustomError(`This name ${userData.name} already exists`, 409);
    }

    const randomId = (Date.now() + Math.floor(Math.random() * 100)).toString(
        36,
    );
    const username = `${userData.email.split('@')[0]}-${randomId}`;
    if (!userData.password) {
        throw new CustomError('Password is required', 400);
    }
    const hashedPassword = await hash(userData.password, 10);
    const newUserData = await repo.createUser({
        name: userData.name,
        email: userData.email,
        delivery_address: userData.delivery_address,
        phone_number: userData.phone_number,
        is_Social_login: userData.is_Social_login || false,
        Social_login_provider: userData.Social_login_provider || undefined,
        username,
        password: hashedPassword,
    });

    const accessToken = await generateAccessToken(
        { userId: newUserData.id },
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    const refreshToken = await generateRefreshToken(
        { userId: newUserData.id },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    await repo.saveRefreshToken(newUserData.id, refreshToken);
    // Remove password from user object before returning

    return {
        user: {
            id: newUserData.id,
            name: newUserData.name,
            email: newUserData.email,
            username: newUserData.username,
            delivery_address: newUserData.delivery_address,
            phone_number: newUserData.phone_number,
        },
        accessToken,
        refreshToken,
    };
};

export const signInService = async (userData: User) => {
    const { error } = validateSignIn(userData);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const user = await repo.findUserByEmail(userData.email);
    if (!user) {
        throw new CustomError('Email or password is invalid', 401);
    }

    if (!userData.password || !user.password) {
        throw new CustomError('Email or password is invalid', 401);
    }
    const validPassword = compareSync(userData.password, user.password);
    if (!validPassword) {
        throw new CustomError('Email or password is invalid', 401);
    }

    const payload = {
        userId: user.id,
    };

    const accessToken = await generateAccessToken(
        payload,
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    const refreshToken = await generateRefreshToken(
        payload,
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    await repo.saveRefreshToken(user.id, refreshToken);

    // Remove password from user object before returning

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            delivery_address: user.delivery_address,
            phone_number: user.phone_number,
        },
        accessToken,
        refreshToken,
    };
};

export const oauthSignInService = async (
    userData: User,
): Promise<{ user: User; accessToken: string; refreshToken: string }> => {
    const { error } = validateOauthSignIn(userData);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }
    let user = await repo.findUserByEmail(userData.email);
    if (!user) {
        const randomId = (
            Date.now() + Math.floor(Math.random() * 100)
        ).toString(36);
        const username = `${userData.email.split('@')[0]}-${randomId}`;
        // create a random password for social login users
        user = await repo.createUser({
            name: userData.name,
            email: userData.email,
            phone_number: userData.phone_number,
            is_Social_login: userData.is_Social_login || true,
            Social_login_provider: userData.Social_login_provider || undefined,
            username,
        });
    }

    const accessToken = await generateAccessToken(
        { userId: user.id },
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    const refreshToken = await generateRefreshToken(
        { userId: user.id },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    await repo.saveRefreshToken(user.id, refreshToken);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            delivery_address: user.delivery_address,
            is_Social_login: user.is_Social_login,
            Social_login_provider: user.Social_login_provider,
            phone_number: user.phone_number,
        },
        accessToken,
        refreshToken,
    };
};

export const updateUserService = async (
    userId: string,
    updateData: Partial<User>,
) => {
    const { error } = validateUpdateUser(updateData);
    if (error) {
        throw new CustomError(error.details[0].message, 400);
    }

    const user = await repo.findUserById(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    await repo.updateUser(userId, updateData);
    return { message: 'User updated successfully' };
};

export const refreshTokenService = async (token: string) => {
    const user = await repo.findByRefreshToken(token);
    if (!user) {
        throw new CustomError('Invalid token', 401);
    }

    const newAccessToken = await generateAccessToken(
        { userId: user.id },
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    const newRefreshToken = await generateRefreshToken(
        { userId: user.id },
        process.env.JWT_REFRESH_TOKEN_SECRET as string,
    );
    await repo.saveRefreshToken(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (userId: string) => {
    const user = await repo.findUserById(userId);
    if (!user) {
        throw new CustomError('Invalid user ID', 401);
    }
    await repo.clearRefreshToken(user);
};
