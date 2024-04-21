"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth"
import prisma from "@repo/db/client";

// server action to add onRamp transaction
export default async function createOnRampTransaction(amount: number, provider: string) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return {
            message: "User not logged in"
        }
    }
    const txn = await prisma.onRampTransaction.create({
        data: {
            userId: Number(session.user.id),
            startTime: new Date(),
            status: "Processing",
            amount,
            provider,
            token: `token__${Math.floor(Math.random() * 1000)}`
        },
    });
    return {
        message: "Onramp transaction created",
        transaction: txn
    }
}
