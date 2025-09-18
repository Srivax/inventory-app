import { useEffect, useState } from "react";
import axios from "axios";

export default function SupplierTable({ refresh }) {
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    loadSuppliers();
  }, [refresh]);

  async function loadSuppliers() {
    const res = await axios.get("http://localhost:5000/api/suppliers");
    setSuppliers(res.data);
  }

  return (
    <table border="1" cellPadding="5">
      <thead>
        <tr>
          <th>Name</th><th>Email</th><th>Phone</th>
        </tr>
      </thead>
      <tbody>
        {suppliers.map((s, i) => (
          <tr key={i}>
            <td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
