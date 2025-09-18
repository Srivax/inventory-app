const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplier");

// GET all suppliers
router.get("/", async (req, res) => {
  const suppliers = await Supplier.find();
  res.json(suppliers);
});

// POST add supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
