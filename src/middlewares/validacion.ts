import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validación para registro
export const validateRegister = [
  body('email')
    .notEmpty()
    .withMessage('El campo no puede estar vacio')
    .isEmail()
    .withMessage('El email no es válido'),
  body('password')
    .notEmpty()
    .withMessage('El campo no puede estar vacio')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres'),
  body('confirmPassword')
    .notEmpty()
    .withMessage('El campo no puede estar vacío')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Las contraseñas no coinciden'),
  body('username')
    .notEmpty()
    .withMessage('El campo no puede estar vacio')
    .isLength({ min: 5 })
    .withMessage('El nombre de usuario debe tener al menos 5 caracteres'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validación para login
export const validateLogin = [
  body('email').isEmail().withMessage('El email no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
