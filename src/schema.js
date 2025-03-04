const { GraphQLObjectType, GraphQLSchema, GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } = require("graphql");
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
    addStatus: {
      type: StatusType,
      args: {
        NamaStatus: { type: GraphQLString },
      },
      resolve(_, { NamaStatus }) {
        return new Promise((resolve, reject) => {
          db.run("INSERT INTO Status (NamaStatus) VALUES (?)", [NamaStatus], function (err) {
            if (err) reject(err);
            resolve({ ID: this.lastID, NamaStatus });
          });
        });
      },
    },
    addEmergency: {
      type: EmergencyType,
      args: {
        EmergencyName: { type: GraphQLString },
      },
      resolve(_, { EmergencyName }) {
        return new Promise((resolve, reject) => {
          db.run("INSERT INTO Emergency (EmergencyName) VALUES (?)", [EmergencyName], function (err) {
            if (err) reject(err);
            resolve({ ID: this.lastID, EmergencyName });
          });
        });
      },
    },
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
              resolve({ ID: this.lastID, Status, Emergency, Title, Description, Date, IsResolved });
            }
          );
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
