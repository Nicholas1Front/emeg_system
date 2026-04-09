const techDocsRepository = require('./technical_docs_repository');
const clientsService = require('../clients/clients_service');
const attachmentsService = require('../attachments/attachments_service');

const allowedTypes = [
    'report',
    'assessment'
]

class TechnicalDocsService{
    async create({
        userId,
        docData,
        attachmentsFiles,
        signatureImg
    }){

        docData.user_id = userId;

        let client = docData.client;

        client = await clientsService.findClients(client);

        if(client.length === 0){
            if(
                client.name === undefined ||
                client.document === undefined ||
                client.type === undefined ||
                client.address === undefined
            ){
                throw new Error('Client not found and insufficient data to create a new client');
            }

            client = await clientsService.create(client);

            if(!client){
                throw new Error('Error creating client');
            }
        }else{
            client = client[0];
        }

        if(!allowedTypes.includes(docData.type)){
            throw new Error(`Invalid document type. Allowed types are: ${allowedTypes.join(', ')}`);
        }

        if(!statusList.includes(docData.status)){
            throw new Error(`Invalid document status. Allowed status are: ${statusList.join(', ')}`);
        }

        if(docData.work_order_id === undefined){
            docData.work_order_id = null;
        }

        let doc = await techDocsRepository.create({
            client_id : docData.client_id,
            work_order_id : docData.work_order_id,
            user_id : docData.user_id,
            title : "technical_doc_draft",
            type : docData.type,
            description : docData.description,
            status : 'draft',
            responsible_name : docData.responsible_name,
            responsible_role : docData.responsible_role,
            responsible_document : docData.responsible_document
        })

        if(!doc){
            throw new Error('Error creating technical document');
        }

        if(signatureImg){
            const signatureObject = await attachmentsService.uploadAttachment({
                file : signatureImg,
                entityType : 'technical_doc_signature',
                entityId : doc.id,
                requesterId : userId
            })

            if(!signatureObject){
                throw new Error('Error uploading signature image');
            }

            doc.signature_url = signatureObject.url;
            doc.is_signed = true;
            doc.status = 'finished';
        }

        if(!signatureImg || signatureImg === undefined){
            doc.is_signed = false;
            doc.status = 'pending_signature';
        }

        let uploadedAttachments = [];

        if(attachmentsFiles && attachmentsFiles.length > 0){
            for(const file of attachmentsFiles){
                const uploadedFile = await attachmentsService.uploadAttachment({
                    file : file,
                    entityType : doc.type,
                    entityId : doc.id,
                    requesterId : userId
                });

                if(!uploadedFile){
                    throw new Error('Error uploading attachment');
                }

                uploadedAttachments.push(uploadedFile);
            }
        }

        if(doc.type === 'report'){
            doc.title = `RELATÓRIO TÉCNICO - ${doc.id} - ${client.name} `
        }else{
            doc.title = `LAUDO TÉCNICO - ${doc.id} - ${client.name} `
        }

        const updatedDoc = await techDocsRepository.update({
            id : doc.id,
            docData : doc
        })
        
        if(!updatedDoc){
            throw new Error('Error updating technical document');
        }

        if(uploadedAttachments.length > 0){
            return {
                ...updatedDoc,
                attachments : uploadedAttachments
            }
        }else{
            return {
                ...updatedDoc,
                attachments : []
            }
        }
    }

