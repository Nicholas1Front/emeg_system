const equipamentsService = require('./equipaments_service');
const {
    createEquipamentSchema,
    updateEquipamentSchema,
    findEquipamentSchema
} = require('./equipaments_schema');
const { update } = require('./equipaments_repository');

class EquipamentsController{
    async createEquipament(req,res){
        try{
            const equipamentData = createEquipamentSchema.parse(req.body);

            const equipament = await equipamentsService.create({
                client_id : equipamentData.client_id,
                brand : equipamentData.brand,
                name : equipamentData.name,
                identification : equipamentData.identification
            });

            return res.status(200).json({
                message : 'Equipament created successfully',
                data : equipament
            });
        }catch(err){
            return res.status(500).json({
                message : 'Error creating equipament',
                error : err
            })
        }
    }

    async updateEquipament(req, res){
        try{
            const equipamentData = updateEquipamentSchema.parse(req.body);

            const equipament = await equipamentsService.update({
                id : req.params.id,
                client_id : equipamentData.client_id,
                brand : equipamentData.brand,
                name : equipamentData.name,
                identification : equipamentData.identification,
            });

            return res.status(200).json({
                message : "Equipament updated successfully",
                data : equipament
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error updating equipament',
                error : err
            })
        }
    }

    async findEquipament(req,res){
        try{
            const filters = findEquipamentSchema.parse(req.query);

            const equipaments = await equipamentsService.find({
                id : filters.id,
                client_id : filters.client_id,
                brand : filters.brand,
                name : filters.name,
                identification : filters.identification,
                includedDeleted : filters.includedDeleted
            });

            return res.status(200).json({
                message : 'Equipaments found successfully',
                data : equipaments
            })
        }catch(err){
            return res.status(400).json({
                message : 'Error finding equipament',
                error : err
            })
        }
    }

    async deactivateEquipament(req,res){
        try{
            const equipament = await equipamentsService.deactivate(req.params.id);

            return res.status(200).json({
                message : 'Equipament deactivated successfully',
                data : equipament
            })
        }catch(err){
            return res.status(500).json({
                message : 'Error deactivating equipament',
                error : err
            })
        }
    }
}

module.exports = new EquipamentsController();