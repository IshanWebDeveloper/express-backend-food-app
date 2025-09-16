import { Order, OrderItem, FoodProduct } from '@/database/models';
import { Transaction } from 'sequelize';

export const OrderRepo = {
    findAllByUser: async (userId: string) => {
        return await Order.findAll({
            where: { userId },
            include: [
                {
                    model: FoodProduct,
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
            { userId: userId as any, totalAmount, status: 'pending' },
            { transaction: t },
        );
        const orderId =
            typeof order.id === 'string' ? order.id : String(order.id);
        const orderItems = items.map(item => ({
            orderId,
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        await OrderItem.bulkCreate(orderItems, { transaction: t });
        return order;
    },
};
