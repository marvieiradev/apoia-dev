import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature")!;
  const endpontSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = stripe.webhooks.constructEvent(payload, sig, endpontSecret);
  } catch (error) {
    return new Response(`Webhook Error: ${(error as Error).message}`, {
      status: 400,
    });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId = session.payment_intent as string;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );

      const donationId = session.metadata?.donationId;
      const donorName = session.metadata?.donorName;
      const donorMessage = session.metadata?.donorMessage;

      try {
        const updateDonation = await prisma.donation.update({
          where: { id: donationId },
          data: {
            status: "PAID",
            donorName: donorName ?? "Anônimo",
            donorMessage: donorMessage ?? "Sem mensagem",
          },
        });
      } catch (error) {
        console.error("Erro ao atualizar doação:", error);
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  return NextResponse.json({ ok: true });
}
