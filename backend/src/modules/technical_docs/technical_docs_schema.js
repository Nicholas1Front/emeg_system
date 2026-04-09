const {z} = require('zod');

const createTechDocSchema = z.object({
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1).optional(),
        address : z.string().min(1).optional(),
        document : z.string().min(11).optional(),
        type : z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional()
    }),
    work_order_id : z.coerce.number().positive("Work order ID must be a positive integer").optional(),
    description : z.string().min(1),
    type : z.string().min(1),
    responsible_name : z.string().min(1).optional(),
    responsible_document : z.string().min(11, "Responsible document must be at least 11 characters").optional(),
    responsible_role : z.string().min(1).optional()
});

const updateTechDocSchema = z.object({
    client : z.object({
        id : z.coerce.number().int().positive("Client ID must be a positive integer").optional(),
        name : z.string().min(1).optional(),
        address : z.string().min(1).optional(),
        document : z.string().min(11).optional(),
        type : z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'").optional()
    }).optional(),
    work_order_id : z.coerce.number().positive("Work order ID must be a positive integer").optional(),
    description : z.string().min(1).optional(),
    type : z.string().min(1).optional(),
    responsible_name : z.string().min(1).optional(),
    responsible_document : z.string().min(11, "Responsible document must be at least 11 characters").optional(),
    responsible_role : z.string().min(1).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update"}
)

const findTechDocSchema = z.object({
    id : z.coerce.number().int().positive().min(1).optional(),
    client_id : z.coerce.number().int().positive().min(1).optional(),
    work_order_id : z.coerce.number().int().positive().min(1).optional(),
    title : z.string().min(1).optional(),
    status : z.string().min(1).optional(),
    responsible_name : z.string().min(1).optional(),
    is_signed : z.boolean().optional(),
    includedDeactivated : z.boolean().optional(),
    created_at_start : z.coerce.date().optional(),
    created_at_end : z.coerce.date().optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for get tech docs" }
)

module.exports = {
    createTechDocSchema,
    updateTechDocSchema,
    findTechDocSchema
}