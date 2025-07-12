// server status and get-clients-equipaments data

// elements
const serverOverlay = document.querySelector(".server-overlay");
const serverErrorMsg = document.querySelector("#server-error-msg");

async function getServerStatus(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com`);
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let serverStatus = await response.json();

        console.log(serverStatus);

        return serverStatus;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }    
}

async function verifyServerStatus(){
    await showHtmlElement([loadingOverlay], "flex");
    const serverStatusObject = await getServerStatus();
    let serverStatus = true;

    serverErrorMsg.innerText = "";

    if(!serverStatusObject.server || !serverStatusObject.env || serverStatusObject.dropboxAccess == false){
        serverStatus = false;
    }

    for ( key in serverStatusObject.archives){
        if(serverStatusObject.archives[key] === false){
            serverStatus = false;
        }
    }

    if(!serverStatus){
        await hideHtmlElement([loadingOverlay]); 
        serverErrorMsg.innerText = serverStatusObject;
        await showHtmlElement([serverOverlay], "flex");
        return;
    }else{
        services_array = await getServicesData();
        await hideHtmlElement([loadingOverlay]);
        await showServerMessagePopup("sucessMsg", "Servidor funcionando corretamente !");
    }
}

document.addEventListener("DOMContentLoaded", async()=>{
    await verifyServerStatus();
});

//get services from services.json
let services_array = [];

async function getServicesData(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com/get-services`);

        const resultArray = await response.json();

        resultArray.sort((a, b) => {
            if (a.type === b.type) {
                return a.name.localeCompare(b.name);
            }
            return a.type.localeCompare(b.type);
        });

        return resultArray;

    }catch(error){
        console.error(`Failed to load json : ${error}`);
    }
}

// update services data

async function updateServiceData(){
    try {
        const response = await fetch('https://emeg-system.onrender.com/update-services', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ services_array }),
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

// upperCase inputs

// elements
const allInputs = document.querySelectorAll("input")

// functions
async function upperCaseInputs() {
    allInputs.forEach((input)=>{
        input.addEventListener("input", ()=>{
            let start = input.selectionStart;
            let end = input.selectionEnd;

            input.value = input.value.toUpperCase();

            input.setSelectionRange(start, end);
        })
    })
}

// booting

upperCaseInputs();

// show or hide elements

async function showHtmlElement([...elements], displayType){
    elements.forEach((element)=>{
        element.style.display = `${displayType}`;
    })
}

async function hideHtmlElement([...elements]){
    elements.forEach((element)=>{
        element.style.display = `none`;
    })
}

// backHomeProcess and cleanAllInputs

async function backHomeProcess(){
    await cleanAllInputs();

    const allSections = document.querySelectorAll("section");

    allSections.forEach(async(section)=>{
        await hideHtmlElement([section]);
    })

    await showHtmlElement([mainHubSection],"block");
}

async function cleanAllInputs(){
    const allInputs = document.querySelectorAll("input");
    const allSelects = document.querySelectorAll("select");

    allInputs.forEach((element)=>{
        element.value = "";
    })
    
    allSelects.forEach((element)=>{
        element.value = "";
    })
}

// format values

async function formatToBrl(value){
    return new Intl.NumberFormat("pt-BR", {
        style : "currency",
        currency : "BRL",
    }).format(value);
};

async function currencyToFloatNum(value){
    const number = value.replace(/[^\d,-]/g, '').replace('.', '').replace(',', '.');

    return parseFloat(number);
}

async function validateOnlyNumbers(param){
    return param.replace(/[^0-9,]/g,"")
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
})

//message popup

//elements
const messagePopup = document.querySelector(".message-popup");
const closeMessagePopupBtn= document.querySelector(".close-message-popup-btn");
const messagePopupSymbol = document.querySelector(".message-popup-control i");
const messagePopupSpan = document.querySelector(".message-popup-span");

//functions

async function showMessagePopup(messageType, messageSpan){
    messagePopupSymbol.removeAttribute("className");

    if(messageType === "errorMsg"){
        messagePopup.style.backgroundColor = "#d61e1e";
        messagePopup.style.color = "#fff";
        messagePopupSymbol.className = `fa-solid fa-triangle-exclamation` ;
    }

    if(messageType === "sucessMsg"){
        messagePopup.style.backgroundColor = "#42f55a"; //green color
        messagePopup.style.color = "#fff"
        messagePopupSymbol.className = `fa-solid fa-circle-check`;
    }

    messagePopupSpan.innerText = messageSpan;

    await showHtmlElement([messagePopup],"block");

    setTimeout(()=>{
        hideHtmlElement([messagePopup]);
    },5000)

}

