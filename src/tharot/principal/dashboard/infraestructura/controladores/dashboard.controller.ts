//importando los decoradores necesarios para este controlador
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { UserService } from "../../../user/infraestructura/servicios/user.service";
import { JwtAuthGuard } from "../../../../../global/dominio/guards/jwt.guard";
import { DashboardCaseUse } from "../../aplicacion/dashboard.case.use";
import {
  ChangeIdColumnOfTheWidgetDto, ChangeIdColumnOfTheWidgetFirstTimeDto,
  CreateColumnDto, CreateDashboardDto, CreateWidgetDto
} from "../dto/dashboard.dto";
import { ColumnService } from "../servicios/column.service";
import { DashboardService } from "../servicios/dashboard.service";
import { WidgetService } from "../servicios/widget.service";

@UseGuards(JwtAuthGuard)
@ApiTags("Dashboard (Tablero inicial)")
@Controller("dashboard")
export class DashboardController {
  private dashboardCaseUse: DashboardCaseUse;

  constructor(private dashboardService: DashboardService, private columnService: ColumnService, private widgetService: WidgetService, private userService: UserService) {
    this.dashboardCaseUse = new DashboardCaseUse(this.dashboardService, this.columnService, this.widgetService, this.userService);
  }

  //DASHBOARD
  @Delete("deleteAll-accordingToTheStatus/:idUser/:status")
  async deleteAllDashboardsAccordingToTheStatus(@Param() param){
    return await this.dashboardCaseUse.deleteAllDashboardsAccordingToTheStatus(parseInt(param.idUser),parseInt(param.status));
  }

  @Delete("deleteAll/:idUser")
  async deleteAllDashboardsByIdUser(@Param() param){
    return await this.dashboardCaseUse.deleteAllDashboardsByIdUser(parseInt(param.idUser));
  }

  @Delete(":idDashboard")
  async deleteDashboardById(@Param() param){
    return await this.dashboardCaseUse.deleteDashboardById(parseInt(param.idDashboard));
  }

  @Get("only-dashboard")
  async getOnlyAllDashboard() {
    return await this.dashboardCaseUse.getOnlyAllDashboard();
  }

  @Get("all-data")
  async getAllDataDashboards() {
    return await this.dashboardCaseUse.getAllDataDashboards();
  }

  @Get(":idUser")
  async getAllDashboardByIdUser(@Param() param) {
    return await this.dashboardCaseUse.getAllDashboardByIdUser(parseInt(param.idUser));
  }

  @Patch("enable/:id")
  async enableDashboard(@Param() param) {
    return await this.dashboardCaseUse.enableDashboard(parseInt(param.id));
  }

  @Patch("disable/:id")
  async disableDashboard(@Param() param) {
    return await this.dashboardCaseUse.disableDashboard(parseInt(param.id));
  }

  @Post()
  async createDashboard(@Body() body: CreateDashboardDto) {
    return await this.dashboardCaseUse.createDashboard(body);
  }

  //WIDGETS
  @Delete("widget/deleteAll-according-to-the-status/:idDashboard/:status")
  async deleteAllWidgetAccordingToTheStatus(@Param() param){
    return await this.dashboardCaseUse.deleteAllWidgetAccordingToTheStatus(parseInt(param.idDashboard),parseInt(param.status));
  }

  @Delete("widget/:idWidget")
  async deleteWidgetById(@Param() param){
    return await this.dashboardCaseUse.deleteWidgetById(parseInt(param.idWidget));
  }

  @Get("widget/allWidget-according-to-status/:idDashboard/:status")
  async getAllWidgetAccordingToTheStatus(@Param() param){
    return await this.dashboardCaseUse.getAllWidgetAccordingToTheStatus(parseInt(param.idDashboard),parseInt(param.status));
  }

  @Patch("widget/enable/:idWidget")
  async enablebleWidgetById(@Param() param) {
    return await this.dashboardCaseUse.enablebleWidgetById(parseInt(param.idWidget));
  }

  @Patch("widget/disable/:idWidget")
  async disableWidgetById(@Param() param) {
    return await this.dashboardCaseUse.disableWidgetById(parseInt(param.idWidget));
  }

  @Patch("widget/change-column-firtTime")
  async changeColumnWidgetFirstTime(@Body() body: ChangeIdColumnOfTheWidgetFirstTimeDto) {
    return await this.dashboardCaseUse.changeColumnWidgetFirstTime(body);
  }

  @Patch("widget/change-column")
  async changeColumnWidget(@Body() body: ChangeIdColumnOfTheWidgetDto) {
    return await this.dashboardCaseUse.changeColumnWidget(body);
  }

  @Post("widget")
  async addWidget(@Body() body: CreateWidgetDto) {
    return await this.dashboardCaseUse.addWidget(body);
  }

  //COLUMNS
  @Delete("column/deleteAll/according-to-the-status/:idDashboard/:status")
  async deleteAllColumnsAccordingToStatus(@Param() param){
    return await this.dashboardCaseUse.deleteAllColumnsAccordingToStatus(parseInt(param.idDashboard),parseInt(param.status));
  }

  @Get("column/all/according-to-the-status/:idDashboard/:status")
  async getAllColumnsAccordingToTheStatus(@Param() param) {
    return await this.dashboardCaseUse.getAllColumnsAccordingToTheStatus(parseInt(param.idDashboard),parseInt(param.status));
  }

  @Get("column/all")
  async getAllColumns() {
    return await this.dashboardCaseUse.getAllColumns();
  }

  @Delete("column/delete-all/:idDashboard")
  async deleteAllColumnByIdDashboard(@Param() param) {
    return await this.dashboardCaseUse.deleteAllColumnByIdDashboard(parseInt(param.idDashboard));
  }

  @Delete("column/delete/:idColumn")
  async deleteColumnById(@Param() param) {
    return await this.dashboardCaseUse.deleteColumnById(parseInt(param.idColumn));
  }

  @Get("column/:idDashboard")
  async getAllColumnByIdDashboard(@Param() param) {
    return await this.dashboardCaseUse.getAllColumnByIdDashboard(parseInt(param.idDashboard));
  }

  @Post("column")
  async createColumn(@Body() body: CreateColumnDto) {
    return await this.dashboardCaseUse.createColumn(body);
  }

  @Patch("column/disable/:idColumn")
  async disableColumn(@Param() param) {
    return await this.dashboardCaseUse.disableColumn(parseInt(param.idColumn));
  }

  @Patch("column/enable/:idColumn")
  async enableColumn(@Param() param) {
    return await this.dashboardCaseUse.enableColumn(parseInt(param.idColumn));
  }

}
