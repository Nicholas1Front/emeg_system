const workOrdersRepository = require('./work_orders_repository');
const workOrderItemsRepository = require('./work_order_items/work_order_items_repository');

const budgetsService = require('../budgets/budgets_service');
const clientsService = require('../clients/clients_service');
const equipamentsService = require('../equipaments/equipaments_service');

const statusList = ['pending', 'in_progress', 'completed', 'canceled'];

class WorkOrdersService{

    async create({
        userId,
        data
    }){
        if(data.budget !== undefined && data.budget.id !== undefined){
            return await this.createFromBudget({
                userId,
                orderData : data
            })
        }else{
            return await this.createManually({
                userId,
                orderData : data
            })
        }
    }

    async createFromBudget({
        userId,
        orderData
    }){
        let budget = await budgetsService.find(orderData.budget);
        
        if(budget.length === 0){
            throw new Error("Budget not found");
        }

        budget = budget[0];

        let client = {
            id : budget.client_id
        }

        client = await clientsService.findClients(client);

        if(!client){
            throw new Error("Client not found");
        }

        client = client[0];

        let equipament = {
            id : budget.equipament_id
        }

        equipament = await equipamentsService.find(equipament);

        if(!equipament){
            throw new Error("Equipament not found");
        }

        equipament = equipament[0];

        let itemsData = [];

        for(const item of budget.items){
            let orderItem = {
                name : item.name,
                quantity : item.quantity,
                status : 'pending'
            }

            itemsData.push(orderItem);
        }

        if(orderData.items !== undefined && orderData.items.length > 0){
            for(const item of orderData.items){

                if(!statusList.includes(item.status)){
                    throw new Error(`Invalid status for item ${item.name}, valid status are: ${statusList.join(', ')}`);
                }

                let orderItem = {
                    name : item.name,
                    quantity : item.quantity,
                    status : item.status
                }

                itemsData.push(orderItem);
            }
        }

        if(itemsData.length === 0){
            throw new Error("At least one item is required to create a work order");
        }

        if(orderData.entry_date !== undefined){
            orderData.entry_date = new Date(orderData.entry_date);
        }

        const order = await workOrdersRepository.create({
            budget_id : budget.id,
            client_id : client.id,
            equipament_id : equipament.id,
            user_id : userId,
            name : `Ordem de serviço - ${client.name} - ${equipament.name}`,
            entry_date : orderData.entry_date,
            exit_date : orderData.exit_date,
            warranty : orderData.warranty,
            observations : orderData.observations,
            status : 'pending',
            pdf_url : null
        })

        if(!order){
            throw new Error("Error creating work order");
        }

        let finishedItems = [];

        for(const item of itemsData){
            const orderItem = await workOrderItemsRepository.create({
                work_order_id: order.id,
                name: item.name,
                quantity: item.quantity,
                status: item.status
            })

            finishedItems.push(orderItem);
        }

        const updatedOrder = await workOrdersRepository.update({
            id : order.id,
            data : {
                name : `Ordem de serviço ${order.id} - ${client.name} - ${equipament.name} - ${equipament.brand} - ${equipament.identification}`
            }
        })

        if(!updatedOrder){
            throw new Error("Error updating work order");
        }

        return{
            ...updatedOrder,
            items : finishedItems
        }
    }

    async createManually({
        userId,
        orderData
    }){
        let client = orderData.client;
        let equipament = orderData.equipament;

        let itemsData = orderData.items;

        if(client.id !== undefined){
            client = await clientsService.findClients(client);

            if(!client){
                throw new Error("Client not found");
            }

            client = client[0];
        }else{
            if(
                client.name === undefined ||
                client.document === undefined || 
                client.type === undefined
            ){
                throw new Error("Client data is incomplete");
            }

            client = await clientsService.createClient(client);

            if(!client){
                throw new Error("Error creating client");
            }
        }

        if(equipament.id !== undefined){
            equipament = await equipamentsService.find(equipament);

            if(!equipament){
                throw new Error("Equipament not found");
            }

            equipament = equipament[0];

        }else{
            if(
                equipament.brand === undefined ||
                equipament.name === undefined ||
                equipament.identification === undefined
            ){
                throw new Error("Equipament data is incomplete");
            }

            equipament = await equipamentsService.create({
                client_id : client.id,
                brand : equipament.brand,
                name : equipament.name,
                identification : equipament.identification
            })

            if(!equipament){
                throw new Error("Error creating equipament");
            }
        }

        if(orderData.entry_date !== undefined){
            orderData.entry_date = new Date();
        }

        const order = await workOrdersRepository.create({
            budget_id : null,
            client_id : client.id,
            equipament_id : equipament.id,
            user_id : userId,
            name : `Ordem de serviço - ${client.name} - ${equipament.name}`,
            entry_date : orderData.entry_date,
            exit_date : orderData.exit_date,
            warranty: orderData.warranty,
            observations: orderData.observations,
            status: orderData.status,
            pdf_url: null
        })

        if(!order){
            throw new Error("Error creating work order");
        }

        let finishedItems = [];

        for(const item of itemsData){

            if(!statusList.includes(item.status)){
                throw new Error(`Invalid status for item ${item.name}, valid status are: ${statusList.join(', ')}`);
            }

            const orderItem = await workOrderItemsRepository.create({
                work_order_id: order.id,
                name: item.name,
                quantity: item.quantity,
                status: item.status
            })

            if(!orderItem){
                throw new Error(`Error creating item ${item.name}`);
            }

            finishedItems.push(orderItem);
        }

        const updatedOrder = await workOrdersRepository.update({
            id : order.id,
            data : {
                name : `Ordem de serviço ${order.id} - ${client.name} - ${equipament.name} - ${equipament.brand} - ${equipament.identification}`
            }
        })

        if(!updatedOrder){
            throw new Error("Error updating work order");
        }

        return{
            ...updatedOrder,
            items : finishedItems
        }
        
    }

