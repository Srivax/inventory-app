import { useEffect, useState } from "react";
import axios from "axios";

export default function PurchaseTable({ refresh, setRefresh }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/purchases")
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]));
  }, [refresh]);

  const editRow = (p) =>
    window.dispatchEvent(new CustomEvent("edit-entity", { detail: { type: "purchase", data: p } }));

  const delRow = async (id) => {
    if (!window.confirm("Delete purchase?")) return;
    await axios.delete(`http://localhost:5000/api/purchases/${id}`);
    setRefresh(!refresh);
  };

  const fmtAmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-yellow-200">
      <h2 className="text-lg font-bold text-yellow-700 mb-4">Purchases</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-yellow-600 text-white">
          <tr>
            <th className="px-4 py-2">Supplier</th>
            <th className="px-4 py-2">Total</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan="4" className="py-4 text-gray-500">No purchases</td></tr>
          ) : (
            rows
              .filter((p) => p && p.totalAmount > 0)
              .map((p) => (
                <tr key={p._id} className="border-b hover:bg-yellow-50">
                  <td className="py-2">{p.supplier?.name || "—"}</td>
                  <td>{fmtAmt(p.totalAmount)}</td>
                  <td>{p.status || "Received"}</td>
                  <td className="space-x-2">
                    <button onClick={() => editRow(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => delRow(p._id)} className="bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
