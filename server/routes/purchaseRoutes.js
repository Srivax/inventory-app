const express = require("express");
const Purchase = require("../models/purchase");
const Supplier = require("../models/supplier");
const Transaction = require("../models/transaction");
const router = express.Router();

// list (populate supplier)
router.get("/", async (_req, res) => {
  const rows = await Purchase.find().populate("supplier", "name").sort({ createdAt: -1 });
  res.json(rows);
});

// create (compute totals, create transaction)
router.post("/", async (req, res) => {
  const { supplier, items = [] } = req.body;
  if (!supplier || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "supplier & items required" });
  }
  const clean = items.map((it) => ({
    product: it.product,
    qty: Number(it.qty),
    rate: Number(it.rate),
    total: Number(it.qty) * Number(it.rate),
  }));
  const totalAmount = clean.reduce((s, it) => s + it.total, 0);
  const doc = await Purchase.create({
    supplier,
    items: clean,
    totalAmount,
    status: "Received",
    date: new Date(),
  });
  const sup = await Supplier.findById(supplier).lean();
  await Transaction.create({
    date: doc.date,
    type: "Purchase",
    party: sup?.name || "Unknown",
    amount: totalAmount,
  });
  const saved = await Purchase.findById(doc._id).populate("supplier", "name");
  res.status(201).json(saved);
});

// delete
router.delete("/:id", async (req, res) => {
  await Purchase.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
