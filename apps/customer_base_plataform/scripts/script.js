// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    try{
        const response = await fetch(`https://nicholas1front.github.io/emeg_system/apps/backend/data/clients_equipaments.json?timestamp=${new Date().getTime()}`);
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let clientsArray_response = await response.json();

        let clientsArray_return = [];

        let clientObject_toPush = null;

        clientsArray_response.forEach((client)=>{
            clientObject_toPush = {
                name : client.name.toUpperCase(),
                equipaments : null, 
            };

            let clientEquipamentsArray = [];

            for(let i= 0 ; i < client.equipaments.length ; i++){
                clientEquipamentsArray.push(client.equipaments[i].toUpperCase());
            }

            clientObject_toPush.equipaments = clientEquipamentsArray;

            clientsArray_return.push(clientObject_toPush);
        });

        clientsArray_return.sort((a,b)=>{
            if(a.name < b.name){
                return -1;
            }
    
            if(a.name > b.name){
                return 1; 
            }
    
            return 0;
        });

        return clientsArray_return;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }
}

//booting
async function Initialize_clients_equipaments_array(){
    clients_equipaments_array = await getClientsData();
    return clients_equipaments_array;
}

Initialize_clients_equipaments_array();

//update json 

//elements

//functions
async function verifyDataBeforeSend(){
    let clients_equipaments_array_Fetched = await getClientsData();

    if(clients_equipaments_array.length < clients_equipaments_array_Fetched.length || clients_equipaments_array.length > clients_equipaments_array_Fetched.length){
        await verifyPasswordProcess(sendToServerProcess);
        return;        
    }

    let clients_equipaments_array_Fetched_JSON = JSON.stringify(clients_equipaments_array_Fetched);
    let clients_equipaments_array_JSON = JSON.stringify(clients_equipaments_array);

    if(clients_equipaments_array_Fetched_JSON === clients_equipaments_array_JSON){
        await showServerMessagePopup("errorMsg", "Dados já existentes ! Tente novamente !");
        return;
    }

    if(clients_equipaments_array_Fetched_JSON !== clients_equipaments_array_JSON){
        await verifyPasswordProcess(sendToServerProcess);
        return;
    }
}

