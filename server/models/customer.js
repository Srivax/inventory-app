const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, lowercase: true, trim: true },
    phone: { type: String, unique: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
