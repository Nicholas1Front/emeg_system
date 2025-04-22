let clientsEquipamentsArray = []

// clients_equipaments.json
async function getClientsData(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com/get-clients-equipaments`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        const clients = await response.json();

        return clients;
    }

    catch(error){
        console.log(`Failed to load json : ${error}`);
    }
}

async function initialize_clients_arary(){
    clientsEquipamentsArray = await getClientsData();
}

//booting

initialize_clients_arary();

// message popup

async function showMessagePopup(message , messageType ){
    msgSpan.innerHTML = "";
    msgSpan.innerText = message;

    if(messageType === "errorMsg"){
        msgControl.style.backgroundColor = "#d61e1e";//red color
        msgControl.style.color = "white"; 
        closeMsgBtn.style.color = "white";
    }
    if (messageType === "adviceMsg"){
        msgControl.style.backgroundColor = "#fcba03";  //yellow color
        msgControl.style.color = "black";
        closeMsgBtn.style.color = "black";
    }
    if(messageType === "sucessMsg"){
        msgControl.style.backgroundColor = "#42f55a" //green color
        msgControl.style.color = "white";
        closeMsgBtn.style.color = "white";
    }

    showHtmlElement([msgControl],"block");
    msgControl.style.transition = "0.5s";
    msgControl.style.marginTop = "37%";

    setTimeout(() => {
        closeMessagePopup();
    }, 6000);

}

async function closeMessagePopup(){
    msgControl.style.marginTop = "43%";
    msgControl.style.transition = "0.5s";
    hideHtmlElement([msgControl]);
}

// server message popup

// elements
const serverMessagePopup = document.querySelector(".server-message-popup");
const closeServerMessagePopupBtn = document.querySelector(".close-server-message-popup-btn")
const serverMessageSymbol = document.querySelector(".server-message-control i");
const serverMessageSpan = document.querySelector(".server-message-span");

// functions

async function showServerMessagePopup(messageType, messageSpan){
    serverMessageSymbol.className = "";

    if(messageType === "errorMsg"){
        serverMessagePopup.style.backgroundColor = "#d61e1e"; //red color
        serverMessagePopup.style.color = "#fff";
        serverMessageSymbol.className = `fa-solid fa-triangle-exclamation`;
    }

    if(messageType === "sucessMsg"){
        serverMessagePopup.style.backgroundColor = "#42f55a"; //green color
        serverMessagePopup.style.color = "#fff"
        serverMessageSymbol.className = `fa-solid fa-circle-check`;
    }

    serverMessageSpan.innerText = messageSpan ;

    await showHtmlElement([serverMessagePopup], "block");

    setTimeout(()=>{
        hideHtmlElement([serverMessagePopup]);
    },5000);
}

//event listeners

closeServerMessagePopupBtn.addEventListener("click",()=>{
    hideHtmlElement([serverMessagePopup]);
});

// show or hide html element

async function showHtmlElement([...elements], displayType){
    elements.forEach((element) =>{
        element.style.display = `${displayType}`;
    })
}

async function hideHtmlElement([...elements]){
    elements.forEach((element) =>{
        element.style.display = "none";
    })
}


// clear html element

async function clearHtmlElement([...elements]){
    elements.forEach((element)=>{
        element.innerHTML = "";
    }) 
}

// upperCase inputs
function upperCaseInputs([...inputs]){
    inputs.forEach((input)=>{
        input.addEventListener("input",()=>{
            input.value = input.value.toUpperCase();
        })
    })
}

// javascript date to brasil date

function JsDate_to_BrDate(){
    let date = dateInput.value;

    let dateArray = date.split("-");

    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    return newDate;    
}

// brasil date to javascript date

function brDate_to_JsDate(dateElement){
    let dateString = dateElement.replace(/\//g,"-"); // all occurrences of the bar
    let dateArray = dateString.split("-");
    dateString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`

    return dateString;
}

// format to BRL

function formatToBrl(value){
    return new Intl.NumberFormat("pt-BR", {
        style : "currency",
        currency : "BRL",
    }).format(value);
};

// formato BRL to float

function currencyToFloatNum(value){
    value = value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.');
    value = parseFloat(value);

    return value;
}

function currencyToStringFormat(value){
    const number = value.replace(/[^\d,-]/g, '').replace('.', '').replace('.', ',');

    return number;
}

//budget-production

//header

//elements
const budgetProduction = document.querySelector("#budget-production");
const msgControl = document.querySelector(".msg-control");
const closeMsgBtn = document.querySelector("#close-msg-btn");
const msgSpan = document.querySelector(".msg-span");

const clientInput = document.querySelector("#client-input");
const clientInputOptionsControl = document.querySelector(".client-input-options-control");
const equipamentInput = document.querySelector("#equipament-input");
const equipamentInputOptionsControl = document.querySelector(".equipament-input-options-control");
const notIdentifiedInput = document.querySelector("#not-identified-input");
const dateInput = document.querySelector("#date-input");
const completionDeadlineInput = document.querySelector("#completion-deadline-input");
const paymentTermsInput = document.querySelector("#payment-terms-input");
const guaranteeInput = document.querySelector("#guarantee-input");
const nextStepContainer = document.querySelector(".next-step-container");
const infosNextStepBtn = document.querySelector("#infos-next-step-btn");

//functions

