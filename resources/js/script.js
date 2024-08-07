const form = document.getElementById("transactionForm")

form.addEventListener("submit", function (event) {
    event.preventDefault()
    if (form.transactionAmount.value > 0) {
        let transactionFormData = new FormData(form)
        let transactionObj = convertFormDataToTransactionObj(transactionFormData)
        saveTransactionObj(transactionObj)
        insertRowTransactionTable(transactionObj)
        form.reset()
    } else {
        alert("Estas ingresando un valor menor o igual a 0")
    }
})

function draw_category() {
    let allCategory = ["Comida", "Cuentas", "Diversión", "Facturas", "Trabajo", "Transporte", "Gastos imprevistos"]
    for (let index = 0; index < allCategory.length; index++) {
        insertCategory(allCategory[index])
    }
}

function insertCategory(categoryName) {
    const selectElement = document.getElementById("transactionCategory")
    let htmlToInsert = `<option> ${categoryName}</option>`
    selectElement.insertAdjacentHTML("beforeend", htmlToInsert)
}

document.addEventListener("DOMContentLoaded", function (event) {
    draw_category()
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    transactionObjArr.forEach(function (arrayElement) {
        insertRowTransactionTable(arrayElement)
    })
})

function getNewTransactionId() {
    let lastTransactionId = localStorage.getItem("lastTransactionId") || "-1"
    let newTransactionId = JSON.parse(lastTransactionId) + 1
    localStorage.setItem("lastTransactionId", JSON.stringify(newTransactionId))
    return newTransactionId
}


function convertFormDataToTransactionObj(transactionFormData) {
    let tsType = transactionFormData.get("transactionType")
    let tsAmount = transactionFormData.get("transactionAmount")
    let tsDescription = transactionFormData.get("transactionDescription")
    let tsCategory = transactionFormData.get("transactionCategory")
    let tsId = getNewTransactionId()
    return {
        "transactionType": tsType,
        "transactionAmount": tsAmount,
        "transactionDescription": tsDescription,
        "transactionCategory": tsCategory,
        "transactionId": tsId
    }
}

function insertRowTransactionTable(transactionObj) {
    let transactionTableRef = document.getElementById("transactionTable")

    let newTransactionRowRef = transactionTableRef.insertRow(-1)
    newTransactionRowRef.setAttribute("data-transaction-id", transactionObj["transactionId"])

    let newTypeCellRef = newTransactionRowRef.insertCell(0)
    newTypeCellRef.textContent = transactionObj["transactionType"]

    newTypeCellRef = newTransactionRowRef.insertCell(1)
    newTypeCellRef.textContent = transactionObj["transactionDescription"]

    newTypeCellRef = newTransactionRowRef.insertCell(2)
    newTypeCellRef.textContent = transactionObj["transactionAmount"]

    newTypeCellRef = newTransactionRowRef.insertCell(3)
    newTypeCellRef.textContent = transactionObj["transactionCategory"]

    let newDeleteCell = newTransactionRowRef.insertCell(4)
    let deleteButton = document.createElement("button")
    deleteButton.textContent = "Eliminar"
    newDeleteCell.appendChild(deleteButton)

    deleteButton.addEventListener("click", (event) => {
        let transactionRow = event.target.parentNode.parentNode
        let transactionId = transactionRow.getAttribute("data-transaction-id")
        transactionRow.remove()
        deleteTransactionObj(transactionId)
        console.log(transactionRow.getAttribute("data-transaction-id"))
    })
}
//Le paso como argumento el transactionId de la transacción que quiero eliminar
function deleteTransactionObj(transactionId) {
    //Obtengo lo que tengo en mi "base de datos" (Desconvierto de JSON a objeto)
    let transactionObjArr = JSON.parse(localStorage.getItem("transactionData"))
    //Busco el indice / la posición de la transacción que quiero eliminar
    let transactionIndexInArray = transactionObjArr.findIndex(element => element.transactionId == transactionId)
    //Elimino el elemento de esa posición
    transactionObjArr.splice(transactionIndexInArray, 1)
    //Convierto de objeto a JSON
    let transactionArrayJSON = JSON.stringify(transactionObjArr)
    //Guardo mi array de transacción en formato JSON en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON)
}

function saveTransactionObj(transactionObj) {
    let storedData = localStorage.getItem("transactionData");
    let myTransactionArray = storedData ? JSON.parse(storedData) : [];

    // Ensure myTransactionArray is an array
    if (!Array.isArray(myTransactionArray)) {
        myTransactionArray = [];
    }
    myTransactionArray.push(transactionObj);
    //Convierto mi array de transacción a JSON
    let transactionArrayJSON = JSON.stringify(myTransactionArray)
    //Guardo mi array de transacción en formato JSON en el local storage
    localStorage.setItem("transactionData", transactionArrayJSON)
}