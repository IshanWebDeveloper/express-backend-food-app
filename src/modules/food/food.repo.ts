// Repository logic for Food
import { DB } from '../../database';
import { Food } from '../../interfaces/food.interfaces';

export const FoodRepo = {
    findAll: async (): Promise<Food[]> => {
        return await DB.Food.findAll();
    },
    findById: async (id: number): Promise<Food | null> => {
        return await DB.Food.findOne({ where: { id } });
    },
    create: async (foodData: Food): Promise<Food> => {
        return await DB.Food.create(foodData);
    },
    update: async (
        id: number,
        updateData: Partial<Food>,
    ): Promise<Food | null> => {
        await DB.Food.update(updateData, { where: { id } });
        return await DB.Food.findOne({ where: { id } });
    },
    delete: async (id: number): Promise<void> => {
        await DB.Food.destroy({ where: { id } });
    },
};
