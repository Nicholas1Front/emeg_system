const {z} = require('zod');

const createAttachmentSchema = z.object({
    entity_type : z.string().min(1),
    entity_id : z.coerce.number().int().positive()
});

const findAttachmentSchema = z.object({
    id : z.coerce.number().int().positive().optional(),
    entity_type : z.string().min(1).optional(),
    entity_id : z.coerce.number().int().positive().optional(),
    original_name : z.string().min(1).optional(),
    mime_type : z.string().min(1).optional(),
    size : z.coerce.number().int().positive().optional(),
    created_by : z.coerce.number().int().positive().optional()
}).refine(data => Object.values(data).some(value => value !== undefined),
    {message : "At least one field must be provided for get attachments"}
)

module.exports = {
    createAttachmentSchema,
    findAttachmentSchema
}