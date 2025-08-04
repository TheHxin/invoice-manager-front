"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

interface Invoice {
  id: number;
  origin: string;
  destination: string;
  issued: string;
  due: string;
  amount: number;
}

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = async () => {
    axios
      .get("http://localhost:38532/invoices", {
        headers: {
          'Authorization': "Bearer " + localStorage.getItem('token')
        },
      })
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((e) => {
        console.log("fuck bruv we got errs: ");
        console.log(e);
      });
  };

  useEffect(() => {
    const intervalid = setInterval(() => {
      fetchInvoices();
    }, 5000);

    return () => clearInterval(intervalid);
  });

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableCaption>Invoices</TableCaption>
          <TableHeader>
            <TableRow>
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
              <TableRow key={invoice.id}>
                <TableCell className="text-center">{invoice.id}</TableCell>
                <TableCell className="text-center">{invoice.origin}</TableCell>
                <TableCell className="text-center">
                  {invoice.destination}
                </TableCell>
                <TableCell className="text-center">{invoice.issued}</TableCell>
                <TableCell className="text-center">{invoice.due}</TableCell>
                <TableCell className="text-center">${invoice.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
