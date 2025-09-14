import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartAttributes {
    id: string;
    userId: string;
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart
    extends Model<CartAttributes, CartCreationAttributes>
    implements CartAttributes
{
    public id!: string;
    public userId!: string;
}

export default function (sequelize: Sequelize): typeof Cart {
    Cart.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            userId: { type: DataTypes.UUID, allowNull: false },
        },
        {
            tableName: 'carts',
            sequelize,
            timestamps: false,
        },
    );
    return Cart;
}
