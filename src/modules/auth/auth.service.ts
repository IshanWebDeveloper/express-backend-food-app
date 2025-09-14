import { User } from '@/interfaces/user.interfaces';
import { validateSignIn, validateSignUp } from './auth.validator';
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
    const hashedPassword = await hash(userData.password, 10);
    console.log('userdata', userData);
    const newUserData = await repo.createUser({
        name: userData.name,
        email: userData.email,
        delivery_address: userData.delivery_address,
        phone_number: userData.phone_number,
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
            deliveryAddress: user.delivery_address,
            phoneNumber: user.phone_number,
        },
        accessToken,
        refreshToken,
    };
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
