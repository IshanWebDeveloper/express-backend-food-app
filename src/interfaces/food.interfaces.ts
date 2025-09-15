export interface Food {
    id?: string;
    name: string;
    price: number;
    category_id: string;
    description?: string;
    preparation_time: number;
    rating: number;
    imageUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}
