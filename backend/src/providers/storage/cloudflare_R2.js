const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand
} = require('@aws-sdk/client-s3');

const path = require('path');
const crypto = require('crypto');

class CloudflareR2Provider {
    constructor(){
        this.client = new S3Client({
            region: 'auto',
            endpoint : process.env.CLOUDFLARE_R2_ENDPOINT_URL,
            credentials : {
                accessKeyId : process.env.CLOUDFLARE_R2_ACCESS_KEY,
                secretAccessKey : process.env.CLOUDFLARE_R2_SECRET_KEY
            }
        })

        console.log("Endpoint:", process.env.CLOUDFLARE_R2_ENDPOINT_URL);
        console.log("Bucket:", process.env.CLOUDFLARE_R2_BUCKET);
        console.log("AccessKey:", process.env.CLOUDFLARE_R2_ACCESS_KEY);
    }

    generateFileKey(originalName, entityType, entityId){
        const ext = path.extname(originalName);
        const randomHash = crypto.randomBytes(16).toString('hex');

        return `${entityType}/${entityId}/${randomHash}${ext}`;
    }

    async uploadFile({
        buffer,
        mimeType,
        key
    }){
        const command = new PutObjectCommand({
            Bucket : process.env.CLOUDFLARE_R2_BUCKET,
            Key : key,
            Body : buffer,
            ContentType : mimeType
        })

        await this.client.send(command);

        return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    }

    async deleteFile(key){
        const command = new DeleteObjectCommand({
            Bucket : process.env.CLOUDFLARE_R2_BUCKET,
            Key : key
        });

        await this.client.send(command)
    }
}

module.exports = new CloudflareR2Provider();