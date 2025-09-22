import { DB } from '@/database';

class CategoryRepo {
    async findAll() {
        return DB.Categories.findAll(
            { order: [['position', 'ASC']] }, // Order by position in ascending order
        );
    }

    async findById(id: string | number) {
        return DB.Categories.findByPk(id);
    }

    async create(data: any) {
        return DB.Categories.create(data);
    }

    async update(id: string | number, data: any) {
        const category = await DB.Categories.findByPk(id);
        if (!category) return null;
        await category.update(data);
        return category;
    }

    async delete(id: string | number) {
        const category = await DB.Categories.findByPk(id);
        if (!category) return null;
        await category.destroy();
        return true;
    }
}

export default new CategoryRepo();
