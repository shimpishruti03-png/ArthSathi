
const isDarkMode = document.body.classList.contains("dark-mode");

const textColor = isDarkMode ? "#ffffff" : "#333333";
const gridColor = isDarkMode ? "#555555" : "#dddddd";

const transactions = JSON.parse(localStorage.getItem("transactions")) || [];
const expenseData = {};

transactions.forEach(function(transaction){

    if(transaction.typeofamount === "Expense"){

        if(expenseData[transaction.category]){
            expenseData[transaction.category] += transaction.amount;
        }
        else{
            expenseData[transaction.category] = transaction.amount;
        }

    }

});

const categoryCtx = document.getElementById("categoryChart");

new Chart(categoryCtx,{

    type:"bar",

    data:{

        labels:Object.keys(expenseData),

        datasets:[{

            label:"Expense",

            data:Object.values(expenseData),

            backgroundColor:[
                "#082570",
                "#070ad1",
                "#3B82F6",
                "#b458ff",
                "#8e44ef",
                "#cbb5ff",
                "#ddccf8"
            ],

            borderRadius:10

        }]

    },

    options:{

        indexAxis:"y",

        responsive:true,

        maintainAspectRatio:false,

        plugins:{
            legend:{
                display:false
            }
        },

        scales:{
            x:{
                beginAtZero:true
            }
        }

    }

    

});


// monthy expense

const monthlyExpense = {};

transactions.forEach(function (transaction) {

    if (transaction.typeofamount === "Expense") {

        const month = transaction.date.slice(0, 7);

        if (monthlyExpense[month]) {
            monthlyExpense[month] += transaction.amount;
        } else {
            monthlyExpense[month] = transaction.amount;
        }

    }

});

const monthlyCtx = document.getElementById("monthlyChart");

new Chart(monthlyCtx, {

    type: "line",

    data: {

        labels: Object.keys(monthlyExpense),

        datasets: [{

            label: "Expenses",

            data: Object.values(monthlyExpense),

            borderColor: "#6366F1",

            backgroundColor: "rgba(99,102,241,0.15)",

            fill: true,

            tension: 0.4,

            pointRadius: 6,

            pointHoverRadius: 8,

            pointBackgroundColor: "#6366F1"

        }]

    },

    options: {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            }

        },

        scales: {

            y: {
                beginAtZero: true
            }

        }

    }

});



//income vs expense

let totalIncome = 0;
let totalExpense = 0;

transactions.forEach(function (transaction) {

    if (transaction.typeofamount === "Income") {
        totalIncome += transaction.amount;
    } else {
        totalExpense += transaction.amount;
    }

});

const incomeExpenseCtx = document.getElementById("incomeExpenseChart");

new Chart(incomeExpenseCtx, {

    type: "doughnut",

    data: {

        labels: ["Income", "Expense"],

        datasets: [{

            data: [totalIncome, totalExpense],

            backgroundColor: [
                "#082db1",
                "#8aa7ff"
            ],

            borderWidth: 2,
            hoverOffset: 20

        }]

    },

    options: {

        responsive: true,
        maintainAspectRatio: false,

        cutout: "70%",

        plugins: {

            legend: {

                position: "bottom",

                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle"
                }

            }

        },

        animation: {
            animateRotate: true,
            animateScale: true
        }

    }

});


// spending patterns

const categoryExpense = {};

transactions.forEach(function(transaction){

    if(transaction.typeofamount === "Expense"){

        if(categoryExpense[transaction.category]){
            categoryExpense[transaction.category] += transaction.amount;
        }
        else{
            categoryExpense[transaction.category] = transaction.amount;
        }

    }

});

const spendingCtx = document.getElementById("spendingChart");

new Chart(spendingCtx,{

    type:"radar",

    data:{
        labels:Object.keys(categoryExpense),

        datasets:[{
            label:"Expenses",
            data:Object.values(categoryExpense),
            backgroundColor:"rgba(78,115,223,0.2)",
            borderColor:"#4e73df",
            borderWidth:2,
            pointBackgroundColor:"#4e73df"
        }]
    },

    options:{
        responsive:true,
        maintainAspectRatio:false,
        scales:{
            r:{
                beginAtZero:true
            }
        }
    }

});