function closeMessagePopup(){
    messagePopupSpan.innerText = "";
    messagePopup.style.display = "none";
}

closeMessagePopupBtn.addEventListener("click", ()=>{
    closeMessagePopup();
})

// loading screen

//elements
const loadingOverlay = document.querySelector(".loading-overlay");


// confirmation popup

// elements
const priceListSystemContainer = document.querySelector(".price-list-system-container");
const confirmationOverlay = document.querySelector(".confirmation-overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const wrongPasswordSpan = document.querySelector(".wrong-password-span");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

let functionToBeExecutedGlobal;
let msgPopupContentGlobal;

function showConfirmationPopup(){
    confirmationOverlay.style.display = "flex";
    priceListSystemContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    confirmationOverlay.style.display="none";
    priceListSystemContainer.style.filter = "blur(0)"
}

async function clickHandleListener(){
    if(confirmationPasswordInput.value === confirmationPassword){
        await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

        await backHomeProcess_editPriceListSection();

        await cleanAllInputs();
    }else{
        wrongPasswordSpan.style.display = "block";
        
        setTimeout(()=>{
            wrongPasswordSpan.style.display = "none";
        },10000);

        confirmationPasswordInput.addEventListener("focus",()=>{
            wrongPasswordSpan.style.display = "none";
        })

        return;
    };
}

async function keyPressHandleListener(event){
    if(event.key === "Enter"){
        if(confirmationPasswordInput.value === confirmationPassword){            
            await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

            await backHomeProcess_editPriceListSection();

            await cleanAllInputs();
        }else{
            wrongPasswordSpan.style.display = "block";
            
            setTimeout(()=>{
                wrongPasswordSpan.style.display = "none";
            },10000);

            confirmationPasswordInput.addEventListener("focus",()=>{
                wrongPasswordSpan.style.display = "none";
            })

            return;
        };  
    }
}

async function verifyPasswordProcess(functionToBeExecuted, msgPopupContent){

    functionToBeExecutedGlobal = functionToBeExecuted;
    msgPopupContentGlobal = msgPopupContent;

    showConfirmationPopup();

    confirmationPopupBtn.removeEventListener("click", clickHandleListener);
    confirmationPasswordInput.removeEventListener("keypress",keyPressHandleListener);

    confirmationPopupBtn.addEventListener("click", clickHandleListener);
    confirmationPasswordInput.addEventListener("keypress",keyPressHandleListener);
};

async function callFunction(functionToBeExecuted, msgPopupContent){
    
    closeConfirmationPopup();

    await functionToBeExecuted();

    services_array.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
    });

    if(msgPopupContent !== undefined){
        showMessagePopup("sucessMsg", msgPopupContent);
    }
}

closeConfirmationPopupBtn.addEventListener("click", ()=>{
    closeConfirmationPopup();
})

// main-hub-section

// elements
const mainHubSection = document.querySelector(".main-hub-section");
const consultPriceListLink = document.querySelector("#consult-price-list-btn");
const priceListShowLink = document.querySelector("#price-list-show-btn");
const editPriceListLink = document.querySelector("#edit-price-list-btn");

// consult-price-list section

// elements

const backHomeBtn = document.querySelectorAll(".back-home-btn");

const consultPriceListSection = document.querySelector(".consult-price-list-section");
const searchInputContainer = document.querySelector(".search-input-container");

const serviceTypeInputSearch = document.querySelector("#service-type-input-search");
const serviceTypeOptionsControl = searchInputContainer.querySelector(".service-type-options-control");

const serviceNameInputSearch = document.querySelector("#service-name-input-search");
const serviceNameOptionsControl = document.querySelector(".service-name-options-control");
const serviceNameOption = null;

const consultPriceListBtn = document.querySelector("#consult-price-list_search-btn");
const consultPriceList_resultContainer = document.querySelector(".consult-price-list_result-container");
const consultPriceList_showControl = document.querySelector(".consult-price-list_show-control");

// functions

