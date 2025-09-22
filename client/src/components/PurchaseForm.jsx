import { useEffect, useState } from "react";
import axios from "axios";

export default function PurchaseForm({ refresh, setRefresh }) {
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recordId, setRecordId] = useState(null);

  const [supplier, setSupplier] = useState("");
  const [items, setItems] = useState([{ product: "", qty: "", rate: "" }]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/suppliers").then((r) => setSuppliers(r.data || []));
    axios.get("http://localhost:5000/api/products").then((r) => setProducts(r.data || []));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type !== "purchase") return;
      const p = e.detail.data;
      setRecordId(p._id || null);
      setSupplier(p.supplier?._id || p.supplier || "");
      setItems((p.items || []).map((it) => ({
        product: it.product?._id || it.product || "",
        qty: String(it.qty ?? ""),
        rate: String(it.rate ?? ""),
      })));
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("edit-entity", handler);
    return () => window.removeEventListener("edit-entity", handler);
  }, []);

  const updateItem = (i, field, value) => {
    setItems((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: value };
      return next;
    });
  };

  const addItem = () => {
    const last = items[items.length - 1];
    if (last.product && last.qty && last.rate) {
      setItems([...items, { product: "", qty: "", rate: "" }]);
    }
  };

  const removeItem = (i) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const reset = () => {
    setRecordId(null);
    setSupplier("");
    setItems([{ product: "", qty: "", rate: "" }]);
  };

  const submit = async (e) => {
    e.preventDefault();
    const cleanItems = items
      .filter((it) => it.product && it.qty && it.rate)
      .map((it) => ({
        product: it.product,
        qty: Number(it.qty),
        rate: Number(it.rate),
        total: Number(it.qty) * Number(it.rate),
      }));
    if (!supplier || cleanItems.length === 0) return alert("Select supplier and at least one complete item.");

    const payload = { supplier, items: cleanItems, totalAmount: cleanItems.reduce((s, it) => s + it.total, 0) };
    if (recordId) {
      await axios.put(`http://localhost:5000/api/purchases/${recordId}`, payload);
    } else {
      await axios.post("http://localhost:5000/api/purchases", payload);
    }
    reset();
    setRefresh(!refresh);
  };

  const canAdd = Boolean(items[items.length - 1].product && items[items.length - 1].qty && items[items.length - 1].rate);

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl shadow-lg mb-6 border border-yellow-200">
      <h2 className="text-lg font-bold text-yellow-700 mb-4">{recordId ? "✏️ Edit Purchase" : "➕ New Purchase"}</h2>

      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Supplier <span className="text-red-500">*</span></label>
          <select className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                  value={supplier} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">Select Supplier</option>
            {(suppliers || []).map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>

        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-4">
              <label className="text-sm font-medium">Product <span className="text-red-500">*</span></label>
              <select className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                      value={it.product} onChange={(e) => updateItem(i, "product", e.target.value)}>
                <option value="">Select</option>
                {(products || []).map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
              <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                     value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium">Rate <span className="text-red-500">*</span></label>
              <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-yellow-400"
                     value={it.rate} onChange={(e) => updateItem(i, "rate", e.target.value)} />
            </div>
            <div className="col-span-2 flex justify-end">
              {items.length > 1 && (
                <button type="button" onClick={() => removeItem(i)} className="bg-rose-600 text-white px-3 py-2 rounded">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="flex justify-between mt-2">
          <button type="button" onClick={addItem}
                  className={`px-4 py-2 rounded-lg shadow text-white transition ${canAdd ? "bg-gray-700 hover:scale-105" : "bg-gray-300 cursor-not-allowed"}`}>
            + Item
          </button>
          <div className="space-x-2">
            {recordId && <button type="button" onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg">
              {recordId ? "Update Purchase" : "Save Purchase"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
