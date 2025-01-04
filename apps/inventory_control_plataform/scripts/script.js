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

const inventoryControlSystemContainer = document.querySelector(".inventory-control-system-container");
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
    inventoryControlSystemContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    inventoryControlSystemContainer.style.filter = "blur(0)"
}

async function clickHandleListener(){
    if(confirmationPasswordInput.value === confirmationPassword){
        await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

        await backHomeProcess_editInventory();

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

            await backHomeProcess_editInventory();

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

    itens_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }

        if(a.name > b.name){
            return 1; 
        }

        return 0;
    })

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

const consultInventory_resultContainer = document.querySelector(".consult-inventory_result-container");
const consultInventory_showControl = document.querySelector(".consult-inventory_show-control");

// functions 

async function createSelectOptions(select){
    console.log(itens_array);
    select.innerHTML = "";
    let allTypes = [];

    let blankOption = document.createElement("option");

    blankOption.value = "";
    blankOption.innerHTML = "";

    select.appendChild(blankOption);

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
        for(let j = 1; j < allTypes.length; j++){
            if(allTypes[i] === allTypes[j]){
                allTypes.splice(j,1);
            }
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

async function searchProcess_consultInventory(){
    let allItens = [];
    let itensSearched = [];

    let noItemInventory = document.querySelector(".no-item-inventory");
    hideHtmlElement([noItemInventory]);

    if(document.querySelector(".end-of-items") !== null){
        document.querySelector(".end-of-items").remove();
    }

    if(document.querySelectorAll(".consult-inventory_show-item").length > 0 || document.querySelectorAll(".consult-inventory_show-item") !== undefined){
        let itensInHtml = document.querySelectorAll(".consult-inventory_show-item")
        for(let i = 0;i < itensInHtml.length ; i++){
            itensInHtml[i].remove();
        }
    }

    if(itemType_selectSearch.value !== ""){
        itens_array.forEach((item)=>{
            if(item.type === itemType_selectSearch.value){
                allItens.push(item);
            }
        })
    }

    if(itemType_selectSearch.value === ""){
        itens_array.forEach((item)=>{
            allItens.push(item);
        })
    }

    for(let i = 0 ; i < allItens.length; i++){
        if(allItens[i].name.includes(itemNameInputSearch.value)){
            itensSearched.push(allItens[i]);
        }
    }

    if(itensSearched.length <= 0){
        showHtmlElement([noItemInventory], "flex");
        let endOfItems = document.createElement("div");
        endOfItems.className = "end-of-items";
        consultInventory_showControl.appendChild(endOfItems);
        return;
    }

    if(itensSearched.length > 0){
        hideHtmlElement([noItemInventory]);
    }

    itensSearched.forEach((element)=>{
        let consultInventory_showItem = document.createElement("div");
        consultInventory_showItem.className = "consult-inventory_show-item";

        let itemNameSpan = document.createElement("span");
        itemNameSpan.innerHTML = element.name;
        itemNameSpan.className = "item-name_span";

        let itemTypeSpan = document.createElement("span");
        itemTypeSpan.innerHTML = element.type;
        itemTypeSpan.className = "item-type_span";

        let itemQuantSpan = document.createElement("span");
        itemQuantSpan.innerHTML = element.quant;
        itemQuantSpan.className = "item-quant_span";

        let itemStatusControl = document.createElement("div");
        itemStatusControl.className = "item-status-control";

        let statusIndicatorCircle = document.createElement("div");
        statusIndicatorCircle.className = "status-indicator-circle";

        let itemStatusSpan = document.createElement("span");
        itemStatusSpan.className = "item-status_span";

        if(element.status === "EM FALTA"){
            statusIndicatorCircle.style.backgroundColor = "#d61e1e"; // red
            itemStatusSpan.innerText = `${element.status}`;

            itemStatusControl.appendChild(statusIndicatorCircle);
            itemStatusControl.appendChild(itemStatusSpan);
        }

        if(element.status === "POSSUI"){
            statusIndicatorCircle.style.backgroundColor = "#42f55a"; // green
            itemStatusSpan.innerText = `${element.status}`;

            itemStatusControl.appendChild(statusIndicatorCircle);
            itemStatusControl.appendChild(itemStatusSpan);
        }

        consultInventory_showItem.appendChild(itemNameSpan);
        consultInventory_showItem.appendChild(itemTypeSpan);
        consultInventory_showItem.appendChild(itemQuantSpan);
        consultInventory_showItem.appendChild(itemStatusControl);

        consultInventory_showControl.appendChild(consultInventory_showItem);
    });

    let endOfItems = document.createElement("div");
    endOfItems.className = "end-of-items";

    consultInventory_showControl.appendChild(endOfItems);

    await showHtmlElement([consultInventory_resultContainer], "block");
}



// event listerners

backHomeBtn.forEach((button)=>{
    button.addEventListener("click", async ()=>{
        await backHomeProcess()
    })
})

consultInventoryLink.addEventListener("click", async ()=>{
    await hideHtmlElement([mainHubSection, consultInventory_resultContainer]);
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

consultInventory_searchBtn.addEventListener("click", async ()=>{
    if(itemNameInputSearch.value === ""){
        await showMessagePopup("errorMsg", "Digite as informações do item para continuar a pesquisa !");
        return;
    }
    await searchProcess_consultInventory();
})

// whole-inventory-section

// elements
const wholeInventorySection = document.querySelector(".whole-inventory-section");
const missingItemsBtn = document.querySelector(".missing-items-btn");
const haveItemsBtn = document.querySelector(".have-items-btn");
const missingItemsContainer = document.querySelector(".missing-items-container");
const missingItems_showControl = document.querySelector(".missing-items_show-control");
const haveItemsContainer = document.querySelector(".have-items-container");
const haveItems_showControl = document.querySelector(".have-items_show-control");

// functions

async function showItems_missingItemsContainer(){
    let allItens = [];

    let noItemInventory_missingItemsContainer = missingItemsContainer.querySelector(".no-item-inventory");
    hideHtmlElement([noItemInventory_missingItemsContainer]);

    if(document.querySelectorAll(".missing-items_show-item").length > 0){
        let itens = document.querySelectorAll(".missing-items_show-item");

        itens.forEach((item)=>{
            item.remove();
        })
    }

    if(missingItemsContainer.querySelector(".end-of-items") !== null){
        let item = missingItemsContainer.querySelector(".end-of-items");

        item.remove();
    }

    itens_array.forEach((item)=>{
        if(item.status === "EM FALTA"){
            allItens.push(item);
        }
    });
    
    allItens.sort((a,b)=>{
        if(a < b){
            return -1;
        }

        if(a > b){
            return 1; 
        }

        return 0;
    });

    console.log(allItens);

    if(allItens.length <= 0){
        await showHtmlElement([noItemInventory_missingItemsContainer],"flex");
        let endOfItems = document.createElement("div");
        endOfItems.className = "end-of-items";
        missingItemsContainer.appendChild(endOfItems);
        return;
    }

    allItens.forEach((element)=>{
        let missingItems_showItem = document.createElement("div");
        missingItems_showItem.className= "missing-items_show-item";

        let itemName_span = document.createElement("span");
        itemName_span.className= "item-name_span";
        itemName_span.innerText = element.name;

        let itemType_span = document.createElement("span");
        itemType_span.className = "item-type_span";
        itemType_span.innerText = element.type;
        
        let itemQuant_span = document.createElement("span");
        itemQuant_span.className= "item-quant_span";
        itemQuant_span.innerText = element.quant;

        let itemStatusControl = document.createElement("div");
        itemStatusControl.className= "item-status-control";

        let statusIndicatorCircle = document.createElement("div");
        statusIndicatorCircle.className= "status-indicator-circle";

        let itemStatus_span = document.createElement("span");
        itemStatus_span.className= "item-status_span";
        itemStatus_span.innerText = element.status;

        if(element.status === "EM FALTA"){
            statusIndicatorCircle.style.backgroundColor = "#d61e1e"; // red
        }

        if(element.status === "POSSUI"){
            statusIndicatorCircle.style.backgroundColor = "#42f55a"; // green
        }

        itemStatusControl.appendChild(statusIndicatorCircle);
        itemStatusControl.appendChild(itemStatus_span);

        missingItems_showItem.appendChild(itemName_span);
        missingItems_showItem.appendChild(itemType_span);
        missingItems_showItem.appendChild(itemQuant_span);
        missingItems_showItem.appendChild(itemStatusControl);

        missingItems_showControl.appendChild(missingItems_showItem);
    });

    let endOfItems = document.createElement("div");
    endOfItems.className = "end-of-items";
    missingItems_showControl.appendChild(endOfItems);

    await showHtmlElement([missingItemsContainer], "flex");
    await hideHtmlElement([haveItemsContainer]);
}

async function showItems_haveItemsContainer(){
    let allItens = [];

    let noItemInventory_haveItemContainer = haveItemsContainer.querySelector(".no-item-inventory");
    await hideHtmlElement([noItemInventory_haveItemContainer]);

    if(haveItemsContainer.querySelectorAll(".have-items_show-item").length > 0){
       let items =  haveItemsContainer.querySelectorAll(".have-items_show-item");

       items.forEach(item => {
        item.remove();
       })
    }

    if(haveItemsContainer.querySelector(".end-of-items") !== null){
        let item = haveItemsContainer.querySelector(".end-of-items");
        item.remove();
    }

    itens_array.forEach((item) => {
        if(item.status === "POSSUI"){
            allItens.push(item);
        }
    })

    allItens.sort((a,b)=>{
        if(a < b){
            return -1;
        }

        if(a > b){
            return 1; 
        }

        return 0;
    });

    console.log(allItens);

    if(allItens.length <= 0){
        await showHtmlElement([noItemInventory_haveItemContainer],"flex");
        let endOfItems = document.createElement("div");
        endOfItems.className = "end-of-items";
        haveItems_showControl.appendChild(endOfItems);
        return;
    }

    allItens.forEach((element) => {
        let haveItems_showItem = document.createElement("div");
        haveItems_showItem.className = "have-items_show-item";

        let itemName_span = document.createElement("span");
        itemName_span.className = "item-name_span";
        itemName_span.innerText = element.name;

        let itemType_span = document.createElement("span");
        itemType_span.className = "item-type_span";
        itemType_span.innerText = element.type;

        let itemQuant_span = document.createElement("span");
        itemQuant_span.className = "item-quant_span";
        itemQuant_span.innerText = element.quant;

        let itemStatusControl = document.createElement("div");
        itemStatusControl.className = "item-status-control";

        let statusIndicatorCircle = document.createElement("div");
        statusIndicatorCircle.className = "status-indicator-circle";

        let itemStatus_span = document.createElement("span");
        itemStatus_span.className = "item-status_span";
        itemStatus_span.innerText = element.status;

        if(element.status === "EM FALTA"){
            statusIndicatorCircle.style.backgroundColor = "#d61e1e"; // red
        }

        if(element.status === "POSSUI"){
            statusIndicatorCircle.style.backgroundColor = "#42f55a"; // green
        }

        itemStatusControl.appendChild(statusIndicatorCircle);
        itemStatusControl.appendChild(itemStatus_span);

        haveItems_showItem.appendChild(itemName_span);
        haveItems_showItem.appendChild(itemType_span);
        haveItems_showItem.appendChild(itemQuant_span);
        haveItems_showItem.appendChild(itemStatusControl);

        haveItems_showControl.appendChild(haveItems_showItem);
    });

    let endOfItems = document.createElement("div");
    endOfItems.className = "end-of-items";
    haveItems_showControl.appendChild(endOfItems);

    await showHtmlElement([haveItemsContainer], "flex");
    await hideHtmlElement([missingItemsContainer]);
}


// event listerners and booting

inventoryShowLink.addEventListener("click", async ()=>{
    await hideHtmlElement([mainHubSection,missingItemsContainer,haveItemsContainer]);
    await showHtmlElement([wholeInventorySection], "block");
});

missingItemsBtn.addEventListener("click", async ()=>{
    await showItems_missingItemsContainer();
});

haveItemsBtn.addEventListener("click", async ()=>{
    await showItems_haveItemsContainer();
})

// edit-inventory-section -> main-hub_edit-inventory

// elements
const editInventorySection = document.querySelector(".edit-inventory-section");
const mainHub_editInventory = document.querySelector(".main-hub_edit-inventory");
const addItemLinkBtn = document.querySelector("#add-item-link-btn");
const deleteItemLinkBtn = document.querySelector("#delete-item-link-btn");
const editItemLinkBtn = document.querySelector("#edit-item-link-btn");

// event listerners and booting

editInventoryShowLink.addEventListener("click", async ()=>{
    await hideHtmlElement([mainHubSection]);
    await showHtmlElement([editInventorySection], "block");
})

// edit-inventory-section -> add-item-container_edit-inventory

// elements

const backHomeBtn_editInventory = document.querySelectorAll(".back-home-btn_edit-inventory");
const addItemContainer_editInventory = document.querySelector(".add-item-container_edit-inventory");
let addItemTypeInput = document.querySelector("#add-item-type-input");
let addItemTypeOptionsControl = document.querySelector(".add-item-type-options-control");
let addItemNameInput = document.querySelector("#add-item-name-input");
const addItemBtn = document.querySelector("#add-item-btn");
let addItemQuantInput = document.querySelector("#add-item-quant-input");
let addItemStatusSelect = document.querySelector("#add-item-status-select");

// functions

async function backHomeProcess_editInventory(){
    await cleanAllInputs();

    await hideHtmlElement([
        addItemContainer_editInventory,
        deleteItemContainer_editInventory,
        editItemContainer_editInventory
    ]);
    await showHtmlElement([mainHub_editInventory],"flex");
}

async function createInputSuggestions_ItemType(
    typeInput,
    optionsControl,
    optionClassName,
){
    let allTypes = [];
    let itensSearched = [];

    itens_array.forEach((item)=>{
        allTypes.push(item.type);
    })

    optionsControl.innerHTML = "";

    allTypes.sort((a,b)=>{
        if(a < b){
            return -1;
        }

        if(a > b){
            return 1; 
        }

        return 0;
    });


    for(let i = 0 ; i <= allTypes.length ; i++){
        for(let j = 1; j <= allTypes.length ; j++){
            if(allTypes[i] === allTypes[j]){
                allTypes.splice(j,1);
            }
        }
    }


    for(let i = 0 ; i < allTypes.length; i++){
        if(allTypes[i].includes(typeInput.value)){
            itensSearched.push(allTypes[i]);
        }
    }

    if(itensSearched.length <= 0){
        optionsControl.innerHTML="";
        await hideHtmlElement([optionsControl]);
        return;
    }

    if(typeInput.value === ""){
        optionsControl.innerHTML="";
        await hideHtmlElement([optionsControl]);
        return;
    }

    itensSearched.forEach((item)=>{
        let addItemTypeOption = document.createElement("div");
        addItemTypeOption.className = `${optionClassName}`;
        addItemTypeOption.innerText = item;

        optionsControl.appendChild(addItemTypeOption);
    })

    let allOptions = optionsControl.querySelectorAll(`.${optionClassName}`);

    allOptions.forEach((option)=>{
        option.addEventListener("click", async()=>{
            typeInput.value = option.innerText;
            optionsControl.innerHTML="";
            await hideHtmlElement([optionsControl]);
        })    
    })

    await showHtmlElement([optionsControl], "block");
    
    document.addEventListener("click", async()=>{
        optionsControl.innerHTML="";
        await hideHtmlElement([optionsControl]);
    })

}

async function addItemLogic(){
    let newItem = {
        name : `${addItemNameInput.value}`,
        type : `${addItemTypeInput.value}`,
        quant : null,
        status : null
    }

    if(addItemStatusSelect.value === "POSSUI"){
        newItem.status = "POSSUI";
        newItem.quant = addItemQuantInput.value;
    }

    if(addItemStatusSelect.value === "EM FALTA"){
        newItem.status = "EM FALTA";
        newItem.quant = 0;
    }

    console.log(newItem);

    itens_array.push(newItem);

    itens_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }

        if(a.name > b.name){
            return 1; 
        }

        return 0;
    });

    console.log(itens_array);
}

async function addItemInventoryProcess(){
    if(addItemTypeInput.value === ""){
        await showMessagePopup("errorMsg","Insira o tipo do item !");
        return;
    }

    if(addItemNameInput.value === ""){
        await showMessagePopup("errorMsg","Insira o nome do item !");
        return;
    }

    if(addItemStatusSelect.value === "POSSUI" && addItemQuantInput.value === ""){
        await showMessagePopup("errorMsg","A quantidade do item não pode estar vazia !");
        return;
    }

    if(addItemStatusSelect.value === "POSSUI" && addItemQuantInput.value === "0"){
        await showMessagePopup("errorMsg","A quantidade do item não pode ser 0 !");
        return;
    }

    let includesInArray = 0;

    for(let i = 0 ; i < itens_array.length; i++){
        let itemName = itens_array[i].name;

        if(itemName.includes(addItemNameInput.value)){
            includesInArray += 1;
        }
    }

    if(includesInArray >= 1){
        await showMessagePopup("errorMsg", "Item já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addItemLogic, "Item adicionado com sucesso !");
        return;
    }
}

// event listeners and booting

backHomeBtn_editInventory.forEach((button)=>{
    button.addEventListener("click", async ()=>{
        await backHomeProcess_editInventory();
    })
});

addItemLinkBtn.addEventListener("click", async ()=>{
    await cleanAllInputs();
    await showHtmlElement([addItemContainer_editInventory], "block");
    await hideHtmlElement([mainHub_editInventory]);
})  

addItemTypeInput.addEventListener("input", async()=>{
    addItemTypeInput.value = addItemTypeInput.value.toUpperCase();

    await createInputSuggestions_ItemType(
        addItemTypeInput,
        addItemTypeOptionsControl,
        "add-item-type-option"
    );
});

addItemNameInput.addEventListener("input", async()=>{
    addItemNameInput.value = addItemNameInput.value.toUpperCase();
})

addItemStatusSelect.addEventListener("change", async()=>{
    if(addItemStatusSelect.value === "POSSUI"){
        addItemQuantInput.value = "1";
        return;
    }

    if(addItemStatusSelect.value === "EM FALTA"){
        addItemQuantInput.value = "0"
        return;
    }
})

addItemBtn.addEventListener("click", async()=>{
    await addItemInventoryProcess();
})   

// edit-inventory-section -> delete-item-container_edit-inventory

// elements
const deleteItemContainer_editInventory = document.querySelector(".delete-item-container_edit-inventory");

let deleteItemTypeInput = document.querySelector("#delete-item-type-input");
const deleteItemTypeOptionsControl = document.querySelector(".delete-item-type-options-control");

let deleteItemNameInput = document.querySelector("#delete-item-name-input");
const deleteItemNameOptionsControl = document.querySelector(".delete-item-name-options-control");
let deleteItemNameOption = null;

const deleteItem_searchItemBtn = document.querySelector("#delete-item_search-item-btn");
const deleteItem_searchedItemContainer = document.querySelector(".delete-item_searched-item-container");

const deleteItemBtn = document.querySelector("#delete-item-btn");

// functions

async function searchForItemProcess_deleteItemContainer(){

    if(deleteItemNameInput.value === ""){
        await showMessagePopup("errorMsg", "Digite o nome do item !");
        return;
    }

    let itemExists = false;

    if(deleteItemTypeInput.value !== ""){
        itens_array.forEach((item)=>{
            if(item.type === deleteItemTypeInput.value && item.name === deleteItemNameInput.value){
                itemExists = true;
                return;
            }
        })
    }

    if(deleteItemTypeInput.value === ""){
        itens_array.forEach((item)=>{
            if(item.name === deleteItemNameInput.value){
                itemExists = true;
                return;
            }
        })
    };

    console.log(itemExists);

    if(!itemExists){
        await showMessagePopup("errorMsg", "O item informado não existe ! Tenete novamente !");
        return;
    }

    const searchedItemContainer = deleteItem_searchedItemContainer.querySelector(".searched-item-container");  

    const searchedItemShowControl = searchedItemContainer.querySelector(".searched-item-show-control");

    const itemName = searchedItemShowControl.querySelector(".item-name_span")
    const itemType = searchedItemShowControl.querySelector(".item-type_span")
    const itemQuant = searchedItemShowControl.querySelector(".item-quant_span")
    const itemStatusControl = searchedItemShowControl.querySelector(".item-status-control");
    const statusIndicatorCircle = itemStatusControl.querySelector(".status-indicator-circle");
    const itemStatus = itemStatusControl.querySelector(".item-status_span");

    itemName.innerHTML = "";
    itemType.innerHTML = "";
    itemQuant.innerHTML = "";
    itemStatus.innerHTML = "";

    itens_array.forEach((item)=>{
        if(item.name === deleteItemNameInput.value){
            itemName.innerText = item.name;
            itemType.innerText = item.type;
            itemQuant.innerText = item.quant;
            itemStatus.innerText = item.status;

            if(item.status === "POSSUI"){
                statusIndicatorCircle.style.backgroundColor = "#42f55a";
            }

            if(item.status === "EM FALTA"){
                statusIndicatorCircle.style.backgroundColor = "#d61e1e";
            }
        }
    });
    
    await showHtmlElement([deleteItem_searchedItemContainer], "flex");

}

async function deleteItemLogic(){
    if(deleteItemTypeInput.value !== ""){
        for(let i = 0; i < itens_array.length ; i++){
            if(itens_array[i].type === deleteItemTypeInput.value && itens_array[i].name === deleteItemNameInput.value){
                itens_array.splice(i, 1);
            }
        }
    }

    if(deleteItemTypeInput.value === ""){
        for(let i = 0; i < itens_array.length ; i++){
            if(itens_array[i].name === deleteItemNameInput.value){
                itens_array.splice(i, 1);
            }
        }
    }

    itens_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }

        if(a.name > b.name){
            return 1; 
        }

        return 0;
    });

    console.log(itens_array);

}

