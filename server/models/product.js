const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  mrp: { type: Number, required: true },
  unit: { type: String, required: true }
});

module.exports = mongoose.model("Product", productSchema);
