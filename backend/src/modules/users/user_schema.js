const {z} = require('zod');

const registerSchema = z.object({
    name: z.string().min(3),
    email : z.string().email(),
    password : z.string().min(6)
});

const updateUserSchema = z.object({
    name : z.string().min(3).optional(),
    email : z.string().email().optional(),
    password : z.string().min(6).optional(),
    deleted_at : z.date().optional() || z.null().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message: "At least one field must be provided for update"}
)

const updateUserRoleSchema = z.object({
    role : z.enum(['user', 'admin'])
});

const findUserSchema = z.object({
    id : z.coerce.number().positive().optional(),
    email : z.string().email().optional(),
    name : z.string().min(3).optional(),
    role : z.enum(['user', 'admin']).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message: "At least one field must be provided for search"}
)

module.exports = {
    registerSchema,
    updateUserSchema,
    updateUserRoleSchema,
    findUserSchema
}
