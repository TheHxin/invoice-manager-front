"use client";

import { useState } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Invoice = { id: number; name: string };

export default function PageWithCustomContextMenu() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const invoices = [
    { id: 1, name: "Invoice #001" },
    { id: 2, name: "Invoice #002" },
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="w-full h-screen p-6">
          <h1 className="text-xl mb-4">Invoices</h1>
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li
                key={inv.id}
                className={`p-2 border rounded cursor-pointer ${
                  selectedInvoice?.id === inv.id
                    ? "bg-blue-100"
                    : "hover:bg-gray-100"
                }`}
                onClick={() =>
                  selectedInvoice?.id === inv.id
                    ? setSelectedInvoice(null)
                    : setSelectedInvoice(inv)
                }
              >
                {inv.name}
              </li>
            ))}
          </ul>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent hideWhenDetached>
        {selectedInvoice ? (
          <div>
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </div>
        ) : (
          <ContextMenuItem disabled>no item selected</ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
}
