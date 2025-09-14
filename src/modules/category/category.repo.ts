import { Category } from '../../database/models';

class CategoryRepo {
    async findAll() {
        return Category.findAll();
    }

    async findById(id: string | number) {
        return Category.findByPk(id);
    }

    async create(data: any) {
        return Category.create(data);
    }

    async update(id: string | number, data: any) {
        const category = await Category.findByPk(id);
        if (!category) return null;
        await category.update(data);
        return category;
    }

    async delete(id: string | number) {
        const category = await Category.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return true;
    }
}

export default new CategoryRepo();
