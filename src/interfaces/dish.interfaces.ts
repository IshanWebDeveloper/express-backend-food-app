export interface Dish {
    id: string;
    name: string;
    description?: string;
    ingredients?: string;
    rating: number;
    price: number;
    calories?: number;
    image_url?: string;
    category_id: string;
    restaurant_id: string;
}
