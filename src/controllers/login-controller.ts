import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password }: { email: string; password: string } = req.body;

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  /* TODO: Resolver bug de senha (carregamento infinito se a senha estiver errada) */
  bcrypt.compare(
    password,
    user.password,
    (err: Error | undefined, result: Boolean) => {
      if (err) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }
      if (result) {
        res.status(200).json({ message: "Authenticated Successfully" });
        return;
      }
    }
  );
};

export { login };
