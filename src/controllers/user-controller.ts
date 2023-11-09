import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

import UserModel from "../models/user-model";

const prisma = new PrismaClient();

//#region Create User
/**
 * The function `createUser` is an asynchronous function that handles the registration of a user by
 * hashing their password and checking if the email already exists in the database.
 * @param {Request} req - The `req` parameter is an object representing the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, and
 * request URL.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code, it is used to send JSON responses with appropriate status
 * codes and error messages.
 * @returns The function `createUser` returns a Promise that resolves to a Response object. The
 * Response object contains the status code and JSON data. The possible return values are:
 */
const createUser = async (req: Request, res: Response) => {
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
      return res.status(500).json({
        error: "Email already exists.",
      });
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
    console.error("Error registering user: ", error);
    return res.status(500).json({
      error: "Internal server error.",
    });
  } finally {
    return await prisma.$disconnect();
  }
};
//#endregion

//#region Get User
/**
 * The getUser function retrieves all users from the database and returns them as a JSON response,
 * handling errors and disconnecting from the database afterwards.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns If the `read` array is empty (length === 0), then a 404 status code with an error message
 * "Users not found" is returned. Otherwise, a 200 status code with the `read` array (containing the
 * users) is returned.
 */
const getUser = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true,
      },
    });

    if (users.length === 0) {
      return res.status(404).json({
        error: "Users not found",
      });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error getting user: ", error);
    return res.status(500).json({ error: "Internal server error." });
  } finally {
    return await prisma.$disconnect();
  }
};
//#endregion

//#region Get User by Id
/**
 * The function `getUserById` retrieves a user from a database using their ID and returns it as a JSON
 * response, or returns an error if the user is not found or if there is an internal server error.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code snippet, it is used to send the JSON response back to the
 * client with the
 */
const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User Not Found.",
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error." });
  } finally {
    return await prisma.$disconnect();
  }
};
//#endregion

//#region Update User
/**
 * The updateUser function updates a user's email and password in the database, using bcrypt to hash
 * the password before storing it.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a JSON response with the updated user data if the update is successful. If the user is not
 * found, it returns a 404 error response. If there is an internal server error, it returns a 500 error
 * response.
 */
const updateUser = async (req: Request, res: Response) => {
  /* TODO: Resolver bug de atualização com um unico elemento (patch) */
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
      return res.status(404).json({
        error: "User Not Found.",
      });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error." });
  } finally {
    console.log("finally");
    return await prisma.$disconnect();
  }
};
//#endregion

//#region Delete User
/**
 * The deleteUser function is an asynchronous function that deletes a user from the database using the
 * Prisma ORM and returns a response indicating the success or failure of the operation.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, request body,
 * and more.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to set the status code,
 * headers, and send the response body.
 * @returns a response object with a status code and a JSON body. If the user is successfully deleted,
 * it will return a 200 status code with a message "User deleted successfully". If the user is not
 * found, it will return a 404 status code with an error message "User Not Found". If there is an error
 * during the deletion process, it will return a 500 status
 */
const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User Not Found." });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  } finally {
    return await prisma.$disconnect();
  }
};
//#endregion

export { createUser, getUser, getUserById, updateUser, deleteUser };
