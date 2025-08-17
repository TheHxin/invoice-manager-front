"use client"

import { useState } from "react"

type Invoice = { id: number; name: string }

function PageWithCustomContextMenu() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null)

  const invoices = [
    { id: 1, name: "Invoice #001" },
    { id: 2, name: "Invoice #002" },
  ]

  const handleRightClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMenuPosition({ x: e.clientX, y: e.clientY })
  }

  const closeMenu = () => setMenuPosition(null)

  return (
    <div
      className="w-full h-screen p-6"
      onContextMenu={handleRightClick}
      onClick={closeMenu} // clicking anywhere closes menu
    >
      <h1 className="text-xl mb-4">Invoices</h1>
      <ul className="space-y-2">
        {invoices.map((inv) => (
          <li
            key={inv.id}
            className={`p-2 border rounded cursor-pointer ${
              selectedInvoice?.id === inv.id ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
            onClick={() => selectedInvoice?.id ===inv.id ? setSelectedInvoice(null) : setSelectedInvoice(inv)}
          >
            {inv.name}
          </li>
        ))}
      </ul>

      {/* Custom right-click menu */}
      {menuPosition && (
        <div
          style={{ top: menuPosition.y, left: menuPosition.x }}
          className="fixed bg-white border rounded shadow-lg z-50 min-w-[150px] p-2"
        >
          {selectedInvoice ? (
            <>
              <div
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert(`Viewing ${selectedInvoice.name}`)}
              >
                View
              </div>
              <div
                className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                onClick={() => alert(`Editing ${selectedInvoice.name}`)}
              >
                Edit
              </div>
              <div
                className="px-3 py-1 hover:bg-red-100 text-red-600 cursor-pointer"
                onClick={() => alert(`Deleting ${selectedInvoice.name}`)}
              >
                Delete
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1 text-gray-500">No invoice selected</div>
              <div className="px-3 py-1 hover:bg-gray-100 cursor-pointer">
                Create New Invoice
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
