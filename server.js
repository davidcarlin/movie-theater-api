const express = require("express");
const app = express();

const { db } = require("./db");
const seed = require("./seed");

const PORT = process.env.PORT || 3000;

// Sync the database and start the server
db.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

// Seed the database when starting the server
seed()
  .then(() => {
    console.log("Database seeded successfully");
  })
  .catch((err) => {
    console.error("Error seeding database", err);
  });
