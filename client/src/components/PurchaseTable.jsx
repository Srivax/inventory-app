import { useEffect, useState } from "react";
import axios from "axios";

export default function PurchaseTable({ refresh, onConfirmed }) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    loadPurchases();
  }, [refresh]);

  async function loadPurchases() {
    const res = await axios.get("http://localhost:5000/api/purchases");
    setPurchases(res.data);
  }

  async function confirmGRN(id) {
    await axios.put(`http://localhost:5000/api/purchases/${id}/confirm`);
    onConfirmed();
  }

  async function deletePurchase(id) {
    await axios.delete(`http://localhost:5000/api/purchases/${id}`);
    loadPurchases();
  }

  return (
    <div className="overflow-x-auto max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Purchase Orders</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Supplier</th>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left">Qty</th>
            <th className="py-2 px-4 text-left">Rate</th>
            <th className="py-2 px-4 text-left">Total</th>
            <th className="py-2 px-4 text-left">Status</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-100 transition-colors">
              <td className="py-2 px-4">{p.supplier?.name}</td>
              <td className="py-2 px-4">{p.product?.name}</td>
              <td className="py-2 px-4">{p.qty}</td>
              <td className="py-2 px-4">{p.rate}</td>
              <td className="py-2 px-4">{p.total}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded ${p.status === "Pending" ? "bg-yellow-200 text-yellow-800" : "bg-green-200 text-green-800"}`}>
                  {p.status}
                </span>
              </td>
              <td className="py-2 px-4">
                {p.status === "Pending" && (
                  <button
                    onClick={() => confirmGRN(p._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition mr-2"
                  >
                    Confirm GRN
                  </button>
                )}
                <button
                  onClick={() => deletePurchase(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {purchases.length === 0 && (
            <tr>
              <td colSpan="7" className="py-4 px-4 text-gray-500 text-center">No purchase orders yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
