const express = require("express");
const UserController = require("../controllers/user");
const app = express();

app.post("/sign-up", UserController.signUp);

app.post("/sign-in", UserController.signIn);

module.exports = app;
