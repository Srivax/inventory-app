const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, required: true },
      rate: { type: Number, required: true },
      total: { type: Number, required: true }
    }
  ],
  discount: { type: Number, default: 0 },
  gst: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Invoice", invoiceSchema);
