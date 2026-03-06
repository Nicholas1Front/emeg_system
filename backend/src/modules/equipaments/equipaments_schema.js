const {z} = require('zod');
const { id } = require('zod/v4/locales');

const createEquipamentSchema = z.object({
    client_id: z.number().int().positive("Client ID must be a positive integer"),
    name : z.string().min(1, "Name is required"),
    brand : z.string().min(1, "Brand is required"),
    identification : z.string().min(1, "Identification is required"),
    deleted_at : z.date().optional()
});

const updateEquipamentSchema = z.object({
    client_id: z.number().int().positive("Client ID must be a positive integer").optional(),
    name : z.string().min(1).optional(),
    brand : z.string().min(1).optional(),
    identification : z.string().min(1).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for update"}
);

const findEquipamentSchema = z.object({
    id : z.number().int().positive("Equipament ID must be a positive integer").optional(),
    client_id: z.number().int().positive("Client ID must be a positive integer").optional(),
    name : z.string().min(1).optional(),
    brand : z.string().min(1).optional(),
    identification : z.string().min(1).optional(),
    includedDeleted : z.boolean().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get equipaments"}
);

module.exports = {
    createEquipamentSchema,
    updateEquipamentSchema,
    findEquipamentSchema
}