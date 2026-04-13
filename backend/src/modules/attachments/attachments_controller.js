const {
    createAttachmentSchema,
    generateUploadUrlSchema,
    findAttachmentSchema
} = require('./attachments_schema');

const attachmentService = require('./attachments_service');

class AttachmentsController{
    async generateUploadUrl(req, res){
        try{
            const data = generateUploadUrlSchema.parse(req.body);

            const url = await attachmentService.generateUploadUrl({
                fileName : data?.file_name || false,
                mimeType : data?.mime_type || false,
                size : data?.size || false,
                entityType : data?.entity_type || false,
                entityId : data?.entity_id || false,
            });

            return res.status(200).json({
                message : 'Upload url generated successfully',
                data : url
            })
        }catch(err){
            return res.status(400).json({
                message : 'Failed to generate upload url',
                error : err.message
            })
        }
    }

    async createAttachment(req,res){
        try{
            const data = createAttachmentSchema.parse(req.body);

            const attachment = await attachmentService.createAttachment({
                key : data?.key || false,
                url : data?.url || false,
                size : data?.size || false,
                mimeType : data?.mime_type || false,
                entityType : data?.entity_type || false,
                entityId : data?.entity_id || false,
                requesterId : req.user.id
            });

            return res.status(200).json({
                message : "Attachment created successfully",
                data : attachment
            })
        }catch(err){
            return res.status(400).json({
                message : "Failed to create attachment",
                error : err.message
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