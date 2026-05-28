const financialService = require('./financial_service');
const {
    createRecordSchema,
    createCategorySchema,
    updateRecordSchema,
    updateCategorySchema,
    findRecordsSchema,
    findCategoriesSchema
} = require('./financial_schema');

class FinancialController{
    async createRecord(req,res){
        try{
            const data = createRecordSchema.parse(req.body);

            const record = await financialService.createRecord({
                user_id : req.user.id,
                category_data : {
                    id : data.category_data.id,
                    title : data.category_data.title,
                    description : data.category_data.description,
                    type : data.category_data.type
                },
                description : data.description,
                amount : data.amount,
                type : data.type,
                date_reference : data.date_reference
            });

            return res.status(200).json({
                message : 'Record created successfully',
                data : record
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to create record',
                error : err.message
            })
        }
    }

    async createCategory(req,res){
        try{
            const data = createCategorySchema.parse(req.body);

            const category = await financialService.createCategory({
                user_id : req.user.id,
                title : data.title,
                description : data.description,
                type : data.type
            });

            return res.status(200).json({
                message : 'Category created successfully',
                data : category
            });
        }catch(err){
            return res.status(400).json({
                message : 'Failed to create category',
                error : err.message
            })
        }
    }

    async updateRecord(req,res){
        try{
            const data = updateRecordSchema.parse(req.body);

            const record = await financialService.updateRecord({
                id : req.params.id,
                user_id : req.user.id,
                recordData : data
            });

            return res.status(200).json({
                message : 'Record updated successfully',
                data : record
            });
        }catch(err){
            return res.status(400).json({
                message : 'Failed to update record',
                error : err.message
            })
        }
    }

    async updateCategory(req,res){
        try{
            const data = updateCategorySchema.parse(req.body);

            const category = await financialService.updateCategory({
                id : req.params.id,
                user_id : req.user.id,
                categoryData : data
            });

            return res.status(200).json({
                message : 'Category updated successfully',
                data : category
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to update category',
                error : err.message
            })
        }
    }

    async getRecords(req,res){
        try{
            let filters = findRecordsSchema.parse(req.query);

            const records = await financialService.findRecords(filters);

            return res.status(200).json({
                message : 'Records retrieved successfully',
                data : records
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to retrieve records',
                error : err.message
            })
        }
    }

    async getCategories(req,res){
        try{
            let filters = findCategoriesSchema.parse(req.query);

            if(filters.includedDeactivated === undefined){
                filters.includedDeactivated = false;
            }

            const categories = await financialService.findCategories(filters);

            return res.status(200).json({
                message : 'Categories retrieved successfully',
                data : categories
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to retrieve categories',
                error : err.message
            })
        }
    } 

    async deleteRecord(req,res){
        try{
            const result = await financialService.deleteRecord({
                id : req.params.id
            })

            return res.status(200).json({
                message : 'Record deleted successfully',
                data : result
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to delete record',
                error : err.message
            })
        }
    }

    async deactivateCategory(req,res){
        try{
            const result = await financialService.deactivateCategory({
                id : req.params.id
            });

            return res.status(200).json({
                message : 'Category deactivated successfully',
                data : result
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to deactivate category',
                error : err.message
            })
        }
    }

    async activateCategory(req,res){
        try{
            const result = await financialService.activateCategory({
                id : req.params.id
            });

            return res.status(200).json({
                message : 'Category activated successfully',
                data : result
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to activate category',
                error : err.message
            })
        }
    }
}

module.exports = new FinancialController();