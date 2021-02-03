const mongoose = require("mongoose");
const Schema = mongoose.Schema;
var uniqueValidator = require("mongoose-unique-validator");

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, "Ingrese el nombre"],
  },
  lastName: {
    type: String,
    required: [true, "Ingrese el apellido"],
  },
  email: {
    type: String,
    required: [true, "Ingrese el email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Ingrese la contraseña"],
  },
  role: {
    type: String,
    default: "USER_ROLE",
  },
  active: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
