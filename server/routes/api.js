const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/gameConfigController");

// Lista de juegos disponibles
router.get("/games", ctrl.getAllGames);

// Configuracion completa de un juego
router.get("/games/:slug", ctrl.getGameConfig);

// Solo el tema visual
router.get("/games/:slug/theme", ctrl.getGameTheme);

// Datos por defecto del formulario
router.get("/games/:slug/defaults", ctrl.getGameDefaults);

// Parseo de lista de mazo
router.post("/parse-deck", express.json(), ctrl.parseDeckList);

module.exports = router;
