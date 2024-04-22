import express from "express";
import db from "@repo/db/client";
import { z } from "zod";

const app = express();

app.use(express.json())
// Add zod validation here
const validateWebhook = z.object({
    token: z.string(),
    user_identifier: z.string(),
    amount: z.string()

});
// zod infer
type WebhookPayload = z.infer<typeof validateWebhook>;

app.post("/hdfcWebhook", async (req, res) => {
    //TODO: HDFC bank should ideally send us a secret so we know this is sent by them

    const paymentInformation: {
        token: string;
        userId: string;
        amount: string
    } = {
        token: req.body.token,
        userId: req.body.user_identifier,
        amount: req.body.amount
    };

    // Validate the webhook payload
    const { success } = validateWebhook.safeParse(paymentInformation);
    if (!success) {
        res.status(400).json({
            message: "Invalid request"
        });
        return;
    }

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                }, 
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.listen(3003, () => console.log("Listening on 3003"));