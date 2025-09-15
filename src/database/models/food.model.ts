import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface FoodAttributes {
    id: string;
    name: string;
    description?: string;
    preparation_time: number;
    rating: number;
    price: number;
    image_url?: string;
    category_id: string;
}

interface FoodCreationAttributes
    extends Optional<FoodAttributes, 'id' | 'description' | 'image_url'> {}

class Food
    extends Model<FoodAttributes, FoodCreationAttributes>
    implements FoodAttributes
{
    public id!: string;
    public name!: string;
    public description?: string;
    public preparation_time!: number;
    public rating!: number;
    public price!: number;
    public image_url?: string;
    public category_id!: string;
}

export default function (sequelize: Sequelize): typeof Food {
    Food.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.TEXT },
            preparation_time: { type: DataTypes.INTEGER, allowNull: false },
            rating: { type: DataTypes.FLOAT, allowNull: false },
            price: { type: DataTypes.FLOAT, allowNull: false },
            image_url: { type: DataTypes.STRING },
            category_id: { type: DataTypes.UUID, allowNull: false },
        },
        {
            tableName: 'food_products',
            sequelize,
            timestamps: false,
        },
    );
    return Food;
}
