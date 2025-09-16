import { DB } from '@/database';
import { FavoritesFood } from '@/interfaces/favorites.food.interface';
import { Food } from '@/interfaces/food.interfaces';
import { User } from '@/interfaces/user.interfaces';

export const repo = {
    getUserProfile: async (
        userId: string | undefined,
    ): Promise<User | null> => {
        return await DB.Users.findOne({ where: { id: userId } });
    },
    // get favorites user food_products
    getUserFavoriteFoods: async (
        userId: string | undefined,
    ): Promise<Food[] | null> => {
        const favorites = await DB.Favorites.findAll({
            where: { user_id: userId },
        });
        if (!favorites) return null;
        const foodIds = favorites.map((fav: FavoritesFood) => fav.food_id);
        const foods = await DB.Food.findAll({ where: { id: foodIds } });
        return foods;
    },
    getFoodById: async (foodId: number | string): Promise<Food | null> => {
        return await DB.Food.findOne({ where: { id: foodId } });
    },
    isFoodFavorite: async (
        userId: string | undefined,
        foodId: number | string,
    ): Promise<boolean> => {
        if (!userId) return false;
        const favorite = await DB.Favorites.findOne({
            where: { user_id: userId, food_id: foodId },
        });
        return !!favorite;
    },
    addUserFavoriteFood: async (
        userId: string | undefined,
        foodId: number | string,
    ): Promise<void> => {
        if (!userId) return;
        await DB.Favorites.create({
            user_id: String(userId),
            food_id: String(foodId),
        });
    },
    removeUserFavoriteFood: async (
        userId: string | undefined,
        foodId: number | string,
    ): Promise<void> => {
        if (!userId) return;
        await DB.Favorites.destroy({
            where: { user_id: userId, food_id: foodId },
        });
    },
};
