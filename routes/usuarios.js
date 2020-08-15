const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "Agrega un email valido").isEmail(),
    check("password", "El password debe tener almenos 6 caracteres").isLength({
      min: 6,
    }),
  ],
  usuarioController.nuevoUsuario
);

module.exports = router;
