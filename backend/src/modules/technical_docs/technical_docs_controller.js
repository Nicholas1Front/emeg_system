const techDocsService = require('./technical_docs_service');
const {
    createTechDocSchema,
    updateTechDocSchema,
    findTechDocSchema
} = require('./technical_docs_schema');

class TechnicalDocsController{
    async createDoc(req,res){
        try{
            const data = createTechDocSchema.parse(req.body);

            const doc = await techDocsService.create({
                userId : req.user.id,
                docData : data
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
            let data = updateTechDocSchema.parse(req.body);

            let signatureData = false;

            if(data.signature){
                signatureData = data.signature;
            }

            delete data.signature;

            let removeAttachments = false;

            if(data.remove_attachments){
                removeAttachments = data.remove_attachments;
            }

            delete data.remove_attachments;

            const doc = await techDocsService.update({
                id : req.params.id,
                userId : req.user.id,
                docData : data,
                signatureData,
                removeAttachments
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