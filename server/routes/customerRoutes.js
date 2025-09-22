const express = require("express");
const Customer = require("../models/customer");
const router = express.Router();

router.post("/", async (req, res, next) => {
  try { res.json(await Customer.create(req.body)); }
  catch (e) { next(e); }
});

router.get("/", async (_req, res, next) => {
  try { res.json(await Customer.find().sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});

router.put("/:id", async (req, res, next) => {
  try { res.json(await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (e) { next(e); }
});

router.delete("/:id", async (req, res, next) => {
  try { await Customer.findByIdAndDelete(req.params.id); res.json({ message: "Customer deleted" }); }
  catch (e) { next(e); }
});

module.exports = router;
