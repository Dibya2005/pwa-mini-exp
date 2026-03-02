// app.js

const expenses = [];
let nextId = 1;

// Function to create an expense
function createExpense(description, amount) {
    const expense = { id: nextId++, description, amount };
    expenses.push(expense);
    syncToServer(expense);
    return expense;
}

// Function to read all expenses
function readExpenses() {
    return expenses;
}

// Function to update an expense
function updateExpense(id, updatedData) {
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
        expenses[index] = { ...expenses[index], ...updatedData };
        syncToServer(expenses[index]);
        return expenses[index];
    } else {
        throw new Error('Expense not found');
    }
}

// Function to delete an expense
function deleteExpense(id) {
    const index = expenses.findIndex(exp => exp.id === id);
    if (index !== -1) {
        const [deletedExpense] = expenses.splice(index, 1);
        syncToServer(deletedExpense, 'DELETE');
        return deletedExpense;
    } else {
        throw new Error('Expense not found');
    }
}

// Function to sync expenses to the server
function syncToServer(expense, method = 'POST') {
    const url = 'https://yourserver.com/api/expenses';
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(expense)
    };

    fetch(url, options)
        .then(response => response.json())
        .then(data => console.log('Sync success:', data))
        .catch(error => console.error('Sync error:', error));
}