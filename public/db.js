// Create variable db to hold the db connection
let db;

// Open connection to the indexedDB and name the database as "budget"
// and set the version to 1
const request = indexedDB.open("budget", 1);