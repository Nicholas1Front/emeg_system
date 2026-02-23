const {
    createAttachmentSchema,
    findAttachmentSchema
} = require('./attachments_schema');

const attachmentService = require('./attachments_service');

class AttachmentsController{
    async createAttachment(req, res){
        try{
            const file = req.file;

            const rawData = {
                entity_type : req.body.entity_type,
                entity_id : req.body.entity_id
            }

            const validateData = createAttachmentSchema.parse(rawData);

            const attachment = await attachmentService.uploadAttachment({
                file,
                entityType : validateData.entity_type,
                entityId : validateData.entity_id,
                requesterId : req.user.id
            });

            return res.status(201).json({
                message : "Attachment uploaded successfully",
                data : attachment
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to upload attachment",
                error : err
            })
        }
    }

    async deleteAttachment(req, res){
        try{

            await attachmentService.deleteAttachment({
                attachmentId : req.params.id,
                requesterRole : req.user.role
            });

            return res.status(200).json({
                message : "Attachment deleted successfully"
            })
    
        }catch(err){
            return res.status(400).json({
                message : "Failed to delete attachment",
                error : err.message
            })
        }
    }

    async getAttachments(req, res){
        try{
            const rawFilters = {
                id : req.query.id,
                entity_type : req.query.entity_type,
                entity_id : req.query.entity_id,
                created_by : req.query.created_by,
                original_name : req.query.original_name,
                mime_type : req.query.mime_type,
                size : req.query.size
            };

            const filters = findAttachmentSchema.parse(rawFilters);

            const attachments = await attachmentService.findAttachments(filters);

            return res.status(200).json({
                message : "Attachments fetched successfully",
                data : attachments
            })

        }catch(err){
            return res.status(400).json({
                message : "Failed to fetch attachments",
                error : err.message
            })
        }
    }
}

module.exports = new AttachmentsController();