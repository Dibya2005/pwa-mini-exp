const form = document.getElementById("expenseForm");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const filter = document.getElementById("filter");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function updateLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateUI() {
  list.innerHTML = "";

  let income = 0;
  let expense = 0;

  expenses
    .filter(item => filter.value === "all" || item.type === filter.value)
    .forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.description} (₹${item.amount})
        <div>
          <button onclick="editExpense(${index})">Edit</button>
          <button onclick="deleteExpense(${index})">X</button>
        </div>
      `;
      list.appendChild(li);

      if (item.type === "income") income += item.amount;
      else expense += item.amount;
    });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;
}

form.addEventListener("submit", e => {
  e.preventDefault();

  const newExpense = {
    description: description.value,
    amount: +amount.value,
    type: type.value,
    category: category.value
  };

  expenses.push(newExpense);
  updateLocalStorage();
  updateUI();
  form.reset();
});

function deleteExpense(index) {
  expenses.splice(index, 1);
  updateLocalStorage();
  updateUI();
}

function editExpense(index) {
  const item = expenses[index];
  description.value = item.description;
  amount.value = item.amount;
  type.value = item.type;
  category.value = item.category;

  deleteExpense(index);
}

filter.addEventListener("change", updateUI);

updateUI();
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}
function syncToServer(expense) {
  fetch("backend/add_expense.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  });
}

window.addEventListener("online", () => {
  expenses.forEach(exp => syncToServer(exp));
});

