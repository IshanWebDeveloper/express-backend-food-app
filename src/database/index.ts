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
import userModel from './models/user.model';
import {
    Category,
    Dish,
    Order,
    OrderItem,
    Rating,
    RefreshToken,
    Restaurant,
    User,
} from './models';

const sequelize = new Sequelize.Sequelize(
    DB_NAME as string,
    DB_USERNAME as string,
    DB_PASSWORD,
    {
        dialect: (DB_DIALECT as Sequelize.Dialect) || 'mysql',
        host: DB_HOST,
        port: parseInt(DB_PORT as string, 10),
        timezone: '+09:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            underscored: true,
            freezeTableName: true,
        },
        pool: {
            min: 0,
            max: 5,
        },
        logQueryParameters: NODE_ENV === 'development',
        logging: (query, time) => {
            logger.info(time + 'ms' + ' ' + query);
        },
        benchmark: true,
    },
);

sequelize.authenticate();

export async function syncDatabase() {
    try {
        await sequelize.authenticate();

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
    Users: userModel(sequelize),
    Categories: Category,
    Dishes: Dish,
    Orders: Order,
    OrderItems: OrderItem,
    Ratings: Rating,
    RefreshTokens: RefreshToken,
    Restaurants: Restaurant,
    sequelize, // connection instance (RAW queries)
    syncDatabase,
    Sequelize, // library
};
