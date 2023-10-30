import { PrismaClient } from "@prisma/client";
import express from "express";
import UserModel from "../models/user-model";
import bcrypt from "bcrypt";

const userRouter = express.Router();
const prisma = new PrismaClient();

userRouter.use(express.json());

userRouter.post("/users", async (req, res) => {
  const { email, password } = req.body;

  console.log(email);

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

userRouter.get("/users", async (req, res) => {
  try {
    const read = await prisma.user.findMany();
    if (!read) {
      return res.json({
        error: "There was an error during registration. Please try again.",
      });
    } else {
      return read;
    }
  } catch (error) {
    console.error("Error registering user:", error);
    return res.json({ error: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
});

userRouter.get("/users:id", (req, res) => {
  res.send("ler usuarios por id");
});

userRouter.patch("/users:id", (req, res) => {
  res.send("atualizar um atributo do usuário");
});

userRouter.put("/users:id", (req, res) => {
  res.send("atualizar um usuário");
});

userRouter.delete("/users:id", (req, res) => {
  res.send("deletar um usuário");
});

export default userRouter;
