import CategoryRepo from '../../../src/modules/category/category.repo';
import {
    getAllCategoriesService,
    getCategoryService,
    createCategoryService,
    updateCategoryService,
    deleteCategoryService,
} from '../../../src/modules/category/category.service';
import {
    validateGetCategory,
    validateCreateCategory,
    validateUpdateCategory,
    validateDeleteCategory,
} from '../../../src/modules/category/category.validator';
import { CustomError } from '../../../src/utils/custom-error';

jest.mock('../../../src/modules/category/category.repo', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        findById: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
    },
}));

jest.mock('../../../src/modules/category/category.validator', () => ({
    validateGetCategory: jest.fn(() => ({ error: null })),
    validateCreateCategory: jest.fn(() => ({ error: null })),
    validateUpdateCategory: jest.fn(() => ({ error: null })),
    validateDeleteCategory: jest.fn(() => ({ error: null })),
}));

describe('category.service', () => {
    beforeEach(() => jest.clearAllMocks());

    it('getAllCategoriesService should return categories', async () => {
        (CategoryRepo.findAll as jest.Mock).mockResolvedValue([{ id: '1' }]);
        const res = await getAllCategoriesService();
        expect(CategoryRepo.findAll).toHaveBeenCalled();
        expect(res).toEqual([{ id: '1' }]);
    });

    it('getCategoryService should validate and fetch by id', async () => {
        (CategoryRepo.findById as jest.Mock).mockResolvedValue({ id: 'abc' });
        const res = await getCategoryService({
            categoryid: '11111111-1111-1111-1111-111111111111',
        });
        expect(validateGetCategory).toHaveBeenCalled();
        expect(CategoryRepo.findById).toHaveBeenCalledWith(
            '11111111-1111-1111-1111-111111111111',
        );
        expect(res).toEqual({ id: 'abc' });
    });

    it('getCategoryService should throw on validator error', async () => {
        (validateGetCategory as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(getCategoryService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });

    it('getCategoryService should throw if categoryid missing after validation bypass', async () => {
        (validateGetCategory as jest.Mock).mockReturnValueOnce({ error: null });
        await expect(getCategoryService({})).rejects.toThrow(
            'Invalid or missing categoryId parameter',
        );
    });

    it('createCategoryService should validate and create', async () => {
        (CategoryRepo.create as jest.Mock).mockResolvedValue({
            id: '1',
            name: 'cat',
        });
        const res = await createCategoryService({ name: 'cat' });
        expect(validateCreateCategory).toHaveBeenCalled();
        expect(CategoryRepo.create).toHaveBeenCalledWith({ name: 'cat' });
        expect(res).toEqual({ id: '1', name: 'cat' });
    });

    it('createCategoryService should throw on validation error', async () => {
        (validateCreateCategory as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'invalid' }] },
        });
        await expect(createCategoryService({})).rejects.toThrow(
            new CustomError('invalid', 400),
        );
    });

    it('updateCategoryService should validate and update', async () => {
        // Service expects numeric-like categoryId; bypass validator and supply numeric string
        (CategoryRepo.update as jest.Mock).mockResolvedValue({
            id: 123,
            name: 'x',
        });
        const res = await updateCategoryService({
            categoryId: '123',
            name: 'x',
        });
        expect(validateUpdateCategory).toHaveBeenCalled();
        expect(CategoryRepo.update).toHaveBeenCalledWith(123, { name: 'x' });
        expect(res).toEqual({ id: 123, name: 'x' });
    });

    it('updateCategoryService should throw on validation error', async () => {
        (validateUpdateCategory as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'oops' }] },
        });
        await expect(updateCategoryService({})).rejects.toThrow(
            new CustomError('oops', 400),
        );
    });

    it('deleteCategoryService should validate and delete', async () => {
        (CategoryRepo.delete as jest.Mock).mockResolvedValue(true);
        const res = await deleteCategoryService({ categoryId: '123' });
        expect(validateDeleteCategory).toHaveBeenCalled();
        expect(CategoryRepo.delete).toHaveBeenCalledWith(123);
        expect(res).toEqual(true);
    });

    it('deleteCategoryService should throw on validation error', async () => {
        (validateDeleteCategory as jest.Mock).mockReturnValueOnce({
            error: { details: [{ message: 'bad' }] },
        });
        await expect(deleteCategoryService({})).rejects.toThrow(
            new CustomError('bad', 400),
        );
    });
});
