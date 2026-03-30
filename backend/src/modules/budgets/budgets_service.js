const budgetsRepository = require('./budgets_repository');
const budgetItemsRepository = require('./budget_items/budget_items.repository');

const clientsService = require('../clients/clients_service');
const equipamentsService = require('../equipaments/equipaments_service');

/* 
    Budgets status list :
        - draft : Orçamento em rascunho, ainda não enviado para o cliente
        - pending : Orçamento aguardando aprovação do cliente
        - approved : Orçamento aprovado pelo cliente
        - rejected : Orçamento rejeitado pelo cliente
*/

const statusList = ['draft', 'pending', 'approved', 'rejected'];

function calculateItemDiscount(
    unit_price,
    quantity,
    discount_percent
){
    const total_price = unit_price * quantity;
    const discount_amount = total_price * (discount_percent / 100);

    return total_price - discount_amount;
}

function calculateBudgetDiscount(
    base_price,
    discount_percent
){
    const discount_amount = base_price * (discount_percent / 100);

    return base_price - discount_amount;
}

class BudgetsService{
    async create({
        userId,
        budgetData
    }){
        let client = budgetData.client;
        let equipament = budgetData.equipament;

        let itemsData = budgetData.items;

        delete budgetData.items

        if(client.id === undefined){
            if(
                client.name === undefined || 
                client.document === undefined || 
                client.type === undefined ||
                client.address === undefined
            ){
                throw new Error("Missing client data");
            }

            const newClient = await clientsService.createClient(client);

            if(!newClient){
                throw new Error("Error creating client");
            }

            client = newClient;
        }

        if(equipament.id === undefined){
            if(
                equipament.brand === undefined || 
                equipament.name === undefined || 
                equipament.identification === undefined
            ){
                throw new Error("Missing equipament data");
            }

            const newEquipament = await equipamentsService.create({
                client_id : client.id,
                brand : equipament.brand,
                name : equipament.name,
                identification : equipament.identification
            });

            if(!newEquipament){
                throw new Error("Error creating equipament");
            }

            equipament = newEquipament;
        }

        budgetData = await budgetsRepository.create({
            user_id : userId,
            client_id : client.id,
            equipament_id : equipament.id,
            name : `orçamento em rascunho - ${new Date().toLocaleString()}`,
            discount_percent : budgetData.discount_percent,
            payment_condition : budgetData.payment_condition,
            term_service : budgetData.term_service,
            warranty : budgetData.warranty,
            base_price : 0,
            final_price : 0,
            status : "draft",
            pdf_url : null,
            observations : budgetData.observations
        });

        if(!budgetData){
            throw new Error("Error creating budget");
        }

        let finsishedItems = [];
        let basePriceBudget = 0;

        for(const item of itemsData){
            item.base_price = item.unit_price * item.quantity;

            if(item.discount_percent > 0){
                item.final_price = calculateItemDiscount(
                    item.unit_price,
                    item.quantity,
                    item.discount_percent
                );
            }else{
                item.final_price = item.base_price;
            }

            basePriceBudget += item.final_price;

            const budgetItem = await budgetItemsRepository.create({
                budget_id : budgetData.id,
                name : item.name,
                unit_price : item.unit_price,
                quantity : item.quantity,
                base_price : item.base_price,
                final_price : item.final_price,
                discount_percent : item.discount_percent
            })

            if(!budgetItem){
                throw new Error("Error creating budget item");
            }

            finsishedItems.push(budgetItem);
        }

        budgetData.base_price = basePriceBudget;

        if(budgetData.discount_percent > 0){    
            budgetData.final_price = calculateBudgetDiscount(
                budgetData.base_price,
                budgetData.discount_percent
            );
        }else{
            budgetData.final_price = budgetData.base_price;
        }

        if(client.name === undefined){
            client = await clientsService.findClients(client);
            client = client[0];
        }

        if(equipament.name === undefined){
            equipament = await equipamentsService.find(equipament);
            equipament = equipament[0];
        }

        const equipamentInfo = `${equipament.name} - ${equipament.brand} - ${equipament.identification}`;

        budgetData.name = `Orçamento ${budgetData.id} - ${client.name} - ${equipamentInfo}`;

        budgetData = await budgetsRepository.update({
            id : budgetData.id,
            data : budgetData
        })

        if(!budgetData){
            throw new Error("Error updating budget with final price");
        }

        return {
            budget : budgetData,
            items : finsishedItems
        }

    }

