const express = require("express");
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

// PUT update the status of a show
router.put("/:id/status", async (req, res, next) => {
  try {
    const id = req.params.id;
    const status = req.body.status;
    const show = await Show.findByPk(id);
    if (show === null) {
      res.status(404).send("Show not found");
    } else {
      await show.update({ status: status });
      res.json(show);
    }
  } catch (error) {
    next(error);
  }
});

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