// event listerners and booting

deleteItemLinkBtn.addEventListener("click", async()=>{
    await cleanAllInputs();
    await hideHtmlElement([mainHub_editInventory,deleteItem_searchedItemContainer]);
    await showHtmlElement([deleteItemContainer_editInventory], "block");    
})

deleteItemTypeInput.addEventListener("input", async()=>{
    deleteItemTypeInput.value = deleteItemTypeInput.value.toUpperCase();
    
    await createInputSuggestions_ItemType(
        deleteItemTypeInput,
        deleteItemTypeOptionsControl,
        "delete-item-type-option"
    );
});

deleteItemNameInput.addEventListener("input", async()=>{
    deleteItemNameInput.value = deleteItemNameInput.value.toUpperCase();

    await createInputSuggestions(
        deleteItemTypeInput,
        deleteItemNameInput,
        deleteItemNameOptionsControl,
        deleteItemNameOption,
        "delete-item-name-option"
    )
});

deleteItem_searchItemBtn.addEventListener("click", async()=>{
    await searchForItemProcess_deleteItemContainer();
})

deleteItemBtn.addEventListener("click", async ()=>{
    await verifyPasswordProcess(deleteItemLogic, "Item deletado com sucesso !");
})

// edit-inventory-section -> edit-item-container_edit-inventory

