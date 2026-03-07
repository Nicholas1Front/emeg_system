const equipamentsRepository = require('./equipaments_repository');
const clientRepository = require('../clients/clients_repository');

class EquipamentsService{
    async create({
        client_id,
        brand,
        name,
        identification
    }){
        const existingClient = await clientRepository.findClients({id : client_id});

        if(!existingClient){
            throw new Error('Client not found');
        }

        const equipament = await equipamentsRepository.create({
            client_id,
            brand,
            name,
            identification
        });

        return equipament;
    }

    async update({
        id,
        equipamentData
    }){
        const existingEquipament = await equipamentsRepository.find({id});

        if(existingEquipament.length === 0){
            throw new Error('Equipament not found');
        }

        const updatedEquipament = await equipamentsRepository.update({
            id : id,
            data : equipamentData
        });

        return updatedEquipament;
    }

    async find(filters){
        const equipaments = await equipamentsRepository.find({
            id : filters.id,
            client_id : filters.client_id,
            brand : filters.brand,
            name : filters.name,
            identification : filters.identification,
            includedDeleted : filters.includedDeleted
        });

        return equipaments;
    }

    async deactivate(id){
        const existingEquipament = await equipamentsRepository.find({
            id : id,
        });

        if(existingEquipament.length === 0){
            throw new Error('Equipament not found');
        }

        const deactivatedEquipament = await equipamentsRepository.deactivate(id);

        return deactivatedEquipament;
    }

    async activate(id){
        const existingEquipament = await equipamentsRepository.find({id, includedDeleted : true});

        if(existingEquipament.length === 0){
            throw new Error('Equipament not found');
        }

        const activatedEquipament = await equipamentsRepository.activate(id);

        return activatedEquipament;
    }
};

module.exports = new EquipamentsService();