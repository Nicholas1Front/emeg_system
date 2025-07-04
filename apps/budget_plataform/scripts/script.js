// server status and get-clients-equipaments data

// elements
const serverOverlay = document.querySelector(".server-overlay");
const serverErrorMsg = document.querySelector("#server-error-msg");

async function getServerStatus(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com`);
        if(!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let serverStatus = await response.json();

        console.log(serverStatus);

        return serverStatus;
    }
    catch(error){
        console.error(`Failed to load json : ${error}`);
    }    
}

async function verifyServerStatus(){
    await showHtmlElement([loadingOverlay], "flex");
    const serverStatusObject = await getServerStatus();
    let serverStatus = true;

    serverErrorMsg.innerText = "";

    if(!serverStatusObject.server || !serverStatusObject.env || serverStatusObject.dropboxAccess == false){
        serverStatus = false;
    }

    for ( key in serverStatusObject.archives){
        if(serverStatusObject.archives[key] === false){
            serverStatus = false;
        }
    }

    if(!serverStatus){
        await hideHtmlElement([loadingOverlay]); 
        serverErrorMsg.innerText = serverStatusObject;
        await showHtmlElement([serverOverlay], "flex");
        return;
    }else{
        clients_equipaments_array = await getClientsData();
        await hideHtmlElement([loadingOverlay]);
        await showServerMessagePopup("sucessMsg", "Servidor funcionando corretamente !");
        await getBudgetLatestNumber()
    }
}
/* 
document.addEventListener("DOMContentLoaded", async()=>{
    await verifyServerStatus();
}); */

let clients_equipaments_array = []

// clients_equipaments.json
async function getClientsData(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com/get-clients-equipaments`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        const clients = await response.json();

        return clients;
    }

    catch(error){
        console.log(`Failed to load json : ${error}`);
    }
}

// message popup

async function showMessagePopup(message , messageType ){
    msgSpan.innerHTML = "";
    msgSpan.innerText = message;

    if(messageType === "errorMsg"){
        msgControl.style.backgroundColor = "#d61e1e";//red color
        msgControl.style.color = "white"; 
        closeMsgBtn.style.color = "white";
    }
    if (messageType === "adviceMsg"){
        msgControl.style.backgroundColor = "#fcba03";  //yellow color
        msgControl.style.color = "black";
        closeMsgBtn.style.color = "black";
    }
    if(messageType === "sucessMsg"){
        msgControl.style.backgroundColor = "#42f55a" //green color
        msgControl.style.color = "white";
        closeMsgBtn.style.color = "white";
    }

    showHtmlElement([msgControl],"block");
    msgControl.style.transition = "0.5s";
    msgControl.style.marginTop = "37%";

    setTimeout(() => {
        closeMessagePopup();
    }, 6000);

}

async function closeMessagePopup(){
    msgControl.style.marginTop = "43%";
    msgControl.style.transition = "0.5s";
    hideHtmlElement([msgControl]);
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
});

// show or hide html element

async function showHtmlElement([...elements], displayType){
    elements.forEach((element) =>{
        element.style.display = `${displayType}`;
    })
}

async function hideHtmlElement([...elements]){
    elements.forEach((element) =>{
        element.style.display = "none";
    })
}


// clear html element

// elements

const allInputs = document.querySelectorAll("input");

async function clearHtmlElement([...elements]){
    elements.forEach((element)=>{
        element.innerHTML = "";
    }) 
}

// upperCase inputs
async function upperCaseInputs() {
    allInputs.forEach((input)=>{
        input.addEventListener("input", ()=>{
            let start = input.selectionStart;
            let end = input.selectionEnd;

            input.value = input.value.toUpperCase();

            input.setSelectionRange(start, end);
        })
    })
}

upperCaseInputs();

// validate only numbers 

function validateOnlyNumbers(param){
    return param.replace(/[^0-9,-]/g,"")
}

// clear inputs
async function clearInputs([...inputs]){
    inputs.forEach((input)=>{
        input.value = "";
    })
}


// javascript date to brasil date

function JsDate_to_BrDate(){
    let date = dateInput.value;

    let dateArray = date.split("-");

    let newDate = `${dateArray[2]}/${dateArray[1]}/${dateArray[0]}`;

    return newDate;    
}

