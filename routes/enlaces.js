const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const auth = require("../middleware/auth");
const enlacesController = require("../controllers/enlacesController");
const archivosController = require("../controllers/archivosController");

router.post(
  "/",
  [
    check("nombre", "Sube un archivo").not().isEmpty(),
    check("nombre_original", "Sube un archivo").not().isEmpty(),
  ],
  auth,
  enlacesController.nuevoEnlace
);

router.get("/", enlacesController.todosEnlaces)

router.get("/:url", enlacesController.tienePassword, enlacesController.obtenerEnlace)

router.post("/:url", enlacesController.verificarPassword, enlacesController.obtenerEnlace)

module.exports = router;
