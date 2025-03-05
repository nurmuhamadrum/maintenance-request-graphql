const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema");
const updateMaintenanceStatus = require("../database/statusUpdater");

const app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);


// Run every hour (3600000 ms = 1 hour)
setInterval(updateMaintenanceStatus, 3600000);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/graphql`);
});
