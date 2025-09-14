import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface CartItemAttributes {
    id: string;
    cartId: string;
    productId: string;
    quantity: number;
}

interface CartItemCreationAttributes
    extends Optional<CartItemAttributes, 'id'> {}

class CartItem
    extends Model<CartItemAttributes, CartItemCreationAttributes>
    implements CartItemAttributes
{
    public id!: string;
    public cartId!: string;
    public productId!: string;
    public quantity!: number;
}

export default function (sequelize: Sequelize): typeof CartItem {
    CartItem.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            cartId: { type: DataTypes.UUID, allowNull: false },
            productId: { type: DataTypes.UUID, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
        },
        {
            tableName: 'cart_items',
            sequelize,
            timestamps: false,
        },
    );
    return CartItem;
}
