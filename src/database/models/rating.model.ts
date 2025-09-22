import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface RatingAttributes {
    id: string;
    user_id: string;
    dish_id?: string | null;
    restaurant_id?: string | null;
    score: number; // 0.0 - 5.0
    review?: string | null;
    created_at?: Date;
    updated_at?: Date;
}

type RatingCreationAttributes = Optional<
    RatingAttributes,
    'id' | 'dish_id' | 'restaurant_id' | 'review' | 'created_at' | 'updated_at'
>;

class Rating
    extends Model<RatingAttributes, RatingCreationAttributes>
    implements RatingAttributes
{
    public id!: string;
    public user_id!: string;
    public dish_id?: string | null;
    public restaurant_id?: string | null;
    public score!: number;
    public review?: string | null;
    public created_at?: Date | undefined;
    public updated_at?: Date | undefined;
}

export default function (sequelize: Sequelize): typeof Rating {
    Rating.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            dish_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            restaurant_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            score: {
                type: DataTypes.FLOAT,
                allowNull: false,
                validate: {
                    min: 0,
                    max: 5,
                },
            },
            review: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
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
            tableName: 'ratings',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );
    return Rating;
}