    async update({
        id,
        userId,
        orderData,
        itemsData
    }){
        let existingOrder = await workOrdersRepository.find({
            id : id
        });

        if(existingOrder.length === 0){
            throw new Error('Work order not found');
        }

        existingOrder = existingOrder[0];

        let items = null;

        if(itemsData !== undefined && itemsData.length > 0){
            items = itemsData;
        }

        let finishedItems = [];

        if(items !== null && items.length > 0){
            const existingItems = await workOrderItemsRepository.find({
                work_order_id : id
            })

            const existingItemsIds = existingItems.map(item => item.id);

            const incomingItemsIds = items.map(item => item.id).filter(id => id !== undefined);

            const idsToDelete = existingItemsIds.filter(id => !incomingItemsIds.includes(id));

            for(const id of idsToDelete){
                const result = await workOrderItemsRepository.delete(id);

                if(!result){
                    throw new Error(`Error deleting item with id ${id}`);
                }
            }

            for(const item of items){
                if(item.status !== undefined && !statusList.includes(item.status)){
                    throw new Error(`Invalid status for item ${item.name}, valid status are: ${statusList.join(', ')}`);
                }

                if(item.id !== undefined){
                    const updatedItem = await workOrderItemsRepository.update({
                        id : item.id,
                        data : item
                    })
                    
                    if(!updatedItem){
                        throw new Error(`Error updating item with id ${item.id}`);
                    }

                    finishedItems.push(updatedItem);
                }else{
                    const newItem = await workOrderItemsRepository.create({
                        work_order_id : id,
                        name : item.name,
                        quantity : item.quantity,
                        status : item.status
                    })

                    if(!newItem){
                        throw new Error(`Error creating item ${item.name}`);
                    }

                    finishedItems.push(newItem);
                }
            }
            
        }

        if(finishedItems.length === 0){
            finishedItems = await workOrderItemsRepository.find({
                work_order_id : id
            });
        }

        let client = null;

        if(orderData.client !== undefined){
            client = orderData.client
        }else{
            client = {
                id : existingOrder.client_id
            }
        }

        delete orderData.client;

        let equipament = null;

        if(orderData.equipament !== undefined){
            equipament = orderData.equipament
        }else{
            equipament = {
                id : existingOrder.equipament_id
            }
        }

        delete orderData.equipament;

        if(client !== null && client.id !== undefined){

            const foundClients = await clientsService.findClients({
                id : client.id
            });

            if(foundClients.length === 0){
                throw new Error("Client not found");
            }

            client = foundClients[0];
        }

        if(client !== null && client.id === undefined){
            if(
                client.name === undefined ||
                client.document === undefined ||
                client.type === undefined
            ){
                throw new Error("Client data is incomplete");
            }

            const createdClient = await clientsService.createClient(client);

            if(!createdClient){
                throw new Error('Error creating client');
            }

            client = createdClient;
        }

        if(equipament !== null && equipament.id !== undefined){

            const foundEquipaments = await equipamentsService.find({
                id : equipament.id
            });

            if(foundEquipaments.length === 0){
                throw new Error("Equipament not found");
            }

            equipament = foundEquipaments[0];
        }

        if(equipament !== null && equipament.id === undefined){
            if(
                equipament.name === undefined ||
                equipament.brand === undefined ||
                equipament.identification === undefined
            ){
                throw new Error("Equipament data is incomplete");
            }

            const createdEquipament = await equipamentsService.create({
                client_id : client.id,
                brand : equipament.brand,
                name : equipament.name,
                identification : equipament.identification
            });

            if(!createdEquipament){
                throw new Error('Error creating equipament');
            }

            equipament = createdEquipament;
        }

        if(equipament !== null || client !== null){
            orderData.name = `Ordem de serviço ${existingOrder.id} - ${client.name} - ${equipament.name} - ${equipament.brand} - ${equipament.identification}`;
        }

        orderData.user_id = userId;

        if(orderData.status !== undefined && !statusList.includes(orderData.status)){
            throw new Error(`Invalid status, valid status are: ${statusList.join(', ')}`);
        }

        const updatedOrder = await workOrdersRepository.update({
            id : id,
            data : orderData
        });

        if(!updatedOrder){
            throw new Error(`Error updating work order with id ${id}`);
        }

        return {
            ...updatedOrder,
            items : finishedItems
        }
    }

