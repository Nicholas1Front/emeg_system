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
    let allServices = [];
    let servicesSearched = [];
    serviceNameOptionsControl.innerHTML = "";

    if(serviceType_selectSearch.value !== ""){
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

        console.log(servicesSearched);

    }else{
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

    if(servicesSearched.length === 0){
        serviceNameOptionsControl.innerHTML = "";
        hideHtmlElement([serviceNameOptionsControl]);
        return;
    }

    servicesSearched.forEach((service)=>{
        let serviceNameOption = document.createElement("div");

        serviceNameOption.className = "service-name-option";
        serviceNameOption.innerHTML = service;

        serviceNameOptionsControl.appendChild(serviceNameOption);
    });

    let serviceNameOption = document.querySelectorAll(".service-name-option");

   for(let i = 0 ; i < serviceNameOption.length ; i++){
        serviceNameOption[i].addEventListener("click",()=>{
            serviceNameInputSearch.value = serviceNameOption[i].innerHTML;
            hideHtmlElement([serviceNameOption]);
        })
   }

   showHtmlElement([serviceNameOptionsControl],"block");

   document.addEventListener("click",()=>{
        serviceNameOptionsControl.innerHTML = "";
        hideHtmlElement([serviceNameOptionsControl]);
   })
  
}

// event listerners

serviceNameInputSearch.addEventListener("input",async()=>{
    serviceNameInputSearch.value = serviceNameInputSearch.value.toUpperCase();

    await createInputSuggestions();
})
