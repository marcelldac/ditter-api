import express from "express";

const userRouter = express.Router();

userRouter.post("/users", (req, res) => {
  res.send("criar novo usuario");
});

userRouter.get("/users", (req, res) => {
  res.send("ler usuarios");
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