async function createClientInputSuggestions(
    inputClient,
    optionsControl,
    itemClassName
){
    optionsControl.innerHTML = "";

    let notIdentifiedClient = document.createElement("div");

    notIdentifiedClient.className = "client-input-option";
    notIdentifiedClient.innerHTML = "(NÃO IDENTIFICADO)";
    optionsControl.appendChild(notIdentifiedClient);

    console.log(clientsEquipamentsArray);

    let itensSearched = [];

    clientsEquipamentsArray.forEach((client)=>{
        if(client.name.includes(inputClient.value)){
            itensSearched.push(client.name);
        }
    });

    if(itensSearched.length === 0 || inputClient.value === ""){
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl]);
        return;
    }

    itensSearched.forEach((client)=>{
        let clientOption = document.createElement("div");

        clientOption.className = `${itemClassName}`;
        clientOption.innerHTML = client;

        optionsControl.appendChild(clientOption);
    });

    optionItem = document.querySelectorAll(`.${itemClassName}`);

    optionItem.forEach((option)=>{
        option.addEventListener("click", ()=>{
            inputClient.value = option.innerHTML;

            optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
        })
    });

    showHtmlElement([optionsControl], "block");

    document.addEventListener("click", async()=>{
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
    })

}

async function createEquipamentsInputSuggestions(
    inputEquipament,
    optionsControl,
    itemClassName
){
    optionsControl.innerHTML = "";

    let allEquipaments= [];

    clientsEquipamentsArray.forEach((client)=>{
        if(client.name === clientInput.value){
            client.equipaments.forEach((equipament)=>{
                allEquipaments.push(equipament);
            })
        }
    });

    let itensSearched = [];

    allEquipaments.forEach((equipament)=>{
        if(equipament.includes(inputEquipament.value)){
            itensSearched.push(equipament);
        }
    });

    console.log(itensSearched);

    if(itensSearched.length === 0 || inputEquipament.value === ""){
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl])
        return;
    };

    itensSearched.forEach((equipament)=>{
        let equipamentOption = document.createElement("div");

        equipamentOption.className = `${itemClassName}`;
        equipamentOption.innerHTML = equipament;

        optionsControl.appendChild(equipamentOption);
    });

    optionItem = document.querySelectorAll(`.${itemClassName}`);

    optionItem.forEach((option)=>{
        option.addEventListener("click", ()=>{
            inputEquipament.value = option.innerText;

            optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
        })
    });

    showHtmlElement([optionsControl], "block");

    document.addEventListener("click", ()=>{
        optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
    })
}

async function validateSelectsProcess(){
    if(clientInput.value === ""){
        await showMessagePopup("Digite ou selecione um cliente !", "errorMsg");
        return;
    }

    if(equipamentInput.value === ""){
        await showMessagePopup("Digite ou selecione um equipamento !", "errorMsg");
        return;
    }

    if(dateInput.value === "" || completionDeadlineInput.value === "" || paymentTermsInput.value === "" || guaranteeInput.value === ""){
        await showMessagePopup("Alguns campos estão vazios !", "adviceMsg");
    };

    await showHtmlElement([partsSection,servicesSection,totalBudgetProdSection,observationsSection,expensesSection,generateBudgetSection], "block");
    await hideHtmlElement([nextStepContainer]);
}

//booting

upperCaseInputs([
    clientInput,
    equipamentInput,
    guaranteeInput,
    paymentTermsInput,
    completionDeadlineInput
])

//event listeners

clientInput.addEventListener("input", ()=>{
    createClientInputSuggestions(
        clientInput,
        clientInputOptionsControl,
        "client-input-option"
    );
});

equipamentInput.addEventListener("input", ()=>{
    createEquipamentsInputSuggestions(
        equipamentInput,
        equipamentInputOptionsControl,
        "equipament-input-option"
    );
})

infosNextStepBtn.addEventListener("click", ()=>{
    validateSelectsProcess();
});

closeMsgBtn.addEventListener("click", ()=>{
    closeMessagePopup();
})

//parts section

//elements
const partsSection = document.querySelector(".parts-section");
const partsAddedItemsControl = document.querySelector(".parts-added-items-control");
const partQuantInput = document.querySelector("#part-quant-input");
const partDescriptionInput = document.querySelector("#part-description-input");
const partUnitValueInput = document.querySelector("#part-unit-value-input");
const partAddItemBtn = document.querySelector("#part-add-item-btn");

//functions

function validateOnlyNumbers(param){
    return param.replace(/[^0-9,]/g,"")
}

async function clearInputs([...inputs]){
    inputs.forEach((input)=>{
        input.value = "";
    })
}

