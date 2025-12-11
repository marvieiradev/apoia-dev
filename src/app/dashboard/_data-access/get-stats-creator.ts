"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function getStatsCreator(userId: string, stripeAccountId: string) {
  if (!userId) {
    return {
      error: "Usuario não autenticado",
    };
  }

  try {
    const totalDonations = await prisma.donation.count({
      where: {
        userId: userId,
        status: "PAID",
      },
    });

    const totalAmountDonated = await prisma.donation.aggregate({
      where: {
        userId: userId,
        status: "PAID",
      },
      _sum: {
        amount: true,
      },
    });

    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountId,
    });

    return {
      totalQtdDonations: totalDonations,
      totalAmoutResult: totalAmountDonated._sum.amount ?? 0,
      balance: balance?.pending[0]?.amount ?? 0,
    };
  } catch (error) {
    return {
      error: "Erro ao buscar estatísticas do criador: " + error,
    };
  }
}