async function updateClientsData() {
    try {
        const response = await fetch('https://emeg-orc.onrender.com/update-clients-equipaments', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ clients_equipaments_array }),
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

    await showHtmlElement([overlayForLoading], "flex");

    let result = await updateClientsData();

    if(!result){
        await hideHtmlElement([overlayForLoading]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar dados ! Tente novamente !")
        return;
    }

    await hideHtmlElement([overlayForLoading]);
    await showServerMessagePopup("sucessMsg", "Dados enviados com sucesso !");

    await showMessagePopup("sucessMsg", "Dados atualizados com sucesso !");

    setTimeout(async () => {
        getClientsData();
    },1000);
}

//show and hide elements functions

async function showHtmlElement([...elements], displayType){
    elements.forEach(element => {
        element.style.display = displayType;
    });
}

async function hideHtmlElement([...elements]){
    elements.forEach(element => {
        element.style.display="none";
    })
};

async function backHomeProcess(){
    clearAllInputs();

    const All_sections = document.querySelectorAll("section");

    for (let i = 0;i < All_sections.length;i++){
        hideHtmlElement([All_sections[i]]);
    }

    hideHtmlElement([
        addEquipamentControl,
        editClientControl,
        editEquipament_equipamentSearchControl,
        editEquipament_equipamentEditControl,
        deleteEquipamentControl
    ])

    showHtmlElement([mainHubSection],"flex");
}    

// clear inputs and other inputs

async function UpperCaseAllInputs(){
    let allInputs = document.querySelectorAll("input");

    for(let i = 0; i < allInputs.length ; i++){
        allInputs[i].addEventListener("input", async ()=>{
            allInputs[i].value = allInputs[i].value.toUpperCase();
        })
    }
}

async function clearAllInputs(){
    let All_inputs = document.querySelectorAll("input");
    let All_selects = document.querySelectorAll("select");

    All_inputs.forEach((input)=>{
        input.value = "";
    })

    All_selects.forEach((select)=>{
        select.value = "";
    })
}

// booting

UpperCaseAllInputs();

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

let functionToBeExecutedGlobal;
let msgPopupContentGlobal;

function showConfirmationPopup(){
    overlay.style.display = "flex";
    customerBasePlataformContainer.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

function closeConfirmationPopup(){
    overlay.style.display="none";
    customerBasePlataformContainer.style.filter = "blur(0)"
}

async function clickHandleListener(){
    if(confirmationPasswordInput.value === confirmationPassword){
        await callFunction(functionToBeExecutedGlobal, msgPopupContentGlobal);

        await backHomeProcess();

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

            await backHomeProcess();

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

    clients_equipaments_array.sort((a,b)=>{
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

// customer-base-plataform-container

// elements
const customerBasePlataformContainer  = document.querySelector(".customer-base-plataform-container");

//main-hub-section

//elements
const mainHubSection = document.querySelector(".main-hub-section");
const addClientLink = document.querySelector("#add-client-link");
const addEquipamentLink = document.querySelector("#add-equipament-link");
const editClientLink = document.querySelector("#edit-client-link");
const editEquipamentLink = document.querySelector("#edit-equipament-link");
const deleteClientLink = document.querySelector("#delete-client-link");
const deleteEquipamentLink = document.querySelector("#delete-equipament-link");
const consultClientLink = document.querySelector("#consult-client-link");
const sendToServerBtn = document.querySelector("#send-to-server-btn");

//event listerners

sendToServerBtn.addEventListener("click", async ()=>{
    await verifyDataBeforeSend();
})

//add-client-section

//elements
const addClientSection = document.querySelector(".add-client-section");
const addClientInput = document.querySelector("#add-client-input");
const addClientBtn = document.querySelector("#add-client-btn");
const backHomeBtn = document.querySelectorAll(".back-home-btn");

//functions

async function addClientLogic(){
    let clientName = addClientInput.value.toUpperCase();
    clientName.trim();

    const newClient = {
        name : clientName,
        equipaments : []
    }

    clients_equipaments_array.push(newClient);

};

async function addClientProcess(){

    let clientName = addClientInput.value.toUpperCase();
    clientName.trim();

    if(addClientInput.value === ""){
        showMessagePopup("errorMsg", "O campo 'Cliente' não pode estar vazio !");
        return;
    }

    let clientsList = [];

    clients_equipaments_array.forEach((client)=>{
        clientsList.push(client);
    })

    let includesInArray = clientsList.includes(clientName);

    if(includesInArray){
        showMessagePopup("errorMsg", "Cliente já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addClientLogic , "Cliente adicionado com sucesso !");
    }
}

// event listerner

addClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([addClientSection], "flex");
})

addClientBtn.addEventListener("click",async ()=>{
    addClientProcess();
});

//back home buttons through the document
for(let i = 0; i < backHomeBtn.length ; i++){
    backHomeBtn[i].addEventListener("click", ()=>{
        backHomeProcess();
    })
}

//add-equipament-section

//elements
const addEquipamentSection = document.querySelector(".add-equipament-section");

const addEquipament_clientInput = document.querySelector("#add-equipament_client-input");
const addEquipament_clientOptionsControl = document.querySelector(".add-equipament_client-options-control");
const addEquipament_searchBtn = document.querySelector("#add-equipament_search-btn");

const addEquipamentControl = document.querySelector(".add-equipament-control");
const addEquipamentInput = document.querySelector("#add-equipament-input");
const addEquipamentBtn = document.querySelector("#add-equipament-btn");

//functions

async function createClientSuggestions(
    clientInput,
    optionsControl,
    optionClassName
){
    optionsControl.innerHTML = "";

    let allClients = [];
    let itensSearched = [];

    clients_equipaments_array.forEach((client)=>{
        allClients.push(client.name);
    });

    for(let i = 0; i < allClients.length ; i++){
        if(allClients[i].includes(clientInput.value)){
            itensSearched.push(allClients[i]);
        }
    }

    console.log(itensSearched);

    if(itensSearched.length < 0 || clientInput.value === ""){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    }

    for(let i = 0; i < itensSearched.length ; i++){
        let option = document.createElement("div");

        option.className = optionClassName;
        option.innerHTML = itensSearched[i];

        optionsControl.appendChild(option);
    }

    const allOptions = document.querySelectorAll(`.${optionClassName}`);

    for(let i = 0; i < allOptions.length ; i++){
        allOptions[i].addEventListener("click", async ()=>{
            clientInput.value = allOptions[i].innerText;

            optionsControl.innerHTML = "";
            await hideHtmlElement([optionsControl]);
        })
    }

    document.addEventListener("click", async ()=>{
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
    });

    await showHtmlElement([optionsControl], "block");
}

async function verifyClientInput_searchBtn(
    clientInput,
    showThisElement,
    displayType
){
    let inputValue = clientInput.value.trim();

    if(inputValue === ""){
        await showMessagePopup("errorMsg", "O campo 'Cliente' não pode estar vazio ! Tente novamente !");
        return
    }

    let clientExists = false;

    clients_equipaments_array.forEach(async (client)=>{
        if(inputValue === client.name){
            clientExists = true;
        }
    });

    if(!clientExists){
        await showMessagePopup("errorMsg", "O cliente inserido não existe ! Tente nocvamente !");
        return;
    }

    if(clientExists){
        await showHtmlElement([showThisElement], displayType);
        return;
    }
}

async function addEquipamentLogic(){

    let equipamentName = addEquipamentInput.value.toUpperCase();

    equipamentName.trim();

    clients_equipaments_array.forEach((client)=>{
        if(client.name === addEquipament_clientInput.value){
            client.equipaments.push(equipamentName);
        }
    });

};

async function addEquipamentProcess(){
    if(addEquipamentInput.value === ""){
        showMessagePopup("errorMsg","O campo 'Equipamentos' não pode estar vazio !")
        return;
    }

    let equipamentName = addEquipamentInput.value.toUpperCase();
    equipamentName.trim();

    let equipamentsArray = [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name === addEquipament_clientInput.value){
            client.equipaments.forEach((equipament)=>{
                equipamentsArray.push(equipament);
            })
        }
    });

    let includesInArray = equipamentsArray.includes(equipamentName);

    if(includesInArray){
        showMessagePopup("errorMsg","Equipamento já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(addEquipamentLogic,"Equipamento adicionado com sucesso !");
    }
        
}

//event listeners

addEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([addEquipamentSection],"flex");
});

addEquipament_clientInput.addEventListener("input", async ()=>{
    await createClientSuggestions(
        addEquipament_clientInput,
        addEquipament_clientOptionsControl,
        "add-equipament_client-option"
    );
});

addEquipament_searchBtn.addEventListener("click", async()=>{
    await verifyClientInput_searchBtn(
        addEquipament_clientInput,
        addEquipamentControl,
        "flex"
    )
})

addEquipamentBtn.addEventListener("click", ()=>{
    addEquipamentProcess();
});

//edit-client-section

//elements
const editClientSection = document.querySelector(".edit-client-section");
const editClient_clientSelectList = document.querySelector("#edit-client_client-select-list");
const editClient_clientInput = document.querySelector("#edit-client_client-input");
const editClient_clientOptionsControl = document.querySelector(".edit-client_client-options-control");
const editClient_clientSearchBtn = document.querySelector("#edit-client_client-search-btn")
const editClientControl = document.querySelector(".edit-client-control");
const editClientInput = document.querySelector("#edit-client-input");
const editClientBtn = document.querySelector("#edit-client-btn");

//functions

async function editClientLogic(){
    clients_equipaments_array.forEach((client)=>{
        if(client.name === editClient_clientInput.value){
            client.name = editClientInput.value.trim();
        }
    })

};

async function editClientProcess(){

    let clientName = editClientInput.value.trim();

    if(editClient_clientInput.value === ""){
        showMessagePopup("errorMsg","O campo 'Cliente' não pode estar vazio !");
        return;
    }

    if(clientName === editClient_clientInput.value){
        showMessagePopup("errorMsg","Cliente não pode ser igual a anterior !");
        return;
    }

    let clientsList = [];

    clients_equipaments_array.forEach((client)=>{
        clientsList.push(client.name);
    })   
    
    let includesInArray = clientsList.includes(clientName);

    if(includesInArray){
        showMessagePopup("errorMsg","Cliente já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(editClientLogic,"Cliente editado com sucesso !");
    }
        

};

//event listeners
editClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([editClientSection],"flex");
})

editClient_clientInput.addEventListener("input", async ()=>{
    await createClientSuggestions(
        editClient_clientInput,
        editClient_clientOptionsControl,
        "edit-client_client-option"
    )
});

editClient_clientSearchBtn.addEventListener("click", async()=>{
    await verifyClientInput_searchBtn(
        editClient_clientInput,
        editClientControl,
        "block"
    )
})

editClientBtn.addEventListener("click", ()=>{
    editClientProcess();
})

//edit-equipament-section

//elements

const editEquipamentSection = document.querySelector(".edit-equipament-section");

const editEquipament_clientInput = document.querySelector("#edit-equipament_client-input");
const editEquipament_clientOptionsControl = document.querySelector(".edit-equipament_client-options-control");
const editEquipament_searchClientBtn = document.querySelector("#edit-equipament_search-client-btn");

const editEquipament_equipamentSearchControl = document.querySelector(".edit-equipament_equipament-search-control");
const editEquipament_equipamentSearchInput = document.querySelector("#edit-equipament_equipament-search-input");
const editEquipament_equipamentSearchOptionsControl = document.querySelector(".edit-equipament_equipament-search-options-control");
const editEquipament_searchEquipamentBtn = document.querySelector("#edit-equipament_search-equipament-btn");

const editEquipament_equipamentEditControl = document.querySelector(".edit-equipament_equipament-edit-control");
const editEquipament_equipamentSelectList = document.querySelector("#edit-equipament_equipament-select-list");
const editEquipamentInput = document.querySelector("#edit-equipament-input");
const editEquipamentBtn = document.querySelector("#edit-equipament-btn");

// functions

async function createEquipamentSuggestions(
    clientInput,
    equipamentInput,
    optionsControl,
    optionClassName
){
    optionsControl.innerHTML = "";

    let targetClient;

    let allEquipaments = [];

    let inputValue = clientInput.value.trim();

    let clientExists = false;

    for(i = 0; i < clients_equipaments_array.length; i++){
        if(clients_equipaments_array[i].name === inputValue){
            targetClient = clients_equipaments_array[i];
            clientExists = true;
        }
    }

    if(!clientExists){
        await showMessagePopup("errorMsg","Cliente não encontrado ! Tente novamente !");
        return;
    }


    for(i = 0; i < targetClient.equipaments.length; i++){
        allEquipaments.push(targetClient.equipaments[i]);
    }

    if(allEquipaments.length == 0 || equipamentInput.value === ""){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    }

    allEquipaments.forEach((equipament)=>{
        let option = document.createElement("div");

        option.innerHTML = equipament;
        option.className = optionClassName;

        optionsControl.appendChild(option);
    });

    const allEquipamentOptions = document.querySelectorAll(`.${optionClassName}`);

    allEquipamentOptions.forEach((option)=>{
        option.addEventListener("click", async()=>{
            equipamentInput.value = option.innerHTML;

            await hideHtmlElement([optionsControl]);
            optionsControl.innerHTML = "";
        })
    });

    document.addEventListener('click', async()=>{
        await hideHtmlElement([optionsControl]);
        optionsControl.innerHTML = "";
    })

    await showHtmlElement([optionsControl], "block");

}

async function verifyEquipamentInput_searchBtn(
    clientInput,
    equipamentInput,
    equipamentInput_edit,
    showThisElement,
    displayType
){
    let targetClient;

    for(i = 0; i < clients_equipaments_array.length;i++){
        if(clients_equipaments_array[i].name === clientInput.value){
            targetClient = clients_equipaments_array[i];
        }
    }

    let equipamentExists = false;

    for(i = 0; i < targetClient.equipaments.length; i++){
        if(targetClient.equipaments[i] === equipamentInput.value){
            equipamentExists = true;
            if(equipamentInput_edit !== "noInput"){
                equipamentInput_edit.value = equipamentInput.value;
            }
        }
    }

    if(equipamentExists){
        await showHtmlElement([showThisElement], displayType);
        return
    }

    if(!equipamentExists){
        await showMessagePopup("errorMsg", "Equipamento não encontrado ! Tente novamente !");
        return;
    }
}

async function  editEquipamentLogic(){
    clients_equipaments_array.forEach((client)=>{
        if(client.name === editEquipament_clientInput.value){
            for(i=0; i < client.equipaments.length; i++){
                if(client.equipaments[i] === editEquipament_equipamentSearchInput.value){
                    client.equipaments[i] = editEquipamentInput.value;
                }
            }
        }
    })

};

async function editEquipamentProcess(){

    let equipamentName = editEquipamentInput.value.trim();

    if(editEquipament_equipamentSearchInput.value === equipamentName){
        showMessagePopup("errorMsg","Equipamento não pode ser igual ao anterior !");
        return;
    }

    let equipamentsArray = [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name === editEquipament_clientInput.value){
            client.equipaments.forEach((equipament)=>{
                equipamentsArray.push(equipament);
            })
        }
    });

    let includesInArray = equipamentsArray.includes(equipamentName);

    if(includesInArray){
        showMessagePopup("errorMsg","Equipamento já existente ! Tente novamente !");
        return;
    }else{
        await verifyPasswordProcess(editEquipamentLogic,"Equipamento editado com sucesso !");
    }

}

