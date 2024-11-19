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

    const info = await transporter.sendMail({
      from: `"Validar Email" <${process.env.MAILER_EMAIL}>`,
      to: email,
      subject: "Valida tu cuenta",
      html: `<p>Hola,</p>
             <p>Por favor, valida tu cuenta haciendo clic en el siguiente enlace:</p>
             <a href="${urlValidacion}">Validar Email</a>
             <p>Este enlace es válido por 1 hora.</p>`,
    });

    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error("Error al enviar correo:", error);
    throw new Error("Error al enviar correo electrónico");
  }
};
