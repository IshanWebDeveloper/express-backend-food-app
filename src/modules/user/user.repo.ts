import { DB } from '@/database';
import { FavoritesFood } from '@/interfaces/favorites.food.interface';
import { Food } from '@/interfaces/food.interfaces';
import { User } from '@/interfaces/user.interfaces';

// Helper function to convert Dish to Food interface
const dishToFood = (dish: any): Food => ({
    id: dish.id,
    name: dish.name,
    price: dish.price,
    category_id: dish.category_id,
    description: dish.description,
    preparation_time: 0, // Default value since Dish doesn't have this
    rating: dish.rating,
    imageUrl: dish.image_url,
    createdAt: dish.createdAt,
    updatedAt: dish.updatedAt,
});

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
        const dishes = await DB.Food.findAll({ where: { id: foodIds } });
        return dishes.map(dishToFood);
    },
    getFoodById: async (foodId: number | string): Promise<Food | null> => {
        const dish = await DB.Food.findOne({ where: { id: foodId } });
        return dish ? dishToFood(dish) : null;
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
