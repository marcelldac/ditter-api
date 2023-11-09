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
profileRouter.get("/profiles", getProfileById);
profileRouter.post("/profiles", createProfile);
profileRouter.put("/profiles", updateProfile);
profileRouter.delete("/profiles", deleteProfile);

export default profileRouter;
