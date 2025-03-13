import { Router } from "express";
import * as categoriaController from "../controllers/categoria.controller";
import { verificarAdmin } from "../middlewares/verificarAdmin";
import { verificarToken } from "../middlewares/jwt";

const router = Router();

// crear Categoria
router.post("/", verificarToken, verificarAdmin, categoriaController.create);
// Leer Categorias
router.get("/", categoriaController.index);
// Editar Categoria por ID
router.put("/:id", verificarToken, verificarAdmin, categoriaController.update);
// Eliminar Categoria por ID
router.delete("/:id", verificarToken, verificarAdmin, categoriaController.destroy);

export default router;