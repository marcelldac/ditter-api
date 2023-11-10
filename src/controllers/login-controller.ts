import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";

import LoginModel from "../models/login-model";

const prisma: PrismaClient = new PrismaClient();

//#region Login Authorization
/**
 * The function `authorization` is responsible for handling user login and generating a JWT token if
 * the credentials are valid.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is an instance of the `Response` object from the
 * Express.js framework. It represents the HTTP response that will be sent back to the client.
 * @returns a response with a status code of 201 and a JSON object containing a token.
 */
const authorization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  //TODO: Resolver bug de geração de token mesmo se estiver com a senha errada.
  const { email, password }: LoginModel = req.body;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (!userExists) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = compare(password, userExists.password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const jwtToken = jwt.sign({ sub: userExists.id }, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  });

  return res.status(201).json({ token: jwtToken });
};
//#endregion

const verification = (req: Request, res: Response, next: NextFunction) => {
  const authToken = req.headers["authorization"];

  if (!authToken) {
    return res.status(401).json({ message: "Token does not provided." });
  }

  const token = authToken?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Invalid token." });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
};

export { authorization, verification };
