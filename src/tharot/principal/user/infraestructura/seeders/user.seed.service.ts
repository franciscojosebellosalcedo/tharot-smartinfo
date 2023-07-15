import { Injectable } from '@nestjs/common';
import { UserService } from '../servicios/user.service';
import { AuthService } from '../servicios/auth.service';
import * as bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { transporter } from "src/config";
@Injectable()
export class UserSeedService {
    constructor(private readonly userService:UserService, private readonly authService:AuthService){}
    async run(){
        const n = await this.userService.countUser();
        if(n==0){
            const hash = await bcrypt.hash('123456789', 10);
            await this.userService.createUser({
                identity: '1001936668',
                username: 'Michael',
                lastname: 'Negrete',
                customer_id: 1,
                rol_id: 1,
                status: 1,
                address: '',
                session_active:0,
                phone:"+54 0000000000",
                change_password: 0
            })

            await this.authService.createAuth({
                user_identity: '1001936668',
                email: 'michael.negrete1@gmail.com',           
            })

            let parm = sign({email:'michael.negrete16@gmail.com', name: 'Michael Negrete'}, process.env.SECRET_KEY, {
                algorithm: "HS256",
            }); 
            let parm1 = ""
            let punto = {
            status: true,
            position: 0,
            };
            for (let i = 0; i < parm.length; i++) {
            if (parm[i] === ".") {
                parm1 += parm[i];
                punto.status = true;
                punto.position = i;
            } else if (i == punto.position + 5) {
                const char1 = String.fromCharCode(
                Math.floor(Math.random() * 26) + 97
                );
                const char2 = String.fromCharCode(
                Math.floor(Math.random() * 26) + 97
                );
                parm1 += parm[i] + char1 + char2;
                punto.status = false;
            } else {
                parm1 += parm[i];
            }
            }
            //parm = parm.slice(0, 5) + char1 + char2 + parm.slice(5);
            //const token = parm.slice(0,5) + parm.slice(7);
            punto.status = true;
            punto.position = 0;
            let token = "";
            for (let j = 0; j < parm1.length; j++) {
            if (parm1[j] === ".") {
                token += parm1[j];
                punto.status = true;
                punto.position = j;
            } else if (j == punto.position + 6 || j == punto.position + 7) {
                punto.status = false;
            } else {
                token += parm1[j];
            }
            }
            const send = transporter.sendMail({
            from: `<${process.env.EMAIL_EMISOR}>`,
            to: 'michael.negrete16@gmail.com',
            subject: "SmartInfo ✔",
            text: "BIENVENIDO A THAROT",
            html: `
            <p style="font-size:16px;">Hola Michael Negrete</p> 
            <p style="font-size:15px;"> Ingresa al siguiente enlace para terminar la configuración de tu cuenta:</p> http://tharot.smartinfo.co/?${parm1} 
            <br>
            <br>
            `
            }, function (error, info) {
            if (error) {
                console.log("Error al enviar email");
            } else {
                console.log("Correo enviado correctamente");
            }
            });
        }
    }       
} 
