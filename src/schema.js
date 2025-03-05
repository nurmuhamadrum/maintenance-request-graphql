const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLNonNull,
} = require("graphql");
const db = require("./db");

// Tipe Status
const StatusType = new GraphQLObjectType({
  name: "Status",
  fields: {
    ID: { type: GraphQLInt },
    NamaStatus: { type: GraphQLString },
  },
});

// Tipe Emergency
const EmergencyType = new GraphQLObjectType({
  name: "Emergency",
  fields: {
    ID: { type: GraphQLInt },
    EmergencyName: { type: GraphQLString },
  },
});

// Tipe Maintenance Request
const MaintenanceRequestType = new GraphQLObjectType({
  name: "MaintenanceRequest",
  fields: {
    ID: { type: GraphQLInt },
    Status: { type: GraphQLInt },
    Emergency: { type: GraphQLInt },
    Title: { type: GraphQLString },
    Description: { type: GraphQLString },
    Date: { type: GraphQLString },
    IsResolved: { type: GraphQLBoolean },
  },
});

// Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    statuses: {
      type: new GraphQLList(StatusType),
      resolve(_, args) {
        return new Promise((resolve, reject) => {
          db.all("SELECT * FROM Status", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
    },
    emergencies: {
      type: new GraphQLList(EmergencyType),
      resolve(_, args) {
        return new Promise((resolve, reject) => {
          db.all("SELECT * FROM Emergency", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
    },
    maintenanceRequests: {
      type: new GraphQLList(MaintenanceRequestType),
      resolve(_, args) {
        return new Promise((resolve, reject) => {
          db.all("SELECT * FROM MaintenanceRequest", [], (err, rows) => {
            if (err) reject(err);
            resolve(rows);
          });
        });
      },
    },
  },
});

// Mutasi
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    // add status
    addStatus: {
      type: StatusType,
      args: {
        NamaStatus: { type: GraphQLString },
      },
      resolve(_, { NamaStatus }) {
        return new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO Status (NamaStatus) VALUES (?)",
            [NamaStatus],
            function (err) {
              if (err) reject(err);
              resolve({ ID: this.lastID, NamaStatus });
            }
          );
        });
      },
    },
    // update status
    updateStatus: {
      type: StatusType,
      args: {
        ID: { type: GraphQLInt },
        NamaStatus: { type: GraphQLString },
      },
      resolve(_, { ID, NamaStatus }) {
        return new Promise((resolve, reject) => {
          db.run(
            "UPDATE Status SET NamaStatus = ? WHERE ID = ?",
            [NamaStatus, ID],
            function (err) {
              if (err) reject(err);
              resolve({ ID, NamaStatus });
            }
          );
        });
      },
    },

    // delete status
    deleteStatus: {
      type: GraphQLString,
      args: {
        ID: { type: GraphQLInt },
      },
      resolve(_, { ID }) {
        return new Promise((resolve, reject) => {
          db.run("DELETE FROM Status WHERE ID = ?", [ID], function (err) {
            if (err) reject(err);
            resolve(`Status with ID ${ID} deleted successfully`);
          });
        });
      },
    },

    // add emergency
    addEmergency: {
      type: EmergencyType,
      args: {
        EmergencyName: { type: GraphQLString },
      },
      resolve(_, { EmergencyName }) {
        return new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO Emergency (EmergencyName) VALUES (?)",
            [EmergencyName],
            function (err) {
              if (err) reject(err);
              resolve({ ID: this.lastID, EmergencyName });
            }
          );
        });
      },
    },

    // update emergency
    updateEmergency: {
      type: EmergencyType,
      args: {
        ID: { type: GraphQLInt },
        EmergencyName: { type: GraphQLString },
      },
      resolve(_, { ID, EmergencyName }) {
        return new Promise((resolve, reject) => {
          db.run(
            "UPDATE Emergency SET EmergencyName = ? WHERE ID = ?",
            [EmergencyName, ID],
            function (err) {
              if (err) reject(err);
              resolve({ ID, EmergencyName });
            }
          );
        });
      },
    },

    // delete emergency
    deleteEmergency: {
      type: GraphQLString, // Assuming you want to return a confirmation message or ID of the deleted emergency
      args: {
        id: { type: GraphQLInt }, // Assuming 'id' is the identifier of the emergency to be deleted
      },
      resolve(_, { id }) {
        return new Promise((resolve, reject) => {
          db.run("DELETE FROM Emergency WHERE ID = ?", [id], function (err) {
            if (err) reject(err);
            resolve(`Emergency with ID ${id} deleted successfully.`);
          });
        });
      },
    },

    // add maintenance request
    addMaintenanceRequest: {
      type: MaintenanceRequestType,
      args: {
        Status: { type: GraphQLInt },
        Emergency: { type: GraphQLInt },
        Title: { type: GraphQLString },
        Description: { type: GraphQLString },
        Date: { type: GraphQLString },
        IsResolved: { type: GraphQLBoolean },
      },
      resolve(_, { Status, Emergency, Title, Description, Date, IsResolved }) {
        return new Promise((resolve, reject) => {
          db.run(
            "INSERT INTO MaintenanceRequest (Status, Emergency, Title, Description, Date, IsResolved) VALUES (?, ?, ?, ?, ?, ?)",
            [Status, Emergency, Title, Description, Date, IsResolved],
            function (err) {
              if (err) reject(err);
              resolve({
                ID: this.lastID,
                Status,
                Emergency,
                Title,
                Description,
                Date,
                IsResolved,
              });
            }
          );
        });
      },
    },

    // delete maintenance request by id
    deleteMaintenanceRequest: {
      type: GraphQLString,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(_, { id }) {
        return new Promise((resolve, reject) => {
          db.run(
            "DELETE FROM MaintenanceRequest WHERE ID = ?",
            [id],
            function (err) {
              if (err) {
                reject(err);
              } else if (this.changes === 0) {
                resolve(`No maintenance request found with ID ${id}.`);
              } else {
                resolve(
                  `Maintenance request with ID ${id} deleted successfully.`
                );
              }
            }
          );
        });
      },
    },
    
    // delete multiple maintenance id
    deleteMultipleMaintenanceRequests: {
      type: GraphQLString, // Returns a success message
      args: {
        ids: { type: new GraphQLList(GraphQLInt) }, // Accepts an array of IDs
      },
      resolve(_, { ids }) {
        return new Promise((resolve, reject) => {
          if (!ids || ids.length === 0) {
            return reject(new Error("No IDs provided for deletion."));
          }

          // Construct a dynamic query with placeholders
          const placeholders = ids.map(() => "?").join(", ");
          const query = `DELETE FROM MaintenanceRequest WHERE ID IN (${placeholders})`;

          db.run(query, ids, function (err) {
            if (err) {
              reject(err);
            } else if (this.changes === 0) {
              resolve(`No maintenance requests found for the given IDs.`);
            } else {
              resolve(
                `Successfully deleted ${this.changes} maintenance requests.`
              );
            }
          });
        });
      },
    },
    
    // update maintenance request
    updateMaintenanceRequest: {
      type: MaintenanceRequestType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
        Status: { type: GraphQLInt },
        Emergency: { type: GraphQLInt },
        Title: { type: GraphQLString },
        Description: { type: GraphQLString },
        Date: { type: GraphQLString },
        IsResolved: { type: GraphQLBoolean },
      },
      resolve(
        _,
        { id, Status, Emergency, Title, Description, Date, IsResolved }
      ) {
        return new Promise((resolve, reject) => {
          db.get(
            "SELECT * FROM MaintenanceRequest WHERE ID = ?",
            [id],
            (err, row) => {
              if (err) return reject(err);
              if (!row) return resolve(null);

              // Prepare the updated data, keeping old values if new ones are not provided
              const updatedData = {
                Status: Status !== undefined ? Status : row.Status,
                Emergency: Emergency !== undefined ? Emergency : row.Emergency,
                Title: Title !== undefined ? Title : row.Title,
                Description:
                  Description !== undefined ? Description : row.Description,
                Date: Date !== undefined ? Date : row.Date,
                IsResolved:
                  IsResolved !== undefined ? IsResolved : row.IsResolved,
              };

              // Execute update query
              db.run(
                "UPDATE MaintenanceRequest SET Status = ?, Emergency = ?, Title = ?, Description = ?, Date = ?, IsResolved = ? WHERE ID = ?",
                [
                  updatedData.Status,
                  updatedData.Emergency,
                  updatedData.Title,
                  updatedData.Description,
                  updatedData.Date,
                  updatedData.IsResolved,
                  id,
                ],
                function (err) {
                  if (err) return reject(err);
                  resolve({
                    ID: id,
                    ...updatedData,
                  });
                }
              );
            }
          );
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
