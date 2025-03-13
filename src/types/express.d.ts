import { MulterFile } from "multer"; // Importa si usas types para Multer

declare global {
  namespace Express {
    interface Request {
      file?: MulterFile; // Añade el tipo para `req.file`
      files?: MulterFile[]; // Si usas múltiples archivos
    }
  }
}