// elements
const editItemContainer_editInventory = document.querySelector(".edit-item-container_edit-inventory");

const editItemTypeInput_search = document.querySelector("#edit-item-type-input_search");
const editItemTypeOptionsControl_search = document.querySelector(".edit-item-type-options-control_search");

const editItemNameInput_search = document.querySelector("#edit-item-name-input_search");
const editItemNameOptionsControl_search = document.querySelector(".edit-item-name-options-control_search");
const editItemNameOption_search = null;

const editItem_searchItemBtn = document.querySelector("#edit-item_search-item-btn");

const searchedItemContainer_editItemContainer  = document.querySelector(".edit-item_searched-item-container");

const editItemNameInput_searched = document.querySelector("#edit-item-name-input_searched");
const editItemNameOptionsControl_searched = document.querySelector(".edit-item-name-options-control_searched");
const editItemNameOption_searched = null;

const editItemTypeInput_searched = document.querySelector("#edit-item-type-input_searched");
const editItemTypeOptionsControl_searched = document.querySelector(".edit-item-type-options-control_searched");
const editItemTypeOption_searched = null;

const editItemQuantInput_searched = document.querySelector("#edit-item-quant-input_searched");

const editItemStatusControl_searched = document.querySelector(".edit-item-status-control_searched");
const editItemStatusSelect_searched = document.querySelector("#edit-item-status-select_searched");

