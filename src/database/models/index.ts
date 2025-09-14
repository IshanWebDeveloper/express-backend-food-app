import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DIALECT,
} from '../../config';
import UserModel from './user.model';
import CategoryModel from './category.model';
import FoodProductModel from './food.model';
import OrderModel from './order.model';
import OrderItemModel from './orderItem.model';
import CartModel from './cart.model';
import CartItemModel from './cartItem.model';
import FavoritesFoodModel from './favoritesFood.model';
const sequelize = new Sequelize(DB_NAME!, DB_USERNAME!, DB_PASSWORD!, {
    host: DB_HOST,
    port: DB_PORT ? Number(DB_PORT) : undefined,
    dialect: DB_DIALECT as any,
});

// Initialize models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const FoodProduct = FoodProductModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Cart = CartModel(sequelize);
const CartItem = CartItemModel(sequelize);
const FavoritesFood = FavoritesFoodModel(sequelize);

// Associations

Category.hasMany(FoodProduct, { foreignKey: 'categoryId' });
FoodProduct.belongsTo(Category, { foreignKey: 'categoryId' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

FavoritesFood.belongsTo(User, { foreignKey: 'userId' });
FavoritesFood.belongsTo(FoodProduct, { foreignKey: 'foodId' });

Order.belongsToMany(FoodProduct, { through: OrderItem, foreignKey: 'orderId' });
FoodProduct.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'productId',
});

User.hasOne(Cart, { foreignKey: 'userId' });
Cart.belongsTo(User, { foreignKey: 'userId' });

Cart.belongsToMany(FoodProduct, { through: CartItem, foreignKey: 'cartId' });
FoodProduct.belongsToMany(Cart, { through: CartItem, foreignKey: 'productId' });

export {
    sequelize,
    User,
    Category,
    FoodProduct,
    Order,
    OrderItem,
    Cart,
    CartItem,
    FavoritesFood,
};