async function createTypeSuggestions(
    typeInput,
    optionsControl,
    optionsClassName
){
    optionsControl.innerHTML = "";

    let allTypes = [];
    let itensSearched = [];

    services_array.forEach((service)=>{
        allTypes.push(service.type);
    });

    console.log(allTypes);

    allTypes.sort((a,b)=>{
        if(a < b){
            return -1;
        }

        if(a > b){
            return 1; 
        }

        return 0;
    });

    for (let i = 0; i < allTypes.length; i++) {
        allTypes.sort((a, b) => (a < b ? -1 : 1));

        if (allTypes[i] === allTypes[i + 1]) {
            allTypes.splice(i + 1, 1);
            i--; // Voltar um índice para não pular elementos
        }
    }

    console.log(allTypes);

    for(let i = 0 ; i < allTypes.length ; i++){
        if(allTypes[i].includes(typeInput.value)){
            itensSearched.push(allTypes[i]);
        }
    }

    console.log(itensSearched);

    if(itensSearched.length === 0 || typeInput.value === ""){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    };

    itensSearched.forEach((item)=>{
        const serviceTypeOption = document.createElement("div");

        serviceTypeOption.innerHTML = item;
        serviceTypeOption.className = optionsClassName;

        optionsControl.appendChild(serviceTypeOption);
    });

    const allOptions = document.querySelectorAll(`.${optionsClassName}`);

    for(let i = 0; i < allOptions.length; i++){
        allOptions[i].addEventListener("click", async()=>{
            typeInput.value = allOptions[i].innerText;
            
            optionsControl.innerHTML = "";

            await hideHtmlElement([optionsControl]);
        })
    }

    document.addEventListener("click", async()=>{
        optionsControl.innerHTML = "";

        await hideHtmlElement([optionsControl]);
    })

    await showHtmlElement([optionsControl], "block");
}

async function createNameSuggestions(
    typeSelectList,
    searchInput,
    optionsControl,
    optionItem,
    optionItemClassName,
    priceSpan){
    let allServices = [];
    let servicesSearched = [];
    optionsControl.innerHTML = "";

    if(typeSelectList.value !== ""){
        services_array.forEach((element)=>{
            if(typeSelectList.value === element.type){
                allServices.push(element);
            }
        })

        for(let i = 0; i < allServices.length ; i++){
            if(allServices[i].name.includes(searchInput.value)){
                servicesSearched.push(allServices[i]);
            }
        }

    }
    
    if(typeSelectList.value === ""){
        services_array.forEach((element)=>{
            allServices.push(element);
        })

        for(let i = 0; i < allServices.length ; i++){
            if(allServices[i].name.includes(searchInput.value)){
                servicesSearched.push(allServices[i]);
            }
        }
    }

    if(servicesSearched.length === 0){
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl]);
        return;
    }

    if(searchInput.value === ""){
        hideHtmlElement([optionsControl]);
        return;
    }

    servicesSearched.forEach((service)=>{
        let option = document.createElement("div");

        option.className = `${optionItemClassName}`
        option.innerHTML = service.name;

        optionsControl.appendChild(option);
    });

    optionItem = document.querySelectorAll(`.${optionItemClassName}`);

   for(let i = 0 ; i < optionItem.length ; i++){
        optionItem[i].addEventListener("click",()=>{
            searchInput.value = optionItem[i].innerHTML;
            hideHtmlElement([optionsControl]);

            if(priceSpan === "nopricespan"){
                console.log("no price span mentioned");
            }

            if(priceSpan !== undefined){
                let service = null

                for(let j = 0 ; j < services_array.length; j++){
                    if(searchInput.value === services_array[j].name){
                        console.log(searchInput.value);
                        
                        service = services_array[j];
                    } 
                }

                if(service !== null){
                    console.log(service);
                    priceSpan.innerText = service.price;
                }
                
                if(service === null){
                    console.log(service);
                    priceSpan.innerText = "R$ --" 
                }
            }
        })
   }

   showHtmlElement([optionsControl],"block");

   document.addEventListener("click",()=>{
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl]);

        if(priceSpan === "nopricespan"){
            console.log("no price span mentioned");
        }

        if(priceSpan !== undefined){
            let serviceName = searchInput.value.trim();

            for(let i = 0 ; i < services_array.length; i++){
                if(serviceName === services_array[i].name){
                    priceSpan.innerText = services_array[i].price;
                    return;
                }

                if(serviceName !== services_array[i].name){
                    priceSpan.innerText = "R$ --";
                }
            } 
        }
   });
  
}

