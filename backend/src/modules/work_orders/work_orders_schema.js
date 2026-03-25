const {z} = require('zod');
const { update } = require('./work_orders_repository');
const { updateStatus } = require('./work_orders_service');

const createWorkOrderSchema = z.object({
    budget : z.object({
        id : z.coerce.number().int().positive("Budget ID must be a positive integer").optional(),
    }).optional(),
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name: z.string().min(1, "Name is required").optional(),
        address: z.string().min(1, "Address is required").optional(),
        document: z.string().min(11, "Document is required").optional(),
        type: z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional()
    }),
    equipament : z.object({
        id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
        client_id: z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1, "Name is required").optional(),
        brand : z.string().min(1, "Brand is required").optional(),
        identification : z.string().min(1, "Identification is required").optional(),
    }),
    entry_date : z.coerce.date({ message: "Entry date must be a valid date" }).optional(),
    exit_date : z.coerce.date({ message: "Exit date must be a valid date" }).optional(),
    warranty : z.string().min(1).max(255).optional(),
    observations : z.string().max(255).optional(),
    status : z.string().min(1).max(255).optional(),
    
    items : z.array(
        z.object({
            name : z.string().min(1, "Name is required").optional(),
            quantity : z.coerce.number().int().positive("Quantity must be a positive integer").optional(),
            status : z.string().min(1).max(255).optional(),
        }).optional()
    ).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for create work order" }
)

const updateWorkOrderSchema = z.object({
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name: z.string().min(1, "Name is required").optional(),
        address: z.string().min(1, "Address is required").optional(),
        document: z.string().min(11, "Document is required").optional(),
        type: z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional()
    }),
    equipament : z.object({
        id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
        client_id: z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1, "Name is required").optional(),
        brand : z.string().min(1, "Brand is required").optional(),
        identification : z.string().min(1, "Identification is required").optional(),
    }),
    entry_date : z.coerce.date({ message: "Entry date must be a valid date" }).optional(),
    exit_date : z.coerce.date({ message: "Exit date must be a valid date" }).optional(),
    warranty : z.string().min(1).max(255).optional(),
    observations : z.string().max(255).optional(),
    status : z.string().min(1).max(255).optional(),
    
    items : z.array(
        z.object({
            name : z.string().min(1, "Name is required").optional(),
            quantity : z.coerce.number().int().positive("Quantity must be a positive integer").optional(),
            status : z.string().min(1).max(255).optional(),
        }).optional()
    ).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update work order" }
);

const updateStatusWorkOrderSchema = z.object({
    work_order_status : z.string().min(1).max(255).optional(),
    items : z.array({
        id : z.coerce.number().int().positive("Item ID must be a positive integer").optional(),
        status : z.string().min(1).max(255).optional()
    }).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update status work order" }
)

const findWorkOrdersSchema = z.object({
    id : z.coerce.number().int().positive("ID must be a positive integer").optional(),
    name : z.string().min(1).max(255).optional(),
    client_id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
    equipament_id : z.coerce.number().int().positive("Equipament ID must be a positive integer").optional(),
    user_id : z.coerce.number().int().positive("User ID must be a positive integer").optional(),
    entry_date : z.coerce.date({ message: "Entry date must be a valid date" }).optional(),
    exit_date : z.coerce.date({ message: "Exit date must be a valid date" }).optional(),
    status : z.string().min(1).max(255).optional(),
    includedDeactivated : z.boolean().optional()
})

module.exports = {
    createWorkOrderSchema,
    updateWorkOrderSchema,
    updateStatusWorkOrderSchema,
    findWorkOrdersSchema
}