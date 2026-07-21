const knex = require('../../../database/knex');

class AnalyticsRepository {

    async getDashboard({
        user_id,
        date_reference_start,
        date_reference_end
    }) {

        const query = knex('financial_transactions');

        if (user_id !== undefined) {
            query.where('user_id', user_id);
        }

        if (date_reference_start !== undefined) {
            query.where('date_reference', '>=', date_reference_start);
        }

        if (date_reference_end !== undefined) {
            query.where('date_reference', '<=', date_reference_end);
        }

        const [result] = await query
            .select(
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'income'
                                THEN amount
                            END
                        ),
                        0
                    ) AS total_income
                `),
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'expense'
                                THEN amount
                            END
                        ),
                        0
                    ) AS total_expense
                `),
                knex.raw(`
                    COUNT(*) AS transactions
                `)
            );

        return {
            total_income: Number(result.total_income),
            total_expense: Number(result.total_expense),
            balance: Number(result.total_income) - Number(result.total_expense),
            transactions: Number(result.transactions)
        };
    }

    async getMonthlySummary({
        user_id,
        date_reference_start,
        date_reference_end
    }) {

        const query = knex('financial_transactions');

        if (user_id !== undefined) {
            query.where('user_id', user_id);
        }

        if (date_reference_start !== undefined) {
            query.where('date_reference', '>=', date_reference_start);
        }

        if (date_reference_end !== undefined) {
            query.where('date_reference', '<=', date_reference_end);
        }

        const result = await query
            .select(
                knex.raw(`
                    EXTRACT(MONTH FROM date_reference) AS month
                `),
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'income'
                                THEN amount
                            END
                        ),
                        0
                    ) AS income
                `),
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'expense'
                                THEN amount
                            END
                        ),
                        0
                    ) AS expense
                `)
            )
            .groupByRaw('EXTRACT(MONTH FROM date_reference)')
            .orderByRaw('EXTRACT(MONTH FROM date_reference)');

        return result.map(item => ({
            month: Number(item.month),
            income: Number(item.income),
            expense: Number(item.expense)
        }));
    }

    async getYearlySummary({
        user_id,
        date_reference_start,
        date_reference_end
    }) {

        const query = knex('financial_transactions');

        if (user_id !== undefined) {
            query.where('user_id', user_id);
        }

        if (date_reference_start !== undefined) {
            query.where('date_reference', '>=', date_reference_start);
        }

        if (date_reference_end !== undefined) {
            query.where('date_reference', '<=', date_reference_end);
        }

        const result = await query
            .select(
                knex.raw(`
                    EXTRACT(YEAR FROM date_reference) AS year
                `),
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'income'
                                THEN amount
                            END
                        ),
                        0
                    ) AS income
                `),
                knex.raw(`
                    COALESCE(
                        SUM(
                            CASE
                                WHEN type = 'expense'
                                THEN amount
                            END
                        ),
                        0
                    ) AS expense
                `)
            )
            .groupByRaw('EXTRACT(YEAR FROM date_reference)')
            .orderByRaw('EXTRACT(YEAR FROM date_reference)');

        return result.map(item => ({
            year: Number(item.year),
            income: Number(item.income),
            expense: Number(item.expense)
        }));
    }

    async getTotalByCategory({
        user_id,
        date_reference_start,
        date_reference_end
    }) {

        const query = knex('financial_transactions as ft')
            .leftJoin(
                'financial_categories as fc',
                'ft.category_id',
                'fc.id'
            );

        if (user_id !== undefined) {
            query.where('ft.user_id', user_id);
        }

        if (date_reference_start !== undefined) {
            query.where(
                'ft.date_reference',
                '>=',
                date_reference_start
            );
        }

        if (date_reference_end !== undefined) {
            query.where(
                'ft.date_reference',
                '<=',
                date_reference_end
            );
        }

        const result = await query
            .select(
                'fc.id as category_id',
                'fc.title as category_title',
                'fc.type as category_type',
                'fc.deleted_at'
            )
            .select(
                knex.raw(`
                    COALESCE(
                        SUM(ft.amount),
                        0
                    ) AS total_amount
                `)
            )
            .groupBy(
                'fc.id',
                'fc.title',
                'fc.type',
                'fc.deleted_at'
            )
            .orderBy('total_amount', 'desc');

        return result.map(item => ({
            category_id: Number(item.category_id),
            category_title: item.category_title,
            category_type: item.category_type,
            total_amount: Number(item.total_amount),
            deleted: item.deleted_at !== null
        }));
    }

    async getRecentTransactions({
        user_id,
        date_reference_start,
        date_reference_end
    }) {

        const limit = 10;

        const query = knex('financial_transactions as ft')
            .leftJoin(
                'financial_categories as fc',
                'ft.category_id',
                'fc.id'
            );

        if (user_id !== undefined) {
            query.where('ft.user_id', user_id);
        }

        if (date_reference_start !== undefined) {
            query.where(
                'ft.date_reference',
                '>=',
                date_reference_start
            );
        }

        if (date_reference_end !== undefined) {
            query.where(
                'ft.date_reference',
                '<=',
                date_reference_end
            );
        }

        const result = await query
            .select(
                'ft.id',
                'ft.category_id',
                'fc.title as category_title',
                'ft.description',
                'ft.amount',
                'ft.type',
                'ft.date_reference',
                'ft.created_at'
            )
            .orderBy('ft.date_reference', 'desc')
            .orderBy('ft.created_at', 'desc')
            .limit(limit);

        return result.map(item => ({
            id: Number(item.id),
            category_id: item.category_id ? Number(item.category_id) : null,
            category_title: item.category_title,
            description: item.description,
            amount: Number(item.amount),
            type: item.type,
            date_reference: item.date_reference,
            created_at: item.created_at
        }));
    }

}

module.exports = new AnalyticsRepository();