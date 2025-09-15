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
        const favorites = await DB.Favorites.findAll({ where: { userId } });
        if (!favorites) return null;
        const foodIds = favorites.map((fav: FavoritesFood) => fav.foodId);
        const foods = await DB.Food.findAll({ where: { id: foodIds } });
        return foods;
    },
};