    async updateStatus({
        id,
        userId,
        orderData
    }){
        let existingOrder = await workOrdersRepository.find({
            id : id
        })

        if(existingOrder.length === 0){
            throw new Error('Work order not found');
        }

        existingOrder = existingOrder[0];

        let workOrderStatus = null;

        if(orderData.status !== undefined){
            workOrderStatus = orderData.status;
        }

        let finishedOrder = null;

        if(workOrderStatus !== null){
            if(!statusList.includes(workOrderStatus)){
                throw new Error(`Invalid status, valid status are: ${statusList.join(', ')}`);
            }

            finishedOrder = await workOrdersRepository.updateStatus({
                id : id,
                status : workOrderStatus,
                user_id : userId
            })

            if(!finishedOrder){
                throw new Error(`Error updating work order status with id ${id}`);
            }
        }

        if(finishedOrder === null){
            finishedOrder = existingOrder[0];
        }

        let itemsData = null;

        if(orderData.items !== undefined && orderData.items.length > 0){
            itemsData = orderData.items;
        }

        let finishedItems = [];

        if(itemsData !== null && itemsData.length > 0){
            for(const item of itemsData){
                const existingItem = await workOrderItemsRepository.find({
                    id : item.id
                })

                if(existingItem.length === 0){
                    throw new Error(`Item with id ${item.id} not found`);
                }

                if(!statusList.includes(item.status)){
                    throw new Error(`Invalid status, valid status are: ${statusList.join(', ')}`);
                }

                const updatedItem = await workOrderItemsRepository.updateStatus({
                    id : item.id,
                    status : item.status
                })

                finishedItems.push(updatedItem);
            }
        }

        if(finishedItems.length === 0){
            finishedItems = existingOrder[0].items;
        }

        return {
            ...finishedOrder,
            items : finishedItems
        }
    }

    async find(filters){
        const orders = await workOrdersRepository.find({
            budget_id : filters.budget_id,
            client_id : filters.client_id,
            equipament_id : filters.equipament_id,
            user_id : filters.user_id,
            id : filters.id,
            name : filters.name,
            entry_date : filters.entry_date,
            exit_date : filters.exit_date,
            status : filters.status,
            includedDeactivated : filters.includedDeactivated
        });

        let finishedOrders = [];

        for(const order of orders){
            items = await workOrderItemsRepository.find({
                work_order_id : order.id
            });


            finishedOrders.push({
                ...order,
                items : items
            })
        }

        return finishedOrders
    }

    async deactivate({
        id,
        requesterRole
    }){

        if(requesterRole !== 'admin'){
            throw new Error('Unauthorized : only admin can deactivate work orders');
        }

        const existingOrder = await workOrdersRepository.find({
            id : id
        })

        if(existingOrder.length === 0){
            throw new Error('Work order not found');
        }

        const deactivatedOrder = await workOrdersRepository.deactivate(id);

        const items = await workOrderItemsRepository.find({
            work_order_id : id
        })

        return {
            ...deactivatedOrder,
            items : items
        };
    }

    async activate({
        id,
        requesterRole
    }){

        if(requesterRole !== 'admin'){
            throw new Error('Unauthorized : only admin can activate work orders');
        }

        const existingOrder = await workOrdersRepository.find({
            id : id
        })

        if(existingOrder.length === 0){
            throw new Error('Work order not found');
        }

        const activatedOrder = await workOrdersRepository.activate(id);

        const items = await workOrderItemsRepository.find({
            work_order_id : id
        })

        return {
            ...activatedOrder,
            items : items
        };
    }
        
}

module.exports = new WorkOrdersService();