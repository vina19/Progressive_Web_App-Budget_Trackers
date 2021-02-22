// Create variable db to hold the db connection
let db;

// Open connection to the indexedDB and name the database as "budget"
// and set the version to 1.
const request = indexedDB.open("budget", 1);

// Create an object store inside the onupgradeneeded method.
request.onupgradeneeded = function(event) {
    
    // An object store called "pending" and set autoIncreament to true.
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

// If onupgradeneeded handler which create an object store finished or connected without errors,
// then trigger onsuccess method.
request.onsuccess = function(event) {

    // Set the result as the global variable db.
    db = event.target.result;

    // Check if app is online before reading from db.
    if (navigator.onLine) {
        // Calling the checkDatabase function.
        checkDatabase();
    };
};

// Error method handler if the request caused the error
request.onerror = function(event) {
    // log the error message
    console.log("Error occured:" + event.target.errorCode);
};

// Adding the record to the object store
function saveRecord(record) {
    // create a transaction on the pending db with readwrite access
  const transaction = db.transaction(["pending"], "readwrite");

  // access your pending object store
  const store = transaction.objectStore("pending");

  // add record to your store with add method.
  store.add(record);
};

