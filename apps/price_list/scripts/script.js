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

//message popup

//elements
const messagePopup = document.querySelector(".message-popup");
const closeMessagePopupBtn= document.querySelector(".close-message-popup-btn");
const messagePopupSymbol = document.querySelector(".message-popup-control i");
const messagePopupSpan = document.querySelector(".message-popup-span");

//functions

async function showMessagePopup(messageType, messageSpan){
    messagePopupSymbol.className = "";

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

// consult-price-list section

// elements
const consultPriceListSection = document.querySelector(".consult-price-list-section");
let serviceType_selectSearch = document.querySelector("#service-type_select-search");
let serviceNameInputSearch = document.querySelector("#service-name-input-search");
let serviceNameOptionsControl = document.querySelector(".service-name-options-control");
let serviceNameOption = null;

const consultPriceListBtn = document.querySelector("#consult-price-list_search-btn");
const consultPriceList_resultContainer = document.querySelector(".consult-price-list_result-container");
const consultPriceList_showControl = document.querySelector(".consult-price-list_show-control")
// functions

async function createInputSuggestions(typeSelectList,searchInput,optionsControl,optionItem,optionItemClassName){
    let allServices = [];
    let servicesSearched = [];
    optionsControl.innerHTML = "";

    if(typeSelectList.value !== ""){
        services_array.forEach((element)=>{
            if(serviceType_selectSearch.value === element.type){
                allServices.push(element.name);
            }
        })

        for(let i = 0; i < allServices.length ; i++){
            if(allServices[i].includes(serviceNameInputSearch.value)){
                servicesSearched.push(allServices[i]);
            }
        }

    }
    
    if(typeSelectList.value === ""){
        services_array.forEach((element)=>{
            allServices.push(element.name);
        })

        for(let i = 0; i < allServices.length ; i++){
            if(allServices[i].includes(serviceNameInputSearch.value)){
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
        option.innerHTML = service;

        optionsControl.appendChild(option);
    });

    optionItem = document.querySelectorAll(`.${optionItemClassName}`);

    console.log(optionItem);

   for(let i = 0 ; i < optionItem.length ; i++){
        optionItem[i].addEventListener("click",()=>{
            searchInput.value = optionItem[i].innerHTML;
            hideHtmlElement([optionsControl]);
        })
   }

   showHtmlElement([optionsControl],"block");

   document.addEventListener("click",()=>{
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl]);
   })
  
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
    }else if (servicesSearched.length < 0){ 
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
})   
