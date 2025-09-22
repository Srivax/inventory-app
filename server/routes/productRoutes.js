const express = require("express");
const Product = require("../models/product");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try { res.json(await Product.create(req.body)); }
  catch (e) { next(e); }
});

router.get("/", async (_req, res, next) => {
  try { res.json(await Product.find().sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try { res.json(await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try { await Product.findByIdAndDelete(req.params.id); res.json({ message: "Product deleted" }); }
  catch (e) { next(e); }
});

module.exports = router;
