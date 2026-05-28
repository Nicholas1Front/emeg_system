const {z} = require('zod');

const createRecordSchema = z.object({
    category_data : z.object({
        id : z.coerce.number().positive().optional(),
        title : z.string().optional(),
        description : z.string().optional(),
        type : z.string().optional()
    }).refine(
        data => Object.values(data).some(value => value !== undefined),
        {message : "At least one field must be provided for create category"}
    ),
    description : z.string().optional(),
    amount : z.coerce.number().positive('Amount must be greater than zero'),
    type : z.string().min(1, 'Type is required'),
    date_reference : z.coerce.date()
});

const createCategorySchema = z.object({
    title : z.string().min(1, 'Title is required'),
    description : z.string().min(1, 'Description is required'),
    type : z.string().min(1, 'Type is required')
});

const updateRecordSchema = z.object({
    category_id : z.coerce.number().positive('Category ID must be greater than zero').optional(),
    description : z.string().optional(),
    amount : z.coerce.number().positive('Amount must be greater than zero').optional(),
    type : z.string().min(1, 'Type is required').optional(),
    date_reference : z.coerce.date().optional()
}).refine(
    data => Object.values(data).some(value => value !== undefined),
    {message : "At least one field must be provided for update record"}
);

const updateCategorySchema = z.object({
    title : z.string().min(1, 'Title is required').optional(),
    description : z.string().min(1, 'Description is required').optional(),
    type : z.string().min(1, 'Type is required').optional()
}).refine(
    data => Object.values(data).some(value => value !== undefined),
    {message : "At least one field must be provided for update category"}
);

const findRecordsSchema = z.object({
    user_id : z.coerce.number().positive('User ID must be greater than zero').optional(),
    month_start : z.coerce.number().min(1).max(12).optional(),
    month_end : z.coerce.number().min(1).max(12).optional(),
    year_start : z.coerce.number().min(1900).max(2100).optional(),
    year_end : z.coerce.number().min(1900).max(2100).optional(),
    date_reference_start : z.coerce.date().optional(),
    date_reference_end : z.coerce.date().optional(),
    type : z.string().min(1, 'Type is required').optional(),
    amount : z.coerce.number().positive('Amount must be greater than zero').optional()
})

const findCategoriesSchema = z.object({
    user_id : z.coerce.number().positive('User ID must be greater than zero').optional(),
    id : z.coerce.number().positive('Category ID must be greater than zero').optional(),
    title : z.string().min(1, 'Title is required').optional(),
    description : z.string().min(1, 'Description is required').optional(),
    type : z.string().min(1, 'Type is required').optional()
})

module.exports = {
    createRecordSchema,
    createCategorySchema,
    updateRecordSchema,
    updateCategorySchema,
    findRecordsSchema,
    findCategoriesSchema
}

