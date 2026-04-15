const CloudflareR2Provider = require("../../providers/storage/cloudflare_R2");
const attachmentRepository = require("./attachments_repository");

const max_file_size = 2 * 1024 * 1024 * 1024 // 2GB

class AttachmentsService {
    async generateUploadUrl({
        fileName,
        mimeType,
        size,
        entityType,
        entityId,
    }){
        if(!fileName || !mimeType || !size){
            throw new Error('Missing file data');
        }

        if(size <= 0){
            throw new Error('Invalid file size');
        }

        if(size > max_file_size){
            throw new Error('File size is too large');
        }

        const key = CloudflareR2Provider.generateFileKey(
            fileName,
            entityType,
            entityId
        );

        const uploadUrl = await CloudflareR2Provider.generateSignedUploadUrl({
            key,
            mimeType
        })

        const publicUrl = CloudflareR2Provider.getPublicUrl(key);

        return {
            upload_url : uploadUrl,
            key : key,
            public_url : publicUrl
        }
    }

    async createAttachment({
        key,
        url,
        size,
        mimeType,
        entityType,
        entityId,
        requesterId
    }){
        if(!key || !url){
            throw new Error('Missing file data');
        }

        if(!key.startsWith(`${entityType}/${entityId}`)){
            throw new Error('Invalid key structure')
        }

        const exists = await CloudflareR2Provider.fileExists(key);

        if(!exists){
            throw new Error('File does not exist');
        }

        const attachment = await attachmentRepository.create({
            original_name : key.split('/').pop(),
            entity_type : entityType,
            entity_id : entityId,
            storage_key : key,
            mime_type : mimeType,
            size : size,
            created_by : requesterId,
            url : url
        });

        if(!attachment){
            throw new Error('Error creating attachment');
        }

        return attachment
    }

    async deleteAttachment({
        attachmentId,
        requesterRole
    }){
        if(requesterRole !== 'admin'){
            throw new Error("Only admins can delete attachments");
        }

        const attachment = await attachmentRepository.find({
            id : attachmentId
        });

        if(attachment.length === 0){
            throw new Error("Attachment not found");
        }

        await CloudflareR2Provider.deleteFile(attachment[0].storage_key);

        await attachmentRepository.delete(attachmentId);

        return { message : "Attachment deleted successfully" };
    }

    async findAttachments(filters){
        const attachments = await attachmentRepository.find(filters);

        return attachments;
    }
}

module.exports = new AttachmentsService();