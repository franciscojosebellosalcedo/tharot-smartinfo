import { Injectable } from '@nestjs/common';
import { RolService } from '../servicios/rol.service';

@Injectable()
export class RolSeedService {
    constructor(private readonly rolService:RolService){}
    async run(){
        const n = await this.rolService.countRol();
        if(n==0){
            await this.rolService.createRol({
                id: 1,
                name: 'super',
                level: 0
            })
            await this.rolService.createRol({
                id: 2,
                name: 'administrador',
                level: 1
            })
            await this.rolService.createRol({
                id: 3, 
                name: 'operador',
                level: 2
            })
        }       
    } 
}