async function updateTotal_servicesAndParts(){
    const partsTotalValueSpan = document.querySelectorAll(".parts-total-value-span");

    let totalValueOfParts = 0;

    if(partsTotalValueSpan[0] !== null || partsTotalValueSpan[0] !== undefined){
        partsTotalValueSpan.forEach((span)=>{
            let value = span.innerText;
            value = currencyToFloatNum(value);
    
            totalValueOfParts += value;
        })
    }

    if(partsTotalValueSpan[0] === null || partsTotalValueSpan[0] === undefined){
        totalValueOfParts = 0;
    }

    totalValueOfParts = formatToBrl(totalValueOfParts);
    
    const partsItemTotalSpan = document.querySelector(".parts-item-total-span");
    partsItemTotalSpan.innerHTML = "";
    partsItemTotalSpan.innerHTML = totalValueOfParts;
    
    const totalOfPartsDisplaySpan = document.querySelector(".total-of-parts-display-span");
    totalOfPartsDisplaySpan.innerHTML = "";
    totalOfPartsDisplaySpan.innerHTML = totalValueOfParts;

    const serviceTotalValueSpan = document.querySelectorAll(".service-total-value-span");
    let totalValueOfServices = 0;

    if(serviceTotalValueSpan[0] !== null || servicesTotalValueSpan[0] !== undefined){
        serviceTotalValueSpan.forEach((span)=>{
            let value = span.innerText;
            value = currencyToFloatNum(value);
    
            totalValueOfServices += value;
        });
    }

    if(serviceTotalValueSpan[0] === null || serviceTotalValueSpan[0] === undefined){
        totalValueOfServices = 0;
    }

    totalValueOfServices = formatToBrl(totalValueOfServices);

    const servicesItemTotalSpan = document.querySelector(".services-item-total-span");
    servicesItemTotalSpan.innerHTML = "";
    servicesItemTotalSpan.innerHTML = totalValueOfServices;

    const totalOfServicesDisplaySpan = document.querySelector(".total-of-services-display-span");
    totalOfServicesDisplaySpan.innerHTML = "";
    totalOfServicesDisplaySpan.innerHTML = totalValueOfServices;
    
    let totalValueOfPartsAndServices = 0;

    totalValueOfParts = currencyToFloatNum(totalOfPartsDisplaySpan.innerText);
    totalValueOfServices = currencyToFloatNum(totalOfServicesDisplaySpan.innerText);

    totalValueOfPartsAndServices = totalValueOfParts + totalValueOfServices;

    totalValueOfPartsAndServices = formatToBrl(totalValueOfPartsAndServices);

    const totalOfBudgetDisplaySpan = document.querySelector(".total-of-budget-display-span");
    totalOfBudgetDisplaySpan.innerHTML = "";
    totalOfBudgetDisplaySpan.innerHTML = totalValueOfPartsAndServices;
}

async function createPartItem(quantString, descriptionString, unitValueString){

    let quant = parseInt(quantString);

    let unitValue = parseFloat(unitValueString.replace(",", "."));
    unitValueString = formatToBrl(unitValue);

    let totalValue =  quant * unitValue;

    let totalValueString = formatToBrl(totalValue);    

    const itemString =
    `
    <div class="parts-item">

                                <div class="parts-item-content">
                                    <span class="parts-quant-span">${quantString}</span>

                                    <span class="parts-description-span">${descriptionString.toUpperCase()}</span>

                                    <span class="parts-unit-value-span">${unitValueString}</span>

                                    <span class="parts-total-value-span">${totalValueString}</span>

                                    <div class="edit-btn-control">
                                        <button class="edit-btn-of-parts">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>

                                    <div class="delete-btn-control">
                                        <button class="delete-btn-of-parts">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>

    </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    partsAddedItemsControl.appendChild(itemHtml);
};

async function deleteItem_partItem(element){
    element.remove();
    await updateTotal_servicesAndParts();

    await handleAllEventListeners_partsItem();
}

async function editItem_partItem(element, elementIndex){
    let partsQuantSpan = document.querySelectorAll(`.parts-quant-span`);
    let partsDescriptionSpan = document.querySelectorAll(`.parts-description-span`);
    let partsUnitValueSpan = document.querySelectorAll(`.parts-unit-value-span`);

    console.log(element);
    console.log(elementIndex);

    partQuantInput.value = partsQuantSpan[elementIndex].innerText;
    partDescriptionInput.value = partsDescriptionSpan[elementIndex].innerText;
            
    let unitValueUpdated = currencyToStringFormat(partsUnitValueSpan[elementIndex].innerText);

    partUnitValueInput.value = unitValueUpdated;

    await handleAllEventListeners_partsItem();

    setTimeout(async()=>{
        await deleteItem_partItem(element);
    },1)

    await updateTotal_servicesAndParts();

}

async function handleAllEventListeners_partsItem(){
    let partsItem = document.querySelectorAll(".parts-item");

    if(partsItem[0] === undefined || partsItem.length == 0){
        return;
    }

    let editBtnOfParts = document.querySelectorAll(".edit-btn-of-parts");
    let deleteBtnOfParts = document.querySelectorAll(".delete-btn-of-parts");

    for(let i = 0; i < partsItem.length; i++){
        editBtnOfParts[i].removeEventListener("click", editItem_partItem);
        deleteBtnOfParts[i].removeEventListener("click",deleteItem_partItem)
    }
    
    for(let i = 0; i < partsItem.length; i++){
        editBtnOfParts[i].addEventListener("click", async()=>{
            await editItem_partItem(partsItem[i], i);
        });

        deleteBtnOfParts[i].addEventListener("click", async()=>{
            await deleteItem_partItem(partsItem[i], i);
        })
    }


}

async function addPartItemProcess(){
    //input validation
    if(partQuantInput.value === "" && partDescriptionInput.value === "" && partUnitValueInput.value === ""){
        await showMessagePopup("Insira as informações das peças aplicadas antes de prosseguir !" , "errorMsg");
        return;
    }

    if(partQuantInput.value ===""){
        await showMessagePopup("Insira a quantidade de peças !", "errorMsg");
        return;
    }

    if(partDescriptionInput.value ===""){
        await showMessagePopup("Insira a descrição da peça !", "errorMsg");
        return;
    }

    if(partUnitValueInput.value ===""){
        await showMessagePopup("Insira um valor unitário !" , "errorMsg");
        return;
    }

    await createPartItem(partQuantInput.value, partDescriptionInput.value, partUnitValueInput.value)
    await updateTotal_servicesAndParts();

    await handleAllEventListeners_partsItem();

    await clearInputs([
        partQuantInput,
        partDescriptionInput,
        partUnitValueInput
    ]);

}

//booting

handleAllEventListeners_partsItem();

upperCaseInputs([
    partDescriptionInput
])

updateTotal_servicesAndParts();

// event listerers

partQuantInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
});

partUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

partUnitValueInput.addEventListener('keydown',async (event)=>{
    if(event.key === "Enter"){
        await addPartItemProcess(); 

        partQuantInput.focus();
    }
})

partAddItemBtn.addEventListener("click", async ()=>{
    await addPartItemProcess();

    partQuantInput.focus();
});

//services section 

//elements

const servicesSection = document.querySelector(".services-section");
const servicesAddedItemsControl = document.querySelector(".services-added-items-control");
const serviceQuantInput = document.querySelector("#service-quant-input");
const serviceDescriptionInput = document.querySelector("#service-description-input");
const serviceUnitValueInput = document.querySelector("#service-unit-value-input");
const serviceAddItemBtn = document.querySelector("#service-add-item-btn");

async function createServiceItem(quantString , descriptionString , unitValueString){
    let quant = parseInt(quantString);

    let unitValue = parseFloat(unitValueString.replace(",", "."));
    unitValueString = formatToBrl(unitValue);

    let totalValue =  quant * unitValue;

    let totalValueString = formatToBrl(totalValue);

    const itemString = `
    <div class="services-item">

                                <div class="services-item-content">
                                    <span class="service-quant-span">${quant}</span>

                                    <span class="service-description-span">${descriptionString.toUpperCase()}</span>

                                    <span class="service-unit-value-span">${unitValueString}</span>

                                    <span class="service-total-value-span">${totalValueString}</span>

                                    <div class="edit-btn-control">
                                        <button class="edit-btn-of-services">
                                            <i class="fa-solid fa-pen"></i>
                                        </button>
                                    </div>

                                    <div class="delete-btn-control">
                                        <button class="delete-btn-of-services">
                                            <i class="fa-solid fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                            </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesAddedItemsControl.appendChild(itemHtml);
}


