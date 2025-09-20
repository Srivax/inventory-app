import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierTable({ refresh, onEdit }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadSuppliers();
  }, [refresh]);

  async function loadSuppliers() {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  }

  async function deleteSupplier(id) {
    await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
    loadSuppliers();
  }

  return (
    <div className="overflow-x-auto max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Supplier List</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Phone</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s) => (
            <tr key={s._id} className="border-b hover:bg-gray-100 transition-colors">
              <td className="py-2 px-4">{s.name}</td>
              <td className="py-2 px-4">{s.email}</td>
              <td className="py-2 px-4">{s.phone}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => onEdit(s)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteSupplier(s._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr>
              <td className="py-4 px-4 text-gray-500" colSpan={4}>No suppliers yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
