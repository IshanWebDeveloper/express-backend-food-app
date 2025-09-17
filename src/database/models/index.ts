import { Sequelize } from 'sequelize';
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
const FavoritesFood = FavoritesFoodModel(sequelize);

// Associations

Category.hasMany(FoodProduct, { foreignKey: 'category_id' });
FoodProduct.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

FavoritesFood.belongsTo(User, { foreignKey: 'user_id' });
FavoritesFood.belongsTo(FoodProduct, { foreignKey: 'food_id' });

Order.belongsToMany(FoodProduct, { through: OrderItem, foreignKey: 'orderId' });
FoodProduct.belongsToMany(Order, {
    through: OrderItem,
    foreignKey: 'productId',
});

export {
    sequelize,
    User,
    Category,
    FoodProduct,
    Order,
    OrderItem,
    FavoritesFood,
};
