let clientsEquipamentsArray = []

// clients_equipaments.json
async function getClientsData(){
    try{
        const response = await fetch(`https://nicholas1front.github.io/emeg_system/apps/backend/data/clients_equipaments.json?timestamp=${new Date().getTime()}`);

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


// message popup

async function showPopupMsg(message , messageType ){
    msgSpan.innerHTML = "";
    msgSpan.innerText = message;

    if(messageType === "errorMsg"){
        msgControl.style.backgroundColor = "#d61e1e";//red color
        msgControl.style.color = "white"; 
        closeMsgBtn.style.color = "white";
    }else if (messageType === "adviceMsg"){
        msgControl.style.backgroundColor = "#fcba03";  //yellow color
        msgControl.style.color = "black";
        closeMsgBtn.style.color = "black";
    }else if(messageType === "successMsg"){
        msgControl.style.backgroundColor = "#42f55a" //green color
        msgControl.style.color = "white";
        closeMsgBtn.style.color = "white";
    }

    showHtmlElement([msgControl],"block");
    msgControl.style.transition = "0.5s";
    msgControl.style.marginTop = "37%";

    setTimeout(() => {
        closePopupMsg();
    }, 6000);

}

async function closePopupMsg(){
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
    const number = value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.');

    return parseFloat(number);
}

//budget-production

//header

//elements
const budgetProduction = document.querySelector("#budget-production");
const msgControl = document.querySelector(".msg-control");
const closeMsgBtn = document.querySelector("#close-msg-btn");
const msgSpan = document.querySelector(".msg-span");

const clientsSelectList = document.querySelector("#clients-select-list");
const equipamentsSelectList = document.querySelector("#equipaments-select-list");
const notIdentifiedInput = document.querySelector("#not-identified-input");
const dateInput = document.querySelector("#date-input");
const completionDeadlineInput = document.querySelector("#completion-deadline-input");
const paymentTermsInput = document.querySelector("#payment-terms-input");
const guaranteeInput = document.querySelector("#guarantee-input");
const nextStepContainer = document.querySelector(".next-step-container");
const infosNextStepBtn = document.querySelector("#infos-next-step-btn");

//functions

async function createClientsList(){
    clientsEquipamentsArray = await getClientsData();

    clientsEquipamentsArray.forEach(client => {
        let option = document.createElement("option");

        option.textContent = client.name;
        option.value = client.name;

        clientsSelectList.appendChild(option);
    });
}

function createEquipamentsList(){
    let equipamentData = [];

    clearHtmlElement([equipamentsSelectList]);
    clearInputs([notIdentifiedInput]);

    if(clientsSelectList.value === "(NÃO IDENTIFICADO)"){
        showHtmlElement([notIdentifiedInput],"block");
        hideHtmlElement([equipamentsSelectList]);
    }else{
        showHtmlElement([equipamentsSelectList],"block");
        hideHtmlElement([notIdentifiedInput]);
    }

    clientsEquipamentsArray.forEach((client) => {
        if(clientsSelectList.value === client.name){
            equipamentData = equipamentData.concat(client.equipaments);

            console.log(equipamentData);

            equipamentData.forEach((equipament)=>{
                let option = document.createElement("option");

                option.textContent = equipament;
                option.value = equipament;

                equipamentsSelectList.add(option);
            });
        }
    })
};

async function validateSelectsProcess(){
    if(clientsSelectList.value === ""){
        await showPopupMsg("Selecione um cliente !", "errorMsg");
        return;
    }

    if(equipamentsSelectList.style.display === "block" && equipamentsSelectList.value === ""){
        await showPopupMsg("Selecione um equipamento !", "errorMsg");
        return;
    }

    if(clientsSelectList.value === "(NÃO IDENTIFICADO)" && notIdentifiedInput.style.display === "block" && notIdentifiedInput.value === ""){
        await showPopupMsg("Digite o modelo do equipamento !", "errorMsg");
        return;
    }

    if(dateInput.value === "" || completionDeadlineInput.value === "" || paymentTermsInput.value === "" || guaranteeInput.value === ""){
        await showPopupMsg("Alguns campos estão vazios !", "adviceMsg");
    };

    await showHtmlElement([partsSection,servicesSection,totalBudgetProdSection,observationsSection,generateBudgetSection], "block");
    await hideHtmlElement([nextStepContainer]);
}



//booting

window.addEventListener("DOMContentLoaded",async ()=>{
    await createClientsList();
})

upperCaseInputs([
    notIdentifiedInput,
    guaranteeInput,
    paymentTermsInput,
    completionDeadlineInput
])

//event listeners

clientsSelectList.addEventListener("change", ()=>{
    createEquipamentsList();
})

infosNextStepBtn.addEventListener("click", ()=>{
    validateSelectsProcess();
});

closeMsgBtn.addEventListener("click", ()=>{
    closePopupMsg();
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

function updateTotalSpan(spanGroupHtml, spanResultHtml){
    const allSpansHtml = document.querySelectorAll(`.${spanGroupHtml}`);

    let totalValue = null;

    for(let i = 0 ; i < allSpansHtml.length ; i++){
        let number = currencyToFloatNum(allSpansHtml[i].innerText);

        totalValue += number;
    }

    const resultSpan = document.querySelector(`.${spanResultHtml}`);

    resultSpan.innerHTML = "";

    let totalValueString = formatToBrl(totalValue);

    if (totalValueString === "R$ NaN"){
        totalValueString = "R$ 0,00";
    }

    resultSpan.innerText = totalValueString;

}

async function updateTotalSpans_BudgetProdSection(){
    const partsItemTotalSpan = document.querySelector(".parts-item-total-span");
    const servicesItemTotalSpan = document.querySelector(".services-item-total-span");
    let partsItemsValue = 0;
    let servicesItemsValue = 0;
    let totalBudgetValue = 0;

    const totalPartsDisplaySpan = document.querySelector(".total-of-parts-display-span");
    const totalServicesDisplaySpan = document.querySelector(".total-of-services-display-span");
    const totalBudgetDisplaySpan = document.querySelector(".total-of-budget-display-span");

    //clear inputs
    totalPartsDisplaySpan.innerHTML = "";
    totalServicesDisplaySpan.innerHTML = "";
    totalBudgetDisplaySpan.innerHTML = "";

    if (partsItemTotalSpan.innerText === ""){
        partsItemTotalSpan.innerText = "R$ 0,00";
    }

    if(servicesItemTotalSpan.innerText === ""){
        servicesItemTotalSpan.innerText = "R$ 0,00"
    }

    let partsItemsValueString = currencyToFloatNum(partsItemTotalSpan.innerText)
    let servicesItemsValueString = currencyToFloatNum(servicesItemTotalSpan.innerText);

    partsItemsValue = partsItemsValueString;
    servicesItemsValue = servicesItemsValueString;

    totalBudgetValue = partsItemsValue + servicesItemsValue;
        
    let totalBudgetValueString = formatToBrl(totalBudgetValue);
    partsItemsValueString = formatToBrl(partsItemsValue);
    servicesItemsValueString = formatToBrl(servicesItemsValue);

    totalPartsDisplaySpan.innerHTML = partsItemsValueString;
    totalServicesDisplaySpan.innerHTML = servicesItemsValueString
    totalBudgetDisplaySpan.innerHTML = totalBudgetValueString;

    return;

}

function createPartItem(quantString, descriptionString, unitValueString){

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

async function partsItems_handleEventListeners(){
    /*get itens all time this function is called*/

    let partsItem = document.querySelectorAll(".parts-item");
    let editBtnOfParts = document.querySelectorAll(".edit-btn-of-parts");
    let deleteBtnOfParts = document.querySelectorAll('.delete-btn-of-parts');

    //event listeners to delete itens
    for(let i = 0 ; i < partsItem.length ; i++){
        deleteBtnOfParts[i].addEventListener("click", ()=>{
            partsItem[i].remove();
            updateTotalSpan("parts-total-value-span", "parts-item-total-span");
            updateTotalSpans_BudgetProdSection();
        })   
    };

    //event listeners to edit itens

    for(let i = 0 ; i < partsItem.length ; i++){
       editBtnOfParts[i].addEventListener("click", ()=>{
            let partsQuantSpan = document.querySelectorAll(".parts-quant-span");
            let partsDescriptionSpan = document.querySelectorAll(".parts-description-span");
            let partsUnitValueSpan = document.querySelectorAll(".parts-unit-value-span");

            partQuantInput.value = partsQuantSpan[i].innerText;
            partDescriptionInput.value = partsDescriptionSpan[i].innerText;
            
            let unitValueUpdated = partsUnitValueSpan[i].innerText.slice(2); // took off the R$

            partUnitValueInput.value = unitValueUpdated;

            partsItem[i].remove();

            updateTotalSpan("parts-total-value-span", "parts-item-total-span");
            updateTotalSpans_BudgetProdSection();
       })   
    };
}

async function addPartItemProcess(){
    //input validation
    if(partQuantInput.value === "" && partDescriptionInput.value === "" && partUnitValueInput.value === ""){
        await showPopupMsg("Insira as informações das peças aplicadas antes de prosseguir !" , "errorMsg");
        return;
    }

    if(partQuantInput.value ===""){
        await showPopupMsg("Insira a quantidade de peças !", "errorMsg");
        return;
    }

    if(partDescriptionInput.value ===""){
        await showPopupMsg("Insira a descrição da peça !", "errorMsg");
        return;
    }

    if(partUnitValueInput.value ===""){
        await showPopupMsg("Insira um valor unitário !" , "errorMsg");
        return;
    }

    createPartItem(partQuantInput.value, partDescriptionInput.value, partUnitValueInput.value)
    updateTotalSpan("parts-total-value-span", "parts-item-total-span");

    await partsItems_handleEventListeners();

    await clearInputs([
        partQuantInput,
        partDescriptionInput,
        partUnitValueInput
    ]);

}

//booting

partsItems_handleEventListeners();

upperCaseInputs([
    partDescriptionInput
])

// event listerers

partAddItemBtn.addEventListener("click", async ()=>{
    await addPartItemProcess();
    await updateTotalSpans_BudgetProdSection();
});

partUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

partUnitValueInput.addEventListener('keydown',async (event)=>{
    if(event.key === "Enter"){
        await addPartItemProcess();
        await updateTotalSpans_BudgetProdSection();
    }
})

//services section 

//elements

const servicesSection = document.querySelector(".services-section");
const servicesAddedItemsControl = document.querySelector(".services-added-items-control");
const serviceQuantInput = document.querySelector("#service-quant-input");
const serviceDescriptionInput = document.querySelector("#service-description-input");
const serviceUnitValueInput = document.querySelector("#service-unit-value-input");
const serviceAddItemBtn = document.querySelector("#service-add-item-btn");

function createServiceItem(quantString , descriptionString , unitValueString){
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

async function servicesItems_handleEventListeners(){
    let servicesItem = document.querySelectorAll(".services-item");
    let editBtnOfServices = document.querySelectorAll(".edit-btn-of-services");
    let deleteBtnOfServices = document.querySelectorAll(".delete-btn-of-services");

    for(let i = 0 ; i < servicesItem.length ; i++){
        deleteBtnOfServices[i].addEventListener('click', ()=>{
            servicesItem[i].remove();
            updateTotalSpan("service-total-value-span", "services-item-total-span");
            updateTotalSpans_BudgetProdSection();
        });
    }

    for(let i = 0 ; i < servicesItem.length ; i++){
        editBtnOfServices[i].addEventListener("click", ()=>{
            let serviceQuantSpan = document.querySelectorAll(".service-quant-span");
            let serviceDescriptionSpan = document.querySelectorAll(".service-description-span");
            let serviceUnitValueSpan = document.querySelectorAll(".service-unit-value-span");

            let unitValue = serviceUnitValueSpan[i].innerText.slice(2);

            serviceQuantInput.value = serviceQuantSpan[i].innerText;
            serviceDescriptionInput.value = serviceDescriptionSpan[i].innerText;
            serviceUnitValueInput.value = unitValue;

            servicesItem[i].remove();

            updateTotalSpan("service-total-value-span", "services-item-total-span");
            updateTotalSpans_BudgetProdSection();
        })
    }
}

async function addServiceItemProcess(){
    //validation inputs

    if(serviceQuantInput.value === "" && serviceDescriptionInput.value === "" && serviceUnitValueInput.value === ""){
        await showPopupMsg("Insira as informações do serviços executados antes de prosseguir !" , "errorMsg");
        return;
    }
    if(serviceQuantInput.value === ""){
        await showPopupMsg("Insira a quantidade de serviços executados !", "errorMsg");
        return;
    }

    if(serviceDescriptionInput.value === ""){
        await showPopupMsg("Insira a descrição dos serviços executados !", "errorMsg");
        return;
    }

    if(serviceUnitValueInput.value === ""){
        await showPopupMsg("Insira o valor unitário do serviço executado !", "errorMsg");
        return;
    }
    
    createServiceItem(serviceQuantInput.value, serviceDescriptionInput.value , serviceUnitValueInput.value);
    updateTotalSpan("service-total-value-span", "services-item-total-span");
    clearServicesInputs();

    await servicesItems_handleEventListeners(); 
    
    await clearInputs([
        serviceQuantInput,
        serviceDescriptionInput,
        serviceUnitValueInput
    ]);
}

//booting

servicesItems_handleEventListeners();

upperCaseInputs([
    serviceDescriptionInput
])

// event listeners

serviceAddItemBtn.addEventListener("click", ()=>{
    addServiceItemProcess();
    updateTotalSpans_BudgetProdSection();
})

serviceUnitValueInput.addEventListener('input', (event)=>{
    const updateValue = validateOnlyNumbers(event.target.value);

    event.target.value = updateValue;
})

serviceUnitValueInput.addEventListener('keydown',(event)=>{
    if(event.key === "Enter"){
        addServiceItemProcess();
        updateTotalSpans_BudgetProdSection();
    }
})

//total-budget-prod-section

//elements
const totalBudgetProdSection = document.querySelector(".total-budget-prod-section");

// observations-section

//elements

const observationsSection = document.querySelector(".observations-section");
const observationsTextarea = document.querySelector("#observations-textarea");

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

function showConfirmationPopup(){
    overlay.style.display = "flex";
    priceListSystemContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    priceListSystemContainer.style.filter = "blur(0)"
}

async function confirmationProcess(){
    showConfirmationPopup();

    confirmationPopupBtn.addEventListener("click",async ()=>{
        if(confirmationPasswordInput.value === confirmationPassword){
            await displayBudgetNumber();
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
}

//generate budget section

//elements
const generateBudgetSection = document.querySelector(".generate-budget-section");
const generateBudgetBtn = document.querySelector("#generate-budget-btn");
let latest_budget_number = null;

// functions

async function getBudgetLatestNumber(){
    try{
        const response = await fetch(`https://nicholas1front.github.io/emeg_system/apps/backend/data/latest_budget_number.json?timestamp=${new Date().getTime()}`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let number = await response.json();
        number = number.latest; 

        console.log(number);

        return number;
    }catch(error){
        console.error(error);
    }
}

async function updateBudgetNumberData(){
    try {
        latest_budget_number = budgetNumberSpan.innerText;
        latest_budget_number = latest_budget_number.slice(0,1);

        const response = await fetch('https://emeg-orc.onrender.com/update-latest-budget-number', { 
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
    await showHtmlElement([overlayForLoading]);

    const response = await updateBudgetNumberData();

    if(!response){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar os dados ! Tente novamente !");
        return;
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg","Dados enviados com sucesso !");

    await showMessagePopup("sucessMsg","Dados atualizados com sucesso !");
}

async function displayBudgetNumber(){
    let number = await getBudgetLatestNumber();
    number = parseInt(number) + 1;
    let year = new Date().getFullYear();

    budgetNumberSpan.innerHTML = `${number}${year}`;

}

//budget finished 

//elements
const budgetFinished = document.querySelector("#budget-finished");
const budgetFinishedContent = document.querySelector(".budget-finished-content-container");

const clientSpanResult = document.querySelector("#client-span-result");
const equipamentSpanResult = document.querySelector("#equipament-span-result");
const budgetNumberSpan = document.querySelector("#budget-number-span"); 
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

    clientSpanResult.innerText = clientsSelectList.value;

    if(clientsSelectList.value === "(NÃO IDENTIFICADO)"){
        equipamentSpanResult.innerText = notIdentifiedInput.value;
    }else{
        equipamentSpanResult.innerText = equipamentsSelectList.value;
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

    let budgetName = createBudgetName();

    document.querySelector("title").textContent = budgetName;
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
    budgetNameArchive = createBudgetName();

    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${budgetNameArchive} .html`;
    link.click();
}

function backHomeProcess(){
    clientsSelectList.value = clientSpanResult.innerText;
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