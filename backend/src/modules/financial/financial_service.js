const financialRepository = require('./financial_repository');

const allowedTypes = [
    'income',
    'expense'
];

class FinancialService{
    async createRecord({
        user_id,
        category_data,
        description,
        amount,
        type,
        date_reference
    }){
        if(!allowedTypes.includes(type)){
            throw new Error('Invalid record type');
        }

        let category = null;

        if(category_data && category_data.id !== undefined){
            category = await this.findCategories({
                id : category_data.id
            });

            if(category.length === 0){
                throw new Error('Category not found');
            }

            category = category[0];
        }else{
            if(
                category_data.title === undefined ||
                category_data.description === undefined ||
                category_data.type === undefined
            ){
                throw new Error('Category data is incomplete');
            }

            category = await this.createCategory({
                user_id : user_id,
                title : category_data.title,
                description : category_data.description,
                type : category_data.type
            })

            if(!category){
                throw new Error('Failed to create category');
            }
        }

        if(!description || description === undefined){
            description = `descrição referente a ${title} - tipo : ${type}`
        }

        if(amount <= 0){
            throw new Error('Amount must be greater than zero');
        }

        const record = await financialRepository.createRecord({
            user_id,
            category_id : category.id,
            description,
            amount,
            type,
            date_reference
        })

        if(!record){
            throw new Error('Failed to create record');
        }

        return record
    }

    async createCategory({
        user_id,
        title,
        description,
        type
    }){

        if(!allowedTypes.includes(type)){
            throw new Error('Invalid category type');
        }

        if(!description || description === undefined){
            description = `descrição referente a ${title} - tipo : ${type}`
        }

        const result = await this.findCategories({
            title : title,
            type : type,
        });

        if(result.length > 0){
            throw new Error('Category with the same title and type already exists');
        }

        const category = await financialRepository.createCategory({
            user_id,
            title,
            description,
            type
        });

        if(!category){
            throw new Error('Failed to create category');
        }

        return category;
    }

    async findCategories(filters){
        const categories = await financialRepository.getCategories({
            user_id: filters.user_id,
            id: filters.id,
            title: filters.title,
            description: filters.description,
            type: filters.type,
            includedDeactivated: filters.includedDeactivated
        });

        return categories;
    }

    async findRecords(filters){
        const records = await financialRepository.getRecords({
            user_id: filters.user_id,
            month_start: filters.month_start,
            month_end: filters.month_end,
            year_start: filters.year_start,
            year_end: filters.year_end,
            date_reference_start: filters.date_reference_start,
            date_reference_end: filters.date_reference_end,
            type: filters.type,
            amount: filters.amount
        });

        return records;
    }

    async updateRecord({
        id,
        recordData
    }){
        let record = await this.findRecords({
            id : id
        });

        if(record.length === 0){
            throw new Error('Record not found');
        }

        if(recordData.type !== undefined){
            if(!allowedTypes.includes(recordData.type)){
                throw new Error('Invalid record type');
            }
        }

        if(recordData.category_id && recordData.category_id !== undefined){
            const category = await this.findCategories({
                id : recordData.category_id
            });

            if(category.length === 0){
                throw new Error('Category not found');
            }
        }

        if(recordData.amount && recordData.amount <= 0){
            throw new Error('Amount must be greater than zero');
        }

        const updatedRecord = await financialRepository.updateRecord({
            id,
            recordData
        });

        if(!updatedRecord){
            throw new Error('Failed to update record');
        }

        return updatedRecord;
    }

    async updateCategory({
        id,
        categoryData
    }){
       let existingCategory = await this.findCategories({
           id : id
       });

       if(existingCategory.length === 0){
            throw new Error('Category not found');
       }

       if(categoryData.type && categoryData.type !== undefined){
            if(!allowedTypes.includes(categoryData.type)){
                throw new Error('Invalid category type');
            }
       }

       if(categoryData.title !== undefined && categoryData.type !== undefined){
            const result = await this.findCategories({
                title : categoryData.title,
                type : categoryData.type,
            });

            if(result.length > 0 && result[0].id !== id){
                throw new Error('Category with the same title and type already exists');
            }
       }

       const updatedCategory = await financialRepository.updateCategory({
            id,
            categoryData
       });

       if(!updatedCategory){
            throw new Error('Failed to update category')
       }

       return updatedCategory;
    }

    async deleteRecord(id){
        const record = await this.findRecords({
            id : id
        });

        if(record.length === 0){
            throw new Error('Record not found');
        }

        const result = await financialRepository.deleteRecord(id);

        if(!result){
            throw new Error('Failed to delete record');
        }

        return result
    }

    async deactivateCategory(id){

        const category = await this.findCategories({
            id : id
        })

        if(category.length === 0){
            throw new Error('Category not found');
        }

        const result = await financialRepository.deactivateCategory(id);

        if(!result){
            throw new Error('Failed to deactivate category');
        }

        return result;
    }

    async activateCategory(id){

        const category = await this.findCategories({
            id : id
        })

        if(category.length === 0){
            throw new Error('Category not found');
        }

        const result = await financialRepository.activateCategory(id);

        if(!result){
            throw new Error('Failed to activate category');
        }

        return result;
    }
}

module.exports = new FinancialService();