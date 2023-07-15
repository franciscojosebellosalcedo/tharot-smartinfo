import { Module } from '@nestjs/common';
import { FormModule } from '../formularios/form/form.module';
import { FormService } from '../formularios/form/infraestructura/servicios/form.service';
import { SqlService } from "./infraestructura/servicios/sql.service";

@Module({
  imports: [FormModule],
  providers: [SqlService],
  exports: [SqlService],
})
export class SqlModule { }
