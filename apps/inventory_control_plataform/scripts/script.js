// get inventory data from inventory.json

let itens_array = null;

async function getInventoryItens(){
    try{
        const response = await fetch(`../backend/data/inventory.json`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        const itens = await response.json();

        return itens;
    }

    catch(error){
        console.log(`Failed to load json : ${error}`);
    }
}

// booting

async function initialize_itens_array(){
    itens_array = await getInventoryItens();
}

initialize_itens_array();

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

// main-hub-section

// elements

const consultInventoryBtn = document.querySelector("#consult-inventory-btn");
const inventoryShowBtn = document.querySelector("#inventory-show-btn");
const editInventoryShowBtn = document.querySelector("#edit-inventory-show-btn");

// consult-inventory-section

// elements
const consultInventorySection = document.querySelector(".consult-inventory-section");
const itemType_selectSearch = document.querySelector("#item-type_select-search");
const itemNameInputSearch = document.querySelector("#item-name-input-search");
const itemNameOptionsControl = document.querySelector(".item-name-options-control");
const itemNameOption = null;
const consultInventory_searchBtn = document.querySelector("#consult-inventory_search-btn");

// functions 

async function createSelectOptions(select){
    console.log(itens_array);
    select.innerHTML = "";
    const allTypes = [];

    itens_array.forEach((item)=>{
        allTypes.push(item.type);
    })

    allTypes.sort((a,b)=>{
        if(a < b){
            return -1;
        }

        if(a > b){
            return 1; 
        }

        return 0;
    })

    console.log(allTypes);

    for(let i = 0;i < allTypes.length; i++){
        if(allTypes[i] === allTypes[i-1]){
            allTypes.splice(i,1);
        }

        if(allTypes[i] === allTypes[i+1]){
            allTypes.splice(i,1);
        }
    }

    console.log(allTypes);

    allTypes.forEach((type)=>{
        let option = document.createElement("option");

        option.value = type;
        option.innerText = type;

        select.appendChild(option);
    })
}

async function createInputSuggestions(
    //
){

}