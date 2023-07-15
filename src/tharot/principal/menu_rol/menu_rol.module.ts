import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuRolModel } from './infraestructura/modelos/menu_rol.model';
import { SubMenuModel } from '../menu/infraestructura/modelo/sub_menu.model';
import { MenuRolService } from './infraestructura/servicios/menu_rol.service';

@Module({
  imports: [ TypeOrmModule.forFeature([MenuRolModel, SubMenuModel]),],
  providers: [MenuRolService],
  exports: [MenuRolService]
})
export class MenuRolModule {}
