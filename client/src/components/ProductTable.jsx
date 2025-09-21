import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductTable({ refresh, onEdit }) {
  const [products, setProducts] = useState([]);

  useEffect(() => { load(); }, [refresh]);

  async function load() {
    const res = await axios.get("http://localhost:5000/api/products");
    setProducts(res.data);
  }

  async function remove(id) {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    load();
  }

  return (
    <div className="overflow-x-auto max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product List</h2>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">MRP</th>
            <th className="py-2 px-4 text-left">Unit</th>
            <th className="py-2 px-4 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4">{p.mrp}</td>
              <td className="py-2 px-4">{p.unit}</td>
              <td className="py-2 px-4">
                <button onClick={() => onEdit(p)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2">Edit</button>
                <button onClick={() => remove(p._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan="4" className="py-4 text-center text-gray-500">No products yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
