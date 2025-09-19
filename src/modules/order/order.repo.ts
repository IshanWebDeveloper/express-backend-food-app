import { Order, OrderItem, Dish } from '@/database/models';
import { OrderStatus } from '@/database/models/order.model';
import { Transaction } from 'sequelize';

export const OrderRepo = {
    findAllByUser: async (userId: string) => {
        return await Order.findAll({
            where: { userId },
            include: [
                {
                    model: Dish,
                    through: { attributes: ['quantity', 'price'] },
                },
            ],
            order: [['createdAt', 'DESC']],
        });
    },

    create: async (
        userId: string,
        items: Array<{ productId: string; quantity: number; price: number }>,
        totalAmount: number,
        t?: Transaction,
    ) => {
        const order = await Order.create(
            { userId: userId as any, totalAmount, status: OrderStatus.PENDING },
            { transaction: t },
        );
        const orderId =
            typeof order.id === 'string' ? order.id : String(order.id);
        const orderItems = items.map(item => ({
            orderId,
            dishId: item.productId, // Map productId to dishId
            quantity: item.quantity,
            price: item.price,
        }));
        await OrderItem.bulkCreate(orderItems, { transaction: t });
        return order;
    },
};
