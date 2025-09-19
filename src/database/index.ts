import logger from '@/utils/logger';
import Sequelize from 'sequelize';
import {
    DB_DIALECT,
    DB_HOST,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_SYNC,
    DB_SYNC_ALTER,
    DB_SYNC_FORCE,
    DB_USERNAME,
    NODE_ENV,
} from '@/config';
import {
    User,
    Category,
    Dish,
    Order,
    OrderItem,
    Rating,
    Restaurant,
    RefreshToken,
    FavoritesFood,
    sequelize,
} from './models';

export async function syncDatabase() {
    try {
        await sequelize.authenticate();
        logger.info('Database connected successfully!');

        const shouldSync = DB_SYNC || NODE_ENV === 'development';
        if (!shouldSync) {
            logger.info(
                'Sequelize sync skipped (disabled via env and not development).',
            );
            return;
        }

        const syncOptions: Sequelize.SyncOptions = {};
        if (DB_SYNC_FORCE) {
            syncOptions.force = true;
        } else if (DB_SYNC_ALTER || NODE_ENV === 'development') {
            syncOptions.alter = true;
        }

        logger.info(
            `Sequelize sync starting with options: ${JSON.stringify(
                syncOptions,
            )}`,
        );
        await sequelize.sync(syncOptions);
        logger.info('Sequelize sync completed.');
    } catch (err) {
        logger.error('Database connection/sync failed', err as any);
        throw err;
    }
}

export const DB = {
    Users: User,
    Categories: Category,
    Dishes: Dish,
    Orders: Order,
    OrderItems: OrderItem,
    Ratings: Rating,
    RefreshTokens: RefreshToken,
    Restaurants: Restaurant,
    FavoritesFood: FavoritesFood,
    // Aliases for backward compatibility
    Food: Dish,
    Favorites: FavoritesFood,
    sequelize, // connection instance (RAW queries)
    syncDatabase,
    Sequelize, // library
};
