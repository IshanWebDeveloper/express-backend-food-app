// Repository logic for Food
import { DB } from '../../database';
import { Food } from '../../interfaces/food.interfaces';

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

// Helper function to convert Food to Dish data
const foodToDish = (food: Food): any => ({
    id: food.id,
    name: food.name,
    price: food.price,
    category_id: food.category_id,
    description: food.description,
    rating: food.rating,
    image_url: food.imageUrl,
    restaurant_id: '00000000-0000-0000-0000-000000000000', // Default restaurant_id
});

export const FoodRepo = {
    findAll: async (): Promise<Food[]> => {
        const dishes = await DB.Food.findAll();
        return dishes.map(dishToFood);
    },
    findById: async (id: string): Promise<Food | null> => {
        const dish = await DB.Food.findOne({ where: { id } });
        return dish ? dishToFood(dish) : null;
    },
    create: async (foodData: Food): Promise<Food> => {
        const dishData = foodToDish(foodData);
        const dish = await DB.Food.create(dishData);
        return dishToFood(dish);
    },
    update: async (
        id: string,
        updateData: Partial<Food>,
    ): Promise<Food | null> => {
        const dishData = foodToDish(updateData as Food);
        await DB.Food.update(dishData, { where: { id } });
        const dish = await DB.Food.findOne({ where: { id } });
        return dish ? dishToFood(dish) : null;
    },
    delete: async (id: string): Promise<void> => {
        await DB.Food.destroy({ where: { id } });
    },
};
