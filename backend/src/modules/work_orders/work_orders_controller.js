const workOrdersService = require('./work_orders_service');

const {
    createWorkOrderSchema,
    updateWorkOrderSchema,
    updateStatusWorkOrderSchema,
    findWorkOrdersSchema,
} = require('./work_orders_schema');

class WorkOrdersController{
    async createWorkOrder(req,res){
        try{
            const workOrderData = createWorkOrderSchema.parse(req.body);

            const order = await workOrdersService.create({
                userId : req.user.id,
                data : workOrderData
            })

            return res.status(200).json({
                message : "Work order created successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : "Error creating work order",
                error : err.message
            })
        }
    }

    async updateWorkOrder(req,res){
        try{
            const updatedData = updateWorkOrderSchema.parse(req.body);

            const order = await workOrdersService.update({
                id : req.params.id,
                userId : req.user.id,
                orderData : updatedData
            });

            return res.status(200).json({
                message : "Work order updated successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : "Error updating work order",
                error : err.message
            })
        }
    }

    async updateWorkOrderStatus(req,res){
        try{
            const data = updateStatusWorkOrderSchema.parse(req.body);

            const order = await workOrdersService.updateStatus({
                id : req.params.id,
                userId : req.user.id,
                workOrderStatus : data.status,
                itemsData : data.items
            })

            return res.status(200).json({
                message : "Work order status updated successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : "Error updating work order status",
                error : err.message
            })
        }
    }

    async getWorkOrders(req,res){
        try{
            const data = findWorkOrdersSchema.parse(req.query);

            const orders = await workOrdersService.find(data);

            return res.status(200).json({
                message : "Work orders retrieved successfully",
                data : orders
            })
        }catch(err){
            return res.status(400).json({
                message : "Error retrieving work orders",
                error : err.message
            })
        }
    }

    async deactivateWorkOrder(req,res){
        try{
            const order = await workOrdersService.deactivate({
                id : req.params.id,
                requesterRole : req.user.role
            });

            return res.status(200).json({
                message : "Work order deactivated successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : "Error deactivating work order",
                error : err.message
            })
        }
    }

    async activateWorkOrder(req,res){
        try{
            const order = await workOrdersService.activate({
                id : req.params.id,
                requesterRole : req.user.role
            });

            return res.status(200).json({
                message : "Work order activated successfully",
                data : order
            })
        }catch(err){
            return res.status(400).json({
                message : "Error activating work order",
                error : err.message
            })
        }
    }
}

module.exports = new WorkOrdersController();