const express = require("express");
const conectarDB = require("./config/db");
const cors = require("cors")

//crear el servidor
const app = express();

//conectar a la bd
conectarDB();

//Habilitar cors
app.use(cors());

//puerto de la app
const port = process.env.PORT || 4000;

//Habilitar leer los valores de un body
app.use(express.json());

//ruta de la app
app.use("/api/usuarios", require("./routes/usuarios"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/enlaces", require("./routes/enlaces"));
app.use("/api/archivos", require("./routes/archivos"));

//arrancar la app
app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta corriendo en el puesto: ${port}`);
});
