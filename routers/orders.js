const express = require("express");
const OrderContoller = require("../controllers/orders");
const md_auth = require("../middleware/authenticated");

const app = express();

app.post("/comprar", md_auth.ensureAuth, OrderContoller.createBuyOrder);

module.exports = app;
