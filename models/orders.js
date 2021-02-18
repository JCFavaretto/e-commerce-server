const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  comprador: {
    type: Schema.Types.ObjectId,
    ref: "Comprador",
    required: true,
  },
  calle: {
    type: String,
    required: true,
  },

  altura: {
    type: Number,
    required: true,
  },
  depto: {
    type: String,
    required: false,
  },
  piso: {
    type: String,
    required: false,
  },
  telefono: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  cart: {
    type: [],
    required: true,
  },
  estado: {
    type: String,
    required: true,
    default: "Pendiente",
  },
  total: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
