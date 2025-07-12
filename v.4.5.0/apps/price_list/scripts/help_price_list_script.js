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

// back main hub process

async function backMainHubProcess(){
    const allBackMainHubBtn = document.querySelectorAll(".back-main-hub-btn");

    allBackMainHubBtn.forEach((btn)=>{
        btn.addEventListener("click", async ()=>{
            const titleSection = document.querySelector(".title-section");
            const introductionSection = document.querySelector(".introduction-usage-system-section");
            const mainHubSection = document.querySelector(".main-hub-section");

            const consultItemPriceListSection = document.querySelector(".consult-item-price-list-section");
            const wholePriceListSection = document.querySelector(".whole-price-list-section");
            const editPriceListSection = document.querySelector(".edit-price-list-section");

            await hideHtmlElement([consultItemPriceListSection, wholePriceListSection,editPriceListSection]);

            await showHtmlElement([titleSection,introductionSection,mainHubSection],"flex");
        })
    })
}

backMainHubProcess();

// main-hub-section

async function mainHubButtonsProcess(){
    const consultItemPriceListBtn = document.querySelector("#consult-item-price-list-btn");
    const wholePriceListBtn = document.querySelector("#whole-price-list-btn");
    const editPriceListBtn = document.querySelector("#edit-price-list-btn");

    const consultItemPriceListSection = document.querySelector(".consult-item-price-list-section");
    const wholePriceListSection = document.querySelector(".whole-price-list-section");
    const editPriceListSection = document.querySelector(".edit-price-list-section");

    consultItemPriceListBtn.addEventListener("click", async ()=>{
        await showHtmlElement([consultItemPriceListSection],"block");
    })

    wholePriceListBtn.addEventListener("click", async ()=>{
        await showHtmlElement([wholePriceListSection],"block");
    })
    
    editPriceListBtn.addEventListener("click", async ()=>{
        await showHtmlElement([editPriceListSection],"block");
    })
}

mainHubButtonsProcess();