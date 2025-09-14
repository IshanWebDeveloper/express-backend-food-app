import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface FavoritesFoodAttributes {
    id: string;
    userId: string;
    foodId: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface FavoritesFoodCreationAttributes
    extends Optional<FavoritesFoodAttributes, 'id'> {}

class FavoritesFood
    extends Model<FavoritesFoodAttributes, FavoritesFoodCreationAttributes>
    implements FavoritesFoodAttributes
{
    public id!: string;
    public userId!: string;
    public foodId!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof FavoritesFood {
    FavoritesFood.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: { type: DataTypes.UUID, allowNull: false },
            foodId: { type: DataTypes.UUID, allowNull: false },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'favorites_food',
            sequelize,
            timestamps: false,
        },
    );
    return FavoritesFood;
}
