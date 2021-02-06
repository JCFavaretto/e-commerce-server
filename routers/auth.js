const express = require("express");
const AuthController = require("../controllers/auth");

const app = express();

app.post("/refresh-access-token", AuthController.refreshAccessToken);

module.exports = app;
