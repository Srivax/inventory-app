import { useState, useEffect } from "react";
import axios from "axios";

export default function InvoiceForm({ onSaved, editingInvoice, clearEdit }) {
  const [form, setForm] = useState({
    customer: "",
    items: [],
    discount: "",
    gst: "",
    product: "",
    qty: "",
    rate: ""
  });

  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/customers").then(res => setCustomers(res.data));
    axios.get("http://localhost:5000/api/products").then(res => setProducts(res.data));
  }, []);

  useEffect(() => {
    if (editingInvoice) {
      setForm({ ...editingInvoice, product: "", qty: "", rate: "" });
    }
  }, [editingInvoice]);

  function addItem() {
    if (!form.product || !form.qty || !form.rate) return;
    const newItem = {
      product: form.product,
      qty: Number(form.qty),
      rate: Number(form.rate),
      total: Number(form.qty) * Number(form.rate)
    };
    setForm({
      ...form,
      items: [...form.items, newItem],
      product: "",
      qty: "",
      rate: ""
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const itemsWithTotal = form.items.map(i => ({
      ...i,
      total: i.qty * i.rate
    }));

    const subtotal = itemsWithTotal.reduce((sum, i) => sum + i.total, 0);
    const grand = subtotal - (Number(form.discount) || 0) + (Number(form.gst) || 0);

    const payload = { ...form, items: itemsWithTotal, grandTotal: grand };

    try {
      if (editingInvoice?._id) {
        await axios.put(`http://localhost:5000/api/invoices/${editingInvoice._id}`, payload);
      } else {
        await axios.post("http://localhost:5000/api/invoices", payload);
      }
      onSaved();
      setForm({ customer: "", items: [], discount: "", gst: "", product: "", qty: "", rate: "" });
      clearEdit();
    } catch (err) {
      console.error("Save Invoice error:", err.response?.data || err.message);
    }
  }

  const subtotal = form.items.reduce((sum, i) => sum + (i.total || 0), 0);
  const grandTotal = subtotal - (Number(form.discount) || 0) + (Number(form.gst) || 0);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-3">{editingInvoice ? "Edit Invoice" : "New Invoice"}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={form.customer}
          onChange={(e) => setForm({ ...form, customer: e.target.value })}
          className="border p-2 w-full"
          required
        >
          <option value="">Select Customer</option>
          {customers.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>

        <div className="flex space-x-2">
          <select
            value={form.product}
            onChange={(e) => setForm({ ...form, product: e.target.value })}
            className="border p-2 flex-1"
          >
            <option value="">Select Product</option>
            {products.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>
          <input
            type="number"
            placeholder="Qty"
            value={form.qty}
            onChange={(e) => setForm({ ...form, qty: e.target.value })}
            className="border p-2 w-20"
          />
          <input
            type="number"
            placeholder="Rate"
            value={form.rate}
            onChange={(e) => setForm({ ...form, rate: e.target.value })}
            className="border p-2 w-24"
          />
          <button type="button" onClick={addItem} className="bg-blue-500 text-white px-3 rounded">+ Add Item</button>
        </div>

        <ul className="list-disc pl-5">
          {form.items.map((i, idx) => (
            <li key={idx}>
              {products.find(p => p._id === i.product)?.name || "Unknown"} – {i.qty} × {i.rate} = {i.total}
            </li>
          ))}
        </ul>

        <input
          type="number"
          placeholder="Discount"
          value={form.discount}
          onChange={(e) => setForm({ ...form, discount: e.target.value })}
          className="border p-2 w-full"
          min="0"
        />
        <input
          type="number"
          placeholder="GST"
          value={form.gst}
          onChange={(e) => setForm({ ...form, gst: e.target.value })}
          className="border p-2 w-full"
          min="0"
        />

        <p className="font-bold">Subtotal: {subtotal}</p>
        <p className="font-bold">Grand Total: {grandTotal}</p>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {editingInvoice ? "Update Invoice" : "Save Invoice"}
        </button>
      </form>
    </div>
  );
}
