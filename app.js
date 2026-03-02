// app.js - Updated Client-Side Code for Expense Tracking

class ExpenseTracker {
    constructor() {
        this.expenses = {};
        this.syncedWithServer = false;
    }

    addExpense(expense) {
        this.expenses[expense.id] = expense;
        this.syncWithServer();
    }

    updateExpense(updatedExpense) {
        if (this.expenses[updatedExpense.id]) {
            this.expenses[updatedExpense.id] = updatedExpense;
            this.syncWithServer();
        } else {
            this.displayError('Expense not found!');
        }
    }

    deleteExpense(id) {
        delete this.expenses[id];
        this.syncWithServer();
    }

    syncWithServer() {
        // Implement the sync logic here
        this.syncedWithServer = true; // Update status after syncing
    }

    displayError(message) {
        // Implement UI error display logic
        console.error(message);
        alert(message);
    }

    // Additional methods as required
}

const tracker = new ExpenseTracker();

// Example usage
tracker.addExpense({ id: '1', description: 'Lunch', amount: 10 });
tracker.updateExpense({ id: '1', description: 'Lunch with colleagues', amount: 15 });
tracker.deleteExpense('1');