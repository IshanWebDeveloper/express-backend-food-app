import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface OrderItemAttributes {
    id: string;
    orderId: string;
    productId: string;
    quantity: number;
    price: number;
}

interface OrderItemCreationAttributes
    extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem
    extends Model<OrderItemAttributes, OrderItemCreationAttributes>
    implements OrderItemAttributes
{
    public id!: string;
    public orderId!: string;
    public productId!: string;
    public quantity!: number;
    public price!: number;
}

export default function (sequelize: Sequelize): typeof OrderItem {
    OrderItem.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
            },
            orderId: { type: DataTypes.UUID, allowNull: false },
            productId: { type: DataTypes.UUID, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.FLOAT, allowNull: false },
        },
        {
            tableName: 'order_items',
            sequelize,
            timestamps: false,
        },
    );
    return OrderItem;
}
