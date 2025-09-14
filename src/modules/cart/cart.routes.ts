import { Router } from 'express';
import {
    getCartController,
    addItemController,
    removeItemController,
    clearCartController,
} from './cart.controller';

const cartRouter = Router();

// Get current user's cart
cartRouter.get('/:userId', getCartController);

// Add item to cart
cartRouter.post('/:userId/add/:productId/:quantity', addItemController);

// Remove item from cart
cartRouter.delete('/:userId/remove/:productId', removeItemController);

// Clear cart
cartRouter.delete('/:userId/clear', clearCartController);

export default cartRouter;