function logsomething(argument){
    console.log(argument);
}

logsomething();

async function searchItemProcess(){
    if(serviceNameInputSearch.value === ""){
        showMessagePopup("errorMsg", "A descrição do serviço não pode estar vazia !");
        return;
    }

    const consultPriceList_AllItems = document.querySelectorAll(".consult-price-list_show-item");

    if(consultPriceList_AllItems.length > 0 || consultPriceList_AllItems !== undefined){
        consultPriceList_AllItems.forEach((item)=>{
            item.remove();
        })
    }

    if(document.querySelector(".end-of-items") !== null){
        document.querySelector(".end-of-items").remove();
    }

    let servicesSearched = [];

    for(let i = 0 ; i < services_array.length; i++){
        if(serviceTypeInputSearch.value.trim() === ""){
            if(services_array[i].name.includes(serviceNameInputSearch.value)){
                servicesSearched.push(services_array[i]);   
            }
        }
        
        if(serviceTypeInputSearch.value !== ""){
            if(serviceTypeInputSearch.value === services_array[i].type && services_array[i].name.includes(serviceNameInputSearch.value.trim())){
                servicesSearched.push(services_array[i]);
            }
        }
    }

    if(servicesSearched.length > 0){
        servicesSearched.forEach(service => {  
            let item = document.createElement("div");
    
            item.className = "consult-price-list_show-item";
    
            let serviceTypeSpan = document.createElement("span");
            let serviceDescriptionSpan = document.createElement("span");
            let servicePriceSpan = document.createElement("span");
    
            serviceTypeSpan.innerText = service.type;
            serviceTypeSpan.className = "service-type_span";
            item.appendChild(serviceTypeSpan);
    
            serviceDescriptionSpan.innerText = service.name;
            serviceDescriptionSpan.className = "service-description_span";
            item.appendChild(serviceDescriptionSpan);
    
            servicePriceSpan.innerText = service.price;
            servicePriceSpan.className = "service-price_span";
            item.appendChild(servicePriceSpan);

            consultPriceList_showControl.appendChild(item);
        });
    }
    
    if(servicesSearched.length == 0){   
        let item = document.createElement("div");    

        item.className = "consult-price-list_show-item";
    
        let noServiceSpan = document.createElement("span");

        noServiceSpan.innerText = "Não existem serviços correspondentes !"

        item.appendChild(noServiceSpan);

        consultPriceList_showControl.appendChild(item);
    }

    let endOfItems = document.createElement("div");

    endOfItems.className = "end-of-items";

    consultPriceList_showControl.appendChild(endOfItems);

    await showHtmlElement([consultPriceList_resultContainer],"block");
    await showHtmlElement([consultPriceList_showControl],"flex");
}

// event listerners

consultPriceListLink.addEventListener("click", async()=>{
    showHtmlElement([consultPriceListSection], "block");
    hideHtmlElement([mainHubSection,consultPriceList_showControl,consultPriceList_resultContainer]);
})

serviceTypeInputSearch.addEventListener("input", async()=>{
    await createTypeSuggestions(
        serviceTypeInputSearch,
        serviceTypeOptionsControl,
        "service-type-option"
    )
})

serviceNameInputSearch.addEventListener("input",async()=>{

    await createNameSuggestions(
        serviceTypeInputSearch,
        serviceNameInputSearch,
        serviceNameOptionsControl,
        serviceNameOption,
        "service-name-option"
    );
});

consultPriceListBtn.addEventListener("click",async()=>{
    await searchItemProcess();
});

backHomeBtn.forEach(button => {
    button.addEventListener("click", async()=>{
        await backHomeProcess();
    })
});

// price-list-show-section

// elements

const priceListShowSection = document.querySelector(".price-list-show-section")
const priceListShowControl = document.querySelector(".price-list-show-control")
// functions

