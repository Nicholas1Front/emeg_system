const {z} = require('zod');

const financialAnalyticsSchema = z.object({
    user_id : z.coerce.number().int().positive().optional(),
    date_reference_start : z.coerce.date(),
    date_reference_end : z.coerce.date()
})

module.exports = {
    financialAnalyticsSchema
}
