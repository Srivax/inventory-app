import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierTable({ refresh }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadSuppliers();
  }, [refresh]);

  async function loadSuppliers() {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  }

  return (
    <div className="overflow-x-auto max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        Supplier List
      </h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Phone</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((s, i) => (
            <tr
              key={i}
              className="border-b hover:bg-gray-100 transition-colors"
            >
              <td className="py-2 px-4">{s.name}</td>
              <td className="py-2 px-4">{s.email}</td>
              <td className="py-2 px-4">{s.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
