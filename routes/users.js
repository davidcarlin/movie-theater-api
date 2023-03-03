const express = require("express");
const { User } = require("../models");
const router = express.Router();

// GET all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// GET one user
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

// GET all shows watched by a user (user id in req.params)
router.get("/:id/shows", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { include: "shows" });
    if (user) {
      res.json(user.shows);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

// PUT update and add a show if a user has watched it
router.put("/:id/shows", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const { showId } = req.body;
      const show = await Show.findByPk(showId);
      if (show) {
        await user.addShow(show);
        res.json({
          message: `Show ${show.title} added to user ${user.username}`,
        });
      } else {
        res.status(404).json({ message: "Show not found" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
