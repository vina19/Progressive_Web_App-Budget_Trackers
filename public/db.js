// Create variable db to hold the db connection
let db;

// Open connection to the indexedDB and name the database as "budget"
// and set the version to 1.
const request = indexedDB.open("budget", 1);

// Create an object store inside the onupgradeneeded method.
request.onupgradeneeded = function (event) {
  // An object store called "pending" and set autoIncreament to true.
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

// If onupgradeneeded handler which create an object store finished or connected without errors,
// then trigger onsuccess method.
request.onsuccess = function (event) {
  // Set the result as the global variable db.
  db = event.target.result;

  // Check if app is online before reading from db.
  if (navigator.onLine) {
    // Calling the checkDatabase function.
    checkDatabase();
  }
};

// Error method handler if the request caused the error.
request.onerror = function (event) {
  // log the error message.
  console.log("Error occured:" + event.target.errorCode);
};

// Adding the transaction record to the object store "pending".
function saveRecord(record) {
  // create a transaction on the pending db with readwrite access.
  const transaction = db.transaction(["pending"], "readwrite");

  // access your pending object store.
  const store = transaction.objectStore("pending");

  // add record to your store with add method.
  store.add(record);
}

// Check the database and send all the database data to the "/api/transaction/bulk".
function checkDatabase() {
  // open a transaction on your pending db.
  const transaction = db.transaction(["pending"], "readwrite");

  // access your pending object store.
  const store = transaction.objectStore("pending");

  // get all records from store and set to a variable.
  const getAll = store.getAll();

  // Onsuccess handler if get all records finished without errors.
  getAll.onsuccess = function () {
    
    // if there are results in getting the records the POST the results to the api.
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then(() => {
          // if successful, open a transaction on your pending db.
          const transaction = db.transaction(["pending"], "readwrite");

          // access your pending object store.
          const store = transaction.objectStore("pending");

          // clear all items in your store.
          store.clear();
        });
    }
  };
};

// listen for app coming back online
window.addEventListener("online", checkDatabase);