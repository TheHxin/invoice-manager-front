"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import axios from "axios";
import { useRef, useState } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Invoice {
  id: number;
  origin: string;
  destination: string;
  issued: string;
  due: string;
  amount: number;
}

import { SETTINGS } from "@/lib/settings";
import useAuth from "./auth-context";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Home() {
  const intervalRef = useRef(setTimeout(() => {}, 1000)); //wow this is ass tbh i hate ts -> to set the value i had to call a function and pass it an anonymous function so efficient

  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const router = useRouter();
  const authenticator = useAuth();

  const fetchInvoices = async () => {
    axios
      .get(new URL("/invoices", SETTINGS.API_URL).toString(), {
        headers: {
          Authorization: "Bearer " + authenticator?.getToken(),
        },
      })
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((e) => {
        console.log(e);
        if (e.status == 401) {
          //console.log(intervalRef.current, "cleared")
          //clearInterval(intervalRef.current);
          console.log("Not authed, routing ...");
          router.push(new URL("/login", SETTINGS.HOST).toString());
        }
      });
  };

  useEffect(() => {
    intervalRef.current = setInterval(fetchInvoices, 2000);

    return () => {
      clearInterval(intervalRef.current);
    };
  }); // note: no need for dependency array if not used.

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="h-screen select-none">
            <div className="w-full max-w-5xl mx-auto p-4">
              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                      <TableHead className="w-[100px]">InvoiceID</TableHead>
                      <TableHead className="text-center">Origin</TableHead>
                      <TableHead className="text-center">Destination</TableHead>
                      <TableHead className="text-center">IssuedDate</TableHead>
                      <TableHead className="text-center">DueDate</TableHead>
                      <TableHead className="text-center">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow
                        key={invoice.id}
                        className={
                          selectedRow === invoice.id
                            ? "bg-blue-400 hover:bg-blue-400"
                            : ""
                        }
                        onClick={() => {
                          return selectedRow === invoice.id
                            ? setSelectedRow(0)
                            : setSelectedRow(invoice.id);
                        }}
                      >
                        <TableCell className="text-center">
                          {invoice.id}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.origin}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.destination}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.issued}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.due}
                        </TableCell>
                        <TableCell className="text-center">
                          ${invoice.amount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent hideWhenDetached>
          {selectedRow ? (
            <div>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Edit</ContextMenuItem>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </div>
          ) : (
            <ContextMenuItem disabled>no item selected</ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
