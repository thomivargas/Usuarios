import { Router } from "express";
import * as categoriaController from "../controllers/categoria.controller";

const router = Router();

// crear Categoria
router.post("/", categoriaController.create);
// Leer Categorias
router.get("/", categoriaController.index);

export default router;