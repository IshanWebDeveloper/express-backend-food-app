import { Request, Response, NextFunction } from 'express';
import {
    createDishController,
    deleteDishController,
    getAllDishesByCategory,
    getAllDishesController,
    getDishController,
    getDishesByCategoryController,
    updateDishController,
} from '../../../src/modules/dish/dish.controller';
import * as dishService from '../../../src/modules/dish/dish.service';
import * as categoryService from '../../../src/modules/category/category.service';

jest.mock('../../../src/modules/dish/dish.service');
jest.mock('../../../src/modules/category/category.service');

describe('dish.controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('createDishController returns 201 with payload', async () => {
        (dishService.createDishService as jest.Mock).mockResolvedValue({
            id: '1',
        });
        req.body = { name: 'A' };
        await createDishController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Successfully created dish',
            data: { id: '1' },
        });
    });

    it('getAllDishesController returns 200 list', async () => {
        (dishService.getAllDishesService as jest.Mock).mockResolvedValue([
            { id: '1' },
        ]);
        await getAllDishesController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    it('getAllDishesByCategory groups dishes by category', async () => {
        (dishService.getAllDishesService as jest.Mock).mockResolvedValue([
            { id: 'a', category_id: 'c1' },
            { id: 'b', category_id: 'c2' },
            { id: 'c', category_id: 'c1' },
        ]);
        (
            categoryService.getAllCategoriesService as jest.Mock
        ).mockResolvedValue([
            { id: 'c1', name: 'Cat1' },
            { id: 'c2', name: 'Cat2' },
        ]);
        await getAllDishesByCategory(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            data: [
                {
                    title: 'Cat1',
                    data: [
                        { id: 'a', category_id: 'c1' },
                        { id: 'c', category_id: 'c1' },
                    ],
                },
                { title: 'Cat2', data: [{ id: 'b', category_id: 'c2' }] },
            ],
        });
    });

    it('getDishesByCategoryController returns category and dishes', async () => {
        req.params = { categoryid: 'uuid' } as any;
        (categoryService.getCategoryService as jest.Mock).mockResolvedValue({
            id: 'uuid',
            name: 'Meals',
        });
        (dishService.getDishesByCategoryService as jest.Mock).mockResolvedValue(
            [{ id: '1' }],
        );
        await getDishesByCategoryController(
            req as Request,
            res as Response,
            next,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            category: 'Meals',
            dishes: [{ id: '1' }],
        });
    });

    it('getDishController returns 200', async () => {
        req.params = { dishid: 'uuid' } as any;
        (dishService.getDishService as jest.Mock).mockResolvedValue({
            id: 'uuid',
        });
        await getDishController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 'uuid' });
    });

    it('updateDishController returns 200', async () => {
        req.params = { dishid: 'uuid' } as any;
        req.body = { name: 'B' };
        (dishService.updateDishService as jest.Mock).mockResolvedValue({
            id: 'uuid',
            name: 'B',
        });
        await updateDishController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 'uuid', name: 'B' });
    });

    it('deleteDishController returns 200', async () => {
        req.params = { foodId: 'uuid' } as any;
        (dishService.deleteDishService as jest.Mock).mockResolvedValue(
            undefined,
        );
        await deleteDishController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Dish deleted successfully',
        });
    });

    it('controllers forward errors', async () => {
        const err = new Error('x');
        (dishService.getAllDishesService as jest.Mock).mockRejectedValue(err);
        await getAllDishesController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });
});
