import { Module } from '@nestjs/common';
import { FormModule } from './form/form.module';
import { SqlModule } from "../sql/sql.module";

@Module({
  imports: [FormModule, SqlModule],
})
export class FormularioModule {}
