const form = document.getElementById("transaction-form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const type = document.getElementById("type");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const transactionList = document.getElementById("transaction-list");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}

function addTransactionDOM(transaction) {

    const li = document.createElement("li");

    li.classList.add("transaction");
    li.classList.add(transaction.type);

    li.innerHTML = `
        <div>
            <h4>${transaction.text}</h4>
            <small>${transaction.category}</small>
        </div>

        <div>
            <strong>
                ${transaction.type === "income" ? "+" : "-"}
                ₹${transaction.amount}
            </strong>
        </div>

        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">
            Delete
        </button>
    `;

    transactionList.appendChild(li);
}

function updateValues() {

    const incomeAmount = transactions
        .filter(transaction => transaction.type === "income")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const expenseAmount = transactions
        .filter(transaction => transaction.type === "expense")
        .reduce((total, transaction) => total + transaction.amount, 0);

    const totalBalance = incomeAmount - expenseAmount;

    balance.innerText = `₹${totalBalance}`;
    income.innerText = `₹${incomeAmount}`;
    expense.innerText = `₹${expenseAmount}`;

    updateChart();
}

function addTransaction(e) {

    e.preventDefault();

    const transaction = {
        id: Date.now(),
        text: text.value,
        amount: Number(amount.value),
        category: category.value,
        type: type.value
    };

    transactions.push(transaction);

    saveTransactions();

    addTransactionDOM(transaction);

    updateValues();

    form.reset();
}

function deleteTransaction(id) {

    transactions = transactions.filter(transaction => transaction.id !== id);

    saveTransactions();

    init();
}

function init() {

    transactionList.innerHTML = "";

    transactions.forEach(addTransactionDOM);

    updateValues();
}

form.addEventListener("submit", addTransaction);

let chart;

function updateChart() {

    const categories = {};

    transactions
        .filter(transaction => transaction.type === "expense")
        .forEach(transaction => {

            if (categories[transaction.category]) {
                categories[transaction.category] += transaction.amount;
            } else {
                categories[transaction.category] = transaction.amount;
            }
        });

    const labels = Object.keys(categories);
    const data = Object.values(categories);

    const ctx = document.getElementById("expenseChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Expenses',
                data: data,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

init();