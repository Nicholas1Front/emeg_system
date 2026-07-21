const analyticsService = require('./financial_analytics_service');
const {financialAnalyticsSchema} = require('./financial_analytics_schema');
class FinancialAnalyticsController{
    async getDashboard(req,res){
        try{
            const {
                user_id,
                date_reference_start,
                date_reference_end
            } = financialAnalyticsSchema.parse(req.query);

            const dashboard_data = await analyticsService.getDashboard({
                user_id,
                date_reference_start,
                date_reference_end
            });

            return res.status(200).json({
                message : 'Dashboard data retrieved successfully',
                data : dashboard_data
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error getting dashboard data',
                error : err.message
            })
        }
    }

    async getMonthlySummary(req,res){
        try{
            const {
                user_id,
                date_reference_start,
                date_reference_end
            } = financialAnalyticsSchema.parse(req.query);

            const monthly_summary = await analyticsService.getMonthlySummary({
                user_id,
                date_reference_start,
                date_reference_end
            });

            return res.status(200).json({
                message : 'Monthly summary retrieved successfully',
                data : monthly_summary
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error getting monthly summary',
                error : err.message
            })
        }
    }

    async getYearlySummary(req,res){
        try{
            const {
                user_id,
                date_reference_start,
                date_reference_end
            } = financialAnalyticsSchema.parse(req.query);

            const yearly_summary = await analyticsService.getYearlySummary({
                user_id,
                date_reference_start,
                date_reference_end
            });

            return res.status(200).json({
                message : 'Yearly summary retrieved successfully',
                data : yearly_summary
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error getting yearly summary',
                error : err.message
            })
        }
    }

    async getTotalByCategory(req,res){
        try{
            const {
                user_id,
                date_reference_start,
                date_reference_end
            } = financialAnalyticsSchema.parse(req.query);

            const total_by_category = await analyticsService.getTotalByCategory({
                user_id,
                date_reference_start,
                date_reference_end
            });

            return res.status(200).json({
                message : 'Total by category retrieved successfully',
                data : total_by_category
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error getting total by category',
                error : err.message
            })
        }
    }

    async getRecentTransactions(req,res){
        try{
            const {
                user_id,
                date_reference_start,
                date_reference_end
            } = financialAnalyticsSchema.parse(req.query);

            const recent_transactions = await analyticsService.getRecentTransactions({
                user_id,
                date_reference_start,
                date_reference_end
            });
            
            return res.status(200).json({
                message : 'Recent transactions retrieved successfully',
                data : recent_transactions
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error getting most recent transactions',
                error : err.message
            })
        }
    }
}

module.exports = new FinancialAnalyticsController();