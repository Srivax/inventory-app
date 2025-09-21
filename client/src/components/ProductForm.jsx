import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductForm({ onSaved, editingProduct, clearEdit }) {
  const [form, setForm] = useState({ name: "", mrp: "", unit: "" });

  useEffect(() => {
    if (editingProduct) setForm(editingProduct);
  }, [editingProduct]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingProduct?._id) {
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, form);
    } else {
      await axios.post("http://localhost:5000/api/products", form);
    }
    onSaved();
    setForm({ name: "", mrp: "", unit: "" });
    clearEdit();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editingProduct ? "Edit Product" : "Add Product"}</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" required className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"/>
      <input type="number" name="mrp" value={form.mrp} onChange={handleChange} placeholder="MRP" required className="w-full p-2 mb-3 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"/>
      <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit (kg, litre, bag)" required className="w-full p-2 mb-4 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"/>

      <div className="flex gap-3">
        {!editingProduct && (
          <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700">Save</button>
        )}
        {editingProduct && (
          <>
            <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">Update</button>
            <button type="button" onClick={clearEdit} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
          </>
        )}
      </div>
    </form>
  );
}
