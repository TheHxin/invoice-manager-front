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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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

export default function Home() {
  const intervalRef = useRef(setTimeout(() => {}, 1000)); //wow this is ass tbh i hate ts -> to set the value i had to call a function and pass it an anonymous function so efficient

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const router = useRouter();

  const fetchInvoices = async () => {
    axios
      .get(new URL("/invoices",SETTINGS.API_URL).toString(), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setInvoices(res.data);
      })
      .catch((e) => {
        console.log("fuck bruv we got errs: ");
        console.log(e);
        if (e.status == 401){
          clearInterval(intervalRef.current);
          setAlertOpen(true);
        }

      });
  };

  useEffect(() => {
    const intervalId = setInterval(fetchInvoices,5000);
    intervalRef.current = intervalId;

    return () => {clearInterval(intervalId)}
  } , [])

  return (
    <div>
      <div>
        <AlertDialog open={alertOpen}>
          <AlertDialogTrigger>Open</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Authorization Error</AlertDialogTitle>
              <AlertDialogDescription>
                You are not logged in.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => {
                  router.push(new URL("/login", window.location.origin).toString());
                }}
              >
                Go To Login
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
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
                  <TableCell className="text-center">
                    {invoice.origin}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.destination}
                  </TableCell>
                  <TableCell className="text-center">
                    {invoice.issued}
                  </TableCell>
                  <TableCell className="text-center">{invoice.due}</TableCell>
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
  );
}
