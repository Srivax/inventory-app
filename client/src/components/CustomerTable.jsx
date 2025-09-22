import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerTable({ refresh, setRefresh }) {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/customers").then((res) => setCustomers(res.data || []));
  }, [refresh]);

  const editCustomer = (c) => {
    window.dispatchEvent(new CustomEvent("edit-entity", { detail: { type: "customer", data: c } }));
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await axios.delete(`http://localhost:5000/api/customers/${id}`);
    setRefresh(!refresh);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-purple-200">
      <h2 className="text-lg font-bold text-purple-700 mb-4">📋 Customer List</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-purple-600 text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr><td colSpan="4" className="py-4 text-gray-500">No customers found</td></tr>
          ) : customers.map((c) => (
            <tr key={c._id} className="border-b hover:bg-purple-50">
              <td className="py-2">{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td className="space-x-2">
                <button onClick={() => editCustomer(c)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteCustomer(c._id)} className="bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
