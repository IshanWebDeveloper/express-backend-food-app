export interface Food {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    description?: string;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
