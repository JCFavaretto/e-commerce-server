const express = require("express");
const UserController = require("../controllers/user");
const md_auth = require("../middleware/authenticated");

const app = express();

app.post("/sign-up", UserController.signUp);

app.post("/sign-in", UserController.signIn);

app.get("/users", [md_auth.ensureAuth], UserController.getUsers);

app.get("/users-active", [md_auth.ensureAuth], UserController.getActiveUsers);

app.put("/update-user/:id", [md_auth.ensureAuth], UserController.updateUsers);

app.put(
  "/change-status-user/:id",
  [md_auth.ensureAuth],
  UserController.changeStatus
);

module.exports = app;
