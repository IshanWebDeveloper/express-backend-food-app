import { Sequelize } from 'sequelize';
import UserModel from './user.model';
import CategoryModel from './category.model';
import OrderModel from './order.model';
import OrderItemModel from './orderItem.model';
import DishModel from './dish.model';
import RatingModel from './rating.model';
import RestaturantModel from './restaurant.model';
import RefreshTokenModel from './refreshToken.model';

// Initialize all models on the provided Sequelize instance and wire associations
export function initModels(sequelize: Sequelize) {
    const User = UserModel(sequelize);
    const Category = CategoryModel(sequelize);
    const Dish = DishModel(sequelize);
    const Order = OrderModel(sequelize);
    const OrderItem = OrderItemModel(sequelize);
    const Rating = RatingModel(sequelize);
    const Restaurant = RestaturantModel(sequelize);
    const RefreshToken = RefreshTokenModel(sequelize);

    // Associations
    Category.hasMany(Dish, { foreignKey: 'category_id' });
    Dish.belongsTo(Category, { foreignKey: 'category_id' });

    User.hasMany(Order, { foreignKey: 'user_id' });
    Order.belongsTo(User, { foreignKey: 'user_id' });

    // Many-to-many between orders and dishes via order_items
    Order.belongsToMany(Dish, {
        through: OrderItem,
        foreignKey: 'order_id',
        otherKey: 'dish_id',
    });
    Dish.belongsToMany(Order, {
        through: OrderItem,
        foreignKey: 'dish_id',
        otherKey: 'order_id',
    });

    Dish.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
    Restaurant.hasMany(Dish, { foreignKey: 'restaurant_id' });

    Dish.belongsTo(Category, { foreignKey: 'category_id' });
    Category.hasMany(Dish, { foreignKey: 'category_id' });

    User.hasMany(Rating, { foreignKey: 'user_id' });
    Rating.belongsTo(User, { foreignKey: 'user_id' });

    Dish.hasMany(Rating, { foreignKey: 'dish_id' });
    Rating.belongsTo(Dish, { foreignKey: 'dish_id' });

    // Refresh tokens: one-to-many (one user can have many refresh tokens)
    RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
    User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });

    return {
        User,
        Category,
        Dish,
        Order,
        OrderItem,
        Rating,
        Restaurant,
        RefreshToken,
    };
}

export type Models = ReturnType<typeof initModels>;
