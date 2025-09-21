import axios from "axios";
import { useEffect, useState } from "react";

export default function InvoiceTable({ refresh, onEdit }) {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/invoices").then(res => setInvoices(res.data));
  }, [refresh]);

  async function deleteInvoice(id) {
    if (!window.confirm("Delete this invoice?")) return;
    await axios.delete(`http://localhost:5000/api/invoices/${id}`);
    setInvoices(invoices.filter(i => i._id !== id));
  }

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-xl font-bold mb-3">Invoices</h2>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Items</th>
            <th className="p-2 border">Grand Total</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map(inv => (
            <tr key={inv._id} className="border">
              <td className="p-2 border">{inv.customer?.name || "Unknown"}</td>
              <td className="p-2 border">
                {inv.items.map((it, idx) => (
                  <div key={idx}>
                    {it.product?.name || "Unknown"} – {it.qty} × {it.rate} = {it.total}
                  </div>
                ))}
              </td>
              <td className="p-2 border">{inv.grandTotal}</td>
              <td className="p-2 border">
                <button onClick={() => onEdit(inv)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                <button onClick={() => deleteInvoice(inv._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
