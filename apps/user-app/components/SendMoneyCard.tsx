"use client"
import { Button } from "@repo/ui/button";
import { Card } from "@repo/ui/card";
import { useState } from "react";
import { TextInput } from "@repo/ui/textinput";
import { useRouter } from "next/navigation";
import { peerToPeerTransactions } from "../app/lib/actions/peerToPeerTransactions";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
}];

export const SendMoneyCard = () => {
    const router = useRouter();
    const [amount, setAmount] = useState("");
    const [number, setNumber] = useState("")
    return <Card title="Send Money">
    <div className="w-full">
    <TextInput label={"Number"} placeholder={"Number"} onChange={(value) => setNumber(value)} />
    <TextInput label={"Amount"} placeholder={"Amount"} onChange={(value) => setAmount(value)} />
        
        <div className="flex justify-center pt-4">
            <Button onClick={async () => {
                // peer to peer transfer
                await peerToPeerTransactions(number, Number(amount) * 100);
                router.push("/transactions")
            }}>
            Send
            </Button>
        </div>
    </div>
</Card>
}