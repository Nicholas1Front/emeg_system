// get clients data from github

let clients_equipaments_array = [];

async function getClientsData(){
    try{
        const response = await fetch(`https://emeg-orc.onrender.com/get-clients-equipaments`);
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let clientsArray_response = await response.json();

        clientsArray_response.sort((a,b)=>{
            if(a.name < b.name){
                return -1;
            }
    
            if(a.name > b.name){
                return 1; 
            }
    
            return 0;
        });

        console.log(clientsArray_response);
        return clientsArray_response;
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
    elements.forEach((element) => {
        element.style.display="none";
    })
};

async function deleteHtmlElement([...elements]){
    elements.forEach((element) => {
        element.remove();
    })
}

async function clearHtmlElement([...elements]){
    elements.forEach((element)=>{
        element.innerHTML = "";
    })
}

async function backHomeProcess(){
    clearAllInputs();

    const All_sections = document.querySelectorAll("section");

    for (let i = 0;i < All_sections.length;i++){
        hideHtmlElement([All_sections[i]]);
    }

    hideHtmlElement([
        addEquipamentControl,
        editClientContainer_edit,
        editEquipament_equipamentSearchControl,
        editEquipament_equipamentEditControl,
        deleteEquipamentControl,
        resultConsultContainer,
        cnpjCpfResultContainer
    ])

    showHtmlElement([mainHubSection],"flex");
}    

// clear inputs and other inputs

async function upperCaseThisInput([...inputs]){
    inputs.forEach((input)=>{
        input.addEventListener("input", async()=>{
            input.value = input.value.toUpperCase();
        })
    })
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

async function validateOnlyNumbers(param){
    return param.replace(/[^0-9,]/g,"")
}

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
const addClientInput_name = document.querySelector("#add-client-input_name");
const addClientInput_cnpj_cpf = document.querySelector("#add-client-input_cnpj_cpf");

const addClientInputControl_contact = document.querySelector(".add-client-input-control_contact");
const addClientInput_firstContact = document.querySelector(".add-client-input_contact");
let addClientInput_allContacts;
const addContactInputBtn = document.querySelector("#add-contact-input-btn");

const addClientInputControl_locality = document.querySelector(".add-client-input-control_locality");
const addClientInput_firstLocality = document.querySelector(".add-client-input_locality");
let addClientInput_allLocalities;
let addClientLocality_allOptionsControl;
const addLocalityInputBtn = document.querySelector("#add-locality-input-btn");

const addClientBtn = document.querySelector("#add-client-btn");
const backHomeBtn = document.querySelectorAll(".back-home-btn");

//functions

async function addClient_handleDeleteContact(){
    const allInputsControl = addClientInputControl_contact.querySelectorAll(".input-control");
    const allDeleteBtns = addClientInputControl_contact.querySelectorAll(".delete-contact-input-btn");

    if(allDeleteBtns.length == 0 || allDeleteBtns == [] ){
        return;
    }

    for(i = 0 ; i < allDeleteBtns.length ; i++){
        allDeleteBtns[i].addEventListener("click", async()=>{
            allInputsControl[i].remove();
            setTimeout(async()=>{
                await addClient_handleDeleteContact();
            },500)
        })
    }
}

async function addClientContactInput(){
    const inputContainer = addClientInputControl_contact.querySelector(".input-container");

    const inputControlString = 
    `
    <div class="input-control">
        <input type="text" class="add-client-input_contact" autocomplete="off" placeholder="Digite o contato do cliente...">
                <button class="delete-contact-input-btn">
                    <i class="fa-solid fa-trash"></i>
                </button>
    </div>
    `

    const parser = new DOMParser();

    const doc = parser.parseFromString(inputControlString, "text/html");
    
    const itemHtml = doc.body.firstChild;

    inputContainer.appendChild(itemHtml);

}

async function createLocalitySuggestions(localityInput, optionsControl, optionClassName){
    let allLocalities = [];
    optionsControl.innerHTML = "";

    clients_equipaments_array.forEach((client)=>{
        if(client.locality.length !== 0){
            for(i = 0; i < client.locality.length; i++){
                allLocalities.push(client.locality[i]);
            }
        }
    })

    allLocalities.sort((a,b)=>{
        if(a < b){
            return -1;
        }
    
        if(a > b){
            return 1; 
        }
    
        return 0;
    });

    for (let i = 0; i < allLocalities.length; i++) {
        allLocalities.sort((a, b) => (a < b ? -1 : 1));

        if (allLocalities[i] === allLocalities[i + 1]) {
            allLocalities.splice(i + 1, 1);
            i--; // Voltar um índice para não pular elementos
        }
    }

    let itensSearched = [];

    for(i = 0; i < allLocalities.length; i++){
        if(allLocalities[i].includes(localityInput.value)){
            itensSearched.push(allLocalities[i]);
        }
    }

    if(itensSearched.length == 0 || localityInput.value === ""){
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
        return;
    }

    itensSearched.forEach((item)=>{
        let option = document.createElement("div");
        option.innerHTML = item;
        option.className = optionClassName;

        optionsControl.appendChild(option);
    });

    let allOptions = optionsControl.querySelectorAll(`.${optionClassName}`);

    allOptions.forEach((option)=>{
        option.addEventListener("click", async()=>{
            localityInput.value = option.innerHTML;
            allOptions.innerHTML = "";
            await hideHtmlElement([optionsControl]);
        })
    })

    console.log(localityInput.value);
    console.log(allLocalities);

    await showHtmlElement([optionsControl], "block");
}

async function addClient_handleAllLocalityInputs(){
    addClientInput_allLocalities = document.querySelectorAll(".add-client-input_locality");
    addClientLocality_allOptionsControl = addClientInputControl_locality.querySelectorAll(".add-client-locality_options-control");

    for(let i = 0; i < addClientInput_allLocalities.length; i++){
        addClientInput_allLocalities[i].addEventListener("input", async()=>{
            await createLocalitySuggestions(
                addClientInput_allLocalities[i],
                addClientLocality_allOptionsControl[i],
                "add-client-locality_option"
            )
        })
    }

}

async function addClient_handleDeleteLocality() {
    addClientInputControl_locality.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-locality-input-btn") || event.target.closest(".delete-locality-input-btn")) {
            const inputControl = event.target.closest(".input-control");
            if (inputControl) {
                inputControl.remove();
            }
        }
    });
}

