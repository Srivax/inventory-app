import { useState } from "react";
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  function reload() {
    setRefresh(!refresh);
  }

  return (
    <div>
      <h1>Supplier Module</h1>
      <SupplierForm onAdded={reload} />
      <SupplierTable refresh={refresh} />
    </div>
  );
}
