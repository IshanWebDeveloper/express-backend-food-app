import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface OrderItemAttributes {
    id: string;
    order_id: string;
    dish_id: string;
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
    public order_id!: string;
    public dish_id!: string;
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
            order_id: { type: DataTypes.UUID, allowNull: false },
            dish_id: { type: DataTypes.UUID, allowNull: false },
            quantity: { type: DataTypes.INTEGER, allowNull: false },
            price: { type: DataTypes.FLOAT, allowNull: false },
        },
        {
            tableName: 'order_items',
            sequelize,
            timestamps: false,
            indexes: [
                // Ensure one dish can appear only once per order
                {
                    unique: true,
                    fields: ['order_id', 'dish_id'],
                    name: 'order_items_order_id_dish_id_unique',
                },
                // Helpful non-unique indexes for lookups
                { fields: ['order_id'], name: 'order_items_order_id_idx' },
                { fields: ['dish_id'], name: 'order_items_dish_id_idx' },
            ],
        },
    );
    return OrderItem;
}
