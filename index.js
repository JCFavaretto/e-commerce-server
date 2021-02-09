const mongoose = require("mongoose");
const app = require("./app");

require("./config/config");

mongoose.connect(
  process.env.URLDB,
  {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err, res) => {
    if (err) {
      throw err;
    }
    console.log("La conexion a la base de datos es correcta.");
    app.listen(process.env.PORT, () => {
      console.log("Escuchando el puerto", process.env.PORT);
    });
  }
);
