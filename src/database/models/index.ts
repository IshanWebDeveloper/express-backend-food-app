import { Sequelize } from 'sequelize';
import {
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_DIALECT,
    NODE_ENV,
} from '../../config';
import UserModel from './user.model';
import CategoryModel from './category.model';
import OrderModel from './order.model';
import OrderItemModel from './orderItem.model';
import DishModel from './dish.model';
import RatingModel from './rating.model';
import RestaturantModel from './restaurant.model';
import RefreshTokenModel from './refreshToken.model';
import FavoritesFoodModel from './favoritesFood.model';

const sequelize = new Sequelize(DB_NAME!, DB_USERNAME!, DB_PASSWORD!, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: DB_DIALECT as any,
    timezone: '+09:00',
    define: {
        charset: 'utf8mb4',
        collate: 'utf8mb4_general_ci',
        underscored: true,
        freezeTableName: true,
    },
    pool: { min: 0, max: 5 },
    logQueryParameters: NODE_ENV === 'development',
    logging: (query, time) => {
        console.log(time + 'ms' + ' ' + query);
    },
    benchmark: true,
});

// Initialize models
const User = UserModel(sequelize);
const Category = CategoryModel(sequelize);
const Dish = DishModel(sequelize);
const Order = OrderModel(sequelize);
const OrderItem = OrderItemModel(sequelize);
const Rating = RatingModel(sequelize);
const Restaurant = RestaturantModel(sequelize);
const RefreshToken = RefreshTokenModel(sequelize);
const FavoritesFood = FavoritesFoodModel(sequelize);

// Associations

Category.hasMany(Dish, { foreignKey: 'category_id' });
Dish.belongsTo(Category, { foreignKey: 'category_id' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id' });

Order.belongsToMany(Dish, { through: OrderItem, foreignKey: 'order_id' });

Dish.belongsTo(Restaurant, { foreignKey: 'restaurant_id' });
Restaurant.hasMany(Dish, { foreignKey: 'restaurant_id' });

Dish.belongsTo(Category, { foreignKey: 'category_id' });
Category.hasMany(Dish, { foreignKey: 'category_id' });

User.hasMany(Rating, { foreignKey: 'user_id' });
Rating.belongsTo(User, { foreignKey: 'user_id' });

Dish.hasMany(Rating, { foreignKey: 'dish_id' });
Rating.belongsTo(Dish, { foreignKey: 'dish_id' });

// Favorites associations
User.hasMany(FavoritesFood, { foreignKey: 'user_id' });
FavoritesFood.belongsTo(User, { foreignKey: 'user_id' });

Dish.hasMany(FavoritesFood, { foreignKey: 'food_id' });
FavoritesFood.belongsTo(Dish, { foreignKey: 'food_id' });

// Note: Removed User <-> RefreshToken association to avoid FK constraint issues
// RefreshToken is handled as a simple TEXT field in User model

export {
    sequelize,
    User,
    Category,
    Order,
    OrderItem,
    Dish,
    Rating,
    Restaurant,
    RefreshToken,
    FavoritesFood,
    // Aliases for backward compatibility
    Dish as FoodProduct,
};
