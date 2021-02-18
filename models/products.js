var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

var productoSchema = new Schema({
  nombre: {
    type: String,
    unique: true,
    required: [true, "El nombre es necesario"],
  },
  precio: {
    type: Number,
    required: [true, "El precio únitario es necesario"],
  },
  descripcion: { type: String, required: true },
  img: {
    type: String,
    required: false,
  },
  oferta: { type: Boolean },
  vendidos: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  stock: { type: Number, required: true },
  categoria: { type: String, required: true },
});

productoSchema.plugin(uniqueValidator, { message: "Ese {PATH} ya existe." });

module.exports = mongoose.model("Product", productoSchema);
