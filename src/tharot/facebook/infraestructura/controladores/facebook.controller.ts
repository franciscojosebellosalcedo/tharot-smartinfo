import { Controller, Get, Param, Query } from '@nestjs/common';
import { FacebookService } from '../servicios/facebook.service';

@Controller('facebook')
export class FacebookController {
    constructor(private readonly facebook_:FacebookService){}

    @Get("")
    async getPages(){
        return await this.facebook_.getPages();
    }

    @Get("/page")
    async getforms(@Query("idPage") idPage:string, @Query("token") tokenPage:string){
        return await this.facebook_.getLeadgenForms(idPage, tokenPage);
    }

    @Get("/leads")
    async getCampaing(@Query("idForm") idForm:string){
        return await this.facebook_.getLeads(idForm);
    }
}