async function deleteItem_serviceItem(element){
    element.remove();
    await updateTotal_servicesAndParts();

    await handleAllEventListeners_servicesItem();
}

async function editItem_serviceItem(element, elementIndex){
    let serviceQuantSpan = document.querySelectorAll(".service-quant-span");
    let serviceDescriptionSpan = document.querySelectorAll(".service-description-span");
    let serviceUnitValueSpan = document.querySelectorAll(".service-unit-value-span");

    let unitValue = currencyToStringFormat(serviceUnitValueSpan[elementIndex].innerText);

    serviceQuantInput.value = serviceQuantSpan[elementIndex].innerText;
    serviceDescriptionInput.value = serviceDescriptionSpan[elementIndex].innerText;
    serviceUnitValueInput.value = unitValue;

    setTimeout(async()=>{
        await deleteItem_serviceItem(element);
    },1)
    
    await handleAllEventListeners_servicesItem();
    await updateTotal_servicesAndParts();
}

async function handleAllEventListeners_servicesItem(){
    let servicesItem = document.querySelectorAll(".services-item");

    if(servicesItem[0] === undefined || servicesItem.length == 0){
        return;
    }

    let editBtnOfServices = document.querySelectorAll(".edit-btn-of-services");
    let deleteBtnOfServices = document.querySelectorAll(".delete-btn-of-services");

    for(let i = 0; i < servicesItem.length; i++){
        editBtnOfServices[i].removeEventListener("click", editItem_serviceItem);
        deleteBtnOfServices[i].removeEventListener("click", deleteItem_serviceItem);
    }

    for(let i = 0; i < servicesItem.length; i++){
        editBtnOfServices[i].addEventListener("click", ()=>{
            editItem_serviceItem(servicesItem[i], i);
        });
        deleteBtnOfServices[i].addEventListener("click", ()=>{
            deleteItem_serviceItem(servicesItem[i]);
        });
    }
}


async function addServiceItemProcess(){
    //validation inputs

    if(serviceQuantInput.value === "" && serviceDescriptionInput.value === "" && serviceUnitValueInput.value === ""){
        await showMessagePopup("Insira as informações do serviços executados antes de prosseguir !" , "errorMsg");
        return;
    }
    if(serviceQuantInput.value === ""){
        await showMessagePopup("Insira a quantidade de serviços executados !", "errorMsg");
        return;
    }

    if(serviceDescriptionInput.value === ""){
        await showMessagePopup("Insira a descrição dos serviços executados !", "errorMsg");
        return;
    }

    if(serviceUnitValueInput.value === ""){
        await showMessagePopup("Insira o valor unitário do serviço executado !", "errorMsg");
        return;
    }
    
    await createServiceItem(serviceQuantInput.value, serviceDescriptionInput.value , serviceUnitValueInput.value);
    

    await handleAllEventListeners_servicesItem();
    await updateTotal_servicesAndParts();
    
    await clearInputs([
        serviceQuantInput,
        serviceDescriptionInput,
        serviceUnitValueInput
    ]);
}

//booting

handleAllEventListeners_servicesItem();

upperCaseInputs([
    serviceDescriptionInput
])

