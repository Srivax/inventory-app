import { useEffect, useState } from "react";
import axios from "axios";

export default function Reports({ refresh }) {
  const [summary, setSummary] = useState({ daily: 0, monthly: 0 });

  useEffect(() => {
    axios.get("http://localhost:5000/api/transactions/summary").then((res) => setSummary(res.data || { daily: 0, monthly: 0 }));
  }, [refresh]);

  return (
    <div className="bg-gradient-to-r from-rose-50 to-rose-100 p-6 rounded-xl shadow-lg border border-rose-200">
      <h2 className="text-lg font-bold text-rose-700 mb-4">📊 Reports</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-600">Daily Total</h3>
          <p className="text-2xl font-bold text-rose-700">₹{summary.daily?.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition">
          <h3 className="text-sm font-medium text-gray-600">Monthly Total</h3>
          <p className="text-2xl font-bold text-rose-700">₹{summary.monthly?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