// functions

async function searchForItemProcess_editItemContainer(){
    if (editItemNameInput_search.value === ""){
        await showMessagePopup("errorMsg", "Digite o nome do item!");
        return;
    }

    let itemExists = false;
    const statusIndicatorCircle = editItemStatusControl_searched.querySelector(".status-indicator-circle");

    if(editItemTypeInput_search.value !== ""){
        itens_array.forEach((item)=>{
            if(item.type === editItemTypeInput_search.value && item.name === editItemNameInput_search.value){
                itemExists = true;
                
                editItemNameInput_searched.value = item.name;
                editItemTypeInput_searched.value = item.type;
                editItemQuantInput_searched.value = item.quant;
                editItemStatusSelect_searched.value = item.status;

                if(item.status === "EM FALTA"){
                    statusIndicatorCircle.style.backgroundColor = "#d61e1e";
                }

                if(item.status === "POSSUI"){
                    statusIndicatorCircle.style.backgroundColor = "#42f55a";
                }
                
            }
        })
    }

    if(editItemTypeInput_search.value === ""){
        itens_array.forEach((item)=>{
            if(item.name === editItemNameInput_search.value){
                itemExists = true;
                
                editItemNameInput_searched.value = item.name;
                editItemTypeInput_searched.value = item.type;
                editItemQuantInput_searched.value = item.quant;
                editItemStatusSelect_searched.value = item.status;

                if(item.status === "EM FALTA"){
                    statusIndicatorCircle.style.backgroundColor = "#d61e1e";
                }

                if(item.status === "POSSUI"){
                    statusIndicatorCircle.style.backgroundColor = "#42f55a";
                }
                
            }
        })
    };

    if(!itemExists){
        await showMessagePopup("errorMsg", "O item não existe ! Tente novamente !");
        return;
    }

    await showHtmlElement([searchedItemContainer_editItemContainer], "flex");
}

