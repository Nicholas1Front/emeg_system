const {z} = require('zod');

const generateUploadUrlSchema = z.object({
    file_name : z.string().min(1, "File name is required"),
    mime_type : z.string().min(1, "Mime type is required"),
    size : z.coerce.number().positive('Size must be greater than zero'),
    entity_type : z.string().min(1, "Entity type is required"),
    entity_id : z.coerce.number().int().positive("Entity ID must be a positive integer"),
});

const createAttachmentSchema = z.object({
    key : z.string().min(1, "Key is required"),
    url : z.string().min(1, "URL is required"),
    mime_type : z.string().min(1, "Mime type is required"),
    size : z.coerce.number().positive('Size must be greater than zero'),
    entity_type : z.string().min(1, "Entity type is required"),
    entity_id : z.coerce.number().int().positive("Entity ID must be a positive integer"),
})

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
    generateUploadUrlSchema,
    createAttachmentSchema,
    findAttachmentSchema
}