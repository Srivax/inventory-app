import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductTable({ refresh, setRefresh }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((res) => setProducts(res.data || []));
  }, [refresh]);

  const editProduct = (p) => {
    window.dispatchEvent(new CustomEvent("edit-entity", { detail: { type: "product", data: p } }));
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    setRefresh(!refresh);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-green-200">
      <h2 className="text-lg font-bold text-green-700 mb-4">📋 Product List</h2>
      <table className="w-full text-center border-collapse">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">MRP</th>
            <th className="px-4 py-2">Unit</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr><td colSpan="4" className="py-4 text-gray-500">No products found</td></tr>
          ) : products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-green-50">
              <td className="py-2">{p.name}</td>
              <td>₹{p.mrp}</td>
              <td>{p.unit}</td>
              <td className="space-x-2">
                <button onClick={() => editProduct(p)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                <button onClick={() => deleteProduct(p._id)} className="bg-rose-600 text-white px-3 py-1 rounded">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
