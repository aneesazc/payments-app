import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";

async function getp2pTransactions() {
    const session = await getServerSession(authOptions);
    const txnsReceived = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });

    const txnsSent = await prisma.p2pTransfer.findMany({
        where: {
            toUserId: Number(session?.user?.id)
        }
    });

    return {
        txnsReceived: txnsReceived.map(t => ({
            time: t.timestamp,
            amount: t.amount,
            status: "Received"
        })),
        txnsSent: txnsSent.map(t => ({
            time: t.timestamp,
            amount: t.amount,
            status: "Sent"
        }))
    }
    

}

export default async function() {
    const transactions = await getp2pTransactions();
    // console.log(transactions);

    return <div className="w-full">
    <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
        Transactions
    </div>

    <div className="w-11/12 md:w-9/12 lg:w-8/12"
    >
        <P2PTransactions txns={transactions} />
    </div>
</div>
}