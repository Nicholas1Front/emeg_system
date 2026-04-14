const {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    HeadObjectCommand
} = require('@aws-sdk/client-s3')

const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const path = require('path');
const crypto = require('crypto')

class CloudflareR2Provider{
    constructor(){
        this.client = new S3Client({
            region : 'auto',
            endpoint : process.env.CLOUDFLARE_R2_ENDPOINT_URL,
            credentials : {
                accessKeyId : process.env.CLOUDFLARE_R2_ACCESS_KEY,
                secretAccessKey : process.env.CLOUDFLARE_R2_SECRET_KEY
            },
            forcePathStyle : true
        })
    }

    generateFileKey(
        originalName,
        entityType,
        entityId
    ){
        const ext = path.extname(originalName);

        const randomHash = crypto.randomBytes(16).toString('hex');

        return `${entityType}/${entityId}/${randomHash}${ext}`
    }

    async generateSignedUploadUrl({
        key,
        mimeType
    }){
        const command = new PutObjectCommand({
            Bucket : process.env.CLOUDFLARE_R2_BUCKET,
            Key : key,
            ContentType : mimeType
        });

        const signedUrl = await getSignedUrl(
            this.client,
            command,
            {
                expiresIn : 60 * 5
            }
        )

        return signedUrl
    }

    getPublicUrl(key){
        const baseUrl = process.env.CLOUDFLARE_R2_ENDPOINT_URL;

        return `${baseUrl}/${key}`
    }

    async fileExists(key){
        try{
            const command = new HeadObjectCommand({
                Bucket : process.env.CLOUDFLARE_R2_BUCKET,
                Key : key
            });

            await this.client.send(command);

            return true
        }catch(err){
            return false
        }
    }

    async deleteFile(key){
        const command = new DeleteObjectCommand({
            Bucket : process.env.CLOUDFLARE_R2_BUCKET,
            Key : key
        });

        await this.client.send(command);
    }
}

module.exports = new CloudflareR2Provider();