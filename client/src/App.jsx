import { useState } from "react";
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseTable from "./components/PurchaseTable";

export default function App() {
  const [activeTab, setActiveTab] = useState("suppliers");

  const [supplierRefresh, setSupplierRefresh] = useState(false);
  const [productRefresh, setProductRefresh] = useState(false);
  const [purchaseRefresh, setPurchaseRefresh] = useState(false);

  function reloadSuppliers() { setSupplierRefresh(!supplierRefresh); }
  function reloadProducts() { setProductRefresh(!productRefresh); }
  function reloadPurchases() { setPurchaseRefresh(!purchaseRefresh); }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Inventory App</h1>
        <div className="space-x-4">
          <button onClick={() => setActiveTab("suppliers")} className={`hover:underline ${activeTab === "suppliers" && "font-bold underline"}`}>Suppliers</button>
          <button onClick={() => setActiveTab("products")} className={`hover:underline ${activeTab === "products" && "font-bold underline"}`}>Products</button>
          <button onClick={() => setActiveTab("purchases")} className={`hover:underline ${activeTab === "purchases" && "font-bold underline"}`}>Purchases</button>
        </div>
      </nav>

      <div className="p-6">
        {activeTab === "suppliers" && (
          <>
            <SupplierForm onSaved={reloadSuppliers} />
            <SupplierTable refresh={supplierRefresh} />
          </>
        )}
        {activeTab === "products" && (
          <>
            <ProductForm onSaved={reloadProducts} />
            <ProductTable refresh={productRefresh} />
          </>
        )}
        {activeTab === "purchases" && (
          <>
            <PurchaseForm onSaved={reloadPurchases} />
            <PurchaseTable refresh={purchaseRefresh} onConfirmed={reloadPurchases} />
          </>
        )}
      </div>
    </div>
  );
}
