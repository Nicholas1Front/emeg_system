const { z } = require('zod');

const createClientSchema = z.object({
    name: z.string().min(1, "Name is required"),
    address: z.string().min(1, "Address is required"),
    document: z.string().min(11, "Document is required"),
    type: z.enum(['PF', 'PJ'], "Type must be either 'PF' or 'PJ'")
})

const createContactSchema = z.object({
    client_id: z.number().int().positive("Client ID must be a positive integer"),
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    phone: z.string().min(1, "Phone is required")
});

const updateClientSchema = z.object({
    name: z.string().min(1).optional(),
    address: z.string().min(1).optional(),
    document: z.string().min(11).optional(),
    type: z.enum(['PF', 'PJ']).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }
);

const updateContactSchema = z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional()
}).refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update" }
);

const findClientSchema = z.object({
    id : z.coerce.number().int().positive().optional(),
    name : z.string().min(1).optional(),
    address : z.string().min(1).optional(),
    document : z.string().min(11).optional(),
    type : z.enum(['PF', 'PJ']).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get clients"}
);

const findContactSchema = z.object({
    id : z.coerce.number().int().positive().optional(),
    client_id : z.coerce.number().int().positive().optional(),
    name : z.string().min(1).optional(),
    email : z.string().email().optional(),
    phone : z.string().min(1).optional()
}).refine(
    data => Object.keys(data).length > 0,
    {message : "At least one field must be provided for get contacts"}
);

module.exports = {
    createClientSchema,
    createContactSchema,
    updateClientSchema,
    updateContactSchema,
    findClientSchema,
    findContactSchema
}
