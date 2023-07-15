import { Injectable } from '@nestjs/common';

import { ConfigMailerModel } from '../modelo/configmail.model';
import { MailModel } from '../modelo/mail.model';
import { MailerRepository } from '../../dominio/repository/mailer.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateConfigMail, UpdateConfigMail, CreateMail, UpdateMail } from '../../dominio/valueobject/mailer.value';

@Injectable()
export class ConfigmailService implements MailerRepository{
    constructor(@InjectRepository(MailModel) private mail: Repository<MailModel>, @InjectRepository(ConfigMailerModel) private mailer : Repository<ConfigMailerModel>){}

    async CreateConfigMail(newMailer: CreateConfigMail): Promise<any> {
        const config = await this.mailer.create(newMailer);
        return await this.mailer.save(config);
    }
    async deleteConfigMail(mailerId: number): Promise<CreateConfigMail> {
        throw new Error('Method not implemented.');
    }
    async getAllConfigMail(): Promise<CreateConfigMail[]> {
        return await this.mailer.find();
    }

    async getConfigMail(id: number): Promise<CreateConfigMail> {
        return await this.mailer.findOne({where:{id}});
    }
    async updateConfigMail(configMailId: number, newData: UpdateConfigMail): Promise<any> {
        const config = await this.mailer.findOne({where:{id:configMailId}});
        const data = {...config, ...newData};
        return await this.mailer.save(data);
    }
    async CreateMail(newMailer: CreateMail): Promise<any> {
        const mailNew = await this.mail.create(newMailer)
        return await this.mail.save(mailNew)
    }
    async deleteMail(mailerId: number): Promise<CreateMail> {
        throw new Error('Method not implemented.');
    }
    async getAllMail(): Promise<CreateMail[]> {
        return await this.mail.find();
    }
    async getMail(id: number): Promise<CreateMail> {
        return await this.mail.findOne({where:{id}})
    }
    async updateMail(configMailId: number, newData: UpdateMail): Promise<any> {
        throw new Error('Method not implemented.');
    }
}
