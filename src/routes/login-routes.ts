import express, { Router } from "express";

import { authorization } from "../controllers/login-controller";

const loginRouter: Router = express.Router();

loginRouter.use(express.json());

loginRouter.post("/authorization", authorization);

export default loginRouter;
