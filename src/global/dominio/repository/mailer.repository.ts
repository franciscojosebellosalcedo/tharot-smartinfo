import { CreateConfigMail, CreateMail, UpdateConfigMail, UpdateMail } from '../valueobject/mailer.value';

export interface MailerRepository{
    CreateConfigMail(newMailer:CreateConfigMail):Promise<CreateConfigMail | any>;
    deleteConfigMail(mailerId:number):Promise<CreateConfigMail | null>;
    getAllConfigMail():Promise<CreateConfigMail[] | null>;
    getConfigMail(id:number):Promise<CreateConfigMail | null>;
    updateConfigMail(configMailId:number,newData:UpdateConfigMail):Promise<CreateConfigMail | any>;
    CreateMail(newMailer:CreateMail):Promise<CreateMail | any>;
    deleteMail(mailerId:number):Promise<CreateMail | null>;
    getAllMail():Promise<CreateMail[] | null>;
    getMail(id:number):Promise<CreateMail | null>;
    updateMail(configMailId:number,newData:UpdateMail):Promise<CreateMail | any>;
}