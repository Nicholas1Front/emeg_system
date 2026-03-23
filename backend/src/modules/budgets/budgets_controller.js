const budgetService = require('./budgets_service');
const {
    createBudgetSchema,
    updateBudgetSchema,
    updateStatusBudgetSchema,
    findBudgetSchema
} = require('./budgets_schema');

class BudgetsController{
    async createBudget(req, res){
        try{
            const data = createBudgetSchema.parse(req.body);

            const budget = await budgetService.create({
                userId : req.user.id,
                budgetData : data
            });

            return res.status(200).json({
                message : "Budget created successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error creating budget",
                error : err.message
            })
        }
    }

    async updateBudget(req, res){
        try{
            const data = updateBudgetSchema.parse(req.body);

            const budget = await budgetService.update({
                budgetId : req.params.id,
                budgetData : data
            })

            return res.status(200).json({
                message : "Budget updated successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error updating budget",
                error : err.message
            })
        }
    }

    async updateStatusBudget(req ,res){
        try{
            const statusParsed = updateStatusBudgetSchema.parse(req.body);

            const budget = await budgetService.updateStatus({
                budgetId : req.params.id,
                statusData : statusParsed
            })

            return res.status(200).json({
                message : "Budget status updated successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error updating budget status",
                error : err.message
            })
        }
    }

    async getBudget(req, res){
        try{
            const data = findBudgetSchema.parse(req.query);

            const budget = await budgetService.find(
                data
            );

            return res.status(200).json({
                message : "Budget retrieved successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error getting budget",
                error : err.message
            })
        }
    }

    async deactivateBudget(req ,res){
        try{
            const budget = await budgetService.deactivate(req.params.id);

            return res.status(200).json({
                message : "Budget deactivated successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error deactivating budget",
                error : err.message
            })
        }
    }

    async activateBudget(req ,res){
        try{
            const budget = await budgetService.activate(req.params.id);

            return res.status(200).json({
                message : "Budget activated successfully",
                data : budget
            })
        }catch(err){
            return res.status(400).json({
                message : "Error activating budget",
                error : err.message
            })
        }
    }
}

module.exports = new BudgetsController();