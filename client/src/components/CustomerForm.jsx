import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerForm({ refresh, setRefresh }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type !== "customer") return;
      const c = e.detail.data;
      setRecordId(c._id);
      setForm({ name: c.name || "", email: c.email || "", phone: c.phone || "" });
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
      await axios.put(`http://localhost:5000/api/customers/${recordId}`, form);
    } else {
      await axios.post("http://localhost:5000/api/customers", form);
    }
    reset();
    setRefresh(!refresh);
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg mb-6 border border-purple-200">
      <h2 className="text-lg font-bold text-purple-700 mb-4">{recordId ? "✏️ Edit Customer" : "➕ Add New Customer"}</h2>
      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Name <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400" value={form.name} onChange={(e) => onChange("name", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400" value={form.email} onChange={(e) => onChange("email", e.target.value)} />
        </div>
        <div>
          <label className="text-sm font-medium">Phone <span className="text-red-500">*</span></label>
          <input className="border p-2 w-full rounded focus:ring-2 focus:ring-purple-400" value={form.phone} onChange={(e) => onChange("phone", e.target.value)} />
        </div>
        <div className="flex justify-end space-x-2">
          {recordId && <button type="button" onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
          <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg">{recordId ? "Update Customer" : "Save Customer"}</button>
        </div>
      </form>
    </div>
  );
}
