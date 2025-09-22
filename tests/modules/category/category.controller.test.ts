import { Request, Response, NextFunction } from 'express';
import {
    getAllCategoriesController,
    getCategoryController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
} from '../../../src/modules/category/category.controller';
import {
    getAllCategoriesService,
    getCategoryService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from '../../../src/modules/category/category.service';

jest.mock('../../../src/modules/category/category.service', () => ({
    getAllCategoriesService: jest.fn(),
    getCategoryService: jest.fn(),
    createCategoryService: jest.fn(),
    updateCategoryService: jest.fn(),
    deleteCategoryService: jest.fn(),
}));

describe('category.controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { params: {}, body: {} };
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('getAllCategoriesController returns 200', async () => {
        (getAllCategoriesService as jest.Mock).mockResolvedValue([{ id: '1' }]);
        await getAllCategoriesController(req as Request, res as Response, next);
        expect(getAllCategoriesService).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{ id: '1' }]);
    });

    it('getAllCategoriesController forwards error', async () => {
        const err = new Error('fail');
        (getAllCategoriesService as jest.Mock).mockRejectedValue(err);
        await getAllCategoriesController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('getCategoryController returns 200', async () => {
        req.params = { categoryid: 'uuid' } as any;
        (getCategoryService as jest.Mock).mockResolvedValue({ id: 'uuid' });
        await getCategoryController(req as Request, res as Response, next);
        expect(getCategoryService).toHaveBeenCalledWith({ categoryid: 'uuid' });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 'uuid' });
    });

    it('getCategoryController forwards error', async () => {
        const err = new Error('bad');
        (getCategoryService as jest.Mock).mockRejectedValue(err);
        await getCategoryController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('createCategoryController returns 201', async () => {
        req.body = { name: 'cat' };
        (createCategoryService as jest.Mock).mockResolvedValue({ id: '1' });
        await createCategoryController(req as Request, res as Response, next);
        expect(createCategoryService).toHaveBeenCalledWith({ name: 'cat' });
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ id: '1' });
    });

    it('createCategoryController forwards error', async () => {
        const err = new Error('bad');
        (createCategoryService as jest.Mock).mockRejectedValue(err);
        await createCategoryController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('updateCategoryController returns 200', async () => {
        req.params = { categoryId: '123' } as any;
        req.body = { name: 'x' };
        (updateCategoryService as jest.Mock).mockResolvedValue({
            id: 123,
            name: 'x',
        });
        await updateCategoryController(req as Request, res as Response, next);
        expect(updateCategoryService).toHaveBeenCalledWith({
            categoryId: '123',
            name: 'x',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ id: 123, name: 'x' });
    });

    it('updateCategoryController forwards error', async () => {
        const err = new Error('bad');
        (updateCategoryService as jest.Mock).mockRejectedValue(err);
        await updateCategoryController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });

    it('deleteCategoryController returns 200', async () => {
        req.params = { categoryId: '123' } as any;
        (deleteCategoryService as jest.Mock).mockResolvedValue(true);
        await deleteCategoryController(req as Request, res as Response, next);
        expect(deleteCategoryService).toHaveBeenCalledWith({
            categoryId: '123',
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Category deleted successfully',
        });
    });

    it('deleteCategoryController forwards error', async () => {
        const err = new Error('bad');
        (deleteCategoryService as jest.Mock).mockRejectedValue(err);
        await deleteCategoryController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });
});