async function addClient_localityInput(){
    const inputContainer = addClientInputControl_locality.querySelector(".input-container");

    const inputControlString = 
    `
    <div class="input-control">
        <div class="add-client-locality-suggestions-control">
            <input type="text" class="add-client-input_locality" autocomplete="off" placeholder="Digite o localidade do cliente...">
            <div class="add-client-locality_options-control">
                <div class="add-client-locality_option">OPTION 1</div>
                <div class="add-client-locality_option">OPTION 2</div>
            </div>
        </div>
        <button class="delete-locality-input-btn">
            <i class="fa-solid fa-trash"></i>
        </button>
    </div>
    `

    const parser = new DOMParser();

    const doc = parser.parseFromString(inputControlString, "text/html");
    
    const itemHtml = doc.body.firstChild;

    inputContainer.appendChild(itemHtml);
}

async function addClient(){
    let newClient = {
        name : addClientInput_name.value.trim(),
        contact : [],
        cnpj_cpf : null,
        locality : [],
        equipaments : []
    }

    if(addClientInput_cnpj_cpf.value !== ""){
        newClient.cnpj_cpf = addClientInput_cnpj_cpf.value
    }

    let allContactInputs = document.querySelectorAll(".add-client-input_contact");

    allContactInputs.forEach((contactInput) => {
        if(contactInput.value === ""){
            return
        }

        if(contactInput.value !== ""){
            newClient.contact.push(contactInput.value.trim());
        }
    })

    let allLocalitiesInputs = document.querySelectorAll(".add-client-input_locality");

    allLocalitiesInputs.forEach((localityInput) => {
        if(localityInput.value === ""){
            return;
        }

        if(localityInput.value !== ""){
            newClient.locality.push(localityInput.value.trim());
        }
    });

    console.log(newClient);
};

