import { Card } from "@repo/ui/card"

export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    const statusColor = (status: string) => {
        if (status === "Processing") {
            return "text-blue-500"
        }
        if (status === "Failed") {
            return "text-red-500"
        }
        if (status === "Success") {
            return "text-green-500"
        }
        return "text-gray-500"
    }
    // console.log(transactions)
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map((t, index) => (
                <div key={index} className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            Received INR
                            <span className={`ml-2 text-xs ${statusColor(t.status)}`}>{t.status}</span>
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        + Rs {t.amount / 100}
                    </div>
                </div>
            ))}
        </div>
    </Card>
}