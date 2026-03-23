const {z} = require('zod');

const createBudgetSchema = z.object({
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().max(255, 'Client name must be at most 255 characters long').optional(),
        address : z.string().max(255, 'Client address must be at most 255 characters long').optional(),
        document: z.string().min(11).optional(),
        type: z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional() 
    }),
    equipament : z.object({
        id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
        client_id: z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1).optional(),
        brand : z.string().min(1).optional(),
        identification : z.string().min(1).optional(),
    }),

    term_service : z.string().max(255, 'Term service must be at most 255 characters long').optional(),
    warranty : z.string().max(255, 'Warranty must be at most 255 characters long').optional(),
    payment_condition : z.string().max(255, 'Payment condition must be at most 255 characters long').optional(),
    discount_percent : z.coerce.number().min(0, 'Discount percent must be at least 0').max(100, 'Discount percent must be at most 100').optional(),
    observations : z.string().max(1000, 'Observations must be at most 1000 characters long').optional(),

    items: z.array(
        z.object({
            name : z.string().min(1, 'Item name is required'),
            unit_price : z.coerce.number().min(0, 'Unit price must be at least 0'),
            quantity : z.coerce.number().int().min(1, 'Quantity must be at least 1'),
            discount_percent : z.coerce.number().min(0, 'Discount percent must be at least 0').max(100, 'Discount percent must be at most 100').optional()
        })
    )

});

const updateBudgetSchema = z.object({
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().max(255, 'Client name must be at most 255 characters long').optional(),
        address : z.string().max(255, 'Client address must be at most 255 characters long').optional(),
        document: z.string().min(11).optional(),
        type: z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional() 
    }).optional(),
    equipament : z.object({
        id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
        client_id: z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1).optional(),
        brand : z.string().min(1).optional(),
        identification : z.string().min(1).optional(),
    }).optional(),

    term_service : z.string().max(255, 'Term service must be at most 255 characters long').optional(),
    warranty : z.string().max(255, 'Warranty must be at most 255 characters long').optional(),
    payment_condition : z.string().max(255, 'Payment condition must be at most 255 characters long').optional(),
    discount_percent : z.coerce.number().min(0, 'Discount percent must be at least 0').max(100, 'Discount percent must be at most 100'),
    observations : z.string().max(1000, 'Observations must be at most 1000 characters long').optional(),

    items: z.array(
        z.object({
            id : z.coerce.number().int().positive("Item ID must be a positive integer").optional(),
            name : z.string().min(1, 'Item name is required'),
            unit_price : z.coerce.number().min(0, 'Unit price must be at least 0'),
            quantity : z.coerce.number().int().min(1, 'Quantity must be at least 1'),
            discount_percent : z.coerce.number().min(0, 'Discount percent must be at least 0').max(100, 'Discount percent must be at most 100').optional()
        }).optional()
    ).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for the update" }
);

const updateStatusBudgetSchema = z.object({
    status : z.string().max(255, 'Status must be at most 255 characters long')
});

const findBudgetSchema = z.object({
    id : z.coerce.number().int().positive("Budget ID must be a positive integer").optional(),
    client_id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
    equipament_id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
    name : z.string().min(1).optional(),
    status : z.string().max(255).optional(),
    final_price : z.coerce.number().min(0).optional(),
    includedDeactivated : z.boolean().optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for get budgets" }
)

module.exports = {
    createBudgetSchema,
    updateBudgetSchema,
    updateStatusBudgetSchema,
    findBudgetSchema
}