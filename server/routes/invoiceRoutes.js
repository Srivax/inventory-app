const express = require("express");
const router = express.Router();
const Invoice = require("../models/invoice");

// Create
router.post("/", async (req, res) => {
  try {
    let itemsWithTotal = req.body.items.map(i => ({
      ...i,
      total: i.qty * i.rate
    }));
    const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);
    const grand = subtotal - (Number(req.body.discount) || 0) + (Number(req.body.gst) || 0);

    const invoice = new Invoice({
      ...req.body,
      items: itemsWithTotal,
      grandTotal: grand
    });
    const saved = await invoice.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read
router.get("/", async (req, res) => {
  const invoices = await Invoice.find().populate("customer").populate("items.product");
  res.json(invoices);
});

// Update
router.put("/:id", async (req, res) => {
  try {
    let itemsWithTotal = req.body.items.map(i => ({
      ...i,
      total: i.qty * i.rate
    }));
    const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);
    const grand = subtotal - (Number(req.body.discount) || 0) + (Number(req.body.gst) || 0);

    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { ...req.body, items: itemsWithTotal, grandTotal: grand },
      { new: true }
    );
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: "Invoice deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
