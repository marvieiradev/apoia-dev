import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = auth(async function GET(request) {
  if (!request) {
    return NextResponse.json(
      { error: "Usuário não autenticado" },
      { status: 400 }
    );
  }

  try {
    const donates = await prisma.donation.findMany({
      where: {
        userId: request.auth?.user.id,
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

    return NextResponse.json({ data: donates });
  } catch (error) {
    return NextResponse.json(
      { error: "Falha ao buscar donates" },
      { status: 400 }
    );
  }
});