    async update({
        id,
        userId,
        docData,
        signatureImg,
        attachmentsFiles
    }){
        let existingDoc = await this.find({
            id : id
        });

        if(existingDoc.length === 0){
            throw new Error('Technical document not found');
        }

        existingDoc = existingDoc[0];

        docData.user_id = userId;

        let client = null;

        if(docData.client !== undefined){
            client = docData.client;
        }

        if(client !== null){
            client = await clientsService.findClients({
                id : client.id
            });

            if(client.length === 0){
                for(const key of client){
                    if(client[key] === undefined){
                        throw new Error(`Client not found and insufficient data to create a new client. Missing field: ${key}`);
                    }
                }

                client = await clientsService.create(client);

                if(!client){
                    throw new Error('Error creating client');
                }

                client = client[0];
            }
        }else{
            client = await clientsService.findClients({
                id : existingDoc.client_id
            });

            if(client.length === 0){
                throw new Error('Client not found for the existing document');
            }

            client = client[0];
        }

        delete docData.client;
        
        docData.client_id = client.id;

        if(docData.type !== undefined){
            if(!allowedTypes.includes(docData.type)){
                throw new Error(`Invalid document type. Allowed types are: ${allowedTypes.join(', ')}`);
            }

            if(docData.type === 'report'){
                docData.title = `RELATÓRIO TÉCNICO - ${id} - ${client.name} `
            }else{
                docData.title = `LAUDO TÉCNICO - ${id} - ${client.name}`
            }
        }

        if(signatureImg){
            let existingSignature = await attachmentsService.findAttachments({
                entityType : 'technical_doc_signature',
                entityId : existingDoc.id
            })

            if(existingSignature.length === 0){
                throw new Error('Existing signature not found for this document');
            }

            existingSignature = existingSignature[0];

            const result = await attachmentsService.deleteAttachment(existingSignature.id);

            if(!result || result.message !== "Attachment deleted successfully"){
                throw new Error('Error deleting existing signature');
            }

            const signatureObject = await attachmentsService.uploadAttachment({
                file : signatureImg,
                entityType : 'technical_doc_signature',
                entityId : existingDoc.id,
                requesterId : docData.user_id
            })

            if(!signatureObject){
                throw new Error('Error uploading new signature image');
            }

            docData.signature_url = signatureObject.url;
            docData.is_signed = true;
            docData.status = 'finished';
        }

        if(!signatureImg){
            let existingSignature = await attachmentsService.findAttachments({
                entityType : 'technical_doc_signature',
                entityId : parseInt(existingDoc.id)
            });

            if(existingSignature.length === 0){
                throw new Error('Existing signature not found for this document');
            }

            existingSignature = existingSignature[0];

            const result = await attachmentsService.deleteAttachment(
                parseInt(existingSignature.id)
            )

            if(!result || result.message !== "Attachment deleted successfully"){
                throw new Error('Error deleting existing signature');
            }

            docData.signature_url = null;
            docData.is_signed = false;
            docData.status = 'pending_signature';
        }

        const uploadedDoc = await techDocsRepository.update({
            id : id,
            docData : docData
        })

        if(!uploadedDoc){
            throw new Error('Error updating technical document');
        }

        let finishedAttachments = [];

        if(attachmentsFiles && attachmentsFiles.length > 0){
            const existingIds = existingDoc.attachments.map(att => att.id);

            for(let id of existingIds){
                id = parseInt(id);

                const result = await attachmentsService.deleteAttachment(id);

                if(!result || result.message !== "Attachment deleted successfully"){
                    throw new Error('Error deleting existing attachment with id ' + id);
                }
            }

            for(const file of attachmentsFiles){
                const uploadedFile = await attachmentsService.uploadAttachment({
                    file : file,
                    entityType : uploadedDoc.type,
                    entityId : uploadedDoc.id,
                    requesterId : uploadedDoc.user_id
                });

                if(!uploadedFile){
                    throw new Error('Error uploading attachment');
                }

                finishedAttachments.push(uploadedFile);
            }
        }

        if(attachmentsFiles || attachmentsFiles.length > 0 || finishedAttachments.length > 0){
            for(const attachment of existingDoc.attachments){
                finishedAttachments.push(attachment);
            }
        }

        return {
            ...uploadedDoc,
            attachments : finishedAttachments
        }
    }

    async find(filters){
        const docs = await techDocsRepository.find({
            id : filters.id,
            client_id : filters.client_id,
            work_order_id : filters.work_order_id,
            title : filters.title,
            status : filters.status,
            responsible_name : filters.responsible_name,
            is_signed : filters.is_signed,
            includedDeactivated : filters.includedDeactivated,
            created_at_start : filters.created_at_start,
            created_at_end : filters.created_at_end
        })

        let finishedDocs = [];

        for(const doc of docs){
            const attachments = await attachmentsService.findAttachments({
                entityType : doc.type,
                entityId : doc.id
            });

            finishedDocs.push({
                ...doc,
                attachments
            })
        }

        return finishedDocs;
    }

    async deactivate({
        id,
        requesterRole
    }){
        if(requesterRole !== 'admin'){
            throw new Error('Unauthorized access');
        }

        const existingDoc = await this.find({
            id : id
        });

        if(existingDoc.length === 0){
            throw new Error('Document not found');
        }

        const deactivatedDoc = await techDocsRepository.deactivate(id);

        if(!deactivatedDoc){
            throw new Error('Error deactivating document');
        }

        for(const file of existingDoc[0].attachments){
            const result = await attachmentsService.deleteAttachment(
                parseInt(file.id)
            )

            if(!result || result.message !== "Attachment deleted successfully"){
                throw new Error('Error deleting attachment with id ' + file.id);
            }
        }

        return deactivatedDoc;
    }

    async activate({
        id,
        requesterRole
    }){
        if(requesterRole !== 'admin'){
            throw new Error('Unauthorized access');
        }

        const existingDoc = await this.find({
            id : id
        });

        if(existingDoc.length === 0){
            throw new Error('Document not found');
        }

        const activatedDoc = await techDocsRepository.activate(id);

        if(!activatedDoc){
            throw new Error('Error activating document');
        }

        return activatedDoc;
    }
}

module.exports = new TechnicalDocsService();