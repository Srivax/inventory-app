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
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mb-6"
    >
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Add Supplier
      </h2>

      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Supplier Name"
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        required
        type="email"
        className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        required
        className="w-full p-2 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Add Supplier
      </button>
    </form>
  );
}
