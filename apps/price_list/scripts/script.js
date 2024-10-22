//get services from services.json
let services_array = [];

async function getServicesData(){
    try{
        const response = await fetch("../backend/data/services.json");

        const resultArray = await response.json();

        resultArray.sort((a,b)=>{
            if(a.name < b.name){
                return -1;
            }
    
            if(a.name > b.name){
                return 1; 
            }
    
            return 0;
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

// values

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

        await clearAllInputs();
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

            await clearAllInputs();
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

    services_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }
    
        if(a.name > b.name){
            return 1; 
        }
    
        return 0;
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

    // console.log(optionItem);

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
        if(serviceType_selectSearch.value === ""){
            if(services_array[i].name.includes(serviceNameInputSearch.value)){
                servicesSearched.push(services_array[i]);   
            }
        }
        
        if(serviceType_selectSearch.value !== ""){
            if(serviceType_selectSearch.value === services_array[i].type && services_array[i].name.includes(serviceNameInputSearch.value)){
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

    showHtmlElement([consultPriceList_resultContainer],"block");
}

// event listerners

consultPriceListLink.addEventListener("click", async()=>{
    showHtmlElement([consultPriceListSection], "block");
    hideHtmlElement([mainHubSection]);
})

serviceType_selectSearch.addEventListener("change", ()=>{
    serviceNameInputSearch.value = "";
})

serviceNameInputSearch.addEventListener("input",async()=>{
    serviceNameInputSearch.value = serviceNameInputSearch.value.toUpperCase();

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

    allSections.forEach(async (section) => {
        await hideHtmlElement([
            section,
            addItemContainer_editPriceList,
            deleteItemContainer_editPriceList
        ]);
    });

    await showHtmlElement([editPriceListSection],"block");

    await showHtmlElement([mainHubContainer_editPriceList], "flex");
}

// event listeners

editPriceListLink.addEventListener("click", async()=>{
    showHtmlElement([editPriceListSection], "block");
    hideHtmlElement([mainHubSection]);
})    

for(let i = 0 ; i < backHome_editPriceListBtn.length ; i++){
    backHome_editPriceListBtn[i].addEventListener("click", async()=>{
        await backHomeProcess_editPriceListSection();
    })
}

// edit-price-list-section -> add-item-container_edit-price-list

// elements

const addItemContainer_editPriceList = document.querySelector(".add-item-container_edit-price-list");
const serviceTypeAddItem_select = document.querySelector("#service-type-add-item_select")
const serviceNameAddItem_input = document.querySelector("#service-name-add-item_input");
const servicePriceAddItem_input = document.querySelector("#service-price-add-item_input");
const serviceAddItem_btn = document.querySelector("#service-add-item_btn");
// functions

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

    let allServicesNames = []

    services_array.forEach(async (service) => {
        allServicesNames.push(service.name);
    })

    let includesInArray = allServicesNames.includes(serviceNameAddItem_input.value);
    
    if(includesInArray){
        showMessagePopup("errorMsg", "O serviço já existe, verifique as informações e tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addServiceLogic, "Serviço adicionado com sucesso !");
    };
}

async function addServiceLogic(){
    console.log(services_array)
    let serviceName = serviceNameAddItem_input.value;

    let servicePrice = servicePriceAddItem_input.value;

    let serviceType = serviceTypeAddItem_select.value;

    let newService = {
        name : serviceName,
        type : serviceType,
        price : servicePrice,
    }

    console.log(newService);

    services_array.push(newService);

    services_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }
    
        if(a.name > b.name){
            return 1; 
        }
    
        return 0;
    });

    console.log(services_array);

}

// event listerners

addItemLink.addEventListener("click", async()=>{
    showHtmlElement([addItemContainer_editPriceList], "block");
});

serviceAddItem_btn.addEventListener("click", async()=>{
    await addServiceProcess();
});

servicePriceAddItem_input.addEventListener("input", async()=>{
    servicePriceAddItem_input.value = await validateOnlyNumbers(servicePriceAddItem_input.value);
})

servicePriceAddItem_input.addEventListener("focusin", async()=>{
    let includesBRL = servicePriceAddItem_input.value.includes("R$");

    if(includesBRL){
        servicePriceAddItem_input.value = await currencyToFloatNum(servicePriceAddItem_input.value);    
    }
})

servicePriceAddItem_input.addEventListener("focusout", async ()=>{
    let price = servicePriceAddItem_input.value;

    if(price === ""){
        servicePriceAddItem_input.value = ""
        return;
    }
    price = await currencyToFloatNum(price);

    servicePriceAddItem_input.value = await formatToBrl(price);
})

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

async function deleteItemProcess(){
    if(serviceTypeDeleteItem_select.value === ""){
        showMessagePopup("erroMsg","Selecione um tipo de serviço para prosseguir ! Tente novamente !");
        return;
    }

    if(serviceNameDeleteItem_input.value === ""){
        showMessagePopup("errorMsg", "A descrição do serviço não pode estar vazia ! Tente novamente !");
        return;
    }

    for(let i = 0; i < services_array.length; i++){
        if(serviceNameDeleteItem_input.value === services_array[i].name){
            await verifyPasswordProcess(deleteItemLogic, "Serviço excluído com sucesso !");
        } 
    }
}

async function deleteItemLogic(){
    console.log(services_array);

    for(let i = 0; i < services_array.length; i++){
        if(serviceNameDeleteItem_input.value === services_array[i].name){
            services_array[i].splice(i,1);
        }
    }

    services_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }
    
        if(a.name > b.name){
            return 1; 
        }
    
        return 0;
    });

    console.log(services_array);
}

// event listeners

deleteItemLink.addEventListener("click", async ()=>{
    showHtmlElement([deleteItemContainer_editPriceList],"block");
})

serviceTypeDeleteItem_select.addEventListener("change",async()=>{
    if(serviceTypeDeleteItem_select.value === ""){
        serviceNameDeleteItem_input.setAttribute("disabled", "true");
        serviceNameDeleteItem_input.style.cursor = "not-allowed";
        return;
    }

    if(serviceTypeDeleteItem_select.value !== ""){
        serviceNameDeleteItem_input.removeAttribute("disabled");
        serviceNameDeleteItem_input.style.cursor = "auto";
    }
})


serviceNameDeleteItem_input.addEventListener("input",async()=>{  

    serviceNameDeleteItem_input.value = serviceNameDeleteItem_input.value.toUpperCase();

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

