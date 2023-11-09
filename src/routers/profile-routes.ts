import express from "express";
import {
  createProfile,
  deleteProfile,
  getProfileById,
  getProfiles,
  updateProfile,
} from "../controllers/profile-controller";

const profileRouter = express.Router();

profileRouter.use(express.json());

profileRouter.get("/profiles", getProfiles);
profileRouter.get("/profiles/:id", getProfileById);
profileRouter.post("/profiles/:id", createProfile);
profileRouter.put("/profiles/:id", updateProfile);
profileRouter.delete("/profiles/:id", deleteProfile);

export default profileRouter;
