const express = require("express");
const UserController = require("../controllers/user");
const app = express();

app.post("/sign-up", UserController.signUp);

module.exports = app;
