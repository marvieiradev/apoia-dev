"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const createPaymentsSchema = z.object({
  slug: z.string().min(1, "Slug do criador é obrigatório"),
  name: z.string().min(1, "O nome é obrigatório"),
  message: z.string().min(5, "A mensagem precisa ter no minimo 5 caracteres"),
  price: z.number().min(1500, "Seu valor precisa ser no minimo 15"),
  creatorId: z.string(),
});

type CreatePaymentsSchema = z.infer<typeof createPaymentsSchema>;

export async function createPayment(data: CreatePaymentsSchema) {
  const schema = createPaymentsSchema.safeParse(data);

  if (!schema.success) {
    return {
      data: null,
      error: schema.error.issues[0].message,
    };
  }

  try {
    const creator = await prisma.user.findUnique({
      where: {
        id: data.creatorId,
      },
    });
  } catch (error) {
    return {
      data: null,
      error: "Falha ao criar pagamento: " + error,
    };
  }
}
