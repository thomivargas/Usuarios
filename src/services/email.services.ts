import nodemailer from "nodemailer";

export const enviarEmailValidacion = async (email: string, token: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL, // Tu correo
        pass: process.env.MAILER_SECRET_KEY, // Contraseña o token de aplicación
      },
    });

    const urlValidacion = `${process.env.WEB_SERVICES_URL}/usuarios/validate-email/${token}`;

    await transporter.sendMail({
      from: `"Phantex" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Valida tu cuenta",
      html: `<p>Hola,</p>
             <p>Por favor, valida tu cuenta haciendo clic en el siguiente enlace:</p>
             <a href="${urlValidacion}">Validar Email</a>
             <p>Este enlace es válido por 1 hora.</p>`,
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};

export const enviarCambiarPassword = async (email: string, user: string, enlace: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.MAILER_SERVICE,
      auth: {
        user: process.env.MAILER_EMAIL, // Tu correo
        pass: process.env.MAILER_SECRET_KEY, // Contraseña o token de aplicación
      },
    });

    await transporter.sendMail({
      from: `"Phantex" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Cambiar Contraseña",
      html: `<p>Hola, ${user}</p>
             <p>Por favor, para cambiar tu contraseña haz clic en el siguiente enlace:</p>
             <a href="${enlace}">Cambiar Contraseña</a>
             <p>Este enlace es válido por 30 minutos.</p>`,
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};
