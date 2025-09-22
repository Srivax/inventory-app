import { useEffect, useState } from "react";
import axios from "axios";

export default function InvoiceForm({ refresh, setRefresh }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [recordId, setRecordId] = useState(null);

  const [customer, setCustomer] = useState("");
  const [items, setItems] = useState([{ product: "", qty: "", rate: "" }]);
  const [discount, setDiscount] = useState(0);
  const [gst, setGst] = useState(0);

  useEffect(() => {
    axios.get("http://localhost:5000/api/customers").then((r) => setCustomers(r.data || []));
    axios.get("http://localhost:5000/api/products").then((r) => setProducts(r.data || []));
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.type !== "invoice") return;
      const inv = e.detail.data;
      setRecordId(inv._id || null);
      setCustomer(inv.customer?._id || inv.customer || "");
      setItems((inv.items || []).map((it) => ({
        product: it.product?._id || it.product || "",
        qty: String(it.qty ?? ""),
        rate: String(it.rate ?? ""),
      })));
      setDiscount(Number(inv.discount || 0));
      setGst(Number(inv.gst || 0));
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
    setCustomer("");
    setItems([{ product: "", qty: "", rate: "" }]);
    setDiscount(0);
    setGst(0);
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
    if (!customer || cleanItems.length === 0) return alert("Select customer and at least one complete item.");

    const subtotal = cleanItems.reduce((s, it) => s + it.total, 0);
    const payload = {
      customer,
      items: cleanItems,
      discount: Number(discount || 0),
      gst: Number(gst || 0),
      grandTotal: subtotal - Number(discount || 0) + Number(gst || 0),
    };

    if (recordId) {
      await axios.put(`http://localhost:5000/api/invoices/${recordId}`, payload);
    } else {
      await axios.post("http://localhost:5000/api/invoices", payload);
    }
    reset();
    setRefresh(!refresh);
  };

  const canAdd = Boolean(items[items.length - 1].product && items[items.length - 1].qty && items[items.length - 1].rate);

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl shadow-lg mb-6 border border-indigo-200">
      <h2 className="text-lg font-bold text-indigo-700 mb-4">{recordId ? "✏️ Edit Invoice" : "➕ New Invoice"}</h2>

      <form onSubmit={submit} className="grid gap-4">
        <div>
          <label className="text-sm font-medium">Customer <span className="text-red-500">*</span></label>
          <select className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
                  value={customer} onChange={(e) => setCustomer(e.target.value)}>
            <option value="">Select Customer</option>
            {(customers || []).map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        {items.map((it, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-end">
            <div className="col-span-4">
              <label className="text-sm font-medium">Product <span className="text-red-500">*</span></label>
              <select className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
                      value={it.product} onChange={(e) => updateItem(i, "product", e.target.value)}>
                <option value="">Select</option>
                {(products || []).map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium">Quantity <span className="text-red-500">*</span></label>
              <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
                     value={it.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
            </div>
            <div className="col-span-3">
              <label className="text-sm font-medium">Rate <span className="text-red-500">*</span></label>
              <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Discount</label>
            <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
                   value={discount} onChange={(e) => setDiscount(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium">GST</label>
            <input type="number" className="border p-2 w-full rounded focus:ring-2 focus:ring-indigo-400"
                   value={gst} onChange={(e) => setGst(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-between mt-2">
          <button type="button" onClick={addItem}
                  className={`px-4 py-2 rounded-lg shadow text-white transition ${canAdd ? "bg-gray-700 hover:scale-105" : "bg-gray-300 cursor-not-allowed"}`}>
            + Item
          </button>
          <div className="space-x-2">
            {recordId && <button type="button" onClick={reset} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>}
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-lg">
              {recordId ? "Update Invoice" : "Save Invoice"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
