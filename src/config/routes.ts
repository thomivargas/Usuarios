import usuariosRoutes from "../routes/usuarios.routes";
import categoriasRoutes from "../routes/categorias.routes";
import logger from "../utils/logger";

export const register = async (app: any) => {
  const url_base = '/api/v1';

  //app.use('/product', productRoutes);
  app.use(`${url_base}/usuarios`, usuariosRoutes);
  app.use(`${url_base}/categorias`, categoriasRoutes);
  logger.info("🟢 Routes registered");
};