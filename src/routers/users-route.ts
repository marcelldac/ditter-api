import { PrismaClient } from "@prisma/client";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserModel from "../models/user-model";

const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.use(express.json());

userRouter.post("/users", async (req: Request, res: Response) => {
  const { email, password }: UserModel = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  try {
    const emailExists = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (emailExists) {
      return res.status(500).json({ error: "Email already exists." });
    }

    const register = await prisma.user.create({
      data: {
        email: email,
        password: hashed,
      },
    });

    if (!register) {
      return res.status(500).json({
        error: "Internal Server Error.",
      });
    }

    return res.status(201).json({
      message: "User successfully registered.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const read = await prisma.user.findMany();
    if (read.length === 0) {
      return res.status(404).json({
        error: "Users not found",
      });
    } else {
      res.status(200).json(read);
    }
  } catch (error) {
    console.error("Erro:", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({
        error: "User Not Found.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, password }: UserModel = req.body;

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);

  try {
    const user = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        email: email,
        password: hashed,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "User Not Found.",
      });
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User Not Found." });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
});

export default userRouter;