async function showWholePriceListProcess(){
    if(document.querySelectorAll(".price-list-show-item") !== null){
        let items = document.querySelectorAll(".price-list-show-item");

        for(let i = 0; i < items.length ; i++){
            items[i].remove();
        }
    }

    if(document.querySelector(".end-of-items") !== null){
        document.querySelector(".end-of-items").remove();
    }

    services_array.forEach((service)=>{
        let priceListShowItem = document.createElement("div");

        priceListShowItem.className = "price-list-show-item";

        let priceListItem_serviceType = document.createElement("span");
        let priceListItem_serviceDescription = document.createElement("span");
        let priceListItem_servicePrice = document.createElement("span");

        priceListItem_serviceType.className = "price-list-item_service-type";
        priceListItem_serviceDescription.className = "price-list-item_service-description";
        priceListItem_servicePrice.className = "price-list-item_service-price";

        priceListItem_serviceType.innerText = service.type;
        priceListItem_serviceDescription.innerText = service.name;
        priceListItem_servicePrice.innerText = service.price;

        priceListShowItem.appendChild(priceListItem_serviceType);
        priceListShowItem.appendChild(priceListItem_serviceDescription);
        priceListShowItem.appendChild(priceListItem_servicePrice);

        priceListShowControl.appendChild(priceListShowItem);
    })

    let endOfItems = document.createElement("div");
    endOfItems.className = "end-of-items";
    priceListShowControl.appendChild(endOfItems);
}

// event listeners

priceListShowLink.addEventListener("click", async()=>{
    showWholePriceListProcess();
    showHtmlElement([priceListShowSection], "block");
    hideHtmlElement([mainHubSection]);
})

// edit-price-list-section -> main-hub-container_edit-price-list

// elements

const editPriceListSection = document.querySelector(".edit-price-list-section");
const addItemLink = document.querySelector("#add-item-link-btn");
const deleteItemLink = document.querySelector("#delete-item-link-btn");
const editItemLink = document.querySelector("#edit-item-link-btn");
const sendToServerBtn = document.querySelector("#send-to-server-btn");
const backHome_editPriceListBtn = document.querySelectorAll(".back-home_edit-price-list");
const mainHubContainer_editPriceList  = document.querySelector(".main-hub-container_edit-price-list")

// functions 

async function backHomeProcess_editPriceListSection(){
    let allSections = document.querySelectorAll("section");

    await cleanAllInputs();

    allSections.forEach(async (section) => {
        await hideHtmlElement([
            section,
            addItemContainer_editPriceList,
            deleteItemContainer_editPriceList,
            editItemContainer_editPriceList,
            updateItemInputContainer,
            updateItemBtnContainer,
        ]);
    });

    await showHtmlElement([editPriceListSection],"block");

    await showHtmlElement([mainHubContainer_editPriceList], "flex");
}

async function verifyDataBeforeSend(){
    let servicesArrayFetched = await getServicesData();

    console.log(services_array);
    console.log(servicesArrayFetched);

    if(services_array.length < servicesArrayFetched.length || services_array.length > servicesArrayFetched.length){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }

    let services_arrayJSON = JSON.stringify(services_array);
    let servicesArrayFetchedJSON = JSON.stringify(servicesArrayFetched);

    console.log(services_arrayJSON);
    console.log(servicesArrayFetchedJSON);

    if(services_arrayJSON === servicesArrayFetchedJSON){
        await showServerMessagePopup("errorMsg", "Dados já existentes ! Tente novamente !");
        return;
    }

    if(services_arrayJSON !== servicesArrayFetchedJSON){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }
}

