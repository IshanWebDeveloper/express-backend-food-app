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
import { initModels, Models } from './models';

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

        const dialect = sequelize.getDialect();
        let fkChecksDisabled = false;
        try {
            // In MySQL, dropping tables with FK dependencies can fail even if Sequelize orders them.
            // Temporarily disable FOREIGN_KEY_CHECKS when using destructive sync options.
            // Note: This is a pragmatic guard for local/dev when DB_SYNC_FORCE/ALTER is used and
            // there may be legacy tables or constraints not represented in the current Sequelize models.
            // Long-term, prefer explicit migrations to manage schema changes and remove orphaned FKs.
            if (
                (dialect === 'mysql' || dialect === 'mariadb') &&
                (syncOptions.force || syncOptions.alter)
            ) {
                await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
                fkChecksDisabled = true;
                logger.info(
                    'MySQL FOREIGN_KEY_CHECKS temporarily disabled for sync.',
                );
            }

            await sequelize.sync(syncOptions);
            logger.info('Sequelize sync completed.');
        } finally {
            if (fkChecksDisabled) {
                try {
                    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
                    logger.info(
                        'MySQL FOREIGN_KEY_CHECKS re-enabled after sync.',
                    );
                } catch (reEnableErr) {
                    logger.error(
                        'Failed to re-enable FOREIGN_KEY_CHECKS',
                        reEnableErr as any,
                    );
                }
            }
        }
    } catch (err) {
        logger.error('Database connection/sync failed', err as any);
        throw err;
    }
}

// Initialize models once on this sequelize instance
const models: Models = initModels(sequelize);

export const DB = {
    Users: models.User,
    Categories: models.Category,
    Dishes: models.Dish,
    Orders: models.Order,
    OrderItems: models.OrderItem,
    Ratings: models.Rating,
    RefreshTokens: models.RefreshToken,
    Restaurants: models.Restaurant,
    sequelize, // connection instance (RAW queries)
    syncDatabase,
    Sequelize, // library
};
