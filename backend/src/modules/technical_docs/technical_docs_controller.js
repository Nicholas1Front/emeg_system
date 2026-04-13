const techDocsService = require('./technical_docs_service');
const {
    createTechDocsSchema,
    updateTechDocSchema,
    findTechDocSchema
} = require('./technical_docs_schema');

class TechnicalDocsController{
    async createDoc(req,res){
        try{

            if(req.body.client){
                try{
                    req.body.client = JSON.parse(req.body.client)
                    /* Devido a requisição ser feita via form-data o client tem que ser parseado para json */
                }catch(err){
                    return res.status(400).json({
                        message : 'Error parsing client',
                        error : err.message
                    })
                }
            }

            const data = createTechDocsSchema.parse(req.body);

            const files = req.files?.attachments || false;

            const signatureFile = req.files?.signatureImg?.[0] || false;

            const doc = await techDocsService.create({
                userId : req.user.id,
                docData : data,
                attachmentsFiles : files,
                signatureImg : signatureFile
            });

            return res.status(200).json({
                message : "Technical doc created successfully",
                data : doc
            })
        }catch(err){
            return res.status(400).json({
                message : "Error creating technical doc",
                error : err.message
            })
        }
    }

    async updateDoc(req, res){
        try{

            if(req.body.client){
                try{
                    req.body.client = JSON.parse(req.body.client)
                    /* Devido a requisição ser feita via form-data o client tem que ser parseado para json */
                }catch(err){
                    return res.status(400).json({
                        message : 'Error parsing client',
                        error : err.message
                    })
                }
            }

            const data = updateTechDocSchema.parse(req.body);

            const files = req.files?.attachments || false;

            let signatureFile = undefined;

            if(!data.remove_signature){
                signatureFile = req.files?.signatureImg?.[0];
            }else{
                signatureFile = false;
            }

            delete data.remove_signature;

            const doc = await techDocsService.update({
                id : req.params.id,
                userId : req.user.id,
                docData : data,
                signatureImg : signatureFile,
                attachmentsFiles : files
            });

            return res.status(200).json({
                message : "Technical doc updated successfully",
                data : doc
            })
        }catch(err){
            return res.status(400).json({
                message : "Error updating technical doc",
                error : err.message
            })
        }
    }

    async findDoc(req,res){
        try{
            const filters = findTechDocSchema.parse(req.query);

            const docs = await techDocsService.find(filters);

            return res.status(200).json({
                message : "Technical docs found successfully",
                data : docs
            })
        }catch(err){
            return res.status(400).json({
                message : "Error getting technical doc",
                error : err.message
            })
        }
    }

    async deactivateDoc(req,res){
        try{
            const doc = await techDocsService.deactivate({
                id : req.params.id,
                requesterRole : req.user.role
            });

            return res.status(200).json({
                message : "Technical doc deactivated successfully",
                data : doc
            })
        }catch(err){
            return res.status(400).json({
                message : "Error deactivating technical doc",
                error : err.message
            })
        }
    }

    async activateDoc(req,res){
        try{
            const doc = await techDocsService.activate({
                id : req.params.id,
                requesterRole : req.user.role
            });

            return res.status(200).json({
                message : "Technical doc activated successfully",
                data : doc
            })
        }catch(err){
            return res.status(400).json({
                message : "Error activating technical doc",
                error : err.message
            })
        }
    }
}

module.exports = new TechnicalDocsController();