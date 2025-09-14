export interface Food {
    id?: string;
    name: string;
    price: number;
    categoryId: string;
    description?: string;
    preparationTime: number;
    rating: number;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
