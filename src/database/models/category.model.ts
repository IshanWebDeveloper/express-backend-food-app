import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CategoryAttributes {
    id: string;
    name: string;
}

interface CategoryCreationAttributes
    extends Optional<CategoryAttributes, 'id'> {}

class Category
    extends Model<CategoryAttributes, CategoryCreationAttributes>
    implements CategoryAttributes
{
    public id!: string;
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
