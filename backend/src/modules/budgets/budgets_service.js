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

        if(client.id === undefined){
            if(
                client.name === undefined || 
                client.document === undefined || 
                client.type === undefined
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
            pdf_url : budgetData.pdf_url,
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
            client = await clientsService.find(client.id);
        }

        if(equipament.name === undefined){
            equipament = await equipamentsService.find(equipament.id);
        }

        budgetData.name = `Orçamento ${budgetData.id} - ${client.name} - ${equipament.name}`;

        budgetData = await budgetsRepository.update({
            id : budgetData.id,
            budgetData : budgetData
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
                        budgetItemData : itemData    
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

        const updatedBudget = await budgetsRepository.update({
            id : budgetId,
            budgetData : budgetData
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
        status
    }){

        const statusList = ['draft', 'pending', 'approved', 'rejected'];

        if(!statusList.includes(status)){
            throw new Error(`The status : ${status} is not valid`);
        }

        const updatedBudget = await budgetsRepository.updateStatus({
            id : budgetId,
            status
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
            items
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

        let items = [];
        for(const budget of budgets){
            items = await budgetItemsRepository.find({budgetId : budget.id});

            finishedBudgets.push({
                ...budget,
                items
            })
        }

        return finishedBudgets;
    }

    async deactivate(id){
        const deactivatedBudget = await budgetsRepository.deactivate(id);

        if(!deactivatedBudget){
            throw new Error("Error deactivating budget");
        }

        return deactivatedBudget
    }

    async activate(id){
        const activatedBudget = await budgetsRepository.activate(id);

        if(!activatedBudget){
            throw new Error("Error activating budget");
        }

        return activatedBudget
    }
}

module.exports = new BudgetsService();