async function addClient_validationProcess(){

    if(addClientInput_name.value === ""){
        await showMessagePopup("errorMsg","O campo 'Nome/Razão social' não pode estar vazio ! Tente novamente !");
        return
    }

   let clientExists = false;

   clients_equipaments_array.forEach((client)=>{
        if(client.name === addClientInput_name.value){
            clientExists = true;
        }
   })

   if(addClientInput_cnpj_cpf.value !== ""){
        if(addClientInput_cnpj_cpf.value.length < 11){
            await showMessagePopup("errorMsg", "O CPF está incorreto ! Tente novamente !");
            return;
        }

        if(addClientInput_cnpj_cpf.value.length >= 11 && addClientInput_cnpj_cpf.value.length < 14){
            await showMessagePopup("errorMsg", "O CNPJ está incorreto ! Tente novamente !");
            return;
        }
   }

   if(clientExists){
        await showMessagePopup("errorMsg","O cliente informado ja existe ! Tente novamente !");
        return;
   }else{
        await verifyPasswordProcess(addClient, "Cliente adicionado com sucesso !");
   }
}

// booting

upperCaseThisInput([
    addClientInput_name,
    addClientInput_firstLocality
]);

addClient_handleDeleteLocality();

// event listerner

addClientLink.addEventListener("click", async()=>{
    await backHomeProcess();
    await showHtmlElement([addClientSection], "flex");
    await addClient_handleAllLocalityInputs();

    addClientInput_allLocalities = document.querySelectorAll(".add-client-input_locality");

    for(let i = 0; i < addClientInput_allLocalities.length; i++){
        addClientInput_allLocalities[i].addEventListener("input", async()=>{
            addClientInput_allLocalities[i].value = addClientInput_allLocalities[i].value.toUpperCase();
        })
    }

})

addClientInput_cnpj_cpf.addEventListener("input", async(event)=>{
    let updateValue = await validateOnlyNumbers(event.target.value);

    if(updateValue.length >= 14){
        updateValue = event.target.value.slice(0, 14);
    }

    event.target.value = updateValue;

})

addContactInputBtn.addEventListener("click", async()=>{
    await addClientContactInput();
    await addClient_handleDeleteContact();
})

addLocalityInputBtn.addEventListener("click", async()=>{
    await addClient_localityInput();
    addClientInput_allLocalities = document.querySelectorAll(".add-client-input_locality");

    for(let i = 0; i < addClientInput_allLocalities.length; i++){
        addClientInput_allLocalities[i].addEventListener("input", async()=>{
            addClientInput_allLocalities[i].value = addClientInput_allLocalities[i].value.toUpperCase();
        })
    }
    
    await addClient_handleAllLocalityInputs();
})

addClientBtn.addEventListener("click",async ()=>{
    addClient_validationProcess();
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

    for(i = 0; i < clients_equipaments_array.length; i++){
        if(clients_equipaments_array[i].name === inputValue){
            clientExists = true;
        }
    }

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
const editClient_clientInputSearch = document.querySelector("#edit-client_client-input-search");
const editClient_clientOptionsControl = document.querySelector(".edit-client_client-options-control");
const editClient_clientSearchBtn = document.querySelector("#edit-client_client-search-btn");

const editClientContainer_edit = document.querySelector(".edit-client-container_edit");
const editClientInput_name = document.querySelector("#edit-client-input_name");
const editClientInput_cnpj_cpf = document.querySelector("#edit-client-input_cnpj_cpf");

const editClientInputControl_contact = document.querySelector(".edit-client-input-control_contact");
const editClientInput_firstContact = document.querySelector(".edit-client-input_contact");
let editClientInput_allContacts;
const addContactInputBtn_editClient = document.querySelector("#add-contact-input-btn_edit-client");

const editClientInputControl_locality = document.querySelector(".edit-client-input-control_locality");
const editClientInput_firstLocality = document.querySelector(".edit-client-input_locality");
let editClientInput_allLocalities;
let editClientLocality_allOptionsControl;
const addLocalityInputBtn_editClient = document.querySelector("#add-locality-input-btn_edit-client");   
const editClientBtn = document.querySelector("#edit-client-btn");   

//functions

async function addContactInput_editClient(){
    const inputContainer = editClientInputControl_contact.querySelector(".input-container");

    const inputControlString = 
    `
        <div class="input-control">
            <input type="text" class="edit-client-input_contact" autocomplete="off" placeholder="Digite o contato do cliente...">
                <button class="delete-contact-input-btn_edit-client">
                    <i class="fa-solid fa-trash"></i>
                </button>
        </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(inputControlString, "text/html");
    
    const itemHtml = doc.body.firstChild;

    inputContainer.appendChild(itemHtml);
}

async function editClient_handleDeleteContact(){
    const allInputsControl = editClientInputControl_contact.querySelectorAll(".input-control");
    const allDeleteBtns = editClientInputControl_contact.querySelectorAll(".delete-contact-input-btn_edit-client");

    if(allDeleteBtns.length == 0 || allDeleteBtns == [] ){
        return;
    }

    for(i = 0 ; i < allDeleteBtns.length ; i++){
        allDeleteBtns[i].addEventListener("click", async()=>{
            allInputsControl[i].remove();
            setTimeout(async()=>{
                await editClient_handleDeleteContact();
            },200)
        })
    }
}

async function addLocalityInput_editClient(){
    const inputContainer = editClientInputControl_locality.querySelector(".input-container");

    const inputControlString = 
    `
        <div class="input-control">
            <div class="edit-client-locality-suggestions-control">
                <input type="text" class="edit-client-input_locality" autocomplete="off" placeholder="Digite o localidade do cliente...">
                <div class="edit-client-locality_options-control">
                    <div class="edit-client-locality_option">OPTION 1</div>
                    <div class="edit-client-locality_option">OPTION 2</div>
                </div>
            </div>
            <button class="delete-locality-input-btn_edit-client">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;

    const parser = new DOMParser();

    const doc = parser.parseFromString(inputControlString, "text/html");
    
    const itemHtml = doc.body.firstChild;

    inputContainer.appendChild(itemHtml);
}

async function editClient_handleDeleteLocality(){
    editClientInputControl_locality.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-locality-input-btn_edit-client") || event.target.closest(".delete-locality-input-btn_edit-client")) {
            const inputControl = event.target.closest(".input-control");
            if (inputControl) {
                inputControl.remove();
            }
        }
    });
}

