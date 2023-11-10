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
const authorization = async (req: Request, res: Response) => {
  //TODO: Resolver bug de geração de token mesmo se estiver com a senha errada.
  const { email, password }: LoginModel = req.body;

  try {
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
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  } finally {
    await prisma.$disconnect;
  }
};
//#endregion

//#region Login Verification
/**
 * The verification function checks if an authorization token is provided in the request headers,
 * verifies the token using a JWT secret, and calls the next middleware function if the token is valid.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is an object representing the HTTP response that will be
 * sent back to the client. It is used to send the response data, such as the status code and the
 * response body.
 * @param {NextFunction} next - The `next` parameter is a function that is used to pass control to the
 * next middleware function in the request-response cycle. It is typically called at the end of the
 * current middleware function to indicate that it has completed its processing and the next middleware
 * function should be called.
 * @returns a response with a status code and a JSON object containing a message.
 */
const verification = (req: Request, res: Response, next: NextFunction) => {
  const authToken: string | undefined = req.headers["authorization"];

  if (!authToken) {
    return res.status(401).json({ error: "Token does not provided." });
  }

  const token = authToken.split(" ")[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};
//#endregion

export { authorization, verification };
