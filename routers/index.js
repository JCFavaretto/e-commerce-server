const express = require("express");
const app = express();

app.use(require("./user"));
app.use(require("./auth"));
app.use(require("./uploads"));
app.use(require("./products"));
app.use(require("./orders"));

module.exports = app;
