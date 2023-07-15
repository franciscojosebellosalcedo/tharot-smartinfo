import { InterfaceTokenEntity } from "../entities/token.entity";
import { v4 as uuid } from 'uuid';



export class TokenData implements InterfaceTokenEntity{
    id?: number;
    method_id: number;
    user_id: number;
    token: string;
    status: number;

    constructor({ method_id, user_id, token,status}:{method_id:number,user_id:number,status:number,token:string}){
        this.id=uuid();
        this.method_id=method_id;
        this.user_id=user_id;
        this.token=token;
        this.status=status;
    }
    
}