"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createUsernameSchema = z.object({
  username: z.string({ message: "Nome de usuário é obrigatório" }),
});

type CreateUsernameSchema = z.infer<typeof createUsernameSchema>;

export async function getInfoUser(data: CreateUsernameSchema) {
  const schema = createUsernameSchema.safeParse(data);

  if (!schema.success) {
    return null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { username: data.username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        image: true,
        connectedStripeAccountId: true,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
}