async function editClient_handleAllLocalityInputs(){
    editClientInput_allLocalities = editClientInputControl_locality.querySelectorAll(".edit-client-input_locality");
    editClientLocality_allOptionsControl = editClientInputControl_locality.querySelectorAll(".edit-client-locality_options-control");

    for(let i = 0; i < editClientInput_allLocalities.length; i++){
        editClientInput_allLocalities[i].addEventListener("input", async()=>{
            await createLocalitySuggestions(
                editClientInput_allLocalities[i],
                editClientLocality_allOptionsControl[i],
                "edit-client-locality_option"
            )
        })
    }
}

async function displayClientInfo_editClient(){
    let clientSearch;

    clients_equipaments_array.forEach((client)=>{
        if(client.name === editClient_clientInputSearch.value){
            clientSearch = client;
        }
    });

    editClientInput_name.value = clientSearch.name;

    if(clientSearch.cnpj_cpf === null){
        editClientInput_cnpj_cpf.value = "";
    }else{
        editClientInput_cnpj_cpf.value = clientSearch.cnpj_cpf;
    }

    if(clientSearch.contact.length > 0){
        
        if(clientSearch.contact.length > 1){
            for(i = 1; i< clientSearch.contact.length; i++){
                await addContactInput_editClient()
            }
        }

        editClientInput_allContacts = editClientInputControl_contact.querySelectorAll(".edit-client-input_contact");

        for(i=0; i < editClientInput_allContacts.length; i++){
            editClientInput_allContacts[i].value = clientSearch.contact[i]
        }
    }

    if(clientSearch.locality.length > 0){
        
        if(clientSearch.locality.length > 1){
            for(i = 1; i< clientSearch.locality.length; i++){
                await addLocalityInput_editClient();
            }
        }

        editClientInput_allLocalities = editClientInputControl_locality.querySelectorAll(".edit-client-input_locality");

        for(i=0; i < editClientInput_allLocalities.length; i++){
            editClientInput_allLocalities[i].value = clientSearch.locality[i];
        }
    }

    setTimeout(async()=>{
        await editClient_handleAllLocalityInputs();
        await editClient_handleDeleteLocality();
        await editClient_handleDeleteContact();
    },200)

    console.log(clientSearch);
}

