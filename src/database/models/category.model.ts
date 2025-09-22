import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CategoryAttributes {
    id: string;
    position: number;
    name: string;
}

class Category
    extends Model<CategoryAttributes, Optional<CategoryAttributes, 'id'>>
    implements CategoryAttributes
{
    public id!: string;
    public position!: number;
    public name!: string;
}

export default function (sequelize: Sequelize): typeof Category {
    Category.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            position: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
        },
        {
            tableName: 'categories',
            sequelize,
            timestamps: false,
        },
    );
    return Category;
}
