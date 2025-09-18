/src/components/SupplierForm.jsx
import { useState } from "react";
import axios from "axios";

export default function SupplierForm({ onAdded }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/suppliers", form);
    onAdded();
    setForm({ name: "", email: "", phone: "" });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="Supplier Name" required />
      <input name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
      <button type="submit">Add Supplier</button>
    </form>
  );
}

