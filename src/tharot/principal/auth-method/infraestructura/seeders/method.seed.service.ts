import { Injectable } from '@nestjs/common';
import { MethodService } from '../servicios/method.service';



@Injectable()
export class SeedService {
    constructor(private readonly methodService:MethodService){}
    async run(){
        const n = await this.methodService.countMethod();
        if(n==0){
            await this.methodService.createMethod({id: 1, name:"google"})
            await this.methodService.createMethod({id: 2, name:"local"})
        }       
        // console.log("Final: "+(await this.methodService.countMethod()));
    } 
}
