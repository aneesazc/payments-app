import express from "express";
import db from "@repo/db/client";
import { z } from "zod";

const app = express();

app.use(express.json());

// Correct the validation schema to match the actual payload structure
const validateWebhook = z.object({
  token: z.string(),
  user_identifier: z.string(),
  amount: z.string(),
});

// zod infer
type WebhookPayload = z.infer<typeof validateWebhook>;

app.get("/", (req, res) => {
  res.send("Hello from bank webhook");
});

app.post("/hdfcWebhook", async (req, res) => {
  console.log("Received request:", req.body);

  // Extract payment information correctly
  const paymentInformation: WebhookPayload = {
    token: req.body.token,
    user_identifier: req.body.user_identifier,
    amount: req.body.amount,
  };

  // Validate the webhook payload
  const validationResult = validateWebhook.safeParse(paymentInformation);
  console.log("Validation result:", validationResult);

  if (!validationResult.success) {
    console.log("Validation failed:", validationResult.error);
    res.status(400).json({
      message: "Invalid request",
    });
    return;
  }

  try {
    await db.$transaction([
      db.balance.updateMany({
        where: {
          userId: Number(paymentInformation.user_identifier),
        },
        data: {
          amount: {
            increment: Number(paymentInformation.amount),
          },
        },
      }),
      db.onRampTransaction.updateMany({
        where: {
          token: paymentInformation.token,
        },
        data: {
          status: "Success",
        },
      }),
    ]);

    res.json({
      message: "Captured",
    });
  } catch (e) {
    console.error("Error during transaction:", e);
    res.status(500).json({
      message: "Error while processing webhook",
    });
  }
});

app.listen(3003, () => console.log("Listening on 3003"));
