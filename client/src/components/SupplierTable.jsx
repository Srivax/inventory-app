import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierTable({ refresh, setRefresh }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers").then((res) => setSuppliers(res.data || []));
  }, [refresh]);

  const editSupplier = (s) => {
    window.dispatchEvent(new CustomEvent("edit-entity", { detail: { type: "supplier", data: s } }));
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;
    await axios.delete(`http://localhost:5000/api/suppliers/${id}`);
    setRefresh(!refresh);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-blue-200">
      <h2 className="text-lg font-bold text-blue-700 mb-4">📋 Supplier List</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr><td colSpan="4" className="py-4 text-gray-500">No suppliers found</td></tr>
          ) : suppliers.map((s) => (
            <tr key={s._id} className="border-b hover:bg-blue-50">
              <td className="py-2">{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td className="space-x-2">
                <button onClick={() => editSupplier(s)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteSupplier(s._id)} className="bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
