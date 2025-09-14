import { Cart, CartItem } from '../../database/models';

const CartRepo = {
    async getCartWithItems(userId: number) {
        // Fetch cart and items for the user
        return await Cart.findOne({
            where: { userId },
            include: [CartItem],
        });
    },

    async addOrUpdateCartItem(
        userId: number,
        productId: number,
        quantity: number,
    ) {
        // Find or create cart
        let cart = await Cart.findOne({ where: { userId: String(userId) } });
        if (!cart) {
            cart = await Cart.create({ userId: String(userId) });
        }
        // Find item
        let item = await CartItem.findOne({
            where: { cartId: String(cart.id), productId: String(productId) },
        });
        if (item) {
            item.quantity += quantity;
            await item.save();
        } else {
            item = await CartItem.create({
                cartId: String(cart.id),
                productId: String(productId),
                quantity,
            });
        }
        return await CartRepo.getCartWithItems(userId);
    },

    async removeCartItem(userId: number, productId: number) {
        const cart = await Cart.findOne({ where: { userId: String(userId) } });
        if (!cart) return null;
        await CartItem.destroy({
            where: { cartId: String(cart.id), productId: String(productId) },
        });
        return await CartRepo.getCartWithItems(userId);
    },

    async clearCart(userId: number) {
        const cart = await Cart.findOne({ where: { userId: String(userId) } });
        if (!cart) return null;
        await CartItem.destroy({ where: { cartId: String(cart.id) } });
        return true;
    },
};

export default CartRepo;
