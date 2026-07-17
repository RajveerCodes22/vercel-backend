import Stripe from "stripe"
import UserModel from "../models/user.model.js"
import dotenv from "dotenv"
dotenv.config()


console.log("CLIENT_URL:", process.env.CLIENT_URL);
console.log("Success URL:", `${process.env.CLIENT_URL}/payment-success`);
console.log("Cancel URL:", `${process.env.CLIENT_URL}/payment-failed`);
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const Credit_Map = {
    100: 50,
    300: 250,
    500: 400
};

export const createCreditOrder = async (req, res) => { 
    try {
        const userId = req.userId
        const { amount } = req.body;

        if (!Credit_Map[amount]) {
            return res.status(400).json({
                message: "Invalid Credit Plan"
            });
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            success_url: `${process.env.CLIENT_URL}/payment-success`,
            cancel_url: `${process.env.CLIENT_URL}/payment-failed`,
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: `${Credit_Map[amount]} Credits`,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1
                },
            ],
            metadata: {
                userId,
                credits: Credit_Map[amount],
            },
        })

        res.status(200).json({ url: session.url })
    } catch (error) {
    console.error("Stripe Error:", error);

    return res.status(500).json({
        success: false,
        message: error.message,
    });
}
}

export const stripeWebhook = async (req, res) => {
    const signature = req.headers["Stripe-Signature"]
    let event;

    try {
        event = stripe.webhooks.constructEvent()
        req.body,
            sig,
            process.env.STRIPE_WEBHOOK_KEY

    } catch (error) {
        console.log("❌ Webhook signature error:", error.message);
        return res.status(400).send("Webhook Error");

    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const creditsToAdd = Number(session.metadata.credits);

        if (!userId || !creditsToAdd) {
            return res.status(400).json({ message: "Invalid metadata" });
        }

        const user = await UserModel.findByIdAndUpdate(userId, {
            $inc: { credits: creditsToAdd },
            $set: { isCreditAvailable: true },
        }, { new: true })
    }

    res.json({ recieved: true })
}
