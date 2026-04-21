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
    }){

        docData.user_id = userId;

        let client = docData.client;

        delete docData.client;

        if(client.id !== undefined){
            client = await clientsService.findClients({
                id : client.id
            })

            if(client.length === 0){
                throw new Error("Client not found")
            }

            client = client[0];
        }

        if(client.id === undefined){
            if(
                client.name === undefined ||
                client.address === undefined ||
                client.type === undefined ||
                client.document === undefined
            ){
                throw new Error('Client data insuficient')
            }

            const newClient = await clientsService.createClient(client);

            if(!newClient){
                throw new Error("Error creating client")
            }

            client = newClient;
        }

        docData.client_id = client.id;

        if(!allowedTypes.includes(docData.type)){
            throw new Error(`Invalid document type. Allowed types are: ${allowedTypes.join(', ')}`);
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
            responsible_name : docData.responsible_name,
            responsible_role : docData.responsible_role,
            responsible_document : docData.responsible_document,
            signature_url : null,
            signed_at : null,
            is_signed : false
        })

        if(!doc){
            throw new Error('Error creating technical document');
        }
        
        let updatedDoc = doc;

        if(updatedDoc.type === 'report'){
            updatedDoc.title = `RELATÓRIO TÉCNICO - ${updatedDoc.id} - ${client.name}`
        }else{
            updatedDoc.title = `LAUDO TÉCNICO - ${updatedDoc.id} - ${client.name}`
        }

        updatedDoc = await techDocsRepository.update({
            id : updatedDoc.id,
            docData : updatedDoc
        });

        if(!updatedDoc){
            throw new Error('Error updating technical document');
        }

        return updatedDoc;

    }

    async update({
        id,
        userId,
        docData,
        signatureData,
        removeAttachments
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
            if(client.id !== undefined){
                client = await clientsService.findClients({
                    id : client.id
                });

                if(client.length === 0){
                    throw new Error('Client not found')
                }
            }

            if(client.id === undefined){
                const newClient = await clientsService.createClient(client);

                if(!newClient){
                    throw new Error('Error creating client');
                }

                client = newClient;
            }
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

        if(signatureData){
            if(signatureData.remove_signature){
                const existingSignature = await attachmentsService.findAttachments({
                    entity_type : 'technical_doc_signature',
                    entity_id : id
                });

                if(existingSignature.length <= 0){
                    throw new Error('Signature not found for the existing document');
                }

                const result = await attachmentsService.deleteAttachment({
                    attachmentId : existingSignature[0].id,
                    requesterRole : 'admin'
                });

                if(!result || result.message !== "Attachment deleted successfully"){
                    throw new Error('Error deleting existing signature with id ' + existingSignature[0].id);
                }

                docData.signature_url = null;
                docData.is_signed = false;
                docData.signed_at = null;
            }

            if(signatureData.update_signature){
                const signature = await attachmentsService.findAttachments({
                    entity_tyoe : 'technical_doc_signature',
                    entity_id : id
                })

                if(signature.length <= 0){
                    throw new Error('Signature not found for the existing document');
                }

                docData.signature_url = signature[0].url;
                docData.is_signed = true;
                docData.signed_at = signature[0].created_at;
            }
        }

        let finalAttachments = [];

        const existingAttachments = await attachmentsService.findAttachments({
            entity_type : 'technical_doc_attachment',
            entity_id : id
        });

        finalAttachments = existingAttachments;

        if(removeAttachments){
            for(const attachment of existingAttachments){
                const result =await attachmentsService.deleteAttachment({
                    attachmentId : attachment.id,
                    requesterRole : 'admin'
                });

                if(!result || result.message !== "Attachment deleted successfully!"){
                    throw new Error('Error deleting existing attachment with id' + attachment.id);
                }
            }

            finalAttachments = [];
        }

        const uploadedDoc = await techDocsRepository.update({
            id : id,
            docData : docData
        })

        if(!uploadedDoc){
            throw new Error('Error updating technical document');
        }

        return {
            ...uploadedDoc,
            attachments : finalAttachments
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
                entity_type : 'technical_doc_attachment',
                entity_id : doc.id
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

        for(const attachment of existingDoc[0].attachments){
            const result = await attachmentsService.deleteAttachment({
                attachmentId : attachment.id,
                requesterRole : 'admin'
            })

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