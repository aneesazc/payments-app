import { Card } from "@repo/ui/card"

export const P2PTransactions = ({
    txns
}: any) => {
    // console.log(txns)
    // Combine the transactions into a single array
const combinedTxns = txns.txnsReceived.concat(txns.txnsSent);

// Sort the array by the 'time' key in ascending order
const sortedTxns = combinedTxns.sort((a: any, b: any) => {
  const timeA = new Date(a.time).getTime();
  const timeB = new Date(b.time).getTime();
  return timeA - timeB;
});
// console.log(sortedTxns)
    if (!sortedTxns.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent txns
            </div>
        </Card>
    }

    // console.log(txns)

    return <Card title="Recent Transactions">
        <div className="pt-2">
            {sortedTxns.map((t: any, index: any) => (
                <div key={index} className="flex justify-between">
                    <div>
                        <div className="text-base">
                            {t.status} INR
                        </div>
                        <div className="text-slate-600 text-xs">
                        {new Date(t.time).toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                       {t.status === "Received" ? "+": "-"} Rs {t.amount / 100}
                    </div>
                </div>
            ))}
        </div>
    </Card>
}