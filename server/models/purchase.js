const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true },
    rate: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Received"], default: "Pending" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
