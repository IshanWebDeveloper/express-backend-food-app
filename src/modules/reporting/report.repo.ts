import { sequelize } from '@/database/models';
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
        const dateCol = `COALESCE("orders"."created_at", "orders"."createdAt")`;
        if (period === 'day') return `to_char(${dateCol}, 'YYYY-MM-DD')`;
        if (period === 'week')
            return `to_char(date_trunc('week', ${dateCol}), 'IYYY-IW')`;
        return `to_char(date_trunc('month', ${dateCol}), 'YYYY-MM')`;
    }
    // generic fallback using DATE_FORMAT for mysql/mariadb
    const dateCol = `COALESCE(orders.created_at, orders.createdAt)`;
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
        const dialect = sequelize.getDialect();
        const periodExpr = periodSelect(period, dialect);
        const replacements: any = {};
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql +=
                ' AND COALESCE(orders.created_at, orders.createdAt) >= :startDate';
            replacements.startDate = range.startDate;
        }
        if (range?.endDate) {
            whereSql +=
                ' AND COALESCE(orders.created_at, orders.createdAt) <= :endDate';
            replacements.endDate = range.endDate;
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
				   SUM(COALESCE(orders.total_amount, orders."totalAmount")) AS total_sales
			FROM orders
			${whereSql}
			GROUP BY period
			ORDER BY period ASC;
		`;
        return await sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },

    async getTopItems(
        metric: 'quantity' | 'revenue',
        range?: DateRange,
        limit = 10,
        status?: string | string[],
    ) {
        const replacements: any = { limit };
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql +=
                ' AND COALESCE(o.created_at, o.createdAt) >= :startDate';
            replacements.startDate = range.startDate;
        }
        if (range?.endDate) {
            whereSql += ' AND COALESCE(o.created_at, o.createdAt) <= :endDate';
            replacements.endDate = range.endDate;
        }
        const statuses = status
            ? Array.isArray(status)
                ? status
                : String(status).split(',')
            : ['delivered', 'confirmed'];
        whereSql += ' AND o.status IN (:statuses)';
        replacements.statuses = statuses;

        const qtyCol = `COALESCE(oi.quantity, oi."quantity")`;
        const priceCol = `COALESCE(oi.price, oi."price")`;
        const aggExpr =
            metric === 'revenue'
                ? `SUM(${qtyCol} * ${priceCol})`
                : `SUM(${qtyCol})`;
        const sql = `
			SELECT fp.id AS product_id,
				   fp.name AS name,
				   ${aggExpr} AS value
			FROM order_items oi
			JOIN orders o ON o.id = COALESCE(oi.order_id, oi."orderId")
			JOIN food_products fp ON fp.id = COALESCE(oi.product_id, oi."productId")
			${whereSql}
			GROUP BY fp.id, fp.name
			ORDER BY value DESC
			LIMIT :limit;
		`;
        return await sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },

    async getAverageOrderValue(
        period: Period,
        range?: DateRange,
        status?: string | string[],
    ) {
        const dialect = sequelize.getDialect();
        const periodExpr = periodSelect(period, dialect);
        const replacements: any = {};
        let whereSql = 'WHERE 1=1';
        if (range?.startDate) {
            whereSql +=
                ' AND COALESCE(orders.created_at, orders.createdAt) >= :startDate';
            replacements.startDate = range.startDate;
        }
        if (range?.endDate) {
            whereSql +=
                ' AND COALESCE(orders.created_at, orders.createdAt) <= :endDate';
            replacements.endDate = range.endDate;
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
				   AVG(COALESCE(orders.total_amount, orders."totalAmount")) AS average_order_value,
				   COUNT(*) AS orders_count
			FROM orders
			${whereSql}
			GROUP BY period
			ORDER BY period ASC;
		`;
        return await sequelize.query(sql, {
            type: QueryTypes.SELECT,
            replacements,
        });
    },
};
