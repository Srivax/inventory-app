import { useState } from "react";
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  function reload() {
    setRefresh(!refresh);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
        Supplier Module
      </h1>
      <SupplierForm onAdded={reload} />
      <SupplierTable refresh={refresh} />
    </div>
  );
}
