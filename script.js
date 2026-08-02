let editIndex=-1;
let transactions = [];
const transactionbtn=document.querySelector(".transaction");
const modal=document.querySelector(".transaction-detail");
const addbtn=document.querySelector(".btn1");
const cancelbtn=document.querySelector(".btn2");
const title= document.getElementById("title1");
const amount=document.getElementById("amt");
const selector=document.getElementById("selection");
const date=document.getElementById("dates");
const amount_type=document.querySelectorAll('input[name="amttype"]')
const incomeCard = document.getElementById("income");
const expenseCard = document.getElementById("expense");
const balanceCard = document.getElementById("balance");
const savingsCard = document.getElementById("savings");
const searchInput=document.getElementById("search");
const filterSelect = document.getElementById("filter");
const sortFilter = document.getElementById("sortFilter");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("themeToggle");

transactionbtn.addEventListener("click",function(){
    modal.style.display="flex";

});

cancelbtn.addEventListener("click", function () {

    modal.style.display = "none";

    clearForm();

    editIndex = -1;
    addbtn.textContent = "Add";

});

addbtn.addEventListener("click", function () {

    let transactionType = "";

    amount_type.forEach(function (radio) {
        if (radio.checked) {
            transactionType = radio.value;
        }
    });

    if (
        title.value.trim() === "" ||
        amount.value === "" ||
        date.value === "" ||
        transactionType === ""
    ) {
        showToast("Please fill all fields", "error");
        return;
    }

    const transaction = {
    id: editIndex === -1 ? Date.now() : transactions[editIndex].id,
    title: title.value,
    amount: Number(amount.value),
    category: selector.value,
    date: date.value,
    typeofamount: transactionType
};

    
    if (editIndex === -1) {
    transactions.push(transaction);
    showToast("Transaction Added Successfully", "success");
} else {
    transactions[editIndex] = transaction;
    showToast("Transaction Updated Successfully", "success");
}

    editIndex = -1;

    addbtn.textContent = "Add";

    saveTransactions();

    applyFilters();

    updateDashboard();

    clearForm();

   modal.style.display = "none"; 

});


function clearForm() {

    title.value = "";
    amount.value = "";
    date.value = "";
    selector.selectedIndex = 0;

    amount_type.forEach(function (radio) {
        radio.checked = false;
    });

}

function renderTransactions(list = transactions) {

    const transactionContainer = document.querySelector(".detailoftransaction");

    transactionContainer.innerHTML = "";
    if (list.length === 0) {

    transactionContainer.innerHTML = `
        <div id="emptyState">
       
            <h2> No Transactions Yet</h2>
            <p>Click "Add Transaction" to get started.</p>
      
        </div>
    `;

    return;
}

   list.forEach(function (transaction) {
        
        const transactionCard = document.createElement("div");

        transactionCard.classList.add("transaction-card");

        transactionCard.innerHTML = `
            <h3>${transaction.title}</h3>
            <p>Amount : ₹${transaction.amount}</p>
            <p>Category : ${transaction.category}</p>
            <p>Date : ${transaction.date}</p>
            <p>Type : ${transaction.typeofamount}</p>

            <button class="edit-btn" data-id="${transaction.id}">
                    Edit
            </button>

          <button class="delete-btn" data-id="${transaction.id}">
                  Delete
         </button>
        `;

        transactionContainer.appendChild(transactionCard);

    });

}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("delete-btn")) {

        const id = Number(event.target.dataset.id);

transactions = transactions.filter(function (transaction) {
    return transaction.id !== id;
    });
        saveTransactions();

        applyFilters();
        updateDashboard();
        showToast("Transaction Deleted Successfully", "success");

    }

});



function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadTransactions() {

    const savedTransactions = localStorage.getItem("transactions");

    if (savedTransactions) {
        transactions = JSON.parse(savedTransactions);
        applyFilters();
    }

}

loadTransactions();
updateDashboard();

function updateDashboard(){
    let totalIncome=0;
    let totalExpense=0;

    transactions.forEach(function (transaction){
        if (transaction.typeofamount==="Income"){
           totalIncome +=transaction.amount;

        }
        else{
            totalExpense+=transaction.amount;
            

        }

        });

    const balance = totalIncome - totalExpense;
    const savings = balance;

    incomeCard.textContent = `₹${totalIncome}`;
    expenseCard.textContent = `₹${totalExpense}`;
    balanceCard.textContent = `₹${balance}`;
    savingsCard.textContent = `₹${savings}`;


    
}

document.addEventListener("click", function (event) {

    if (event.target.classList.contains("edit-btn")) {

        modal.style.display = "flex";

        const id = Number(event.target.dataset.id);

const transaction = transactions.find(function (transaction) {
    return transaction.id === id;
});

        title.value = transaction.title;
        amount.value = transaction.amount;
        selector.value = transaction.category;
        date.value = transaction.date;

        amount_type.forEach(function (radio) {
            radio.checked = (radio.value === transaction.typeofamount);
        });

        editIndex = transactions.findIndex(function (transaction) {
    return transaction.id === id;
});
        addbtn.textContent = "Update";
    }

});


searchInput.addEventListener("input", function(){

    applyFilters();

});

filterSelect.addEventListener("change", function(){

    applyFilters();

});


function applyFilters() {

    let filteredTransactions = [...transactions];

    const searchText = searchInput.value.toLowerCase();

    if (searchText !== "") {

        filteredTransactions = filteredTransactions.filter(function(transaction){

            return (
                transaction.title.toLowerCase().includes(searchText) ||
                transaction.category.toLowerCase().includes(searchText)
            );

        });

    }

    const selectedCategory = filterSelect.value;

    if (selectedCategory !== "All") {

        filteredTransactions = filteredTransactions.filter(function(transaction){

            return transaction.category === selectedCategory;

        });

    }
    const sortValue = sortFilter.value;

if (sortValue === "amount-high") {

    filteredTransactions.sort(function (a, b) {
        return b.amount - a.amount;
    });

}

else if (sortValue === "amount-low") {

    filteredTransactions.sort(function (a, b) {
        return a.amount - b.amount;
    });

}

else if (sortValue === "date-new") {

    filteredTransactions.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

}

else if (sortValue === "date-old") {

    filteredTransactions.sort(function (a, b) {
        return new Date(a.date) - new Date(b.date);
    });

}

    renderTransactions(filteredTransactions);

}

sortFilter.addEventListener("change", function () {
    applyFilters();
});

function showToast(message, type) {

    toast.textContent = message;

    toast.className = "";

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
    }, 3000);

}

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
    }

});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}