// event listeners

serviceQuantInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
});

serviceAddItemBtn.addEventListener("click", ()=>{
    addServiceItemProcess();

    serviceQuantInput.focus();
})

serviceUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

serviceUnitValueInput.addEventListener('keydown',(event)=>{
    if(event.key === "Enter"){
        addServiceItemProcess();

        serviceQuantInput.focus();
    }
})

//total-budget-prod-section

//elements
const totalBudgetProdSection = document.querySelector(".total-budget-prod-section");

// observations-section

//elements

const observationsSection = document.querySelector(".observations-section");
const observationsTextarea = document.querySelector("#observations-textarea");

// booting

upperCaseInputs([
    observationsTextarea
])

// expenses-section

// elements 

const expensesSection = document.querySelector(".expenses-section");
const expensesAddedItemsControl = document.querySelector(".expenses-added-items-control");
const expenseQuantInput = document.querySelector("#expense-quant-input");
const expenseDescriptionInput = document.querySelector("#expense-description-input");
const expenseUnitValueInput = document.querySelector("#expense-unit-value-input");
const expenseAdditemBtn = document.querySelector("#expense-add-item-btn");

// functions

async function createExpenseItem(quantString, descriptionString, unitValueString){
    let quant = parseInt(quantString);

    let unitValue = parseFloat(unitValueString.replace(",", "."));
    unitValueString = formatToBrl(unitValue);

    let totalValue =  quant * unitValue;

    let totalValueString = formatToBrl(totalValue);

    const itemString =
    `
        <div class="expenses-item">
            <div class="expenses-item-content">
                <span class="expense-quant-span">${quantString}</span>
                <span class="expense-description-span">${descriptionString.toUpperCase()}</span>
                <span class="expense-unit-value-span">${unitValueString}</span>
                <span class="expense-total-value-span">${totalValueString}</span>
                <div class="edit-btn-control">
                    <button class="edit-btn-of-expenses">
                        <i class="fa-solid fa-pen" aria-hidden="true"></i>
                    </button>
                </div>

                <div class="delete-btn-control">
                    <button class="delete-btn-of-expenses">
                        <i class="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    expensesAddedItemsControl.appendChild(itemHtml);
}

async function updateTotal_expenseSection(){
    const expenseTotalValueSpan = document.querySelectorAll(".expense-total-value-span");
    let totalValueOfExpenses = 0;

    if(expenseTotalValueSpan !== null ||expenseTotalValueSpan !== undefined){
        expenseTotalValueSpan.forEach((span)=>{
            let value = span.innerText;
            value = currencyToFloatNum(value);

            totalValueOfExpenses += value;
        })
    }

    if(expenseTotalValueSpan === null ||expenseTotalValueSpan === undefined){
        totalValueOfExpenses = 0
    }

    totalValueOfExpenses = formatToBrl(totalValueOfExpenses);

    const expensesItemTotalSpan = document.querySelector(".expenses-item-total-span");
    expensesItemTotalSpan.innerHTML = "";
    expensesItemTotalSpan.innerHTML = totalValueOfExpenses;
}

async function deleteItem_expenseItem(element){
    element.remove();
    await updateTotal_expenseSection();

    await handleAllEventListeners_expensesItem();
}

async function editItem_expenseItem(element, elementIndex){
    let expenseQuantSpan = document.querySelectorAll(".expense-quant-span");
    let expenseDescriptionSpan = document.querySelectorAll(".expense-description-span");
    let expenseUnitValueSpan = document.querySelectorAll(".expense-unit-value-span");

    expenseQuantInput.value = expenseQuantSpan[elementIndex].innerText;
    expenseDescriptionInput.value = expenseDescriptionSpan[elementIndex].innerText;

    let unitValueUpdated = currencyToStringFormat(expenseUnitValueSpan[elementIndex].innerText);

    expenseUnitValueInput.value = unitValueUpdated;

    await handleAllEventListeners_expensesItem();

    setTimeout(async()=>{
        await deleteItem_expenseItem(element);
    },1)

    await updateTotal_expenseSection();
}

async function handleAllEventListeners_expensesItem(){
    let expensesItem = document.querySelectorAll(".expenses-item");
    let editBtnOfExpenses = document.querySelectorAll(".edit-btn-of-expenses");
    let deleteBtnOfExpenses = document.querySelectorAll(".delete-btn-of-expenses");

    if(expensesItem[0] === undefined || expensesItem.length == 0){
        return
    }

    for(let i = 0; i < expensesItem.length; i++){
        editBtnOfExpenses[i].removeEventListener("click", editItem_expenseItem);
        deleteBtnOfExpenses[i].removeEventListener("click", deleteItem_expenseItem);
    }

    for(let i = 0; i < expensesItem.length; i++){
        editBtnOfExpenses[i].addEventListener("click", ()=>{
            editItem_expenseItem(expensesItem[i], i);
        });

        deleteBtnOfExpenses[i].addEventListener("click", ()=>{
            deleteItem_expenseItem(expensesItem[i]);
        })
    }
}

async function addExpenseItemProcess(){
    // input validation

    if(expenseQuantInput.value === "" && expenseDescriptionInput.value === "" && expenseUnitValueInput.value === "" ){
        await showMessagePopup("Insira as informações dos gastos com o serviço antes de prosseguir !", "errorMsg");
        return;
    }

    if(expenseQuantInput.value === ""){
        await showMessagePopup("Insira a quantidade de gastos !", "errorMsg");
        return;
    }

    if (expenseDescriptionInput.value === ""){
        await showMessagePopup("Insira a descrição do gasto aplicado !", "errorMsg");
        return;
    }

    if(expenseUnitValueInput.value === ""){
        await showMessagePopup("Insira o valor do gasto aplicado !", "errorMsg");
        return;
    }

    await createExpenseItem(expenseQuantInput.value,expenseDescriptionInput.value,expenseUnitValueInput.value);
    await updateTotal_expenseSection();

    await handleAllEventListeners_expensesItem();

    await clearInputs([
        expenseQuantInput,
        expenseDescriptionInput,
        expenseUnitValueInput,
    ])
}

// booting

upperCaseInputs([
    expenseDescriptionInput
]);

handleAllEventListeners_expensesItem();
updateTotal_expenseSection();

// event listeners

expenseQuantInput.addEventListener("input", (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

expenseUnitValueInput.addEventListener("input", (event) => {
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
});

expenseUnitValueInput.addEventListener("keydown", async (event)=>{
    if(event.key === "Enter"){
        await addExpenseItemProcess();

        expenseQuantInput.focus();
    }
})

expenseAdditemBtn.addEventListener("click", async ()=>{
    await addExpenseItemProcess();

    expenseQuantInput.focus();
})  

// loading screen

//elements
const overlayForLoading = document.querySelector(".overlay-for-loading");

// confirmation popup

// elements
const overlay = document.querySelector(".overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const wrongPasswordSpan = document.querySelector(".wrong-password-span");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

async function showConfirmationPopup(){
    overlay.style.display = "flex";
    budgetProduction.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

async function closeConfirmationPopup(){
    overlay.style.display="none";
    budgetProduction.style.filter = "blur(0)"
}

async function confirmationProcess(){
    await showConfirmationPopup();

    confirmationPopupBtn.addEventListener("click",async ()=>{
        if(confirmationPasswordInput.value === confirmationPassword){
            await displayBudgetNumber();
            await closeConfirmationPopup();
            await sendToServerProcess();
            await displayBudgetProcess();
        }else{
            wrongPasswordSpan.style.display = "block";
        
            setTimeout(()=>{
                wrongPasswordSpan.style.display = "none";
            },10000);

            confirmationPasswordInput.addEventListener("focus",()=>{
                wrongPasswordSpan.style.display = "none";
            })

            return;
        }
    })

    confirmationPasswordInput.addEventListener("keypress", async (event)=>{
        if(event.key === "Enter"){
            if(confirmationPasswordInput.value === confirmationPassword){
                await displayBudgetNumber();
                await closeConfirmationPopup();
                await sendToServerProcess();
                await displayBudgetProcess();
                
            }else{
                wrongPasswordSpan.style.display = "block";
            
                setTimeout(()=>{
                    wrongPasswordSpan.style.display = "none";
                },10000);
    
                confirmationPasswordInput.addEventListener("focus",()=>{
                    wrongPasswordSpan.style.display = "none";
                })
    
                return;
            }
        }
    })
}

// event listerners

closeConfirmationPopupBtn.addEventListener("click",async ()=>{
    await closeConfirmationPopup();
})

//generate budget section

//elements
const generateBudgetSection = document.querySelector(".generate-budget-section");
const generateBudgetBtn = document.querySelector("#generate-budget-btn");
let latest_budget_number = {
    latestNumber : null
};

// functions

getBudgetLatestNumber();

async function getBudgetLatestNumber(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com/get-latest-budget-number`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let number = await response.json();

        console.log(number);

        return number;
    }catch(error){
        console.error(error);
    }
}

