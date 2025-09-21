import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerTable({ refresh, onEdit }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => { load(); }, [refresh]);

  async function load() {
    const res = await axios.get("http://localhost:5000/api/customers");
    setCustomers(res.data);
  }

  async function remove(id) {
    await axios.delete(`http://localhost:5000/api/customers/${id}`);
    load();
  }

  return (
    <div className="overflow-x-auto max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer List</h2>
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
          {customers.map((c) => (
            <tr key={c._id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{c.name}</td>
              <td className="py-2 px-4">{c.email}</td>
              <td className="py-2 px-4">{c.phone}</td>
              <td className="py-2 px-4">
                <button onClick={() => onEdit(c)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                <button onClick={() => remove(c._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No customers yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
