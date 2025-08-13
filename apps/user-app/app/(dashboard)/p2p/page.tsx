'use client'
import { Button } from "@repo/ui/button";
import { TextInput } from "@repo/ui/textinput";
import { useState } from "react"
import { p2ptransfer } from "../../lib/actions/p2ptransfer";
import React from "react";

export default function SendPage(){
    const [number,setNumber] = useState('');
    const [amount,setAmount] = useState('');


    return  <div className="flex justify-center items-center w-full h-screen">
    <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
      <h1 className="text-2xl font-semibold mb-2">Send</h1>
      <hr className="mb-4" />

      <div className="flex flex-col gap-4">
        <TextInput
          placeholder="Enter Mobile No."
          label="Mobile Number"
          onChange={(value) => setNumber(value)}
        />

        <TextInput
          placeholder="Enter Amount"
          label="Amount"
          onChange={(value) => setAmount(value)}
        />

        <Button onClick={async() => {
          console.log("Sending", amount, "to", number);
          await p2ptransfer(number,Number(amount)*100)
        }}>
          Send Money
        </Button>
      </div>
    </div>
  </div>
}