const express = require("express");
const { db } = require("./db");
const seed = require("./seed");
const usersRouter = require("./routes/users");
const showsRouter = require("./routes/shows");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", usersRouter);
app.use("/shows", showsRouter);

db.sync({ force: true }).then(() => {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});

seed()
  .then(() => {
    console.log("Database seeded successfully");
  })
  .catch((err) => {
    console.error("Error seeding database", err);
  });
