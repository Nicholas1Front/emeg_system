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

// back home process and clear inputs

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

// main-hub-section

// elements

const mainHubSection = document.querySelector(".main-hub-section");
const consultInventoryLink = document.querySelector("#consult-inventory-btn");
const inventoryShowLink = document.querySelector("#inventory-show-btn");
const editInventoryShowLink = document.querySelector("#edit-inventory-show-btn");

// consult-inventory-section

// elements
const backHomeBtn = document.querySelectorAll(".back-home-btn");

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
    const allTypes = ["",];

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
    typeSelectList,
    searchInput,
    optionsControl,
    optionItem,
    optionItemClassName
){

    let allItens = [];
    let itensSearched = [];

    optionsControl.innerHTML = "";

    if(typeSelectList.value !== ""){
        itens_array.forEach((item)=>{
            if(item.type === typeSelectList.value){
                allItens.push(item);
            }
        });

        for(let i = 0; i < allItens.length; i++){
            if(allItens[i].name.includes(searchInput.value)){
                itensSearched.push(allItens[i]);
            }
        }
    }

    if(typeSelectList.value === ""){
        itens_array.forEach((item)=>{
            allItens.push(item);
        }) 

        for(let i = 0; i < allItens.length ; i++){
            if(allItens[i].name.includes(searchInput.value)){
                itensSearched.push(allItens[i]);
            }
        }
    };

    if(itensSearched.length <= 0){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    };

    if(searchInput.value === ""){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    };

    itensSearched.forEach((item)=>{
        let option = document.createElement("div");

        option.innerText = item.name;
        option.className = `${optionItemClassName}`;
        
        optionsControl.appendChild(option);
    });

    optionItem = document.querySelectorAll(`.${optionItemClassName}`);

    for(let i = 0; i < optionItem.length; i++){
        optionItem[i].addEventListener("click", ()=>{
            searchInput.value = optionItem[i].innerText;
            
            optionsControl.innerHTML = "";
            hideHtmlElement([optionsControl]);
        }) 
    }

    showHtmlElement([optionsControl], "block");
    
    document.addEventListener("click", ()=>{
        optionsControl.innerHTML="";
        hideHtmlElement([optionsControl]);
    })

}

// event listerners

backHomeBtn.forEach((button)=>{
    button.addEventListener("click", async ()=>{
        await backHomeProcess()
    })
})

consultInventoryLink.addEventListener("click", async ()=>{
    await hideHtmlElement([mainHubSection]);
    await createSelectOptions(itemType_selectSearch);
    await showHtmlElement([consultInventorySection], "block")
})

itemNameInputSearch.addEventListener("input", async ()=>{
    itemNameInputSearch.value = itemNameInputSearch.value.toUpperCase();

    await createInputSuggestions(
        itemType_selectSearch,
        itemNameInputSearch,
        itemNameOptionsControl,
        itemNameOption,
        "item-name-option"
    ); 
}) 