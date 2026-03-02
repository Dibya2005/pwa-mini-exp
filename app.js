// app.js

// Function to initialize local storage and sync with server
function init() {
    const data = loadFromLocalStorage();
    // Syncing with the server to get the latest data
    fetch('https://example.com/api/data/')
        .then(response => response.json())
        .then(serverData => {
            // Properly mapping server IDs
            serverData.forEach(item => {
                if (!data.some(localItem => localItem.id === item.id)) {
                    data.push(item);
                }
            });
            saveToLocalStorage(data);
            renderData(data);
        })
        .catch(err => console.error('Error syncing with server:', err));
}

// CRUD Function to add item
function addItem(newItem) {
    const data = loadFromLocalStorage();
    // Ensuring that IDs are generated and tracked properly
    newItem.id = generateNewId();
    data.push(newItem);
    saveToLocalStorage(data);
    syncWithServer(newItem, 'add');
    renderData(data);
}

// Function to edit an existing item
function editItem(updatedItem) {
    let data = loadFromLocalStorage();
    const index = data.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        data[index] = updatedItem;
        saveToLocalStorage(data);
        syncWithServer(updatedItem, 'edit');
        renderData(data);
    } else {
        console.error('Item not found for editing');
    }
}

// Function to delete an item
function deleteItem(itemId) {
    let data = loadFromLocalStorage();
    const index = data.findIndex(item => item.id === itemId);
    if (index !== -1) {
        const removedItem = data.splice(index, 1);
        saveToLocalStorage(data);
        syncWithServer(removedItem, 'delete');
        renderData(data);
    } else {
        console.error('Item not found for deletion');
    }
}

// Syncing changes with server
function syncWithServer(item, action) {
    fetch(`https://example.com/api/data/${action}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
    })
    .then(response => response.json())
    .then(data => console.log('Server response:', data))
    .catch(error => console.error('Error:', error));
}

// Placeholder function to load data from local storage
function loadFromLocalStorage() {
    return JSON.parse(localStorage.getItem('data')) || [];
}

// Placeholder function to save data to local storage
function saveToLocalStorage(data) {
    localStorage.setItem('data', JSON.stringify(data));
}

// Function to render data (placeholder implementation)
function renderData(data) {
    console.log('Rendering data:', data);
}

// Function to generate new unique IDs
function generateNewId() {
    return Math.floor(Math.random() * 1000000);
}

// Initialize the application
init();