const CloudflareR2Provider = require("../../providers/storage/cloudflare_R2");
const attachmentRepository = require("./attachments_repository");

const max_file_size = 2 * 1024 * 1024 * 1024 // 2GB

class AttachmentsService {
    async uploadAttachment({ 
        file, 
        entityType,
        entityId,
        requesterId 
    }){
        if(!file || file === undefined){
            throw new Error("No file provided");
        }

        if(file.size > max_file_size){
            throw new Error("File size exceeds the maximum allowed limit of 2GB");
        }

        const fileKey = CloudflareR2Provider.generateFileKey(
            file.originalName,
            entityType,
            entityId
        )

        const fileUrl = await CloudflareR2Provider.uploadFile({
            buffer : file.buffer,
            mimeType : file.mimeType,
            key : fileKey
        })

        const attachment = await attachmentRepository.create({
            original_name : file.originalName,
            mime_type : file.mimeType,
            size : file.size,
            url : fileUrl,
            storage_key : fileKey,
            entity_type : entityType,
            entity_id : entityId,
            created_by : requesterId
        })

        return attachment;
    }

    async deleteAttachment({
        attachmentId,
        requesterRole
    }){
        if(requesterRole !== 'admin'){
            throw new Error("Only admins can delete attachments");
        }

        const attachment = await attachmentRepository.find(attachmentId);

        if(attachment.length === 0){
            throw new Error("Attachment not found");
        }

        await CloudflareR2Provider.deleteFile(attachment[0].storage_key);

        await attachmentRepository.delete(attachmentId);

        return { message : "Attachment deleted successfully" };
    }

    async getAttachments(filters){
        const attachments = await attachmentRepository.find(filters);

        if(attachments.length === 0 || !attachments){
            throw new Error("No attachments found");
        }

        return attachments;
    }
}

module.exports = new AttachmentsService();