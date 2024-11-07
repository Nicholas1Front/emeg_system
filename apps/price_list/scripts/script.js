//get services from services.json
let services_array = [];

async function getServicesData(){
    try{
        const response = await fetch(`https://nicholas1front.github.io/emeg_system/apps/backend/data/services.json?timestamp=${new Date().getTime()}`);

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

async function initialize_services_array(){
    services_array = await getServicesData();

    return services_array;
}

initialize_services_array();

// update services data

async function updateServiceData(){
    try {
        const response = await fetch('https://emeg-orc.onrender.com/update-services', { 
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
async function upperCaseInputs([...inputs]){
    inputs.forEach((input)=>{
        input.addEventListener("input", ()=>{
            input.value = input.value.toUpperCase();
        })
    })
}

// event listerners

for(let i = 0 ; i < allInputs.length ; i++){
    upperCaseInputs([allInputs[i]]);
}

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

// confirmation popup

// elements
const priceListSystemContainer = document.querySelector(".price-list-system-container");
const overlay = document.querySelector(".overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const wrongPasswordSpan = document.querySelector(".wrong-password-span");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

let functionToBeExecutedGlobal;
let msgPopupContentGlobal;

function showConfirmationPopup(){
    overlay.style.display = "flex";
    priceListSystemContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
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
let serviceType_selectSearch = document.querySelector("#service-type_select-search");
let serviceNameInputSearch = document.querySelector("#service-name-input-search");
let serviceNameOptionsControl = document.querySelector(".service-name-options-control");
let serviceNameOption = null;

const consultPriceListBtn = document.querySelector("#consult-price-list_search-btn");
const consultPriceList_resultContainer = document.querySelector(".consult-price-list_result-container");
const consultPriceList_showControl = document.querySelector(".consult-price-list_show-control");

// functions

async function createInputSuggestions(
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
        if(serviceType_selectSearch.value.trim() === ""){
            if(services_array[i].name.includes(serviceNameInputSearch.value)){
                servicesSearched.push(services_array[i]);   
            }
        }
        
        if(serviceType_selectSearch.value !== ""){
            if(serviceType_selectSearch.value === services_array[i].type && services_array[i].name.includes(serviceNameInputSearch.value.trim())){
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

serviceType_selectSearch.addEventListener("change", ()=>{
    serviceNameInputSearch.value = "";
})

serviceNameInputSearch.addEventListener("input",async()=>{

    await createInputSuggestions(
        serviceType_selectSearch,
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

    let serviceAlreadyExist = null;

    services_array.forEach((service)=>{
        let servicesArrayFetched_name = [];

        servicesArrayFetched.forEach((service)=>{
            servicesArrayFetched_name.push(service.name);
        })

        let includesInArray = servicesArrayFetched_name.includes(service.name);

        if(!includesInArray){
            serviceAlreadyExist += 1;
        }
        
    });

    if(serviceAlreadyExist !== null || serviceAlreadyExist > 0){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }

    serviceAlreadyExist = null;

    for(let i = 0 ; i < services_array.length ; i++){
        if(services_array[i].name === servicesArrayFetched[i].name){
            if(services_array[i].price !== servicesArrayFetched[i].price){
                serviceAlreadyExist += 1;
            }
        }
    }

    if(serviceAlreadyExist !== null || serviceAlreadyExist > 0){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }
    
    serviceAlreadyExist = null;

    for(let i = 0 ; i < services_array.length ; i++){
        if(services_array[i].name === servicesArrayFetched[i].name){
            if(services_array[i].type !== servicesArrayFetched[i].type){
                serviceAlreadyExist += 1;
            }
        }
    }

    if(serviceAlreadyExist !== null || serviceAlreadyExist > 0){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }

    await showServerMessagePopup("errorMsg" , "Dados já existentes ! Tente novamente !");

    services_array = await getServicesData();
}

async function sendToServerProcess(){
    await showHtmlElement([overlayForLoading],"flex");

    const response =  await updateServiceData();

    if(!response){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar os dados ! Tente novamente !");
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg","Dados enviados com sucesso !");

    await showMessagePopup("sucessMsg","Dados atualizados com sucesso !");

    setTimeout(async () => {
        getClientsData();
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
const serviceTypeAddItem_select = document.querySelector("#service-type-add-item_select")
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
    if(serviceTypeAddItem_select.value === ""){
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
        /* in a near future the confirmation process in this function will be implemented */
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

    let serviceType = serviceTypeAddItem_select.value;

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

serviceAddItem_btn.addEventListener("click", async()=>{
    await addServiceProcess();
});

formatPriceInput(servicePriceAddItem_input);

// edit-price-list-section -> delete-item-container_edit-price-list

// elements

const deleteItemContainer_editPriceList = document.querySelector(".delete-item-container_edit-price-list");
const serviceTypeDeleteItem_select = document.querySelector("#service-type-delete-item_select");
const serviceNameDeleteItem_input = document.querySelector("#service-name-delete-item_input");
const serviceNameDeleteItem_optionsControl = document.querySelector(".service-name-delete-item_options-control");
const serviceNameDeleteItem_option = null;
const servicePriceDeleteItem_span = document.querySelector("#service-price-delete-item_span");
const serviceDeleteItemBtn = document.querySelector("#service-delete-item-btn")

// functions

async function allowServiceInput(typeSelect,serviceInput,priceSpan){
    typeSelect.addEventListener("change", async ()=>{
        if(typeSelect.value === ""){
            serviceInput.setAttribute("disabled", "true");
            serviceInput.style.cursor = "not-allowed";

            serviceInput.value = "";

            priceSpan.innerText = "R$ --";
            return;
        }

        if(typeSelect.value !== ""){
            serviceInput.removeAttribute("disabled");
            serviceInput.style.cursor = "auto";
        }
    })
}

async function deleteItemProcess(){
    if(serviceTypeDeleteItem_select.value === ""){
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
})

allowServiceInput(serviceTypeDeleteItem_select,serviceNameDeleteItem_input,servicePriceDeleteItem_span);

serviceNameDeleteItem_input.addEventListener("input",async()=>{  

    await createInputSuggestions(
        serviceTypeDeleteItem_select,
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
const serviceTypeSelect_editItem = document.querySelector("#service-type-select_edit-item");
const serviceNameInput_editItem = document.querySelector("#service-name-input_edit-item");
const serviceNameEditItem_optionsControl = document.querySelector(".service-name-edit-item_options-control");
const serviceNameEditItem_option = null;
const servicePriceSpan_editItem = document.querySelector("#service-price-span_edit-item");
const nextStepEditItemBtn = document.querySelector("#next-step-edit-item-btn");

const updateItemInputContainer = document.querySelector("#update-item-input-container");
const updateItemBtnContainer = document.querySelector("#update-item-btn-container");
const serviceTypeSelect_updateItem = document.querySelector("#service-type-select_update-item");
const serviceNameInput_updateItem = document.querySelector("#service-name-input_update-item");
const servicePriceInput_updateItem = document.querySelector("#service-price-input_update-item")
const editItemBtn = document.querySelector("#edit-item-btn");

// functions

async function verifyEditItem_forNextStep(){
    if(serviceTypeSelect_editItem.value === ""){
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

    serviceTypeSelect_updateItem.value = serviceTypeSelect_editItem.value;
    serviceNameInput_updateItem.value = serviceNameInput_editItem.value;
    servicePriceInput_updateItem.value = servicePriceSpan_editItem.innerText;

    await formatPriceInput(servicePriceInput_updateItem);
    
    await showHtmlElement([updateItemInputContainer,updateItemBtnContainer],"flex");
}

async function editItemProcess(){
    if(serviceTypeSelect_updateItem.value === ""){
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
        type : serviceTypeSelect_updateItem.value
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
})

allowServiceInput(serviceTypeSelect_editItem,serviceNameInput_editItem,servicePriceSpan_editItem);

serviceNameInput_editItem.addEventListener("input", async()=>{

    await createInputSuggestions(
        serviceTypeSelect_editItem,
        serviceNameInput_editItem,
        serviceNameEditItem_optionsControl,
        serviceNameEditItem_option,
        "service-name-edit-item_option",
        servicePriceSpan_editItem
    )
});   

nextStepEditItemBtn.addEventListener("click", async()=>{
    await verifyEditItem_forNextStep();
})

editItemBtn.addEventListener("click", async()=>{
    await editItemProcess();
})

