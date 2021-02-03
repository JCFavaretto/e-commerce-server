const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const { API_VERSION } = require("./config/config");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure Header HTTP
// .........

// Router Basic
app.use(require("./routers"));

module.exports = app;
