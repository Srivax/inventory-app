import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductForm({ refresh, setRefresh }) {
  const [form, setForm] = useState({ name: "", mrp: "", unit: "" });
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type !== "product") return;
      const p = e.detail.data;
      setRecordId(p._id);
      setForm({ name: p.name || "", mrp: String(p.mrp ?? ""), unit: p.unit || "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("edit-entity", handler);
    return () => window.removeEventListener("edit-entity", handler);
  }, []);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const reset = () => { setRecordId(null); setForm({ name: "", mrp: "", unit: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.unit.trim() || !form.mrp) return alert("Name, Unit, and MRP are required.");
    const payload = { name: form.name, unit: form.unit, mrp: Number(form.mrp) };
    if (recordId) {
      await axios.put(`http://localhost:5000/api/products/${recordId}`, payload);
    } else {
      await axios.post("http://localhost:5000/api/products", payload);
    }
    reset();
    setRefresh(!refresh);
  };

  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl shadow-lg mb-6 border border-green-200">
      <h2 className="text-lg font-bold text-green-700 mb-4">{recordId ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Product Name <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-green-400" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">MRP <span className="text-red-500">*</span></label>
          <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-green-400" value={form.mrp} onChange={(e) => onChange("mrp", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Unit (kg, litre, bag) <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-green-400" value={form.unit} onChange={(e) => onChange("unit", e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          {recordId && <button type="button" onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-lg">{recordId ? "Update Product" : "Save Product"}</button>
        </div>
      </form>
    </div>
  );
}
