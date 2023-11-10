import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  getUserById,
  updateUser,
} from "../controllers/user-controller";

const userRouter = express.Router();

userRouter.use(express.json());

userRouter.get("/users", getUsers);
userRouter.get("/users/:id", getUserById);
userRouter.post("/users", createUser);
userRouter.put("/users/:id", updateUser);
userRouter.delete("/users/:id", deleteUser);

export default userRouter;
