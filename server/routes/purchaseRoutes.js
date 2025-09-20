const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchase");
const Product = require("../models/product");

// GET all purchases
router.get("/", async (req, res) => {
  const purchases = await Purchase.find().populate("supplier product");
  res.json(purchases);
});

// POST create purchase order
router.post("/", async (req, res) => {
  try {
    const { supplier, product, qty, rate } = req.body;
    const total = qty * rate;
    const purchase = new Purchase({ supplier, product, qty, rate, total });
    const saved = await purchase.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT confirm GRN (mark as Received + update stock)
router.put("/:id/confirm", async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ error: "Not found" });

    if (purchase.status === "Received") {
      return res.status(400).json({ error: "Already confirmed" });
    }

    // update product stock
    const product = await Product.findById(purchase.product);
    if (product) {
      product.stock = (product.stock || 0) + purchase.qty;
      await product.save();
    }

    purchase.status = "Received";
    await purchase.save();

    res.json(purchase);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE purchase
router.delete("/:id", async (req, res) => {
  try {
    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: "Purchase deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;