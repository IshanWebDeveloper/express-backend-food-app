import { DB } from '@/database';
import OrderModel, { OrderStatus } from '@/database/models/order.model';
import { Transaction } from 'sequelize';

export const OrderRepo = {
    findAllByUser: async (userId: string) => {
        return await DB.Orders.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: DB.Dishes as any,
                    through: { attributes: ['quantity', 'price'] } as any,
                },
            ],
            order: [['created_at', 'DESC']],
        });
    },

    create: async (
        userId: string,
        items: Array<{ productId: string; quantity: number; price: number }>,
        totalAmount: number,
        t?: Transaction,
    ) => {
        const order = await DB.Orders.create(
            {
                user_id: userId as any,
                total_amount: totalAmount,
                status: OrderStatus.PENDING,
            },
            { transaction: t },
        );
        const orderId =
            typeof order.id === 'string' ? order.id : String(order.id);
        const orderItems = items.map(item => ({
            order_id: orderId,
            dish_id: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        await DB.OrderItems.bulkCreate(orderItems as any, { transaction: t });
        return order;
    },
    update: async (
        orderId: string,
        items: Array<{ productId: string; quantity: number; price: number }>,
        totalAmount: number,
        t?: Transaction,
    ) => {
        const order = await DB.Orders.findByPk(orderId);
        if (!order) throw new Error('Order not found');
        order.total_amount = totalAmount;
        await order.save({ transaction: t });
        // For simplicity, delete existing items and re-add
        await DB.OrderItems.destroy({
            where: { order_id: orderId },
            transaction: t,
        });
        const orderItems = items.map(item => ({
            order_id: orderId,
            dish_id: item.productId,
            quantity: item.quantity,
            price: item.price,
        }));
        await DB.OrderItems.bulkCreate(orderItems as any, { transaction: t });
        return order;
    },
    updateStatus: async (orderId: string, status: OrderStatus) => {
        const order = await DB.Orders.findByPk(orderId);
        if (!order) throw new Error('Order not found');
        order.status = status;
        await order.save();
        return order;
    },
};
