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

// elements
const consultInventoryBtn = document.querySelector("#consult-inventory-btn");
const inventoryShowBtn = document.querySelector("#inventory-show-btn");
const editInventoryShowBtn = document.querySelector("#edit-inventory-show-btn");

const backMainHubBtn = document.querySelectorAll(".back-main-hub-btn");
const consultInventorySection = document.querySelector(".consult-inventory-section");
const inventoryShowSection = document.querySelector(".inventory-show-section");
const editInventorySection = document.querySelector(".edit-inventory-show-section");   

// functions

async function backHomeProcess(){
    await hideHtmlElement([consultInventorySection, inventoryShowSection, editInventorySection]);
}

// event listerners and booting

backMainHubBtn.forEach(async (button)=>{
    button.addEventListener("click", async ()=>{
        backHomeProcess();
    });
});

consultInventoryBtn.addEventListener("click", async ()=>{
    await hideHtmlElement([inventoryShowSection, editInventorySection]);

    await showHtmlElement([consultInventorySection], "block")
});

inventoryShowBtn.addEventListener("click", async ()=>{
    await hideHtmlElement([consultInventorySection, editInventorySection]);

    await showHtmlElement([inventoryShowSection], "block")
})

editInventoryShowBtn.addEventListener("click", async ()=>{
    await hideHtmlElement([consultInventorySection, inventoryShowSection]);

    await showHtmlElement([editInventorySection], "block");
})

