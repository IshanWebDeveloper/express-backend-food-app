import { DB } from '@/database';
import { parseISO, addDays } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { Op, QueryTypes } from 'sequelize';

export type Period = 'day' | 'week' | 'month';

export interface DateRange {
    startDate?: string; // ISO string
    endDate?: string; // ISO string
}

export interface StatusFilter {
    status?: string | string[]; // default delivered + confirmed
}

function getDateRangeWhere(range?: DateRange) {
    const where: any = {};
    if (range?.startDate || range?.endDate) {
        where.createdAt = {};
        if (range.startDate)
            where.createdAt[Op.gte] = new Date(range.startDate);
        if (range.endDate) where.createdAt[Op.lte] = new Date(range.endDate);
    }
    return where;
}

function getStatusWhere(status?: string | string[]) {
    if (!status) return { status: { [Op.in]: ['delivered', 'confirmed'] } };
    const arr = Array.isArray(status) ? status : String(status).split(',');
    return { status: { [Op.in]: arr } };
}

function periodSelect(period: Period, dialect: string) {
    // Build SQL expression for grouping by date period
    // We rely on created_at column per model config; use sequelize.literal
    if (dialect === 'postgres') {
        const dateCol = `"orders"."created_at"`;
        if (period === 'day') return `to_char(${dateCol}, 'YYYY-MM-DD')`;
        if (period === 'week')
            return `to_char(date_trunc('week', ${dateCol}), 'IYYY-IW')`;
        return `to_char(date_trunc('month', ${dateCol}), 'YYYY-MM')`;
    }
    // generic fallback using DATE_FORMAT for mysql/mariadb
    const dateCol = `orders.created_at`;
    if (period === 'day') return `DATE_FORMAT(${dateCol}, '%Y-%m-%d')`;
    if (period === 'week')
        return `DATE_FORMAT(STR_TO_DATE(CONCAT(YEARWEEK(${dateCol}, 3), ' Monday'), '%X%V %W'), '%x-%v')`;
    return `DATE_FORMAT(${dateCol}, '%Y-%m')`;
}

export const ReportRepo = {
    async getSalesByPeriod(
        period: Period,
        range?: DateRange,
        status?: string | string[],
    ) {
        const dialect = DB.sequelize.getDialect();
        const periodExpr = periodSelect(period, dialect);
        const replacements: any = {};
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql += ' AND orders.created_at >= :startDate';
            // Force midnight in Asia/Tokyo regardless of incoming time
            replacements.startDate = `${formatInTimeZone(
                parseISO(range.startDate),
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        if (range?.endDate) {
            whereSql += ' AND orders.created_at < :endDate';
            replacements.endDate = `${formatInTimeZone(
                parseISO(range.endDate),
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        const statuses = status
            ? Array.isArray(status)
                ? status
                : String(status).split(',')
            : ['delivered', 'confirmed'];
        whereSql += ' AND orders.status IN (:statuses)';
        replacements.statuses = statuses;

        const sql = `
            SELECT ${periodExpr} AS period,
               COUNT(*) AS orders_count,
               SUM(orders.total_amount) AS total_sales
            FROM orders
            ${whereSql}
            GROUP BY period
            ORDER BY period ASC;
        `;
        return await DB.sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },

    async getTopItems(
        metric: 'quantity' | 'revenue',
        range?: DateRange,
        limit = 10,
        status?: string | string[],
    ): Promise<
        Array<{
            dish_id: string;
            name: string;
            value: string;
        }>
    > {
        const replacements: any = { limit };
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql += ' AND o.created_at >= :startDate';
            replacements.startDate = `${formatInTimeZone(
                parseISO(range.startDate),
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        if (range?.endDate) {
            // Half-open range to include entire endDate day
            whereSql += ' AND o.created_at < :endDate';
            replacements.endDate = `${formatInTimeZone(
                range.endDate,
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        const statuses = status
            ? Array.isArray(status)
                ? status
                : String(status).split(',')
            : ['delivered', 'confirmed'];
        whereSql += ' AND o.status IN (:statuses)';
        replacements.statuses = statuses;

        const qtyCol = `oi.quantity`;
        const priceCol = `oi.price`;
        const aggExpr =
            metric === 'revenue'
                ? `SUM(${qtyCol} * ${priceCol})`
                : `SUM(${qtyCol})`;
        const sql = `
            SELECT d.*, t.value
            FROM (
                SELECT oi.dish_id, ${aggExpr} AS value
                FROM order_items oi
                JOIN orders o ON o.id = oi.order_id
                ${whereSql}
                GROUP BY oi.dish_id
            ) AS t
            JOIN dishes d ON d.id = t.dish_id
            ORDER BY t.value DESC
            LIMIT :limit;
        `;
        return await DB.sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },

    async getAverageOrderValue(
        period: Period,
        range?: DateRange,
        status?: string | string[],
    ) {
        const dialect = DB.sequelize.getDialect();
        const periodExpr = periodSelect(period, dialect);
        const replacements: any = {};
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql += ' AND orders.created_at >= :startDate';
            replacements.startDate = `${formatInTimeZone(
                parseISO(range.startDate),
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        if (range?.endDate) {
            whereSql += ' AND orders.created_at < :endDate';
            replacements.endDate = `${formatInTimeZone(
                addDays(parseISO(range.endDate), 1),
                'Asia/Tokyo',
                'yyyy-MM-dd',
            )} 00:00:00`;
        }
        const statuses = status
            ? Array.isArray(status)
                ? status
                : String(status).split(',')
            : ['delivered', 'confirmed'];
        whereSql += ' AND orders.status IN (:statuses)';
        replacements.statuses = statuses;

        const sql = `
            SELECT ${periodExpr} AS period,
               AVG(orders.total_amount) AS average_order_value,
               COUNT(*) AS orders_count
            FROM orders
            ${whereSql}
            GROUP BY period
            ORDER BY period ASC;
        `;
        return await DB.sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },
};