// brasil date to javascript date

function brDate_to_JsDate(dateElement){
    let dateString = dateElement.replace(/\//g,"-"); // all occurrences of the bar
    let dateArray = dateString.split("-");
    dateString = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`

    return dateString;
}

// format to currency

//elements
const BRL = value => currency(value, { symbol: "R$ ", decimal: ",", separator: ".", precision: 2 });

async function currencyToNumber(currencyValue){
    if(currencyValue === undefined || currencyValue === NaN){
        currencyValue = 0;
    }

    currencyValue = BRL(currencyValue);

    let numberInString = currencyValue.value.toString();
    numberInString = numberInString.replace(".",",");

    console.log(numberInString);

    return numberInString
}

async function numberToCurrency(numberValue){

    if(numberValue === undefined ||numberValue === NaN || numberValue === ""){
        numberValue = 0;
    };

    numberValue = await BRL(numberValue).format();

    console.log(numberValue);

    return numberValue;
}

//budget-production

//header

//elements
const budgetProduction = document.querySelector("#budget-production");
const msgControl = document.querySelector(".msg-control");
const closeMsgBtn = document.querySelector("#close-msg-btn");
const msgSpan = document.querySelector(".msg-span");

const clientInput = document.querySelector("#client-input");
const clientInputOptionsControl = document.querySelector(".client-input-options-control");
const equipamentInput = document.querySelector("#equipament-input");
const equipamentInputOptionsControl = document.querySelector(".equipament-input-options-control");
const notIdentifiedInput = document.querySelector("#not-identified-input");
const dateInput = document.querySelector("#date-input");
const completionDeadlineInput = document.querySelector("#completion-deadline-input");
const paymentTermsInput = document.querySelector("#payment-terms-input");
const guaranteeInput = document.querySelector("#guarantee-input");
const nextStepContainer = document.querySelector(".next-step-container");
const infosNextStepBtn = document.querySelector("#infos-next-step-btn");

//functions

async function createClientInputSuggestions(
    inputClient,
    optionsControl,
    itemClassName
){
    optionsControl.innerHTML = "";

    let notIdentifiedClient = document.createElement("div");

    notIdentifiedClient.className = "client-input-option";
    notIdentifiedClient.innerHTML = "(NÃO IDENTIFICADO)";
    optionsControl.appendChild(notIdentifiedClient);

    console.log(clients_equipaments_array);

    let itensSearched = [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name.includes(inputClient.value)){
            itensSearched.push(client.name);
        }
    });

    if(itensSearched.length === 0 || inputClient.value === ""){
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl]);
        return;
    }

    itensSearched.forEach((client)=>{
        let clientOption = document.createElement("div");

        clientOption.className = `${itemClassName}`;
        clientOption.innerHTML = client;

        optionsControl.appendChild(clientOption);
    });

    optionItem = document.querySelectorAll(`.${itemClassName}`);

    optionItem.forEach((option)=>{
        option.addEventListener("click", ()=>{
            inputClient.value = option.innerHTML;

            optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
        })
    });

    showHtmlElement([optionsControl], "block");

    document.addEventListener("click", async()=>{
        optionsControl.innerHTML = "";
        await hideHtmlElement([optionsControl]);
    })

}

async function createEquipamentsInputSuggestions(
    inputEquipament,
    optionsControl,
    itemClassName
){
    optionsControl.innerHTML = "";

    let allEquipaments= [];

    clients_equipaments_array.forEach((client)=>{
        if(client.name === clientInput.value){
            client.equipaments.forEach((equipament)=>{
                allEquipaments.push(equipament);
            })
        }
    });

    let itensSearched = [];

    allEquipaments.forEach((equipament)=>{
        if(equipament.includes(inputEquipament.value)){
            itensSearched.push(equipament);
        }
    });

    console.log(itensSearched);

    if(itensSearched.length === 0 || inputEquipament.value === ""){
        optionsControl.innerHTML = "";
        hideHtmlElement([optionsControl])
        return;
    };

    itensSearched.forEach((equipament)=>{
        let equipamentOption = document.createElement("div");

        equipamentOption.className = `${itemClassName}`;
        equipamentOption.innerHTML = equipament;

        optionsControl.appendChild(equipamentOption);
    });

    optionItem = document.querySelectorAll(`.${itemClassName}`);

    optionItem.forEach((option)=>{
        option.addEventListener("click", ()=>{
            inputEquipament.value = option.innerText;

            optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
        })
    });

    showHtmlElement([optionsControl], "block");

    document.addEventListener("click", ()=>{
        optionsControl.innerHTML = "";

            hideHtmlElement([optionsControl]);
    })
}

//event listeners

clientInput.addEventListener("input", ()=>{
    createClientInputSuggestions(
        clientInput,
        clientInputOptionsControl,
        "client-input-option"
    );
});

equipamentInput.addEventListener("input", ()=>{
    createEquipamentsInputSuggestions(
        equipamentInput,
        equipamentInputOptionsControl,
        "equipament-input-option"
    );
})

closeMsgBtn.addEventListener("click", ()=>{
    closeMessagePopup();
});

// items-section

// elements
const itemsSection = document.querySelector(".items-section");
const itemsInputContainer = itemsSection.querySelector(".items-input-container");
const itemControl = itemsSection.querySelector(".item-control");
let allUnitValueInputs;

// functions

async function handleUnitValueInputs_itemsSection(){
    let allUnitValueInputs = itemsSection.querySelectorAll(".item-unit-value-input");

    console.log(allUnitValueInputs);

    /* for(i = 0; i < allUnitValueInputs.length; i++){
        let actualInput = allUnitValueInputs[i];
        let cloneInput = actualInput.cloneNode(true);

        actualInput.parentNode.replaceChild(cloneInput, actualInput); // replaces the actual input with a clone input
    } */

    for(let i=0; i < allUnitValueInputs.length; i++){
        allUnitValueInputs[i].addEventListener("focusin", async()=>{
            console.log(allUnitValueInputs[i].value);
            allUnitValueInputs[i].value = await currencyToNumber(allUnitValueInputs[i].value);
        });

        allUnitValueInputs[i].addEventListener("focusout", async()=>{
            allUnitValueInputs[i].value = await numberToCurrency(allUnitValueInputs[i].value);
        });
    }

    /* setTimeout(()=>{
        for(i=0; i < allUnitValueInputs.length; i++){
            allUnitValueInputs[i].addEventListener("focusin", async()=>{
                allUnitValueInputs[i].value = await numberToCurrency(allUnitValueInputs[i].value);
            });

            allUnitValueInputs[i].addEventListener("focusout", async()=>{
                allUnitValueInputs[i].value = await currencyToNumber(allUnitValueInputs[i].value);
            });
        }
    },200) */
}

// event listeners and booting

handleUnitValueInputs_itemsSection();

//total-budget-prod-section

//elements
const totalBudgetProdSection = document.querySelector(".total-budget-prod-section");

// observations-section

//elements

const observationsSection = document.querySelector(".observations-section");
const observationsTextarea = document.querySelector("#observations-textarea");

// loading screen

//elements
const loadingOverlay = document.querySelector(".loading-overlay");

// confirmation popup

// elements
const confirmationOverlay = document.querySelector(".confirmation-overlay");
const closeConfirmationPopupBtn = document.querySelector("#close-confirmation-popup-btn");
const confirmationPasswordInput = document.querySelector("#confirmation-password-input");
const wrongPasswordSpan = document.querySelector(".wrong-password-span");
const confirmationPopupBtn = document.querySelector("#confirmation-popup-btn");
const confirmationPassword = "88320940";

async function showConfirmationPopup(){
    confirmationOverlay.style.display = "flex";
    budgetProduction.style.filter = "blur(9px)";
    wrongPasswordSpan.style.display = "none";
}

async function closeConfirmationPopup(){
    confirmationOverlay.style.display="none";
    budgetProduction.style.filter = "blur(0)"
}

async function confirmationProcess(){
    await showConfirmationPopup();

    confirmationPopupBtn.addEventListener("click",async ()=>{
        if(confirmationPasswordInput.value === confirmationPassword){
            await displayBudgetNumber();
            await closeConfirmationPopup();
            await sendToServerProcess();
            await displayBudgetProcess();
        }else{
            wrongPasswordSpan.style.display = "block";
        
            setTimeout(()=>{
                wrongPasswordSpan.style.display = "none";
            },10000);

            confirmationPasswordInput.addEventListener("focus",()=>{
                wrongPasswordSpan.style.display = "none";
            })

            return;
        }
    })

    confirmationPasswordInput.addEventListener("keypress", async (event)=>{
        if(event.key === "Enter"){
            if(confirmationPasswordInput.value === confirmationPassword){
                await displayBudgetNumber();
                await closeConfirmationPopup();
                await sendToServerProcess();
                await displayBudgetProcess();
                
            }else{
                wrongPasswordSpan.style.display = "block";
            
                setTimeout(()=>{
                    wrongPasswordSpan.style.display = "none";
                },10000);
    
                confirmationPasswordInput.addEventListener("focus",()=>{
                    wrongPasswordSpan.style.display = "none";
                })
    
                return;
            }
        }
    })
}

// event listerners

closeConfirmationPopupBtn.addEventListener("click",async ()=>{
    await closeConfirmationPopup();
})

//generate budget section

//elements
const generateBudgetSection = document.querySelector(".generate-budget-section");
const generateBudgetBtn = document.querySelector("#generate-budget-btn");
let latest_budget_number = {
    latestNumber : null
};

// functions

async function getBudgetLatestNumber(){
    try{
        const response = await fetch(`https://emeg-system.onrender.com/get-latest-budget-number`);

        if (!response.ok){
            throw new Error(`HTTP Error ! Status : ${response.status}`);
        }

        let number = await response.json();

        console.log(number);

        return number;
    }catch(error){
        console.error(error);
    }
}

