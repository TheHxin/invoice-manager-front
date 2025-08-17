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
import { Input } from "@/components/ui/input";

interface InvoiceBase { //note: the "origin_name" and "destination_name" are temp for development. 
  issued: string | undefined;
  due: string | undefined;
  amount: number | undefined;
}
interface InvoiceCreate extends InvoiceBase {
  //TODO: the origin and destination fields in this interface will be impelimented using id later
  origin_name: string | undefined;
  destination_name: string | undefined;
}

interface InvoiceAPI { //this interface must match the json format that the api sends.
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
import { Button } from "@/components/ui/button";

export default function Home() {
  const intervalRef = useRef(setTimeout(() => {}, 1000)); //wow this is ass tbh i hate ts -> to set the value i had to call a function and pass it an anonymous function so efficient

  const initInvoiceCreateObj: InvoiceCreate = {
    //note: the purpose of this init value is to relate the typescript nulls for the api readblity values -> in ts we pass null onChange of input fields but we use this obj and the handleInvoiceCreateChange function to set a proccesable value for the api -> in other words now in code of onChange function i can only pass one parameter to the function and other will be by default null so the code is more clean
    origin_name: "", //the thing above in better words: we use this initvalueobj and the handler of the input on change functions to be able to right cleaner code in the jsx (not set each thing we dont pass to its previous value) and instead pass only one parameter which for each input is its own e.target.value
    destination_name: "",
    issued: "",
    due: "",
    amount: 0,
  };

  const [invoiceCreate, setInvoiceCreate] = useState<InvoiceCreate>(initInvoiceCreateObj);
  const [selectedRow, setSelectedRow] = useState<number>(0);
  const [invoices, setInvoices] = useState<InvoiceAPI[]>([]);
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

  const postInvoice = async (invoice: InvoiceCreate) => {
    axios.post(
      new URL("/invoice_acname", SETTINGS.API_URL).toString(),
      {
        origin_name: invoice.origin_name,
        destination_name: invoice.destination_name,
        issued: invoice.issued,
        due: invoice.due,
        amount: invoice.amount,
      },
      {
        headers: {
          Authorization: "Bearer " + authenticator?.getToken(),
          "Content-Type": "application/json",
        },
      }
    );
  };

  function handleCreateInvoiceChange(update: Partial<InvoiceCreate> = {}) {
    //note: instead of this we could use multiple useState for each of the properties but that would make it more verbose. however as react re-redners only hte changed components there is not a messurable diff between the two methods of impelimentation
    const newInvoice: InvoiceCreate = {
      origin_name:
        update.origin_name === undefined
          ? invoiceCreate.origin_name
          : update.origin_name,
      destination_name:
        update.destination_name === undefined
          ? invoiceCreate.destination_name
          : update.destination_name,
      issued:
        update.issued === undefined ? invoiceCreate.issued : update.issued,
      due: update.due === undefined ? invoiceCreate.due : update.due,
      amount:
        update.amount === undefined ? invoiceCreate.amount : update.amount,
    };

    setInvoiceCreate(newInvoice);
  }

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
                    <TableRow>
                      <TableCell className="text-center">
                        <Button onClick={() => {postInvoice(invoiceCreate)}}>Add</Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="text"
                          placeholder="origin"
                          className="text-center"
                          onChange={(e) => {
                            handleCreateInvoiceChange({ //pass the changed value to change handler function that handles partials becaue each input passes only one of the parameters.
                              origin_name: e.target.value,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="text"
                          placeholder="destination"
                          className="text-center"
                          onChange={(e) => {
                            handleCreateInvoiceChange({
                              destination_name: e.target.value,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="date"
                          placeholder="issued"
                          onChange={(e) => {
                            handleCreateInvoiceChange({
                              issued: e.target.value.toString(),
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <Input
                          type="date"
                          placeholder="due"
                          onChange={(e) => {
                            handleCreateInvoiceChange({
                              due: e.target.value.toString(),
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center">
                          <span className="px-2">€</span>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="flex-1 text-center input-no-spinners"
                            onChange={(e) => {
                              handleCreateInvoiceChange({
                                amount: parseFloat(e.target.value),
                              });
                            }}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
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
