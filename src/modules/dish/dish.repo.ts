// Repository logic for Food
import { Dish } from '@/interfaces/dish.interfaces';
import { DB } from '../../database';

export const DishRepo = {
    findAll: async (): Promise<Dish[]> => {
        return await DB.Dishes.findAll();
    },
    findByCategory: async (categoryId: string): Promise<Dish[]> => {
        return await DB.Dishes.findAll({ where: { category_id: categoryId } });
    },
    findById: async (id: string): Promise<Dish | null> => {
        return await DB.Dishes.findOne({ where: { id } });
    },
    create: async (foodData: Dish): Promise<Dish> => {
        return await DB.Dishes.create(foodData);
    },
    update: async (
        id: number,
        updateData: Partial<Dish>,
    ): Promise<Dish | null> => {
        await DB.Dishes.update(updateData, { where: { id } });
        return await DB.Dishes.findOne({ where: { id } });
    },
    delete: async (id: number): Promise<void> => {
        await DB.Dishes.destroy({ where: { id } });
    },
};
