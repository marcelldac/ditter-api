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
    const register = await prisma.user.create({
      data: {
        email: email,
        password: hashed,
      },
    });

    if (!register) {
      return res.json({
        error: "There was an error during registration. Please try again.",
      });
    } else {
      return res.json({
        message: "User successfully registered.",
      });
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.json({
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
      return res.json({
        error: "Users not found",
      });
    } else {
      res.json(read);
    }
  } catch (error) {
    console.error("Erro:", error);
    return res.json({ error: "Internal server error." });
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
      res.json(user);
    } else {
      res.json({
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
      res.json({
        error: "User Not Found.",
      });
    } else {
      res.json(user);
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
      res.sendStatus(404);
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
