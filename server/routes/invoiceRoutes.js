const express = require("express");
const Invoice = require("../models/invoice");
const Customer = require("../models/customer");
const Transaction = require("../models/transaction");
const router = express.Router();

// list (populate customer + product names)
router.get("/", async (_req, res) => {
  const rows = await Invoice.find()
    .populate("customer", "name")
    .populate("items.product", "name")
    .sort({ createdAt: -1 });
  res.json(rows);
});

// create (compute totals, create transaction)
router.post("/", async (req, res) => {
  const { customer, items = [], discount = 0, gst = 0 } = req.body;
  if (!customer || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "customer & items required" });
  }
  const clean = items.map((it) => ({
    product: it.product,
    qty: Number(it.qty),
    rate: Number(it.rate),
    total: Number(it.qty) * Number(it.rate),
  }));
  const subtotal = clean.reduce((s, it) => s + it.total, 0);
  const grandTotal = subtotal - Number(discount || 0) + Number(gst || 0);

  const doc = await Invoice.create({
    customer,
    items: clean,
    discount: Number(discount || 0),
    gst: Number(gst || 0),
    grandTotal,
    date: new Date(),
  });

  const cust = await Customer.findById(customer).lean();
  await Transaction.create({
    date: doc.date,
    type: "Invoice",
    party: cust?.name || "Unknown",
    amount: grandTotal,
  });

  const saved = await Invoice.findById(doc._id)
    .populate("customer", "name")
    .populate("items.product", "name");
  res.status(201).json(saved);
});

// delete
router.delete("/:id", async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
