import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

export const subirImagen = async (filePath: string): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'productos', // Nombre de la carpeta en tu cuenta de Cloudinary
    });
    return result.secure_url; // URL segura de la imagen
  } catch (error) {
    throw new Error(`Error al subir la imagen a Cloudinary: ${JSON.stringify(error)}`);
  }
};
