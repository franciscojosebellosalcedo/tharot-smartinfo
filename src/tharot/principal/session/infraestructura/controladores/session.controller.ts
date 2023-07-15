import { Controller ,Get, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SessionCaseUse } from "../../aplicacion/session.case.use";
import { SessionService } from "../servicios/session.service";

@Controller("session")
@ApiTags("sesión")
export class SessionController {
  private sessionCaseUse: SessionCaseUse;
  constructor(
    private readonly sessionService: SessionService,
  ) {
    this.sessionCaseUse = new SessionCaseUse(this.sessionService);
  }

  @Get()
  getAllSession() {
    return this.sessionCaseUse.getAllSessionData();
  }

  @Patch("disable/:id")
  disableSession(@Param() param) {
    return this.sessionCaseUse.disableSession(parseInt(param.id));
  }
}