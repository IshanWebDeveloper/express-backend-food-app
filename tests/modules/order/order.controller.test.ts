import { Request, Response, NextFunction } from 'express';
import {
    createOrderController,
    getAllOrdersController,
    updateOrderController,
    updateOrderStatusController,
} from '../../../src/modules/order/order.controller';
import * as orderService from '../../../src/modules/order/order.service';

jest.mock('../../../src/modules/order/order.service');

describe('order.controller', () => {
    let req: Partial<Request> & { context?: any };
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { body: {}, params: {}, context: { userId: 'user1' } } as any;
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        next = jest.fn();
        jest.clearAllMocks();
    });

    it('getAllOrdersController returns 200', async () => {
        (orderService.getAllOrdersService as jest.Mock).mockResolvedValue([
            { id: 'o1' },
        ]);
        await getAllOrdersController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ orders: [{ id: 'o1' }] });
    });

    it('getAllOrdersController forwards error when unauthenticated', async () => {
        req.context = undefined;
        await getAllOrdersController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(new Error('User not authenticated'));
    });

    it('createOrderController returns 201', async () => {
        req.body = { items: [{ productId: 'a', quantity: 1 }] };
        (orderService.createOrderService as jest.Mock).mockResolvedValue({
            id: 'ord1',
        });
        await createOrderController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ order: { id: 'ord1' } });
    });

    it('createOrderController forwards error when user missing', async () => {
        req.context = undefined;
        await createOrderController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(new Error('User not authenticated'));
    });

    it('updateOrderStatusController returns 200', async () => {
        req.params = { orderId: 'ord1' } as any;
        req.body = { status: 'delivered' } as any;
        (orderService.updateOrderStatusService as jest.Mock).mockResolvedValue(
            {},
        );
        await updateOrderStatusController(
            req as Request,
            res as Response,
            next,
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Order status updated',
        });
    });

    it('updateOrderStatusController forwards error on missing params', async () => {
        await updateOrderStatusController(
            req as Request,
            res as Response,
            next,
        );
        expect(next).toHaveBeenCalledWith(
            new Error('Order ID and status are required'),
        );
    });

    it('updateOrderController returns 200', async () => {
        req.params = { orderId: 'ord1' } as any;
        req.body = { items: [{ productId: 'a', quantity: 1 }] };
        (orderService.updateOrderService as jest.Mock).mockResolvedValue({
            id: 'ord1',
        });
        await updateOrderController(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ order: { id: 'ord1' } });
    });

    it('updateOrderController forwards error on missing orderId', async () => {
        await updateOrderController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(new Error('Order ID is required'));
    });

    it('controllers forward service errors', async () => {
        const err = new Error('x');
        (orderService.getAllOrdersService as jest.Mock).mockRejectedValue(err);
        await getAllOrdersController(req as Request, res as Response, next);
        expect(next).toHaveBeenCalledWith(err);
    });
});
