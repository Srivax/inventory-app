require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

const supplierRoutes = require("./routes/supplierRoutes");
app.use("/api/suppliers", supplierRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);

const purchaseRoutes = require("./routes/purchaseRoutes");
app.use("/api/purchases", purchaseRoutes);

const customerRoutes = require("./routes/customerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");

app.use("/api/customers", customerRoutes);
app.use("/api/invoices", invoiceRoutes);







mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ Mongo Error:", err.message));

app.get("/api", (req, res) => {
  res.send("Inventory App Backend Running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
