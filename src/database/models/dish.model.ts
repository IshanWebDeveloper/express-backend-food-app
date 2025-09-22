import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface DishAttributes {
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

interface DishCreationAttributes
    extends Optional<DishAttributes, 'id' | 'description' | 'image_url'> {}

class Dish
    extends Model<DishAttributes, DishCreationAttributes>
    implements DishAttributes
{
    public id!: string;
    public name!: string;
    public description?: string;
    public ingredients?: string;
    public rating!: number;
    public price!: number;
    public calories?: number;
    public image_url?: string;
    public category_id!: string;
    public restaurant_id!: string;
}

export default function (sequelize: Sequelize): typeof Dish {
    Dish.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT },
            ingredients: { type: DataTypes.TEXT },
            calories: { type: DataTypes.INTEGER },
            rating: { type: DataTypes.FLOAT, allowNull: false },
            price: { type: DataTypes.FLOAT, allowNull: false },
            image_url: { type: DataTypes.STRING },
            category_id: { type: DataTypes.UUID, allowNull: false },
            restaurant_id: { type: DataTypes.UUID, allowNull: false },
        },
        {
            tableName: 'dishes',
            sequelize,
            timestamps: false,
        },
    );
    return Dish;
}
