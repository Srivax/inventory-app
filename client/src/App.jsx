import { useState } from "react";

// Modules
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import CustomerForm from "./components/CustomerForm";
import CustomerTable from "./components/CustomerTable";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";

export default function App() {
  const [activeTab, setActiveTab] = useState("suppliers");

  // Suppliers
  const [supplierRefresh, setSupplierRefresh] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  // Products
  const [productRefresh, setProductRefresh] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Customers
  const [customerRefresh, setCustomerRefresh] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Invoices
  const [invoiceRefresh, setInvoiceRefresh] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-3 flex flex-wrap gap-3 items-center">
        <h1 className="text-xl font-bold mr-auto">Inventory App</h1>
        <button onClick={() => setActiveTab("suppliers")} className={`px-3 py-1 rounded ${activeTab==="suppliers" ? "bg-white text-blue-700" : "bg-blue-600 hover:bg-blue-500"}`}>Suppliers</button>
        <button onClick={() => setActiveTab("products")} className={`px-3 py-1 rounded ${activeTab==="products" ? "bg-white text-blue-700" : "bg-blue-600 hover:bg-blue-500"}`}>Products</button>
        <button onClick={() => setActiveTab("customers")} className={`px-3 py-1 rounded ${activeTab==="customers" ? "bg-white text-blue-700" : "bg-blue-600 hover:bg-blue-500"}`}>Customers</button>
        <button onClick={() => setActiveTab("invoices")} className={`px-3 py-1 rounded ${activeTab==="invoices" ? "bg-white text-blue-700" : "bg-blue-600 hover:bg-blue-500"}`}>Invoices</button>
      </nav>

      <div className="p-6">
        {activeTab === "suppliers" && (
          <>
            <SupplierForm
              onSaved={() => setSupplierRefresh(!supplierRefresh)}
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
              onSaved={() => setProductRefresh(!productRefresh)}
              editingProduct={editingProduct}
              clearEdit={() => setEditingProduct(null)}
            />
            <ProductTable
              refresh={productRefresh}
              onEdit={(p) => setEditingProduct(p)}
            />
          </>
        )}

        {activeTab === "customers" && (
          <>
            <CustomerForm
              onSaved={() => setCustomerRefresh(!customerRefresh)}
              editingCustomer={editingCustomer}
              clearEdit={() => setEditingCustomer(null)}
            />
            <CustomerTable
              refresh={customerRefresh}
              onEdit={(c) => setEditingCustomer(c)}
            />
          </>
        )}

        {activeTab === "invoices" && (
          <>
            <InvoiceForm
              onSaved={() => setInvoiceRefresh(!invoiceRefresh)}
              editingInvoice={editingInvoice}
              clearEdit={() => setEditingInvoice(null)}
            />
            <InvoiceTable
              refresh={invoiceRefresh}
              onEdit={(inv) => setEditingInvoice(inv)}
            />
          </>
        )}
      </div>
    </div>
  );
}
