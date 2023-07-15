import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe ,Put, Patch} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TokenCaseUse } from "../../aplicacion/token.case.use";
import { CreateTokenDto, UpdateTokenDto } from "../dto/token.dto";
import { TokenService } from "../servicios/token.service";

@ApiTags("tokens")
@Controller("tokens")
export class TokenController {

    private tokenCaseUse: TokenCaseUse;
    constructor(private tokenService: TokenService) {
        this.tokenCaseUse = new TokenCaseUse(this.tokenService);
    }

    @Post("new-token")
    createToken(@Body() body: CreateTokenDto) {
        return this.tokenCaseUse.createToken(body);
    }

    @Get("all")
    getAllTokens(){
        return this.tokenCaseUse.getAllTokens();
    }

    @Get(":tokenId")
    getTokenById(@Param() param){
        return this.tokenCaseUse.getTokenById(parseInt(param.tokenId));
    }

    @Delete("delete/:tokenId")
    deleteToken(@Param() param){
        return this.tokenCaseUse.deleteToken(parseInt(param.tokenId));
    }


    @Patch("update/:tokenId")
    updateToken(@Param() param,@Body() body:UpdateTokenDto){
        return this.tokenCaseUse.updateToken(parseInt(param.tokenId),body);
    }
}