async function editItemProcess(){
    if(editItemNameInput_searched.value === ""){
        await showMessagePopup("errorMsg", "Digite o nome do item!");
        return;
    }

    if(editItemTypeInput_searched.value === ""){
        await showMessagePopup("errorMsg", "Digite o tipo do item!");
        return;
    }

    let existingItem = {};


}

async function changeStatusIndicator_itemSearched(){
    const statusIndicatorCircle = editItemStatusControl_searched.querySelector(".status-indicator-circle");
    
    if(editItemStatusSelect_searched.value === "EM FALTA"){
        statusIndicatorCircle.style.backgroundColor = "#d61e1e";
        editItemQuantInput_searched.value = "0";
    }

    if(editItemStatusSelect_searched.value === "POSSUI"){
        statusIndicatorCircle.style.backgroundColor = "#42f55a";
    }
}

// event listeners and booting

editItemTypeInput_search.addEventListener("input", async()=>{
    editItemTypeInput_search.value = editItemTypeInput_search.value.toUpperCase();

    await createInputSuggestions_ItemType(
        editItemTypeInput_search,
        editItemTypeOptionsControl_search,
        "edit-item-type-option_search"
    )
})

editItemNameInput_search.addEventListener("input", async ()=>{
    editItemNameInput_search.value = editItemNameInput_search.value.toUpperCase();

    await createInputSuggestions(
        editItemTypeInput_search,
        editItemNameInput_search,
        editItemNameOptionsControl_search,
        editItemNameOption_search,
        "edit-item-name-option_search"
    )
})

editItem_searchItemBtn.addEventListener("click", async ()=>{
    await searchForItemProcess_editItemContainer();
});

editItemNameInput_searched.addEventListener("input", async()=>{
    await createInputSuggestions(
        editItemTypeInput_searched,
        editItemNameInput_searched,
        editItemNameOptionsControl_searched,
        editItemNameOption_searched,
        "edit-item-name-option_searched"
    )
});

editItemTypeInput_searched.addEventListener("input", async()=>{
    await createInputSuggestions_ItemType(
        editItemTypeInput_searched,
        editItemTypeOptionsControl_searched,
        "edit-item-type-option_searched"
    );
})

editItemStatusSelect_searched.addEventListener("change", async()=>{
    await changeStatusIndicator_itemSearched();
})

editItemQuantInput_searched.addEventListener("focusout",async()=>{
    let value = parseInt(editItemQuantInput_searched.value);
    console.log(value);

    if(value === 0 || value === NaN){
        editItemStatusSelect_searched.value = "EM FALTA";
    }

    if(value >= 1){
        editItemStatusSelect_searched.value = "POSSUI";
    }

    await changeStatusIndicator_itemSearched();
})