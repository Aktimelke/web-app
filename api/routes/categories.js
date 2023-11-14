const router = require("express").Router();

const Category = require("../models/Category");



router.post("/", async (req, res) => {
  try {
    const newCat = new Category(req.body);
    const savedCat = await newCat.save();
    res.status(201).json(savedCat);
  } catch (err) {
    console.error("Error saving category:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.status(200).json(cats);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

module.exports = router;