// event listerners

editEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([editEquipamentSection],"flex");
    hideHtmlElement([editEquipament_equipamentSearchControl,editEquipament_equipamentEditControl])
})

editEquipament_clientInput.addEventListener("input", async ()=>{
    await createClientSuggestions(
        editEquipament_clientInput,
        editEquipament_clientOptionsControl,
        "edit-equipament_client-option"
    )
})

editEquipament_searchClientBtn.addEventListener("click", async ()=>{
    await verifyClientInput_searchBtn(
        editEquipament_clientInput,
        editEquipament_equipamentSearchControl,
        "flex"
    )
});

editEquipament_equipamentSearchInput.addEventListener("input", async ()=>{
    await createEquipamentSuggestions(
        editEquipament_clientInput,
        editEquipament_equipamentSearchInput,
        editEquipament_equipamentSearchOptionsControl,
        "edit-equipament_equipament-search-option"
    );
})

editEquipament_searchEquipamentBtn.addEventListener("click", async()=>{
    await verifyEquipamentInput_searchBtn(
        editEquipament_clientInput,
        editEquipament_equipamentSearchInput,
        editEquipamentInput,
        editEquipament_equipamentEditControl,
        "flex"
    );
})

editEquipamentBtn.addEventListener("click", ()=>{
    editEquipamentProcess();
}) 