async function sendToServerProcess(){
    await showHtmlElement([overlayForLoading],"flex");

    const response =  await updateServiceData();

    if(!response){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar os dados ! Tente novamente !");
        return;
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg","Dados enviados com sucesso !");

    await showMessagePopup("sucessMsg","Dados atualizados com sucesso !");

    setTimeout(async () => {
        getServicesData();
    },1000);
}

// event listeners

editPriceListLink.addEventListener("click", async()=>{
    await showHtmlElement([editPriceListSection], "block");
    await hideHtmlElement([mainHubSection]);
})    

for(let i = 0 ; i < backHome_editPriceListBtn.length ; i++){
    backHome_editPriceListBtn[i].addEventListener("click", async()=>{
        await backHomeProcess_editPriceListSection();
    })
}

sendToServerBtn.addEventListener("click", async()=>{
    await verifyDataBeforeSend();
})  

// edit-price-list-section -> add-item-container_edit-price-list

// elements

const addItemContainer_editPriceList = document.querySelector(".add-item-container_edit-price-list");
const serviceTypeAddItem_input = document.querySelector("#service-type-add-item_input");
const serviceTypeAddItem_optionsControl = document.querySelector(".service-type-add-item_options-control");
const serviceNameAddItem_input = document.querySelector("#service-name-add-item_input");
const servicePriceAddItem_input = document.querySelector("#service-price-add-item_input");
const serviceAddItem_btn = document.querySelector("#service-add-item_btn");
// functions

async function formatPriceInput(priceInput){
    priceInput.addEventListener("input", async ()=>{
        priceInput.value = await validateOnlyNumbers(priceInput.value);
    });

    priceInput.addEventListener("focusin", async()=>{
        let includesBRL = priceInput.value.includes("R$");

        if(includesBRL){
            priceInput.value = await currencyToFloatNum(priceInput.value);
        }

        priceInput.value = priceInput.value.replace(".", ",");
    });

    priceInput.addEventListener("focusout", async ()=>{
        let price = priceInput.value;

        if(price === ""){
            priceInput.value = "";
            return;
        }

        price = await currencyToFloatNum(price);

        priceInput.value = await formatToBrl(price);   
    })
}

async function addServiceProcess(){
    if(serviceTypeAddItem_input.value === ""){
        showMessagePopup("errorMsg", "Selecione um tipo de serviço !");
        return;
    }

    if(serviceNameAddItem_input.value === ""){
        showMessagePopup("errorMsg", "Digite a descrição do serviço !");
        return;
    }

    if(servicePriceAddItem_input.value === ""){
        showMessagePopup("errorMsg", "Digite o preço base do serviço !")
        return;
    }

    let findInArray = services_array.find((item)=>{
        if(item.name === serviceNameAddItem_input.value.trim()){
            return true;
        }
    })

    console.log(findInArray);

    if(findInArray === undefined){
        await addServiceLogic();
        await showMessagePopup("sucessMsg", "Serviço adicionado com sucesso !");
        return;
    }else{
        await showMessagePopup("errorMsg", "O serviço já existe ! Tente novamente !");
        return;
    }
}

async function addServiceLogic(){
    let serviceName = serviceNameAddItem_input.value.trim();

    let servicePrice = servicePriceAddItem_input.value;

    let includesBRL = servicePrice.includes("R$");

    if(!includesBRL){
        formatToBrl(servicePrice);
    }

    let serviceType = serviceTypeAddItem_input.value;

    let newService = {
        name : serviceName,
        type : serviceType,
        price : servicePrice,
    }

    services_array.push(newService);

    services_array.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
    });

    console.log(services_array);
}

// event listerners

addItemLink.addEventListener("click", async()=>{
    await cleanAllInputs();
    await hideHtmlElement([mainHubContainer_editPriceList]);
    await showHtmlElement([addItemContainer_editPriceList], "block");
});

serviceTypeAddItem_input.addEventListener("input", async()=>{
    await createTypeSuggestions(
        serviceTypeAddItem_input,
        serviceTypeAddItem_optionsControl,
        "service-type-add-item_option"
    );
})

serviceAddItem_btn.addEventListener("click", async()=>{
    await addServiceProcess();
});

formatPriceInput(servicePriceAddItem_input);

// edit-price-list-section -> delete-item-container_edit-price-list

// elements

const deleteItemContainer_editPriceList = document.querySelector(".delete-item-container_edit-price-list");

const serviceTypeDeleteItem_input = document.querySelector("#service-type-delete-item_input");
const serviceTypeDeleteItem_optionsControl = document.querySelector(".service-type-delete-item_options-control");

const serviceNameDeleteItem_input = document.querySelector("#service-name-delete-item_input");
const serviceNameDeleteItem_optionsControl = document.querySelector(".service-name-delete-item_options-control");
const serviceNameDeleteItem_option = null;
const servicePriceDeleteItem_span = document.querySelector("#service-price-delete-item_span");
const serviceDeleteItemBtn = document.querySelector("#service-delete-item-btn")

// functions

async function allowServiceInput(typeInput,serviceInput,priceSpan){
    typeInput.addEventListener("focusout", async ()=>{
        if(typeInput.value === ""){
            serviceInput.setAttribute("disabled", "true");
            serviceInput.style.cursor = "not-allowed";

            serviceInput.value = "";

            priceSpan.innerText = "R$ --";
            return;
        }

        if(typeInput.value !== ""){
            serviceInput.removeAttribute("disabled");
            serviceInput.style.cursor = "auto";
        }
    })
}

