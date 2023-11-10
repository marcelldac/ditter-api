import express, { Router } from "express";

import { login } from "../controllers/login-controller";

const loginRouter: Router = express.Router();

loginRouter.use(express.json());

loginRouter.post("/login", login);

export default loginRouter;
