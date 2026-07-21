const analyticsRepository = require('./financial_analytics_repository');

class AnalyticsService{
    async getDashboard({
        user_id,
        date_reference_start,
        date_reference_end
    }){

        const start = new Date(date_reference_start);
        const end = new Date(date_reference_end);

        if(start > end || start == end){
            throw new Error('Invalid date range');
        }

        const dashboard_data = await analyticsRepository.getDashboard({
            user_id,
            date_reference_start,
            date_reference_end
        });
        
        if(!dashboard_data){
            throw new Error('Dashboard data not found');
        }

        return dashboard_data

    }

    async getMonthlySummary({
        user_id,
        date_reference_start,
        date_reference_end
    }){

        const start = new Date(date_reference_start);
        const end = new Date(date_reference_end);

        const start_string = start.toISOString();
        const end_string = end.toISOString();

        const month_start = Number(start_string.split('-')[1]);
        const month_end = Number(end_string.split('-')[1]);

        if(month_start >= month_end){
            throw new Error('Invalid date range')
        }

        const monthly_summary = await analyticsRepository.getMonthlySummary({
            user_id,
            date_reference_start,
            date_reference_end
        });

        if(!monthly_summary){
            throw new Error('Monthly summary not found');
        }

        return monthly_summary
    }

    async getYearlySummary({
        user_id,
        date_reference_start,
        date_reference_end
    }){

        const start = new Date(date_reference_start);
        const end = new Date(date_reference_end);

        const start_string = start.toISOString();
        const end_string = end.toISOString();

        const year_start = Number(start_string.split('-')[0]);
        const year_end = Number(end_string.split('-')[0]);

        if(year_start > year_end || year_start == year_end){
            throw new Error('Invalid date range');
        }

        const yearly_summary = await analyticsRepository.getYearlySummary({
            user_id,
            date_reference_start,
            date_reference_end
        });
        
        if(!yearly_summary){
            throw new Error('Yearly summary not found');
        }

        return yearly_summary
    }

    async getTotalByCategory({
        user_id,
        date_reference_start,
        date_reference_end
    }){
        const start = new Date(date_reference_start);
        const end = new Date(date_reference_end);

        if(start > end || start == end){
            throw new Error('Invalid date range');
        }

        const total_by_category = await analyticsRepository.getTotalByCategory({
            user_id,
            date_reference_start,
            date_reference_end
        });

        if(!total_by_category){
            throw new Error('Total by category not found');
        }

        return total_by_category
    }

    async getRecentTransactions({
        user_id,
        date_reference_start,
        date_reference_end
    }){
        const start = new Date(date_reference_start);
        const end = new Date(date_reference_end);

        if(start > end || start == end){
            throw new Error('Invalid date range');
        }

        const recent_transactions = await analyticsRepository.getRecentTransactions({
            user_id,
            date_reference_start,
            date_reference_end
        });
        
        if(!recent_transactions){
            throw new Error('Recent transactions not found');
        }

        return recent_transactions
    }
}

module.exports= new AnalyticsService()