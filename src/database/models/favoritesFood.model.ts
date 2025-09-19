import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface FavoritesFoodAttributes {
    id: string;
    user_id: string;
    food_id: string;
    created_at?: Date;
    updated_at?: Date;
}

interface FavoritesFoodCreationAttributes
    extends Optional<FavoritesFoodAttributes, 'id'> {}

class FavoritesFood
    extends Model<FavoritesFoodAttributes, FavoritesFoodCreationAttributes>
    implements FavoritesFoodAttributes
{
    public id!: string;
    public user_id!: string;
    public food_id!: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof FavoritesFood {
    FavoritesFood.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: { type: DataTypes.UUID, allowNull: false },
            food_id: { type: DataTypes.UUID, allowNull: false },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'favorites_food',
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            sequelize,
            timestamps: true,
        },
    );

    return FavoritesFood;
}