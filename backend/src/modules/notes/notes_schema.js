const {z} = require('zod');

const createNoteSchema = z.object({
    title : z.string(),
    content : z.string().min(1),
    date_reference : z.coerce.date()
});

const updateNoteSchema = z.object({
    title : z.string().optional(),
    content : z.string().min(1).optional(),
    date_reference : z.coerce.date().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for update"}
)

const findNoteSchema = z.object({
    id : z.string().uuid().optional(),
    creator_id : z.string().uuid().optional(),
    date_reference_start : z.coerce.date().optional(),
    date_reference_end : z.coerce.date().optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get notes"}
)

module.exports = {
    createNoteSchema,
    updateNoteSchema,
    findNoteSchema
}