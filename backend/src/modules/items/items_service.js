const itemsRepository = require('./items_repository');

class ItemsService{
    async createItem(itemData){
        if(itemData.description === undefined){
            itemData.description = `${itemData.name} - ${itemData.category} - Id do usuário: ${itemData.user_id}`;
        }

        if(itemData.item_type === "service"){
            itemData.quantity_available = null;
        }

        if(itemData.item_type === "part"){
            if(itemData.quantity_available === undefined){
                throw new Error('Quantity available is required for part items');
            }

            if(itemData.quantity_available <= 0){
                throw new Error('Quantity available must be greater than zero for part items');
            }
        }

        const item = await itemsRepository.create({
            user_id : itemData.user_id,
            name : itemData.name,
            description : itemData.description,
            base_price : itemData.base_price,
            item_type : itemData.item_type,
            category : itemData.category,
            quantity_available : itemData.quantity_available
        })

        return item;
    }

    async updateItem({
        id,
        itemData
    }){
        if(itemData.item_type === "service"){
            itemData.quantity_available = null;
        }

        if(itemData.item_type === "part"){
            if(itemData.quantity_available === undefined){
                throw new Error('Quantity available is required for part items');
            }

            if(itemData.quantity_available <= 0){
                throw new Error('Quantity available must be greater than zero for part items');
            }
        }

        const updatedItem = await itemsRepository.update({
            id : id,
            itemData : itemData
        });

        return updatedItem;
    }
    async findItems(filters){
        const items = await itemsRepository.find({
            id : filters.id,
            user_id : filters.user_id,
            name : filters.name,
            item_type : filters.item_type,
            category : filters.category,
            base_price : filters.base_price,
            quantity_available : filters.quantity_available
        });

        return items;
    }

    async deleteItem(id){
        await itemsRepository.delete(id);

        return true;
    }
}

module.exports = new ItemsService();