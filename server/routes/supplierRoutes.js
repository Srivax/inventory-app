const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplier");

// GET all suppliers
router.get("/", async (_req, res) => {
  const suppliers = await Supplier.find().sort({ createdAt: -1 });
  res.json(suppliers);
});

// POST create supplier
router.post("/", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    const saved = await supplier.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update supplier
router.put("/:id", async (req, res) => {
  try {
    const updated = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supplier
router.delete("/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: "Supplier deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
