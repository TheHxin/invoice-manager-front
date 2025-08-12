"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { SETTINGS } from "@/lib/settings";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { AxiosResponse } from "axios";
import { Description } from "@radix-ui/react-alert-dialog";
export default function Test() {
  const [alertOpen, setAlertOpen] = useState(false);
  let description = "";

  const isAuthed = () => {
    axios
      .get(new URL("/users/me", SETTINGS.API_URL).toString(), {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        description = res.status === 200 ? "authed" : res.status.toString()
      })
      .catch((e) => {
        description = e.status === 401 ? "not authed" : e
      })
      .finally(() => {
        setAlertOpen(true);
      });
  };

  return (
    <div>
      <div className="flex justify-center items-center h-screen">
        <Button
          onClick={() => {
            isAuthed();
          }}
        >
          Auth Check
        </Button>
      </div>
      <div>
        <AlertDialog open={alertOpen}>
          <AlertDialogTrigger asChild></AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Resault of the /users/me request
              </AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