    async update({
        budgetId,
        budgetData
    }){
        const existingBudget = await budgetsRepository.find({
            id : budgetId
        });

        if(existingBudget.length === 0){
            throw new Error("Budget not found");
        }

        let itemsData = budgetData.items;

        let basePriceBudget = 0;
        let finishedItems = [];
        let finishedItem;

        if(itemsData.length > 0){
            const existingItems = await budgetItemsRepository.find({budgetId : budgetId});

            const existingItemsIds = existingItems.map(item => item.id);

            const incomingItemsIds = itemsData
                .map(item => item.id)
                .filter(id => id !== undefined);
            
            const idsToDelete = existingItemsIds.filter(id => !incomingItemsIds.includes(id));

            for(const id of idsToDelete){
                await budgetItemsRepository.delete(id);
            }

            for(const item of itemsData){
                item.base_price = item.unit_price * item.quantity;
                if(item.discount_percent > 0){
                    item.final_price = calculateItemDiscount(
                        item.unit_price,
                        item.quantity,
                        item.discount_percent
                    )
                }else{
                    item.final_price = item.base_price;
                }

                basePriceBudget += item.final_price;

                if(item.id === undefined){
                    finishedItem = await budgetItemsRepository.create({
                        budget_id : budgetId,
                        name : item.name,
                        unit_price : item.unit_price,
                        quantity : item.quantity,
                        base_price : item.base_price,
                        final_price : item.final_price,
                        discount_percent : item.discount_percent
                    })
                }else{

                    let itemData = {
                        name : item.name,
                        unit_price : item.unit_price,
                        quantity : item.quantity,
                        base_price : item.base_price,
                        final_price : item.final_price,
                        discount_percent : item.discount_percent
                    }

                    finishedItem = await budgetItemsRepository.update({
                        id : item.id,
                        data : itemData    
                    })
                }

                if(!finishedItem){
                    throw new Error("Error updating budget item");
                }

                finishedItems.push(finishedItem);
            }
                
        }
            
        if(basePriceBudget === 0 && finishedItems.length === 0){
            basePriceBudget = existingBudget[0].base_price;
            finishedItems = await budgetItemsRepository.find({budgetId : budgetId});

            if(finishedItems.length === 0){
                throw new Error("No items found for this budget");
            }
        }

        if(budgetData.discount_percent > 0){
            budgetData.final_price = calculateBudgetDiscount(
                basePriceBudget,
                budgetData.discount_percent
            );
        }

        budgetData.base_price = basePriceBudget;

        delete budgetData.items;

        let client = budgetData.client;
        let equipament = budgetData.equipament;

        delete budgetData.client;
        delete budgetData.equipament;

        if(client !== undefined && client.id !== undefined){
            client = {
                id : client.id
            }

            client = await clientsService.findClients(client);

            if(client.length === 0){
                throw new Error("Client not found");
            }

            client = client[0];
        }

        if(client !== undefined && client.id === undefined){
            if(client.name === undefined ||
                client.document === undefined || 
                client.type === undefined ||
                client.address === undefined 
            ){
                throw new Error("Client data is incomplete");
            }

            client = await clientsService.createClient(client);

            if(!client){
                throw new Error("Error creating client");
            }
        }

        if(equipament !== undefined && equipament.id !== undefined){
            equipament = {
                id : equipament.id
            }

            equipament = await equipamentsService.find(equipament);

            if(equipament.length === 0){
                throw new Error("Equipament not found");
            }

            equipament = equipament[0];
        }

        if(equipament !== undefined && equipament.id === undefined){
            if(
                equipament.brand === undefined ||
                equipament.name === undefined ||
                equipament.identification === undefined
            ){
                throw new Error('Equipament data is incomplete');
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

        if(client !== undefined || equipament !== undefined){
            budgetData.client_id = client.id;
            budgetData.equipament_id = equipament.id;

            const equipamentInfo = `${equipament.name} - ${equipament.brand} - ${equipament.identification}`;

            budgetData.name = `Orçamento ${budgetId} - ${client.name} - ${equipamentInfo}`;
        }

        const updatedBudget = await budgetsRepository.update({
            id : budgetId,
            data : budgetData
        });

        if(!updatedBudget){
            throw new Error("Error updating budget");
        }

        return {
            budget : updatedBudget,
            items : finishedItems
        }
    }

    async updateStatus({
        budgetId,
        statusData
    }){

        const existingBudget = await budgetsRepository.find({
            id : budgetId
        });

        if(existingBudget.length === 0){
            throw new Error("Budget not found");
        }

        if(!statusList.includes(statusData.status)){
            throw new Error(`The status : ${statusData.status} is not valid`);
        }

        const updatedBudget = await budgetsRepository.updateStatus({
            id : budgetId,
            status : statusData.status
        });

        if(!updatedBudget){
            throw new Error("Error updating budget status");
        }

        const items = await budgetItemsRepository.find({budgetId : budgetId});

        if(items.length === 0){
            throw new Error("No items found for this budget");
        }

        return {
            budget : updatedBudget,
            items : items
        }
    }

    async find(
        filters
    ){
        let finishedBudgets = [];
        const budgets = await budgetsRepository.find({
            id : filters.id,
            client_id : filters.client_id,
            equipament_id : filters.equipament_id,
            name : filters.name,
            status : filters.status,
            final_price : filters.final_price,
            includedDeactivated : filters.includedDeactivated
        });

        for(const budget of budgets){
            let budgetItems = await budgetItemsRepository.find({budgetId : budget.id});

            finishedBudgets.push({
                ...budget,
                items : budgetItems
            })
        }

        return finishedBudgets;
    }

    async deactivate(id){

        const existingBudget = await budgetsRepository.find({
            id : id
        })

        if(existingBudget.length === 0){
            throw new Error("Budget not found!")
        }

        const deactivatedBudget = await budgetsRepository.deactivate(id);

        if(!deactivatedBudget){
            throw new Error("Error deactivating budget");
        }

        const items = await budgetItemsRepository.find({budgetId : id});

        if(items.length === 0){
            throw new Error("No items found for this budget");
        }

        return {
            ...deactivatedBudget,
            items : items
        }
    }

    async activate(id){

        const existingBudget = await budgetsRepository.find({
            id : id
        })

        if(existingBudget.length === 0){
            throw new Error("Budget not found!")
        }
        
        const activatedBudget = await budgetsRepository.activate(id);

        if(!activatedBudget){
            throw new Error("Error activating budget");
        }

        const items = await budgetItemsRepository.find({budgetId : id});

        if(items.length === 0){
            throw new Error("No items found for this budget");
        }

        return {
            ...activatedBudget,
            items : items
        }
    }
}

module.exports = new BudgetsService();