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

// consult-price-list section

// elements
const consultPriceListSection = document.querySelector(".consult-price-list-section");
let serviceType_selectSearch = document.querySelector("#service-type_select-search");
let serviceNameInputSearch = document.querySelector("#service-name-input-search");
let serviceNameOptionsControl = document.querySelector(".service-name-options-control");
const consultPriceListBtn = document.querySelector("#consult-price-list_search-btn")

// functions

async function createInputSuggestions(){
    let servicesSearched = [];
    serviceNameOptionsControl.innerHTML = "";

    if(serviceType_selectSearch.value === ""){
        services_array.forEach((element)=>{
            servicesSearched.push(element.name);
        })
        
        servicesSearched.forEach((service)=>{
            let serviceNameOption = document.createElement("div");

            serviceNameOption.className = "service-name-option";
            serviceNameOption.innerHTML = service;

            serviceNameOptionsControl.appendChild(serviceNameOption);
        })
    }
}

setTimeout(()=>{
    createInputSuggestions();
},1000)
