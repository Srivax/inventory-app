import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SupplierForm from "./components/SupplierForm";
import SupplierTable from "./components/SupplierTable";
import CustomerForm from "./components/CustomerForm";
import CustomerTable from "./components/CustomerTable";
import ProductForm from "./components/ProductForm";
import ProductTable from "./components/ProductTable";
import PurchaseForm from "./components/PurchaseForm";
import PurchaseTable from "./components/PurchaseTable";
import InvoiceForm from "./components/InvoiceForm";
import InvoiceTable from "./components/InvoiceTable";
import TransactionTable from "./components/TransactionTable";
import Reports from "./components/Reports";

export default function App() {
  const [activeTab, setActiveTab] = useState("Reports"); // Default = Reports
  const [refresh, setRefresh] = useState(false);

  const tabs = [
    { name: "Suppliers", color: "blue" },
    { name: "Products", color: "green" },
    { name: "Customers", color: "purple" },
    { name: "Purchases", color: "yellow" },
    { name: "Invoices", color: "indigo" },
    { name: "Transactions", color: "orange" },
    { name: "Reports", color: "rose" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-6 py-3 shadow">
        <h1 className="text-2xl font-bold text-center mb-3">📦 Inventory App</h1>
        <div className="flex justify-center flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`px-3 py-1 rounded transition ${
                activeTab === tab.name
                  ? `bg-white text-${tab.color}-700 font-semibold`
                  : `bg-${tab.color}-600 hover:bg-${tab.color}-500`
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content with animation */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === "Suppliers" && (
              <>
                <SupplierForm refresh={refresh} setRefresh={setRefresh} />
                <SupplierTable refresh={refresh} setRefresh={setRefresh} />
              </>
            )}
            {activeTab === "Products" && (
              <>
                <ProductForm refresh={refresh} setRefresh={setRefresh} />
                <ProductTable refresh={refresh} setRefresh={setRefresh} />
              </>
            )}
            {activeTab === "Customers" && (
              <>
                <CustomerForm refresh={refresh} setRefresh={setRefresh} />
                <CustomerTable refresh={refresh} setRefresh={setRefresh} />
              </>
            )}
            {activeTab === "Purchases" && (
              <>
                <PurchaseForm refresh={refresh} setRefresh={setRefresh} />
                <PurchaseTable refresh={refresh} setRefresh={setRefresh} />
              </>
            )}
            {activeTab === "Invoices" && (
              <>
                <InvoiceForm refresh={refresh} setRefresh={setRefresh} />
                <InvoiceTable refresh={refresh} setRefresh={setRefresh} />
              </>
            )}
            {activeTab === "Transactions" && (
              <TransactionTable refresh={refresh} setRefresh={setRefresh} />
            )}
            {activeTab === "Reports" && (
              <Reports refresh={refresh} setRefresh={setRefresh} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
