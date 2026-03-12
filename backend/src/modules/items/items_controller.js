const itemsService = require('./items_service');
const {
    createItemSchema,
    updateItemSchema,
    findItemSchema
} = require('./items_schema');

class ItemsController{
    async createItem(req,res){
        try{
            const parsedData = createItemSchema.parse(req.body);

            const itemData = {
                ...parsedData,
                user_id : req.user.id
            }

            const item = await itemsService.createItem(itemData);

            return res.status(200).json({
                message : "Item created successfully",
                data : item
            })
        }catch(err){
            return res.status(400).json({
                message : "Error creating item",
                error : err.message
            })
        }
    }

    async updateItem(req,res){
        try{
            const itemData = updateItemSchema.parse(req.body);

            const updatedItem = await itemsService.updateItem({
                id : req.params.id,
                itemData : itemData
            });

            return res.status(200).json({
                message : "Item updated successfully",
                data : updatedItem
            })
        }catch(err){

        }
    }

    async deleteItem(req,res){
        try{
            await itemsService.deleteItem(req.params);

            return res.status(200).json({
                message : "Item deleted successfully"
            })
        }catch(err){
            return res.status(400).json({
                message : "Error deleting item",
                error : err.message
            })
        }
    }

    async findItems(req,res){
        try{
            const filters = findItemSchema.parse(req.query);

            const items = await itemsService.findItems(filters);

            return res.status(200).json({
                message : "Items retrieved successfully",
                data : items
            })
        }catch(err){
            return res.status(400).json({
                message : "Error getting items",
                error : err.message
            })
        }
    }
}

module.exports = new ItemsController();