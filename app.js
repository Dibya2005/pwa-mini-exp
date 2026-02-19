const form = document.getElementById("expenseForm");
const list = document.getElementById("list");
const balanceEl = document.getElementById("balance");
const incomeEl = document.getElementById("income");
const expenseEl = document.getElementById("expense");
const filter = document.getElementById("filter");

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

/* -------------------
   LOCAL STORAGE
-------------------- */
function updateLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

/* -------------------
   UPDATE UI
-------------------- */
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

/* -------------------
   ADD EXPENSE
-------------------- */
form.addEventListener("submit", e => {
  e.preventDefault();

  const newExpense = {
    description: descriptionInput.value,
    amount: +amountInput.value,
    type: typeInput.value,
    category: categoryInput.value,
    synced: false   // track sync status
  };

  expenses.push(newExpense);
  updateLocalStorage();
  updateUI();

  if (navigator.onLine) {
    syncToServer(newExpense);
  }

  form.reset();
});

/* -------------------
   DELETE
-------------------- */
function deleteExpense(index) {
  expenses.splice(index, 1);
  updateLocalStorage();
  updateUI();
  fetch(`server/api.php?id=${index}`, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => console.log(data));
}

/* -------------------
   EDIT
-------------------- */
function editExpense(index) {
  const item = expenses[index];

  descriptionInput.value = item.description;
  amountInput.value = item.amount;
  typeInput.value = item.type;
  categoryInput.value = item.category;

  deleteExpense(index);
}

/* -------------------
   FILTER
-------------------- */
filter.addEventListener("change", updateUI);

updateUI();

/* -------------------
   SERVICE WORKER
-------------------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker Registered"));
}

/* -------------------
   SERVER SYNC
-------------------- */
function syncToServer(expense) {
  fetch("server/api.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Synced:", data);
      expense.synced = true;
      updateLocalStorage();
    })
    .catch(err => console.log("Sync failed", err));
}

/* -------------------
   AUTO SYNC WHEN ONLINE
-------------------- */
window.addEventListener("online", () => {
  expenses
    .filter(exp => !exp.synced)
    .forEach(exp => syncToServer(exp));
});
