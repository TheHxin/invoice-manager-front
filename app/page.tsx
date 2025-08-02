"user client"
// in `app/page.tsx` or `src/app/page.tsx` (if using App Router)
import { Button } from "@/components/ui/button" //@ is an alias for the project root path
// { Button } is when you have multiple exports from one file so you do a "named export" 
// to be able to access a function outside the js, ts or tsx file you need to "export" it -> like public in java or C#
import { Input } from "@/components/ui/input"
import {useState} from "react"
import axios from "axios"
import { useRouter } from "next/router"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl space-y-6">
        <h1 className="text-2xl font-semibold text-center">Login</h1>
        <div className="space-y-4">
          <Input type="text" placeholder="Username" className="w-full" />
          <Input type="password" placeholder="Password" className="w-full" />
        </div>
        <Button className="w-full">Login</Button>
      </div>
    </div>
  )
}
