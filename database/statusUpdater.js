const db = require("../src/db");

const updateMaintenanceStatus = () => {
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  const sixHoursAgo = new Date();
  sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);

  const formatDateTime = (date) =>
    date.toISOString().replace("T", " ").substring(0, 19);

  db.serialize(() => {
    // Update 'Less Urgent' to 'Urgent' if older than 3 days
    db.run(
      `UPDATE MaintenanceRequest SET Status = 3 WHERE Status = 2 AND Date <= ?`,
      [formatDateTime(threeDaysAgo)],
      function (err) {
        if (err) console.error("Error updating Less Urgent:", err);
        else console.log(`Updated ${this.changes} Less Urgent requests.`);
      }
    );

    // Update 'Urgent' to 'Emergency' if older than 6 hours
    db.run(
      `UPDATE MaintenanceRequest SET Status = 4 WHERE Status = 3 AND Date <= ?`,
      [formatDateTime(sixHoursAgo)],
      function (err) {
        if (err) console.error("Error updating Urgent:", err);
        else console.log(`Updated ${this.changes} Urgent requests.`);
      }
    );
  });
};

module.exports = updateMaintenanceStatus;
