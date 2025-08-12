"use client"

// in `app/page.tsx` or `src/app/page.tsx` (if using App Router)

import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"; //@ is an alias for the project root path
// { Button } is when you have multiple exports from one file so you do a "named export"
// to be able to access a function outside the js, ts or tsx file you need to "export" it -> like public in java or C#

import { useState } from "react";
import { SETTINGS } from "@/lib/settings";
import { useRouter } from "next/navigation";
import isAuthed from "@/lib/check-auth";

export default function Login() {

  const [username , setUsername] = useState("");
  const [password , setPassword] = useState("");

  const router = useRouter();

  if (isAuthed()){
    router.push(new URL("/",SETTINGS.HOST).toString());
  }

  const auth = (username: string, password: string) => {
    axios
      .post(new URL("/login_json",SETTINGS.API_URL).toString(), {
        username: username,
        password: password,
      })
      .then((res) => {
        console.log(res.data.access_token);

        localStorage.setItem("token", res.data.access_token);
        router.push(new URL("/",SETTINGS.HOST).toString());
        
      })
      .catch((err) => {
        console.log("got fucking error omg", err);
      });
  };

  return ( //TODO: make the login page in a form for password manager convinience
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        <div className="space-y-4">
          <Input type="text" placeholder="Username" className="w-full" onChange={(e) => {
            setUsername(e.target.value);
          }}/>
          <Input type="password" placeholder="Password" className="w-full" onChange={(e) => {
            setPassword(e.target.value)
          }}/>
        </div>
        <Button className="w-full" onClick={() => {
          auth(username, password);
        }}>
          Login
        </Button>
      </div>
    </div>
  );
}
