const express = require("express");
const fileUpload = require("express-fileupload");
const md_auth = require("../middleware/authenticated");
const UploadsController = require("../controllers/uploads");

const app = express();

app.use(fileUpload({ useTempFiles: true }));

app.put(
  "/upload/:tipo/:id",
  [md_auth.ensureAuth],
  UploadsController.uploadImage
);

app.get("/imagen/:tipo/:img", UploadsController.getImagen);

module.exports = app;