async function updateBudgetNumberData(){
    try {
        let number = budgetNumberSpan.innerText;

        latest_budget_number.latestNumber = number; 

        const response = await fetch('https://emeg-system.onrender.com/update-latest-budget-number', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latest_budget_number }),
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
    await showHtmlElement([loadingOverlay], "flex");

    const response = await updateBudgetNumberData();

    if(!response){
        await hideHtmlElement([loadingOverlay]);
        await showServerMessagePopup("errorMsg", "Erro ao enviar os dados ! Tente novamente !");
        return;
    }

    await hideHtmlElement([loadingOverlay]);
    await showServerMessagePopup("sucessMsg","Dados enviados com sucesso !");

    await showMessagePopup("Dados atualizados com sucesso !","sucessMsg");
}

async function displayBudgetNumber(){
    let number = await getBudgetLatestNumber();
    number = parseInt(number.latest_budget_number.latestNumber) + 1;
    let year = new Date().getFullYear();

    budgetNumberSpan.innerHTML = `${number}`;
    budgetYearSpan.innerHTML = `${year}`;

}

//budget finished 

//elements
const budgetFinished = document.querySelector("#budget-finished");
const budgetFinishedContent = document.querySelector(".budget-finished-content-container");

const clientSpanResult = document.querySelector("#client-span-result");
const equipamentSpanResult = document.querySelector("#equipament-span-result");
const budgetNumberSpan = document.querySelector("#budget-number-span");
const budgetYearSpan = document.querySelector("#budget-year-span");
const paymentTermsSpanResult = document.querySelector("#payment-terms-span-result");
const completionDeadlineSpanResult = document.querySelector("#completion-deadline-span-result");
const guaranteeSpanResult = document.querySelector("#guarantee-span-result");
const dateSpanResult = document.querySelector("#date-span-result");