// delete-client-section

// elements
const deleteClientSection = document.querySelector(".delete-client-section");
const deleteClient_clientSelectList = document.querySelector("#delete-client_client-select-list");
const deleteClientInput = document.querySelector("#delete-client-input");
const deleteClientOptionsControl = document.querySelector(".delete-client-options-control");
const deleteClientBtn = document.querySelector("#delete-client-btn");

// functions

async function deleteClientLogic(){

    for(let i = 0 ; i < clients_equipaments_array.length ; i++){
        if(clients_equipaments_array[i].name === deleteClientInput.value){
            clients_equipaments_array.splice(i,1);
        }
    };

}

async function deleteClientProcess(){
    if(deleteClientInput.value === ""){
        showMessagePopup("errorMsg","Um cliente precisa ser selecionado !");
        return;
    }
    
    await verifyPasswordProcess(deleteClientLogic,"Cliente excluído com sucesso !");
}

// event listerners

deleteClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([deleteClientSection],"flex");
});

deleteClientInput.addEventListener("input", async ()=>{
    await createClientSuggestions(
        deleteClientInput,
        deleteClientOptionsControl,
        "delete-client-option"
    )
})

deleteClientBtn.addEventListener("click", ()=>{
    deleteClientProcess();
})

// delete-equipament-section

