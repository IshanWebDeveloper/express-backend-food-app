import { DishRepo } from '../../../src/modules/dish/dish.repo';
import {
    createDishService,
    getAllDishesService,
    getDishesByCategoryService,
    getDishService,
    updateDishService,
    deleteDishService,
    getDishPrices,
} from '../../../src/modules/dish/dish.service';
import {
    validateCreateFood,
    validateGetFood,
    validateUpdateFood,
    validateDeleteFood,
} from '../../../src/modules/dish/dish.validator';
import { CustomError } from '../../../src/utils/custom-error';

jest.mock('../../../src/modules/dish/dish.repo', () => ({
    DishRepo: {
        findAll: jest.fn(),
        findByCategory: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('../../../src/modules/dish/dish.validator', () => ({
    validateCreateFood: jest.fn(() => ({ error: null })),
    validateGetFood: jest.fn(() => ({ error: null })),
    validateUpdateFood: jest.fn(() => ({ error: null })),
    validateDeleteFood: jest.fn(() => ({ error: null })),
}));

describe('dish.service', () => {
    beforeEach(() => jest.clearAllMocks());

    it('createDishService validates and creates', async () => {
        (DishRepo.create as jest.Mock).mockResolvedValue({ id: '1' });
        const res = await createDishService({
            name: 'A',
            price: 10,
            category_id: '00000000-0000-0000-0000-000000000000',
        } as any);
        expect(validateCreateFood).toHaveBeenCalled();
        expect(DishRepo.create).toHaveBeenCalled();
        expect(res).toEqual({ id: '1' });
    });

    it('createDishService throws on validation error', async () => {
        (validateCreateFood as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(createDishService({} as any)).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('getAllDishesService returns items', async () => {
        (DishRepo.findAll as jest.Mock).mockResolvedValue([{ id: '1' }]);
        const res = await getAllDishesService();
        expect(res).toEqual([{ id: '1' }]);
    });

    it('getDishesByCategoryService throws when category missing', async () => {
        await expect(getDishesByCategoryService('')).rejects.toThrow(
            'Invalid or missing categoryId parameter',
        );
    });

    it('getDishesByCategoryService returns items', async () => {
        (DishRepo.findByCategory as jest.Mock).mockResolvedValue([{ id: '1' }]);
        const res = await getDishesByCategoryService('abc');
        expect(DishRepo.findByCategory).toHaveBeenCalledWith('abc');
        expect(res).toEqual([{ id: '1' }]);
    });

    it('getDishService validates and fetches', async () => {
        (DishRepo.findById as jest.Mock).mockResolvedValue({ id: 'd' });
        const res = await getDishService({
            dishid: '11111111-1111-1111-1111-111111111111',
        });
        expect(validateGetFood).toHaveBeenCalled();
        expect(DishRepo.findById).toHaveBeenCalled();
        expect(res).toEqual({ id: 'd' });
    });

    it('getDishService throws on validation error', async () => {
        (validateGetFood as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'no' }] },
        });
        await expect(getDishService({})).rejects.toThrow(
            new CustomError('no', 400),
        );
    });

    it('updateDishService validates and updates', async () => {
        (DishRepo.update as jest.Mock).mockResolvedValue({
            id: '1',
            name: 'B',
        });
        const res = await updateDishService({
            dishid: '11111111-1111-1111-1111-111111111111',
            name: 'B',
        });
        expect(validateUpdateFood).toHaveBeenCalled();
        expect(DishRepo.update).toHaveBeenCalled();
        expect(res).toEqual({ id: '1', name: 'B' });
    });

    it('updateDishService throws on validation error', async () => {
        (validateUpdateFood as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(updateDishService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('deleteDishService validates and deletes', async () => {
        (DishRepo.delete as jest.Mock).mockResolvedValue(undefined);
        const res = await deleteDishService({
            foodId: '11111111-1111-1111-1111-111111111111',
        } as any);
        expect(validateDeleteFood).toHaveBeenCalled();
        expect(DishRepo.delete).toHaveBeenCalled();
        expect(res).toBeUndefined();
    });

    it('deleteDishService throws on validation error', async () => {
        (validateDeleteFood as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(deleteDishService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('getDishPrices filters by ids', async () => {
        (DishRepo.findAll as jest.Mock).mockResolvedValue([
            { id: 'a', price: 10 },
            { id: 'b', price: 20 },
            { id: undefined, price: 30 },
        ]);
        const res = await getDishPrices(['a', 'c']);
        expect(res).toEqual([{ id: 'a', price: 10 }]);
    });
});
