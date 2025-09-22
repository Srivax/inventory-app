import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionTable({ refresh }) {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/transactions")
      .then((r) => setRows(r.data || []))
      .catch(() => setRows([]));
  }, [refresh]);

  const fmtAmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
  const fmtDate = (d) => {
    const v = d || null;
    if (!v) return "—";
    const dt = new Date(v);
    return isNaN(dt.getTime()) ? "—" : dt.toLocaleDateString("en-IN");
    };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-xl shadow-lg border border-orange-200">
      <h2 className="text-lg font-bold text-orange-700 mb-4">Transactions</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-orange-600 text-white">
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Type</th>
            <th className="px-4 py-2">Party</th>
            <th className="px-4 py-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="4" className="py-4 text-gray-500">No transactions</td>
            </tr>
          ) : (
            rows
              .filter((t) => t && t.amount > 0 && t.party && (t.date || t.createdAt))
              .map((t) => (
                <tr key={t._id} className="border-b hover:bg-orange-50">
                  <td className="py-2">{fmtDate(t.date || t.createdAt)}</td>
                  <td>{t.type}</td>
                  <td>{t.party}</td>
                  <td className="font-semibold text-green-700">{fmtAmt(t.amount)}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
}
