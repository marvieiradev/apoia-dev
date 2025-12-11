"use server";

import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function getAllDonates(userId: string) {
  if (!userId) {
    return {
      data: [],
    };
  }

  try {
    const donates = await prisma.donation.findMany({
      where: {
        userId: userId,
        status: "PAID",
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        amount: true,
        createdAt: true,
        donorName: true,
        donorMessage: true,
      },
    });

    return { data: donates };
  } catch (error) {
    return {
      data: [],
    };
  }
}