async function editClient(){
    let allContacts = [];
    let allLocalities = [];

    editClientInput_allContacts = editClientInputControl_contact.querySelectorAll("input");
    editClientInput_allLocalities = editClientInputControl_locality.querySelectorAll("input");

    editClientInput_allContacts.forEach((contactInput)=>{
        if(contactInput.value !== ""){
            allContacts.push(contactInput.value.trim());
        }
    })

    editClientInput_allLocalities.forEach((localityInput)=>{
        if(localityInput.value !== ""){
            allLocalities.push(localityInput.value.trim());
        }
    })

    clients_equipaments_array.forEach((client)=>{
        if(client.name === editClient_clientInputSearch.value){
            client.name = editClientInput_name.value.trim();
            client.cnpj_cpf = editClientInput_cnpj_cpf.value.trim();
            client.contact = allContacts;
            client.locality = allLocalities;
        }
    })

    clients_equipaments_array.sort((a,b)=>{
        if(a.name < b.name){
            return -1;
        }

        if(a.name > b.name){
            return 1; 
        }

        return 0;
    });

    console.log(clients_equipaments_array);
};

async function editClient_validationProcess(){
    let clientSearched;

    clients_equipaments_array.forEach((client)=>{
        if(editClient_clientInputSearch.value === client.name){
            clientSearched = client;
        }
    });

    if(editClientInput_name.value === ""){
        await showMessagePopup("errorMsg", "O 'Nome/Razão social' do cliente não pode estar vazio ! Tente novamente !");
        return;
    }

    let clientEdited = {
        name : null,
        contact : [],
        cnpj_cpf : null,
        locality : [],
        equipaments : clientSearched.equipaments,
    }

    clientEdited.name = editClientInput_name.value.trim();

    if(editClientInput_cnpj_cpf.value !== ""){
        clientEdited.cnpj_cpf = editClientInput_cnpj_cpf.value.trim();
    }

    editClientInput_allContacts = editClientInputControl_contact.querySelectorAll("input");
    editClientInput_allContacts.forEach((contactInput)=>{
        if(contactInput.value !== ""){
            clientEdited.contact.push(contactInput.value.trim());
        }
    })

    editClientInput_allLocalities = editClientInputControl_locality.querySelectorAll("input");
    editClientInput_allLocalities.forEach((localityInput)=>{
        if(localityInput.value !== ""){
            clientEdited.locality.push(localityInput.value.trim());
        }
    });

    let clientSearched_json = JSON.stringify(clientSearched);
    let clientEdited_json = JSON.stringify(clientEdited);

    console.log(clientSearched_json);
    console.log(clientEdited_json);
    
    if(clientSearched_json === clientEdited_json){
        await showMessagePopup("errorMsg", "O cliente editado não pode ser igual ao anterior ! Tente novamente !");
        return;
    }

    if(clientSearched_json !== clientEdited_json){
        await verifyPasswordProcess(editClient, "Cliente editado com sucesso !");
    }
};


//event listeners
editClientLink.addEventListener("click", ()=>{
    backHomeProcess();
    showHtmlElement([editClientSection],"flex");
})

editClient_clientInputSearch.addEventListener("input", async ()=>{
    await createClientSuggestions(
        editClient_clientInputSearch,
        editClient_clientOptionsControl,
        "edit-client_client-option"
    );
});

editClient_clientSearchBtn.addEventListener("click", async()=>{
    await verifyClientInput_searchBtn(
        editClient_clientInputSearch,
        editClientContainer_edit,
        "flex"
    );

    await displayClientInfo_editClient();
});

editClientInput_cnpj_cpf.addEventListener("input", async(event)=>{
    let updateValue = await validateOnlyNumbers(event.target.value);

    if(updateValue.length >= 14){
        updateValue = event.target.value.slice(0, 14);
    }

    event.target.value = updateValue;
})

addContactInputBtn_editClient.addEventListener("click", async()=>{
   addContactInput_editClient();
   editClient_handleDeleteContact();
})

addLocalityInputBtn_editClient.addEventListener("click", async()=>{
    addLocalityInput_editClient();
    editClient_handleDeleteLocality();
    editClient_handleAllLocalityInputs();
})

