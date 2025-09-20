import { useState } from "react";
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";

export default function App() {
  const [activeTab, setActiveTab] = useState("suppliers");

  const [supplierRefresh, setSupplierRefresh] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [productRefresh, setProductRefresh] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  function reloadSuppliers() {
    setSupplierRefresh(!supplierRefresh);
  }
  function reloadProducts() {
    setProductRefresh(!productRefresh);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold">Inventory App</h1>
        <div className="space-x-4">
          <button
            onClick={() => setActiveTab("suppliers")}
            className={`hover:underline ${activeTab === "suppliers" && "font-bold underline"}`}
          >
            Suppliers
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`hover:underline ${activeTab === "products" && "font-bold underline"}`}
          >
            Products
          </button>
        </div>
      </nav>

      <div className="p-6">
        {activeTab === "suppliers" && (
          <>
            <SupplierForm
              onSaved={reloadSuppliers}
              editingSupplier={editingSupplier}
              clearEdit={() => setEditingSupplier(null)}
            />
            <SupplierTable
              refresh={supplierRefresh}
              onEdit={(s) => setEditingSupplier(s)}
            />
          </>
        )}

        {activeTab === "products" && (
          <>
            <ProductForm
              onSaved={reloadProducts}
              editingProduct={editingProduct}
              clearEdit={() => setEditingProduct(null)}
            />
            <ProductTable
              refresh={productRefresh}
              onEdit={(p) => setEditingProduct(p)}
            />
          </>
        )}
      </div>
    </div>
  );
}
