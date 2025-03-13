import multer, { diskStorage } from 'multer';

const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta temporal para almacenar imágenes
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Máximo 5 MB
  },
});

export default upload;