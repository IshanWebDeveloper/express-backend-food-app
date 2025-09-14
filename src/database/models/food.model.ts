import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface FoodAttributes {
    id: string;
    name: string;
    description?: string;
    price: number;
    imageUrl?: string;
    categoryId: string;
}

interface FoodCreationAttributes
    extends Optional<FoodAttributes, 'id' | 'description' | 'imageUrl'> {}

class Food
    extends Model<FoodAttributes, FoodCreationAttributes>
    implements FoodAttributes
{
    public id!: string;
    public name!: string;
    public description?: string;
    public price!: number;
    public imageUrl?: string;
    public categoryId!: string;
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
            price: { type: DataTypes.FLOAT, allowNull: false },
            imageUrl: { type: DataTypes.STRING },
            categoryId: { type: DataTypes.UUID, allowNull: false },
        },
        {
            tableName: 'food_products',
            sequelize,
            timestamps: false,
        },
    );
    return Food;
}
