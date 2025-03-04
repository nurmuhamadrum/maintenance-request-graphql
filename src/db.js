const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./database/database.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Status (ID INTEGER PRIMARY KEY, NamaStatus TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS Emergency (ID INTEGER PRIMARY KEY, EmergencyName TEXT)`);
  db.run(`CREATE TABLE IF NOT EXISTS MaintenanceRequest (
      ID INTEGER PRIMARY KEY,
      Status INTEGER,
      Emergency INTEGER,
      Title TEXT,
      Description TEXT,
      Date TEXT,
      IsResolved BOOLEAN,
      FOREIGN KEY(Status) REFERENCES Status(ID),
      FOREIGN KEY(Emergency) REFERENCES Emergency(ID)
  )`);
});

module.exports = db;
