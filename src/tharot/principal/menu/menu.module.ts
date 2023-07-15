import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubMenuModel } from './infraestructura/modelo/sub_menu.model';
import { SubMenuService } from './infraestructura/servicios/sub_menu.service';
import { MenuService } from './infraestructura/servicios/menu.service';
import { MenuModel } from './infraestructura/modelo/menu.model';
import { MenuRolModel } from '../menu_rol/infraestructura/modelos/menu_rol.model';
import { MenuController } from './infraestructura/controlador/menu.controller';
import { MenuRolModule } from '../menu_rol/menu_rol.module';
import { ActionsService } from './infraestructura/servicios/actions.service';
import { ActionsModel } from './infraestructura/modelo/actions.model';
import { ActionsMenuModel } from './infraestructura/modelo/actions_menu.model';
import { ActionsMenuService } from './infraestructura/servicios/actions_menu.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuModel,SubMenuModel,MenuRolModel,ActionsModel,ActionsMenuModel]), MenuRolModule],
  providers: [SubMenuService, MenuService,ActionsService,ActionsMenuService],
  controllers: [MenuController],
  exports:[SubMenuService, MenuService,ActionsService,ActionsMenuService]
})
export class MenuModule {}