const totalOfPartsSpan = document.querySelector(".total-of-parts-span");
const totalOfServicesSpan = document.querySelector(".total-of-services-span");
const totalOfBudgetSpan = document.querySelector(".total-of-budget-span");

const observationsMadeSpan = document.querySelector(".observations-made-span");

const savePdfBtn = document.querySelector("#save-document-pdf-btn");
const saveHtmlBtn = document.querySelector("#save-document-html-btn");
const backBudgetBtn = document.querySelector("#back-budget-btn");

//functions

async function addHeaderFinishedProcess(){
    clearHtmlElement([
        clientSpanResult,
        equipamentSpanResult,
        paymentTermsSpanResult,
        guaranteeSpanResult,
        dateSpanResult,
        completionDeadlineSpanResult
    ])

    clientSpanResult.innerText = clientInput.value;

    if(clientInput.value === "(NÃO IDENTIFICADO)"){
        equipamentSpanResult.innerText = notIdentifiedInput.value;
    }else{
        equipamentSpanResult.innerText = equipamentInput.value;
    }

    paymentTermsSpanResult.innerText = paymentTermsInput.value;
    completionDeadlineSpanResult.innerText = completionDeadlineInput.value;
    guaranteeSpanResult.innerText = guaranteeInput.value;
    dateSpanResult.innerText = JsDate_to_BrDate();

    if(paymentTermsSpanResult.innerText === ""){
        paymentTermsSpanResult.innerText = "###"
    }

    if(guaranteeSpanResult.innerText === ""){
        guaranteeSpanResult.innerText = "###"
    }

    if(completionDeadlineSpanResult.innerText === ""){
        completionDeadlineSpanResult.innerText = "###"
    }

    if(dateSpanResult.innerText === "undefined/undefined/"){
        dateSpanResult.innerText = "###"
    }

    document.querySelector("title").textContent = `ORÇAMENTO ${budgetNumberSpan.innerText}${budgetYearSpan.innerText} ${clientSpanResult.innerText} ${equipamentSpanResult.innerText}`;
}

