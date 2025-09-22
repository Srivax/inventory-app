const express = require("express");
const Transaction = require("../models/transaction");
const router = express.Router();

router.get("/", async (_req, res) => {
  const rows = await Transaction.find({
    amount: { $gt: 0 },
    party: { $exists: true, $ne: "" },
  })
    .sort({ date: -1, createdAt: -1 })
    .lean();
  res.json(rows);
});

router.get("/summary", async (_req, res) => {
  const now = new Date();
  const startDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const dailyAgg = await Transaction.aggregate([
    { $match: { date: { $gte: startDay }, amount: { $gt: 0 } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const monthlyAgg = await Transaction.aggregate([
    { $match: { date: { $gte: startMonth }, amount: { $gt: 0 } } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  res.json({ daily: dailyAgg[0]?.total || 0, monthly: monthlyAgg[0]?.total || 0 });
});

module.exports = router;
