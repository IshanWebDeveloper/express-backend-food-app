import { repo } from './user.repo';
import { CustomError } from '@/utils/custom-error';
import { verifyAccessToken } from '@/middlewares/jwt.service';
import { JWT_ACCESS_TOKEN_SECRET } from '@/config';

export const getUserProfileService = async (accessToken: string) => {
    const decodeToken = await verifyAccessToken(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );

    const userId = decodeToken.userId;

    const user = await repo.getUserProfile(userId);
    if (!user) {
        throw new CustomError('User not found', 404);
    }

    return user;
};

export const getUserFavoriteFoodsService = async (accessToken: string) => {
    const decodeToken = await verifyAccessToken(
        accessToken,
        JWT_ACCESS_TOKEN_SECRET as string,
    );
    const userId = decodeToken.userId;

    const favoriteFoods = await repo.getUserFavoriteFoods(userId);
    if (!favoriteFoods) {
        throw new CustomError('Favorite foods not found', 404);
    }

    return favoriteFoods;
};