async function deleteItemProcess(){
    if(serviceTypeDeleteItem_input.value === ""){
        showMessagePopup("erroMsg","Selecione um tipo de serviço para prosseguir ! Tente novamente !");
        return;
    }

    if(serviceNameDeleteItem_input.value === ""){
        showMessagePopup("errorMsg", "A descrição do serviço não pode estar vazia ! Tente novamente !");
        return;
    }

    let findInArray = services_array.find((item)=>{
        if(item.name === serviceNameDeleteItem_input.value.trim()){
            return true;
        }
    })

    if(findInArray === undefined){
        await showMessagePopup("errorMsg", "Serviço não existe ! Tente novamente !");
        return;
    }

    for(let i = 0; i < services_array.length; i++){
        if(serviceNameDeleteItem_input.value === services_array[i].name){
            await verifyPasswordProcess(deleteItemLogic, "Serviço excluído com sucesso !");
        } 
    }
}

async function deleteItemLogic(){

    for(let i = 0; i < services_array.length; i++){
        if(serviceNameDeleteItem_input.value.trim() === services_array[i].name){
            services_array.splice(i,1);
        }
    }

    services_array.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
    });

    console.log(services_array);
}

// event listeners

deleteItemLink.addEventListener("click", async ()=>{
    await cleanAllInputs();
    await hideHtmlElement([mainHubContainer_editPriceList]);
    await showHtmlElement([deleteItemContainer_editPriceList],"block");
});

serviceTypeDeleteItem_input.addEventListener("input", async()=>{
    await createTypeSuggestions(
        serviceTypeDeleteItem_input,
        serviceTypeDeleteItem_optionsControl,
        "service-type-delete-item_option"
    )
})

allowServiceInput(serviceTypeDeleteItem_input,serviceNameDeleteItem_input,servicePriceDeleteItem_span);

serviceNameDeleteItem_input.addEventListener("input",async()=>{  

    await createNameSuggestions(
        serviceTypeDeleteItem_input,
        serviceNameDeleteItem_input,
        serviceNameDeleteItem_optionsControl,
        serviceNameDeleteItem_option,
        "service-name-delete-item_option",
        servicePriceDeleteItem_span
    )
});

serviceDeleteItemBtn.addEventListener("click", async ()=>{
    await deleteItemProcess();
})    

// edit-price-list-section -> edit-item-container_edit-price-list

// elements

const editItemContainer_editPriceList = document.querySelector(".edit-item-container_edit-price-list");

const serviceTypeInput_editItem = document.querySelector("#service-type-input_edit-item");
const serviceTypeOptionsControl_editItem = document.querySelector(".service-type-options-control_edit-item");

const serviceNameInput_editItem = document.querySelector("#service-name-input_edit-item");
const serviceNameEditItem_optionsControl = document.querySelector(".service-name-edit-item_options-control");
const serviceNameEditItem_option = null;

const servicePriceSpan_editItem = document.querySelector("#service-price-span_edit-item");
const nextStepEditItemBtn = document.querySelector("#next-step-edit-item-btn");

const updateItemInputContainer = document.querySelector("#update-item-input-container");
const updateItemBtnContainer = document.querySelector("#update-item-btn-container");

const serviceTypeInput_updateItem = document.querySelector("#service-type-input_update-item");
const serviceTypeOptionsControl_updateItem = document.querySelector(".service-type-options-control_update-item");

const serviceNameInput_updateItem = document.querySelector("#service-name-input_update-item");
const serviceNameInputOptionsControl_updateItem = document.querySelector(".service-name-input-options-control_update-item");
const serviceNameOption_updateItem = null;

const servicePriceInput_updateItem = document.querySelector("#service-price-input_update-item")
const editItemBtn = document.querySelector("#edit-item-btn");

// functions