// elements
const deleteElementSection = document.querySelector(".delete-equipament-section");
const deleteEquipament_clientSelectList = document.querySelector("#delete-equipament_client-select-list");
const deleteEquipament_clientInput = document.querySelector("#delete-equipament_client-input");
const deleteEquipament_clientOptionsControl = document.querySelector(".delete-equipament_client-options-control")
const deleteEquipament_searchClientBtn = document.querySelector("#delete-equipament_search-client-btn");

const deleteEquipamentControl = document.querySelector(".delete-equipament-control");
const deleteEquipament_equipamentSelectList = document.querySelector("#delete-equipament_equipament-select-list");
const deleteEquipament_equipamentInput = document.querySelector("#delete-equipament_equipament-input");
const deleteEquipament_equipamentOptionsControl = document.querySelector(".delete-equipament_equipament-options-control")
const deleteEquipamentBtn = document.querySelector("#delete-equipament-btn");

// functions

async function deleteEquipamentLogic(){

    clients_equipaments_array.forEach((client)=>{
        if(client.name === deleteEquipament_clientInput.value){
            for(let i = 0 ; i < client.equipaments.length ; i++){
                if(client.equipaments[i] === deleteEquipament_equipamentInput.value){
                    client.equipaments.splice(i, 1);
                }
            }
        }
    })

}

