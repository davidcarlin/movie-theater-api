// Import required modules
const express = require("express");
const { User, Show } = require("../models");
const router = express.Router();

// Users

// GET all users
router.get("/users", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

// GET one user
router.get("/users/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user);
});

// GET all shows watched by a user
router.get("/users/:id/shows", async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    include: [{ model: Show }],
  });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json(user.shows);
});

// PUT update and add a show if a user has watched it
router.put("/users/:id/shows", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  const { title, genre, rating, status } = req.body;
  const [show, created] = await Show.findOrCreate({
    where: { title },
    defaults: { genre, rating, status },
  });
  await user.addShow(show);
  res.json({ show, created });
});

// Shows

// GET all shows
router.get("/shows", async (req, res) => {
  const shows = await Show.findAll();
  res.json(shows);
});

// GET one show
router.get("/shows/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (!show) {
    return res.status(404).json({ error: "Show not found" });
  }
  res.json(show);
});

// GET shows of a particular genre
router.get("/shows/genre/:genre", async (req, res) => {
  const shows = await Show.findAll({
    where: { genre: req.params.genre },
  });
  res.json(shows);
});

// PUT update rating of a show that has been watched
router.put("/shows/:id/rating", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (!show) {
    return res.status(404).json({ error: "Show not found" });
  }
  const { rating } = req.body;
  await show.update({ rating });
  res.json(show);
});

// PUT update the status of a show
router.put("/shows/:id/status", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (!show) {
    return res.status(404).json({ error: "Show not found" });
  }
  const { status } = req.body;
  await show.update({ status });
  res.json(show);
});

// DELETE a show
router.delete("/shows/:id", async (req, res) => {
  const show = await Show.findByPk(req.params.id);
  if (!show) {
    return res.status(404).json({ error: "Show not found" });
  }
  await show.destroy();
  res.json({ success: true });
});

// Export router
module.exports = router;
