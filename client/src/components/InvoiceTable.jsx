import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceTable({ refresh, setRefresh }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/invoices")
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]));
  }, [refresh]);

  const editRow = (inv) =>
    window.dispatchEvent(new CustomEvent("edit-entity", { detail: { type: "invoice", data: inv } }));

  const delRow = async (id) => {
    if (!window.confirm("Delete invoice?")) return;
    await axios.delete(`http://localhost:5000/api/invoices/${id}`);
    setRefresh(!refresh);
  };

  const fmtAmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-indigo-200">
      <h2 className="text-lg font-bold text-indigo-700 mb-4">Invoices</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="px-4 py-2">Customer</th>
            <th className="px-4 py-2">Discount</th>
            <th className="px-4 py-2">GST</th>
            <th className="px-4 py-2">Grand Total</th>
            <th className="px-4 py-2">Details</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan="6" className="py-4 text-gray-500">No invoices</td></tr>
          ) : (
            rows
              .filter((inv) => inv && inv.grandTotal > 0)
              .map((inv) => (
                <tr key={inv._id} className="border-b hover:bg-indigo-50">
                  <td className="py-2">{inv.customer?.name || "—"}</td>
                  <td>{fmtAmt(inv.discount)}</td>
                  <td>{fmtAmt(inv.gst)}</td>
                  <td className="font-semibold text-green-700">{fmtAmt(inv.grandTotal)}</td>
                  <td className="text-left">
                    {(inv.items || []).map((it, idx) => (
                      <div key={idx} className="text-sm">
                        {(it.product?.name || "—")} ({it.qty} × {it.rate}) = {fmtAmt(it.total)}
                      </div>
                    ))}
                  </td>
                  <td className="space-x-2">
                    <button onClick={() => editRow(inv)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                    <button onClick={() => delRow(inv._id)} className="bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
