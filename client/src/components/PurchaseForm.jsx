import { useEffect, useState } from "react";
import axios from "axios";

export default function PurchaseForm({ onSaved }) {
  const [form, setForm] = useState({ supplier: "", product: "", qty: "", rate: "" });
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadSuppliers();
    loadProducts();
  }, []);

  async function loadSuppliers() {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  }

  async function loadProducts() {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/purchases", form);
    onSaved();
    setForm({ supplier: "", product: "", qty: "", rate: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Create Purchase Order</h2>

      <select
        name="supplier"
        value={form.supplier}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      >
        <option value="">Select Supplier</option>
        {suppliers.map((s) => (
          <option key={s._id} value={s._id}>{s.name}</option>
        ))}
      </select>

      <select
        name="product"
        value={form.product}
        onChange={handleChange}
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>{p.name}</option>
        ))}
      </select>

      <input
        type="number"
        name="qty"
        value={form.qty}
        onChange={handleChange}
        placeholder="Quantity"
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />

      <input
        type="number"
        name="rate"
        value={form.rate}
        onChange={handleChange}
        placeholder="Rate"
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded"
      />

      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition">
        Create PO
      </button>
    </form>
  );
}

