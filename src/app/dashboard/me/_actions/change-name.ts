"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

const changeNameSchema = z.object({
  name: z.string().min(4, "O name precisa ter mais e 4 caracteres").max(100),
});

type ChangeNameSchema = z.infer<typeof changeNameSchema>;

export async function changeName(data: ChangeNameSchema) {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
    return {
      data: null,
      error: "Usuário não autenticado.",
    };
  }

  const schema = changeNameSchema.safeParse(data);
  if (!schema.success) {
    return {
      data: null,
      error: schema.error.issues[0].message,
    };
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { name: data.name },
    });

    return {
      data: user.name,
      error: null,
    };
  } catch (error) {
    console.error("Error updating name:", error);
    return {
      data: null,
      error: "Erro ao atualizar o nome. Tente novamente mais tarde.",
    };
  }
}
