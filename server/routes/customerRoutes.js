const express = require("express");
const router = express.Router();
const Customer = require("../models/customer");

router.post("/", async (req, res) => {
  const customer = new Customer(req.body);
  const saved = await customer.save();
  res.json(saved);
});

router.get("/", async (req, res) => {
  const customers = await Customer.find();
  res.json(customers);
});

router.put("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(customer);
});

router.delete("/:id", async (req, res) => {
  await Customer.findByIdAndDelete(req.params.id);
  res.json({ message: "Customer deleted" });
});

module.exports = router;
