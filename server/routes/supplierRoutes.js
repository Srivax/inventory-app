const express = require("express");
const Supplier = require("../models/supplier");
const router = express.Router();

// create
router.post("/", async (req, res, next) => {
  try {
    const sup = await Supplier.create(req.body);
    res.json(sup);
  } catch (e) { next(e); }
});

// read
router.get("/", async (_req, res, next) => {
  try { res.json(await Supplier.find().sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});

// update
router.put("/:id", async (req, res, next) => {
  try {
    const sup = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(sup);
  } catch (e) { next(e); }
});

// delete
router.delete("/:id", async (req, res, next) => {
  try { await Supplier.findByIdAndDelete(req.params.id); res.json({ message: "Supplier deleted" }); }
  catch (e) { next(e); }
});

module.exports = router;
