import { OrderRepo } from '../../../src/modules/order/order.repo';
import {
    createOrderService,
    getAllOrdersService,
    updateOrderService,
    updateOrderStatusService,
} from '../../../src/modules/order/order.service';
import { validateCreateOrder } from '../../../src/modules/order/order.validator';
import { getDishPrices } from '../../../src/modules/dish/dish.service';
import { CustomError } from '../../../src/utils/custom-error';
import { OrderStatus } from '../../../src/database/models/order.model';

jest.mock('../../../src/modules/order/order.repo', () => ({
    OrderRepo: {
        findAllByUser: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        updateStatus: jest.fn(),
    },
}));

jest.mock('../../../src/modules/order/order.validator', () => ({
    validateCreateOrder: jest.fn(() => ({ error: null })),
}));

jest.mock('../../../src/modules/dish/dish.service', () => ({
    getDishPrices: jest.fn(),
}));

describe('order.service', () => {
    beforeEach(() => jest.clearAllMocks());

    const items = [
        { productId: 'a', quantity: 2 },
        { productId: 'b', quantity: 1 },
    ];

    it('createOrderService validates and creates with total', async () => {
        (getDishPrices as jest.Mock).mockResolvedValue([
            { id: 'a', price: 10 },
            { id: 'b', price: 5 },
        ]);
        (OrderRepo.create as jest.Mock).mockResolvedValue({
            id: 'ord1',
            total_amount: 25,
        });
        const res = await createOrderService('user1', items);
        expect(validateCreateOrder).toHaveBeenCalledWith({ items });
        expect(OrderRepo.create).toHaveBeenCalled();
        expect(res).toEqual({ id: 'ord1', total_amount: 25 });
    });

    it('createOrderService throws if items empty', async () => {
        await expect(createOrderService('user1', [])).rejects.toThrow(
            'Order must have at least one item',
        );
    });

    it('createOrderService throws if some dishes missing', async () => {
        (getDishPrices as jest.Mock).mockResolvedValue([
            { id: 'a', price: 10 },
        ]);
        await expect(createOrderService('user1', items)).rejects.toThrow(
            'Some dishes not found',
        );
    });

    it('getAllOrdersService returns list for user', async () => {
        (OrderRepo.findAllByUser as jest.Mock).mockResolvedValue([
            { id: 'o1' },
        ]);
        const res = await getAllOrdersService('user1');
        expect(res).toEqual([{ id: 'o1' }]);
    });

    it('getAllOrdersService throws if user missing', async () => {
        await expect(getAllOrdersService('')).rejects.toThrow(
            new CustomError('User not authenticated', 401),
        );
    });

    it('updateOrderService validates, recomputes, and updates', async () => {
        (getDishPrices as jest.Mock).mockResolvedValue([
            { id: 'a', price: 10 },
            { id: 'b', price: 5 },
        ]);
        (OrderRepo.update as jest.Mock).mockResolvedValue({
            id: 'ord1',
            total_amount: 25,
        });
        const res = await updateOrderService('ord1', items);
        expect(validateCreateOrder).toHaveBeenCalledWith({ items });
        expect(OrderRepo.update).toHaveBeenCalled();
        expect(res).toEqual({ id: 'ord1', total_amount: 25 });
    });

    it('updateOrderService throws when orderId missing', async () => {
        await expect(updateOrderService('', items)).rejects.toThrow(
            'Order ID is required',
        );
    });

    it('updateOrderStatusService updates status', async () => {
        (OrderRepo.updateStatus as jest.Mock).mockResolvedValue({
            id: 'ord1',
            status: OrderStatus.DELIVERED,
        });
        const res = await updateOrderStatusService(
            'ord1',
            OrderStatus.DELIVERED,
        );
        expect(OrderRepo.updateStatus).toHaveBeenCalledWith(
            'ord1',
            OrderStatus.DELIVERED,
        );
        expect(res).toEqual({ id: 'ord1', status: OrderStatus.DELIVERED });
    });

    it('updateOrderStatusService throws when missing args', async () => {
        await expect(
            updateOrderStatusService('', undefined as any),
        ).rejects.toThrow('Order ID and status are required');
    });
});
