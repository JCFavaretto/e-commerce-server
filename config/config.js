// -------------------------
// Puerto
//--------------------------
process.env.PORT = process.env.PORT || 3977;

//--------------------------
// Entorno
//--------------------------
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//-------------------------
// Base de Datos
//--------------------------
let urlDB = "";
if (process.env.NODE_ENV === "dev") {
  urlDB = "mongodb://localhost:27017/server-portfolio";
} else {
  urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//-------------------------
// Secret key token
//--------------------------
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";
