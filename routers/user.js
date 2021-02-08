const express = require("express");
const UserController = require("../controllers/user");
const multiPart = require("connect-multiparty");

const md_auth = require("../middleware/authenticated");
const md_upload_avatar = multiPart({ uploadDir: "./uploads/avatar" });

const app = express();

app.post("/sign-up", UserController.signUp);

app.post("/sign-in", UserController.signIn);

app.get("/users", [md_auth.ensureAuth], UserController.getUsers);

app.get("/users-active", [md_auth.ensureAuth], UserController.getActiveUsers);

app.put(
  "/upload-avatar/:id",
  [md_auth.ensureAuth, md_upload_avatar],
  UserController.uploadAvatar
);

module.exports = app;
