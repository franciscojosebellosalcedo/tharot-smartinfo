import { registerAs } from '@nestjs/config';
import { createTransport } from "nodemailer";

export default registerAs('config', () => {
  return {
    database: {
      type: process.env.DB_TYPE,
      database: process.env.DB_NAME_DEV,
      port: process.env.DB_PORT,
      username: process.env.USER_DB,
      password: process.env.USER_DB_PASS,
      host: process.env.HOST_DB,
    },
    secret_key: process.env.SECRET_KEY,
    apikey: process.env.API_KEY,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackUrl: process.env.CALLBACK_URL,
    apiKeyTharot: process.env.API_KEY_THAROT,
    apiName: process.env.API_NAME,
    appIdFace: process.env.APP_ID_FACE,
    appSecretFace: process.env.APP_SECRET_FACE,
    accessTokenFace:process.env.ACCESS_TOKEN_FACE
  };
}
);

// Función: createTransport(object)
// Fecha: 2023/04/1
// Autor: Francisco bello
// Descripcion: recibe un objeto de configuracion de las propiedades para hacer posible el permiso de los envios de correos a los usuarios
// para verificar a traves de un codigo de verificacion que se le enviará para poder cambiar la contraseña de su cuenta
export const transporter = createTransport({
  //host desde el cual se estará enviando los correos (gmail)
  host: "smtp.gmail.com",
  //puerto desde donde se enviará el correo (gmail)
  port: 465,
  //para este puerto se debe colocar en true, para otros puertos diferentes debe ser false
  secure: true,
  //objeto de autenticacion de envio
  auth: {
    //usuario desde donde se enviara el correo
    user: "tharot.soporte@gmail.com",
    //contraseña que nos proporciona google para la activacion de dos pasos
    pass: "zqsrrkrhpcqumrzv",
  },
});

// Función: verify()
// Fecha: 2023/04/1
// Autor: Francisco bello
// Descripcion: devuelve una promesa e imprimo un texto para asegurar de que todo esta correctamente bien configurado
transporter.verify().then(() => {
  console.log("verificado con exito");
});