async function addObservationsFinishedProcess(){
    observationsMadeSpan.innerHTML = "";

    if(observationsTextarea.value === ""){
        observationsMadeSpan.innerText = "SEM OBSERVAÇÕES !";
        return;
    }

    observationsMadeSpan.innerText = observationsTextarea.value;
}

async function displayBudgetProcess(){
    //show budget finished and hide budget production
    await showHtmlElement([budgetFinished],"block");
    await hideHtmlElement([budgetProduction])
    //display header informations
    
    await addHeaderFinishedProcess();

    await addObservationsFinishedProcess();
}

function saveAsHtml(){
    let budgetNameArchive = `ORÇAMENTO ${budgetNumberSpan.innerText}${budgetYearSpan.innerText} ${clientSpanResult.innerText} ${equipamentSpanResult.innerText}`

    const blob = new Blob([document.documentElement.outerHTML], { type: 'text/html' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${budgetNameArchive} .html`;
    link.click();
}

function backHomeProcess(){
    clientInput.value = clientSpanResult.innerText;

    if(clientSpanResult.innerText === "(NÃO IDENTIFICADO)"){
        showHtmlElement([notIdentifiedInput], "block");
        hideHtmlElement([equipamentInput]);

        notIdentifiedInput.value = equipamentSpanResult.innerText;
    }

    if(clientSpanResult.innerText !== "(NÃO IDENTIFICADO)"){
        showHtmlElement([equipamentInput], "block");
        hideHtmlElement([notIdentifiedInput]);

        equipamentInput.value  = equipamentSpanResult.innerText
    }

    paymentTermsInput.value = paymentTermsSpanResult.innerText;
    completionDeadlineInput.value = completionDeadlineSpanResult.innerText;
    guaranteeInput.value = guaranteeSpanResult.innerText;

    if(dateSpanResult.innerText !== "###"){
        dateInput.value = brDate_to_JsDate(dateSpanResult.innerText);
    }else{
        dateInput.value = "";
    }
    
    if(paymentTermsInput.value === "###"){
        paymentTermsInput.value = "";
    }

    if(completionDeadlineInput.value === "###"){
        completionDeadlineInput.value = "";
    }

    if(guaranteeInput.value === "###"){
        guaranteeInput.value = "";
    }

    showHtmlElement([budgetProduction],"block");
    hideHtmlElement([budgetFinished]);
    document.querySelector("title").textContent = "Criar orçamento EMEG";
}


//event listerner

generateBudgetBtn.addEventListener("click", async ()=>{
    if(clientInput.value === ""){
        await showMessagePopup("Insira o cliente antes de prosseguir !","errorMsg");
        return;
    }

    if(budgetNumberSpan.innerText === ""){
        await confirmationProcess();
        return;
    }

    await displayBudgetProcess();
})

saveHtmlBtn.addEventListener("click", ()=>{
    saveAsHtml();
})   

savePdfBtn.addEventListener("click", ()=>{
    window.print();
})

backBudgetBtn.addEventListener("click", ()=>{
    backHomeProcess();
})