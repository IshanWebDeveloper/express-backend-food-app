import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}
interface OrderAttributes {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    placedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    public id!: string;
    public userId!: string;
    public totalAmount!: number;
    public status!: OrderStatus;
    public placedAt!: Date | null;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export default function (sequelize: Sequelize): typeof Order {
    Order.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            userId: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            totalAmount: {
                allowNull: false,
                type: DataTypes.DECIMAL(10, 2),
            },
            status: {
                allowNull: false,
                type: DataTypes.ENUM(
                    'pending',
                    'confirmed',
                    'preparing',
                    'delivered',
                    'cancelled',
                ),
                defaultValue: 'pending',
            },
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            placedAt: {
                allowNull: true,
                type: DataTypes.DATE,
                defaultValue: null,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'orders',
            sequelize,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            timestamps: true,
        },
    );

    return Order;
}