editClientBtn.addEventListener("click", ()=>{
    editClient_validationProcess();
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
const cnpjCpfResultContainer = document.querySelector(".cnpj-cpf-result-container");
// functions

async function getCNPJData(cnpj){
    const url = `https://open.cnpja.com/office/${cnpj}`;

    console.log(cnpj);
    
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();

        if (!data || Object.keys(data).length === 0) {
            throw new Error("Nenhuma informação encontrada para este CNPJ.");
        }

        const cnpj_data = {
            company_name : data.company.name || "Não informado",
            client_address : `${data.address.street}, N°${data.address.number}, ${data.address.details}, ${data.address.district}, ${data.address.city}-${data.address.state}`|| "Não informado",
            cep : data.address.zip || "Não informado",
            status : data.status.text || "Não informado",
            statusDateUpdate : data.statusDate || "Não informado"
        };

        console.log(cnpj_data);
        return cnpj_data;
    } catch (error) {
        console.error("Erro ao buscar CNPJ:", error);
    }
}


 async function displayConsultResultHtml_clientAndEquipamentData(clientObject){
    const consultResult_clientName = document.querySelector("#consult-result_client-name");
    const consultResult_clientCnpjCpf = document.querySelector("#consult-result_client-cnpj-cpf");
    const clientDataControl_contact = document.querySelector(".client-data-control-contacts");
    const clientDataControl_locality = document.querySelector(".client-data-control-localities")

    const equipamentDataControl = document.querySelector(".equipament-data-control");
    

    console.log(clientObject);

    consultResult_clientName.innerHTML = "";
    consultResult_clientCnpjCpf.innerHTML = "";
    clientDataControl_contact.innerHTML = "";
    clientDataControl_locality.innerHTML = "";
    equipamentDataControl.innerHTML = "";

    consultResult_clientName.innerHTML = clientObject.name;
    consultResult_clientCnpjCpf.innerHTML = clientObject.cnpj_cpf;

    if(clientObject.contact.length > 0){
        clientObject.contact.forEach((contact)=>{
            let contactData = document.createElement("span");
    
            contactData.innerText = contact;
    
            clientDataControl_contact.appendChild(contactData);
        });
    }else{
        let noSpan = document.createElement("span");
        noSpan.innerText = "SEM INFORMAÇÕES";

        clientDataControl_contact.appendChild(noSpan);
    }

    if(clientObject.locality.length > 0){
        clientObject.locality.forEach((locality)=>{
            let localityData = document.createElement("span");
    
            localityData.innerText = locality;
    
            clientDataControl_locality.appendChild(localityData);
        })
    }else{
        let noSpan = document.createElement("span");
        noSpan.innerText = "SEM INFORMAÇÕES";

        clientDataControl_locality.appendChild(noSpan);
    }

    if(clientObject.equipaments.length > 0){
        clientObject.equipaments.forEach((equipament)=>{
            let equipamentData = document.createElement("div");
    
            equipamentData.className = "equipament-data";
            equipamentData.innerHTML = equipament;
    
            equipamentDataControl.appendChild(equipamentData);
        });
    }else{
        let noSpan = document.createElement("span");
        noSpan.innerText = "SEM INFORMAÇÕES";

        equipamentDataControl.appendChild(noSpan);
    }

    await showHtmlElement([resultConsultContainer], "flex");
}

async function displayConsultResultHtml_cnpjData(cnpj){
    const clientSearched = await getCNPJData(cnpj);

    const clientCompanyName = document.querySelector("#cnpj-cpf-result_client-company-name");
    const clientAddress = document.querySelector("#cnpj-cpf-result_client-address");
    const clientCep = document.querySelector("#cnpj-cpf-result_client-cep");
    const clientStatus = document.querySelector("#cnpj-cpf-result_client-cnpj-status");
    const clientStatusDate = document.querySelector("#cnpj-cpf-result_client-status-date")

    await clearHtmlElement([
        clientCompanyName,
        clientAddress,
        clientCep,
        clientStatus,
        clientStatusDate
    ])

    clientCompanyName.innerHTML = clientSearched.company_name;
    clientAddress.innerHTML = clientSearched.client_address;
    clientCep.innerHTML = clientSearched.cep;
    clientStatus.innerHTML = clientSearched.status;
    clientStatusDate.innerHTML = clientSearched.statusDateUpdate;

    await showHtmlElement([cnpjCpfResultContainer], "flex");

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

    let clientObject

    clients_equipaments_array.forEach((client)=>{
        if(client.name === consultClientInput.value){
            clientObject = client;
        }
    });

    await displayConsultResultHtml_clientAndEquipamentData(clientObject);

    if(clientObject.cnpj_cpf !== null && clientObject.cnpj_cpf.length > 11){
        await displayConsultResultHtml_cnpjData(clientObject.cnpj_cpf);
    }
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