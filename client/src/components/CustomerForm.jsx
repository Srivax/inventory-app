import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerForm({ onSaved, editingCustomer, clearEdit }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    if (editingCustomer) setForm(editingCustomer);
  }, [editingCustomer]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingCustomer?._id) {
      await axios.put(`http://localhost:5000/api/customers/${editingCustomer._id}`, form);
    } else {
      await axios.post("http://localhost:5000/api/customers", form);
    }
    onSaved();
    setForm({ name: "", email: "", phone: "" });
    clearEdit();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mb-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">{editingCustomer ? "Edit Customer" : "Add Customer"}</h2>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full p-2 mb-3 border border-gray-300 rounded"/>
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required className="w-full p-2 mb-3 border border-gray-300 rounded"/>
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="w-full p-2 mb-4 border border-gray-300 rounded"/>

      <div className="flex gap-3">
        {!editingCustomer && (
          <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Save</button>
        )}
        {editingCustomer && (
          <>
            <button type="submit" className="flex-1 bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">Update</button>
            <button type="button" onClick={clearEdit} className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100">Cancel</button>
          </>
        )}
      </div>
    </form>
  );
}
