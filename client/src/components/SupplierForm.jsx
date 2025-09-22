import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierForm({ refresh, setRefresh }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type !== "supplier") return;
      const s = e.detail.data;
      setRecordId(s._id);
      setForm({ name: s.name || "", email: s.email || "", phone: s.phone || "" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("edit-entity", handler);
    return () => window.removeEventListener("edit-entity", handler);
  }, []);

  const onChange = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const reset = () => { setRecordId(null); setForm({ name: "", email: "", phone: "" }); };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return alert("Name and Phone are required.");
    if (recordId) {
      await axios.put(`http://localhost:5000/api/suppliers/${recordId}`, form);
    } else {
      await axios.post("http://localhost:5000/api/suppliers", form);
    }
    reset();
    setRefresh(!refresh);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg mb-6 border border-blue-200">
      <h2 className="text-lg font-bold text-blue-700 mb-4">{recordId ? "✏️ Edit Supplier" : "➕ Add New Supplier"}</h2>
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-400" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          {recordId && <button type="button" onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg">{recordId ? "Update Supplier" : "Save Supplier"}</button>
        </div>
      </form>
    </div>
  );
}
