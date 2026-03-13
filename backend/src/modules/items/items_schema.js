const {z} = require('zod');

const createItemSchema = z.object({
    name : z.string().min(1, 'Name is required'),
    description : z.string().optional(),
    base_price : z.coerce.number().positive('Base price must be greater than zero').optional(),
    item_type : z.enum(['service', 'part'], 'Item type must be either "service" or "part"'),
    category : z.string().min(1, 'Category is required'),
    quantity_available : z.coerce.number().int().positive('Quantity available must be greater than zero').optional()
})

const updateItemSchema = z.object({
    name : z.string().min(1).optional(),
    user_id : z.coerce.number().int().positive('User ID must be a positive integer').optional(),
    description : z.string().optional(),
    base_price : z.coerce.number().positive('Base price must be greater than zero').optional(),
    item_type : z.enum(['service', 'part'], 'Item type must be either "service" or "part"').optional(),
    category : z.string().min(1).optional(),
    quantity_available : z.coerce.number().int().positive('Quantity available must be greater than zero').optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for update' }
)

const findItemSchema = z.object({
    id : z.coerce.number().int().positive('Item ID must be a positive integer').optional(),
    user_id : z.coerce.number().int().positive('User ID must be a positive integer').optional(),
    name : z.string().min(1).optional(),
    description : z.string().optional(),
    base_price : z.coerce.number().positive('Base price must be greater than zero').optional(),
    item_type : z.enum(['service', 'part'], 'Item type must be either "service" or "part"').optional(),
    category : z.string().min(1).optional(),
    quantity_available : z.coerce.number().int().positive('Quantity available must be greater than zero').optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: 'At least one field must be provided for get items' }
)

module.exports = {
    createItemSchema,
    updateItemSchema,
    findItemSchema
}