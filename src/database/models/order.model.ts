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
    user_id: string;
    total_amount: number;
    status: OrderStatus;
    placed_at: Date | null;
    created_at?: Date;
    updated_at?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order
    extends Model<OrderAttributes, OrderCreationAttributes>
    implements OrderAttributes
{
    public id!: string;
    public user_id!: string;
    public total_amount!: number;
    public status!: OrderStatus;
    public placed_at!: Date | null;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

export default function (sequelize: Sequelize): typeof Order {
    Order.init(
        {
            id: {
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
            },
            user_id: {
                allowNull: false,
                type: DataTypes.UUID,
            },
            total_amount: {
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
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            placed_at: {
                allowNull: true,
                type: DataTypes.DATE,
                defaultValue: null,
            },
            updated_at: {
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
