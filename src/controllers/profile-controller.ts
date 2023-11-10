import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

import ProfileModel from "../models/profile-model";

const prisma = new PrismaClient();

//#region Create Profile
/**
 * The function creates a user profile using the provided data and returns a success message if the
 * profile is successfully created.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It contains methods and properties that allow you to control the response, such
 * as setting the status code, headers, and sending the response body.
 * @returns a response object with a status code and a JSON object. If the profile is successfully
 * created, it will return a status code of 201 and a JSON object with a "message" property set to
 * "Profile successfully created.". If there is an error during the creation process, it will return a
 * status code of 500 and a JSON object with an "error" property set to
 */

const createProfile = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { avatar_url, date_of_birth, ...rest }: ProfileModel = req.body;

  try {
    const profileExists = await prisma.profile.findFirst({
      where: {
        userID: id,
      },
    });

    if (profileExists) {
      return res
        .status(500)
        .json({ error: "This user already have a profile." });
    }

    const create = await prisma.profile.create({
      data: {
        avatarUrl: avatar_url,
        dateOfBirth: date_of_birth,
        userID: id,
        ...rest,
      },
    });

    if (!create) {
      return res.status(500).json({
        error: "Internal Server Error.",
      });
    }

    return res.status(201).json({
      message: "Profile successfully created.",
    });
  } catch (error: any) {
    console.error("Error registering user: ", error);
    res.status(500).json({
      error: "Internal server error.",
    });
  } finally {
    await prisma.$disconnect();
  }
};
//#endregion

//#region Get Profiles

/**
 * The function `getProfiles` retrieves profiles from a database using Prisma and returns them as a
 * JSON response, handling errors and disconnecting from the database.
 * @param {Request} req - The `req` parameter represents the HTTP request object, which contains
 * information about the incoming request such as headers, query parameters, and request body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status code, headers, and body. In this code snippet, it is used to send the JSON response with the
 * profiles data or
 * @returns The function `getProfiles` returns a Promise that resolves to a Response object.
 */

const getProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await prisma.profile.findMany();

    if (!profiles) {
      return res.status(404).json({
        error: "Profiles not found",
      });
    }

    return res.status(200).json(profiles);
  } catch (error: any) {
    console.error("Error getting profiles: ", error);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    await prisma.$disconnect();
  }
};
//#endregion

//#region Get Profile by Id

/**
 * The function `getProfileById` is an asynchronous function that retrieves a profile by its ID from a
 * database using Prisma and returns it as a JSON response.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request method, headers, query parameters, and request
 * body.
 * @param {Response} res - The `res` parameter is the response object that is used to send the HTTP
 * response back to the client. It contains methods and properties that allow you to set the response
 * status, headers, and body. In this code, it is used to send the JSON response with the profile data
 * or error message
 * @returns The function `getProfileById` returns a Promise that resolves to a JSON response. If the
 * profile is found, it returns a 200 status code with the profile data. If the profile is not found,
 * it returns a 404 status code with an error message. If there is an error during the execution of the
 * function, it returns a 500 status code with an error message.
 */
const getProfileById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const profile = await prisma.profile.findFirst({
      where: {
        id: {
          equals: id,
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        error: "Profile Not Found.",
      });
    }

    return res.status(200).json(profile);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  } finally {
    await prisma.$disconnect();
  }
};
//#endregion

//#region Update Profile

/**
 * The function `updateProfile` updates a user's profile information in a database using the provided
 * request parameters and body.
 * @param {Request} req - The `req` parameter is an object that represents the HTTP request made to the
 * server. It contains information such as the request headers, request body, request method, request
 * URL, and other relevant details.
 * @param {Response} res - The `res` parameter is the response object that is used to send the response
 * back to the client. It is an instance of the `Response` class from the Express framework.
 * @returns a JSON response with the updated profile data if the update is successful. If the profile
 * is not found, it returns a 404 error response. If there is an internal server error, it returns a
 * 500 error response.
 */
const updateProfile = async (req: Request, res: Response) => {
  /* TODO: Resolver bug de atualização com um unico elemento (patch) */
  const { id } = req.params;
  const { avatar_url, date_of_birth, user_id, ...rest }: ProfileModel =
    req.body;

  try {
    const profile = await prisma.profile.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        avatarUrl: avatar_url,
        dateOfBirth: date_of_birth,
        userID: user_id,
      },
    });

    if (!profile) {
      return res.status(404).json({
        error: "Profile Not Found.",
      });
    }

    return res.status(200).json(profile);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error." });
  } finally {
    await prisma.$disconnect();
  }
};
//#endregion

//#region Delete Profile

const deleteProfile = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const profile = await prisma.profile.delete({
      where: {
        id,
      },
    });

    if (!profile) {
      return res.status(404).json({ error: "Profile Not Found." });
    }

    return res.status(200).json({ message: "Profile deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  } finally {
    await prisma.$disconnect();
  }
};
//#endregion

export {
  createProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
};
