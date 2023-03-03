const express = require("express");
//import express-validator for server-side validation
const { validationResult } = require("express-validator");
const router = express.Router();
const { Show } = require("../models/index");

// GET all shows
router.get("/", async (req, res, next) => {
  try {
    const shows = await Show.findAll();
    res.json(shows);
  } catch (error) {
    next(error);
  }
});

// GET one show
router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const show = await Show.findByPk(id);
    if (show === null) {
      res.status(404).send("Show not found");
    } else {
      res.json(show);
    }
  } catch (error) {
    next(error);
  }
});

// GET shows of a particular genre
router.get("/genre/:genre", async (req, res, next) => {
  try {
    const genre = req.params.genre;
    const shows = await Show.findAll({
      where: { genre: genre },
    });
    res.json(shows);
  } catch (error) {
    next(error);
  }
});

// PUT update rating of a show that has been watched
router.put("/:id/rating", async (req, res, next) => {
  try {
    const id = req.params.id;
    const rating = req.body.rating;
    const show = await Show.findByPk(id);
    if (show === null) {
      res.status(404).send("Show not found");
    } else {
      await show.update({ rating: rating });
      res.json(show);
    }
  } catch (error) {
    next(error);
  }
});

// Route to update the status of a show
router.put(
  "/:id/status",
  [
    // Add validation rules using express-validator
    body("status")
      .trim()
      .notEmpty()
      .withMessage("Status cannot be empty")
      .isLength({ min: 5, max: 25 })
      .withMessage("Status must be between 5 and 25 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    try {
      const show = await Show.findOne({ where: { id } });

      if (!show) {
        return res.status(404).json({ error: "Show not found" });
      }

      // Update the status of the show
      show.status = status;
      await show.save();

      res.json(show);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE a show
router.delete("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const show = await Show.findByPk(id);
    if (show === null) {
      res.status(404).send("Show not found");
    } else {
      await show.destroy();
      res.send("Show deleted successfully");
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