async function updateBudgetNumberData(){
    try {
        let number = budgetNumberSpan.innerText;

        latest_budget_number.latestNumber = number; 

        const response = await fetch('https://emeg-system.onrender.com/update-latest-budget-number', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latest_budget_number }),
        });

        if (!response.ok) {
            await showServerMessagePopup("errorMsg", "Erro ao atualizar dados no servidor!");
            throw new Error('Erro ao atualizar os dados no backend');
        }

        const result = await response.text();

        console.log('Dados atualizados com sucesso no backend e GitHub Pages:', result);

        return true;

    } catch (error) {
        console.error('Erro:', error);
        return false;
    }
}

async function sendToServerProcess(){
    await showHtmlElement([overlayForLoading], "flex");

    const response = await updateBudgetNumberData();

    if(!response){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar os dados ! Tente novamente !");
        return;
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg","Dados enviados com sucesso !");

    await showMessagePopup("Dados atualizados com sucesso !","sucessMsg");
}

async function displayBudgetNumber(){
    let number = await getBudgetLatestNumber();
    number = parseInt(number.latest_budget_number.latestNumber) + 1;
    let year = new Date().getFullYear();

    budgetNumberSpan.innerHTML = `${number}`;
    budgetYearSpan.innerHTML = `${year}`;

}

//budget finished 

//elements
const budgetFinished = document.querySelector("#budget-finished");
const budgetFinishedContent = document.querySelector(".budget-finished-content-container");

const clientSpanResult = document.querySelector("#client-span-result");
const equipamentSpanResult = document.querySelector("#equipament-span-result");
const budgetNumberSpan = document.querySelector("#budget-number-span");
const budgetYearSpan = document.querySelector("#budget-year-span");
const paymentTermsSpanResult = document.querySelector("#payment-terms-span-result");
const completionDeadlineSpanResult = document.querySelector("#completion-deadline-span-result");
const guaranteeSpanResult = document.querySelector("#guarantee-span-result");
const dateSpanResult = document.querySelector("#date-span-result");

const apliedPartsItemsContainer = document.querySelector(".aplied-parts-items-container");
const totalOfPartsApliedItemsSpan = document.querySelector(".total-of-aplied-parts-span");
const servicesPerformedItemsContainer = document.querySelector(".services-performed-items-container");
const totalOfServicesPerformedItemsSpan = document.querySelector(".total-of-services-performed-items-span")

const totalOfPartsSpan = document.querySelector(".total-of-parts-span");
const totalOfServicesSpan = document.querySelector(".total-of-services-span");
const totalOfBudgetSpan = document.querySelector(".total-of-budget-span");

const observationsMadeSpan = document.querySelector(".observations-made-span");

const savePdfBtn = document.querySelector("#save-document-pdf-btn");
const saveHtmlBtn = document.querySelector("#save-document-html-btn");
const backBudgetBtn = document.querySelector("#back-budget-btn");

//functions

async function addHeaderFinishedProcess(){
    clearHtmlElement([
        clientSpanResult,
        equipamentSpanResult,
        paymentTermsSpanResult,
        guaranteeSpanResult,
        dateSpanResult,
        completionDeadlineSpanResult
    ])

    clientSpanResult.innerText = clientInput.value;

    if(clientInput.value === "(NÃO IDENTIFICADO)"){
        equipamentSpanResult.innerText = notIdentifiedInput.value;
    }else{
        equipamentSpanResult.innerText = equipamentInput.value;
    }

    paymentTermsSpanResult.innerText = paymentTermsInput.value;
    completionDeadlineSpanResult.innerText = completionDeadlineInput.value;
    guaranteeSpanResult.innerText = guaranteeInput.value;
    dateSpanResult.innerText = JsDate_to_BrDate();

    if(paymentTermsSpanResult.innerText === ""){
        paymentTermsSpanResult.innerText = "###"
    }

    if(guaranteeSpanResult.innerText === ""){
        guaranteeSpanResult.innerText = "###"
    }

    if(completionDeadlineSpanResult.innerText === ""){
        completionDeadlineSpanResult.innerText = "###"
    }

    if(dateSpanResult.innerText === "undefined/undefined/"){
        dateSpanResult.innerText = "###"
    }

    document.querySelector("title").textContent = `ORÇAMENTO ${budgetNumberSpan.innerText}${budgetYearSpan.innerText} ${clientSpanResult.innerText} ${equipamentSpanResult.innerText}`;
}

function createPartItemFinished(numberItem, quant , description , unitValue , totalValue){
    const itemString = 
    `
        <div class="aplied-parts-item">
            <span class ="aplied-part-number-item-span">${numberItem}</span>
            <span class="aplied-part-quant-span">${quant}</span>
            <span class="aplied-part-description-span">${description}</span>
            <span class="aplied-part-unit-value-span">${unitValue}</span>
            <span class="aplied-part-total-value-span">${totalValue}</span>
        </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    apliedPartsItemsContainer.appendChild(itemHtml);
}

function createServiceItemFinished(numberItem, quant , description , unitValue , totalValue){
    const itemString = 
    `
    <div class="services-performed-item">
        <span class="serv-performed-number-item-span">${numberItem}</span>
        <span class="serv-performed-quant-span">${quant}</span>
        <span class="serv-performed-description-span">${description}</span>
        <span class="serv-performed-unit-value-span">${unitValue}</span>
        <span class="serv-performed-total-value-span">${totalValue}</span>
    </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesPerformedItemsContainer.appendChild(itemHtml);
}

function createNoContentPartsSpan(spanHTML, spanMsg){
    const itemString = 
    `
    <span class="${spanHTML}">${spanMsg}</span>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    apliedPartsItemsContainer.appendChild(itemHtml);
}

function createNoContentServicesSpan(spanHTML, spanMsg){
    const itemString = 
    `
    <span class="${spanHTML}">${spanMsg}</span>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(itemString, 'text/html');

    const itemHtml  = doc.body.firstChild;

    servicesPerformedItemsContainer.appendChild(itemHtml);
}

async function addServiceItemFinishedProcess(){
   const servicesItem = document.querySelectorAll(".services-item");
   const serviceQuantSpan = document.querySelectorAll(".service-quant-span");
   const serviceDescriptionSpan = document.querySelectorAll(".service-description-span");
   const serviceUnitValueSpan = document.querySelectorAll(".service-unit-value-span");
   const serviceTotalValueSpan = document.querySelectorAll(".service-total-value-span");

   servicesPerformedItemsContainer.innerHTML = "";
   
   if(servicesItem[0] === undefined){
        createNoContentServicesSpan("serv-performed-no-content-span","NÃO FORAM EXECUTADOS SERVIÇOS !");
        return;
   }

   for(let i = 0; i < servicesItem.length ; i++){
        let item = i + 1;
        createServiceItemFinished(
            item,
            serviceQuantSpan[i].innerText,
            serviceDescriptionSpan[i].innerText,
            serviceUnitValueSpan[i].innerText,
            serviceTotalValueSpan[i].innerText,
        )
   }
}

async function addPartItemFinishedProcess(){
    const partsItem = document.querySelectorAll(".parts-item");
    const partsQuantSpan = document.querySelectorAll(".parts-quant-span"); 
    const partsDescriptionSpan = document.querySelectorAll(".parts-description-span");
    const partsUnitValueSpan = document.querySelectorAll(".parts-unit-value-span");
    const partsTotalValueSpan = document.querySelectorAll(".parts-total-value-span"); 

    apliedPartsItemsContainer.innerHTML = "";

    if (partsItem[0] === undefined){
        createNoContentPartsSpan("aplied-parts-no-content-span", "NÃO FORAM APLICADAS PEÇAS !");
        return;
    }

    for(let i = 0 ; i < partsItem.length ; i++){
        let item = i+1;
        createPartItemFinished(
            item,
            partsQuantSpan[i].innerText,
            partsDescriptionSpan[i].innerText,
            partsUnitValueSpan[i].innerText,
            partsTotalValueSpan[i].innerText,
        )
    }
}

async function addAllItemsTotalFinished(){
    const partsItemTotalSpan = document.querySelector(".parts-item-total-span");
    const servicesItemTotalSpan = document.querySelector(".services-item-total-span");
    const totalOfBudgetDisplaySpan = document.querySelector(".total-of-budget-display-span");

    //clear inputs
    totalOfPartsApliedItemsSpan.innerHTML = "";
    totalOfPartsSpan.innerHTML = "";
    totalOfServicesPerformedItemsSpan.innerHTML = "";
    totalOfServicesSpan.innerHTML = "";
    totalOfBudgetSpan.innerHTML = "";

    //display informations

    totalOfPartsApliedItemsSpan.innerText = partsItemTotalSpan.innerText;
    totalOfServicesPerformedItemsSpan.innerText = servicesItemTotalSpan.innerText;
    totalOfPartsSpan.innerText = partsItemTotalSpan.innerText;
    totalOfServicesSpan.innerText = servicesItemTotalSpan.innerText;
    totalOfBudgetSpan.innerText = totalOfBudgetDisplaySpan.innerText;


    if (partsItemTotalSpan.innerText === ""){
        totalOfPartsApliedItemsSpan.innerText = "R$ -";
        totalOfPartsSpan.innerText = "R$ -";
    };
    
    if(servicesItemTotalSpan.innerText === ""){
        totalOfServicesPerformedItemsSpan.innerText = "R$ -";
        totalOfServicesSpan.innerText = "R$ -";
    };

    if (totalOfBudgetDisplaySpan.innerText === ""){
        totalOfBudgetSpan.innerText = "R$ -";
    };
}

async function addObservationsFinishedProcess(){
    observationsMadeSpan.innerHTML = "";

    if(observationsTextarea.value === ""){
        observationsMadeSpan.innerText = "SEM OBSERVAÇÕES !";
        return;
    }

    observationsMadeSpan.innerText = observationsTextarea.value;
}

async function displayBudgetProcess(){
    //show budget finished and hide budget production
    await showHtmlElement([budgetFinished],"block");
    await hideHtmlElement([budgetProduction])
    //display header informations
    
    await addHeaderFinishedProcess();

    //display parts and services informations

    await addPartItemFinishedProcess();
    await addServiceItemFinishedProcess();

    //display total informations

    await addAllItemsTotalFinished();

    //display observations informations

    await addObservationsFinishedProcess();
}

function saveAsHtml(){
    let budgetNameArchive = `ORÇAMENTO ${budgetNumberSpan.innerText}${budgetYearSpan.innerText} ${clientSpanResult.innerText} ${equipamentSpanResult.innerText}`

    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${budgetNameArchive} .html`;
    link.click();
}

function backHomeProcess(){
    clientInput.value = clientSpanResult.innerText;

    if(clientSpanResult.innerText === "(NÃO IDENTIFICADO)"){
        showHtmlElement([notIdentifiedInput], "block");
        hideHtmlElement([equipamentInput]);

        notIdentifiedInput.value = equipamentSpanResult.innerText;
    }

    if(clientSpanResult.innerText !== "(NÃO IDENTIFICADO)"){
        showHtmlElement([equipamentInput], "block");
        hideHtmlElement([notIdentifiedInput]);

        equipamentInput.value  = equipamentSpanResult.innerText
    }

    paymentTermsInput.value = paymentTermsSpanResult.innerText;
    completionDeadlineInput.value = completionDeadlineSpanResult.innerText;
    guaranteeInput.value = guaranteeSpanResult.innerText;

    if(dateSpanResult.innerText !== "###"){
        dateInput.value = brDate_to_JsDate(dateSpanResult.innerText);
    }else{
        dateInput.value = "";
    }
    
    if(paymentTermsInput.value === "###"){
        paymentTermsInput.value = "";
    }

    if(completionDeadlineInput.value === "###"){
        completionDeadlineInput.value = "";
    }

    if(guaranteeInput.value === "###"){
        guaranteeInput.value = "";
    }

    showHtmlElement([budgetProduction],"block");
    hideHtmlElement([budgetFinished]);
    document.querySelector("title").textContent = "Criar orçamento EMEG";
}


//event listerner

generateBudgetBtn.addEventListener("click", async ()=>{
    if(budgetNumberSpan.innerText === ""){
        await confirmationProcess();
        return;
    }

    await displayBudgetProcess();
})

saveHtmlBtn.addEventListener("click", ()=>{
    saveAsHtml();
})   

savePdfBtn.addEventListener("click", ()=>{
    window.print();
})

backBudgetBtn.addEventListener("click", ()=>{
    backHomeProcess();
}) 