async function deleteEquipamentProcess(){
    if(deleteEquipament_equipamentInput.value === ""){
        showMessagePopup("errorMsg","Selecione o equipamento que deseja excluir !");
        return
    };

    let targetClient;

    clients_equipaments_array.forEach(client => {
        if(client.name === deleteEquipament_clientInput.value){
            targetClient = client;
        }
    });

    let equipamentExists = false;

    targetClient.equipaments.forEach((equipament)=>{
        if(equipament === deleteEquipament_equipamentInput.value){
            equipamentExists = true;
        }
    })

    if(equipamentExists){
        await verifyPasswordProcess(deleteEquipamentLogic,"Equipamento deletado com sucesso !");
        return;
    }

    if(!equipamentExists){
        await showMessagePopup("errorMsg", "Equipamento informado incorreto ou não existe ! Tente novamente !")
        return;
    }
}

// event listeners

deleteEquipamentLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([deleteElementSection],"flex");
})

deleteEquipament_clientInput.addEventListener("input", async()=>{
    await createClientSuggestions(
        deleteEquipament_clientInput,
        deleteEquipament_clientOptionsControl,
        "delete-equipament_client-option"
    )
});

deleteEquipament_searchClientBtn.addEventListener("click", async()=>{
    await verifyClientInput_searchBtn(
        deleteEquipament_clientInput,
        deleteEquipamentControl,
        "flex"
    )
});

deleteEquipament_equipamentInput.addEventListener("input", async()=>{
    await createEquipamentSuggestions(
        deleteEquipament_clientInput,
        deleteEquipament_equipamentInput,
        deleteEquipament_equipamentOptionsControl,
        "delete-equipament_equipament-option"
    )
})

deleteEquipamentBtn.addEventListener("click", ()=>{
    deleteEquipamentProcess();
})

// consult-client-section

// elements 
const consultClientSection = document.querySelector(".consult-client-section");
const consultClientInput = document.querySelector("#consult-client-input");
const consultClientOptionsControl = document.querySelector(".consult-client-options-control");   
const consultClientBtn = document.querySelector("#consult-client-btn");

const resultConsultContainer = document.querySelector(".result-consult-container");

// functions

 async function displayConsultResultHtml(clientObject){
    const consultResult_clientName = document.querySelector("#consult-result_client-name");
    const equipamentDataControl = document.querySelector(".equipament-data-control");
    consultResult_clientName.innerHTML = "";
    equipamentDataControl.innerHTML = "";

    consultResult_clientName.innerHTML = clientObject.name;

    clientObject.equipaments.forEach((equipament)=>{
        let equipamentData = document.createElement("div");

        equipamentData.className = "equipament-data";
        equipamentData.innerHTML = equipament;

        equipamentDataControl.appendChild(equipamentData);
    });

    await showHtmlElement([resultConsultContainer], "flex");
}

async function consultClientProcess(){
    if(consultClientInput.value === ""){
        showMessagePopup("errorMsg", "Selecione um cliente para consulta !");
        return;
    }

    let clientExists = false;

    clients_equipaments_array.forEach((client)=>{
        if(client.name === consultClientInput.value){
            clientExists = true;
        }
    });

    if(!clientExists){
        await showMessagePopup("erroMsg", "Cliente informado não existe ! Tente novamente !");
        return
    }

    let clientObject = {
        name : null,
        equipaments : null
    }

    clients_equipaments_array.forEach((client)=>{
        if(client.name === consultClientInput.value){
            clientObject.name = client.name;
            clientObject.equipaments = client.equipaments;
        }
    });

    await displayConsultResultHtml(clientObject);
}

// event listeners

consultClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    hideHtmlElement([resultConsultContainer]);
    showHtmlElement([consultClientSection], "flex");
});

consultClientInput.addEventListener("input", async ()=>{
    await createClientSuggestions(
        consultClientInput,
        consultClientOptionsControl,
        "consult-client-option"
    )
})

consultClientBtn.addEventListener("click", ()=>{
    consultClientProcess();
})