async function verifyEditItem_forNextStep(){
    if(serviceTypeInput_editItem.value === ""){
        await showMessagePopup("errorMsg", "Selecione um tipo de serviço para prosseguir !");
        return;
    }

    if(serviceNameInput_editItem.value === ""){
        await showMessagePopup("errorMsg", "Digite e selecione o serviço para edição !")
        return;
    }

    let findInArray = services_array.find((item) => {
        if(item.name === serviceNameInput_editItem.value.trim()){
            return true;
        }
    });

    if(findInArray === undefined){
        await showMessagePopup("errorMsg", "O serviço não existe ! Tente novamente !");
        return;
    }

    serviceTypeInput_updateItem.value = serviceTypeInput_editItem.value;
    serviceNameInput_updateItem.value = serviceNameInput_editItem.value;
    servicePriceInput_updateItem.value = servicePriceSpan_editItem.innerText;

    await formatPriceInput(servicePriceInput_updateItem);
    
    await showHtmlElement([updateItemInputContainer,updateItemBtnContainer],"flex");
}

async function editItemProcess(){
    if(serviceTypeInput_updateItem.value === ""){
        await showMessagePopup("errorMsg", "Selecione um tipo de serviço para prosseguir !");
        return;
    }

    if(serviceNameInput_updateItem.value === ""){
        await showMessagePopup("errorMsg", "Digite o serviço para edição !");
        return;
    }

    if(servicePriceInput_updateItem.value === ""){
        await showMessagePopup("errorMsg", "Digite o preço do serviço para edição !");
        return;
    }

    let serviceName = serviceNameInput_updateItem.value;
    serviceName = serviceName.trim();

    let findInArray = services_array.find((item)=>{
        if(item.name === serviceName){
            return true;
        }
    });

    if(findInArray !== undefined){
        await showMessagePopup("errorMsg", "O serviço digitado já existe ! Tente novamente !");
        return;
    }

    await verifyPasswordProcess(editItemLogic, "Serviço editado com sucesso !");
}

async function editItemLogic(){
    let existentItem_name = null;

    let servicePrice = servicePriceInput_updateItem.value;

    let includesBRL = servicePrice.includes("R$");

    if(!includesBRL){
        formatToBrl(servicePrice);
    }

    let newItem = {
        name : serviceNameInput_updateItem.value.trim(),
        price : servicePrice,
        type : serviceTypeInput_updateItem.value
    }

    for(let i = 0 ; i < services_array.length; i++){
        if(serviceNameInput_editItem.value === services_array[i].name){
            existentItem_name = services_array[i].name;
        }
    }

    for(let i = 0 ; i < services_array.length; i++){
        if(existentItem_name === services_array[i].name){
            services_array[i].name = newItem.name;
            services_array[i].price = newItem.price;
            services_array[i].type = newItem.type;
        }
    }

    services_array.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type.localeCompare(b.type);
    });

    console.log(services_array);

}

// event listerners

editItemLink.addEventListener("click", async()=>{
    await cleanAllInputs();
    await hideHtmlElement([mainHubContainer_editPriceList]);
    await showHtmlElement([editItemContainer_editPriceList], "block");
});

serviceTypeInput_editItem.addEventListener("input", async()=>{
    await createTypeSuggestions(
        serviceTypeInput_editItem,
        serviceTypeOptionsControl_editItem,
        "service-type-option_edit-item"
    )
})

allowServiceInput(serviceTypeInput_editItem,serviceNameInput_editItem,servicePriceSpan_editItem);

serviceNameInput_editItem.addEventListener("input", async()=>{

    await createNameSuggestions(
        serviceTypeInput_editItem,
        serviceNameInput_editItem,
        serviceNameEditItem_optionsControl,
        serviceNameEditItem_option,
        "service-name-edit-item_option",
        servicePriceSpan_editItem
    )
});   

nextStepEditItemBtn.addEventListener("click", async()=>{
    await verifyEditItem_forNextStep();
});

serviceTypeInput_updateItem.addEventListener("input", async()=>{
    await createTypeSuggestions(
        serviceTypeInput_updateItem,
        serviceTypeOptionsControl_updateItem,
        "service-type-option_update-item"
    )
});

serviceNameInput_updateItem.addEventListener("input",async ()=>{
    await createNameSuggestions(
        serviceTypeInput_updateItem,
        serviceNameInput_updateItem,
        serviceNameInputOptionsControl_updateItem,
        serviceNameOption_updateItem,
        "service-name-option_update-item",
        'nopricespan'
    )
})

editItemBtn.addEventListener("click", async()=>{
    await editItemProcess();
})

