import { UserRepository } from "../../user/dominio/repository/user.repositoty";
import { columnRepository, dashboardRepository, widgetRepository } from "../dominio/repository/dashboard.repository";
import { ChangeIdColumnOfTheWidgetData, ChangeIdColumnOfTheWidgetFirstTimeData, ColumnData, DashboardData, GetColumnData, WidgetData } from "../dominio/valueObjet/dashboard.value";
const utf8 = require('utf8');
export class DashboardCaseUse {
  constructor(
    private readonly dashboardRepository: dashboardRepository,
    private readonly columnRepository?: columnRepository,
    private readonly widgetRepository?: widgetRepository,
    private readonly userRepository?: UserRepository) {
  }

  async deleteAllWidgetAccordingToTheStatus(idDashboard: number, status: number) {
    const dashboardFound = await this.dashboardRepository.getDashboardById(idDashboard);
    if (!dashboardFound) {
      return { ok: false, message: "Tablero no existente", status: 404, error: { message: "Tablero no existente en la aplicación" } };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const columns = await this.columnRepository.getAllColumnByIdDashboard(dashboardFound.id);
    let aux = 0;
    for (let i = 0; i < columns.length; i++) {
      const column: ColumnData = columns[i];
      const response = await this.widgetRepository.deleteAllWidgetAccordingToTheStatus(column.id, status);
      if (response["affected"] > 0) {
        aux++;
      }
    }
    if (aux > 0) {
      return { ok: true, status: 200, message: `Widgets ${status === 1 ? "activos" : "inactivos"} eliminados con exito` };
    }
    return { ok: false, status: 204, message: "Ya estos widgets fueron eliminados" };
  }

  async deleteWidgetById(idWidget: number) {
    const widget = await this.widgetRepository.getWidgetById(idWidget);
    if (!widget) {
      return { ok: false, status: 404, message: "Widget no existente" };
    }
    const responseDeletedWidget = await this.widgetRepository.deleteWidgetById(idWidget);
    if (responseDeletedWidget["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudo eliminar el widget" };
    }
    return { ok: true, status: 200, message: "Widget eliminado con exito" };
  }

  async getAllWidgetAccordingToTheStatus(idDashboard: number, status: number) {
    const dashboardFound = await this.dashboardRepository.getDashboardById(idDashboard);
    if (!dashboardFound) {
      return { ok: false, status: 404, message: "Tablero no existente en la aplicación" };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const columnsFound = await this.columnRepository.getAllColumnByIdDashboard(dashboardFound.id);
    const widgets: WidgetData[] = [];
    for (let i = 0; i < columnsFound.length; i++) {
      const column: ColumnData = columnsFound[i];
      const widgetsColumn = await this.widgetRepository.getAllWidgetAccordingToTheStatus(column.id, status);
      for (let j = 0; j < widgetsColumn.length; j++) {
        const widget: WidgetData = widgetsColumn[j];
        widgets.push(widget);
      }
    }
    if (widgets.length === 0) {
      return { ok: false, status: 204, message: `No tienes widgets ${status === 1 ? "activos" : "inactivos"}` };
    }
    return { ok: true, status: 200, message: `Widgets ${status === 1 ? "activos" : "inactivos"}`, datos: [...widgets] };
  }

  async getAllDashboardsAccordingToTheStatus(idUser: number, status: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no existente en la aplicación" };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const dashboards = await this.dashboardRepository.getAllDashboardsAccordingToTheStatus(idUser, status);
    if (dashboards.length === 0) {
      return { ok: false, message: `No tienes Tableros ${status === 1 ? "activos" : "inactivos"}`, status: 204 };
    }
    return { ok: true, status: 200, message: "Tableros", datos: [...dashboards] };
  }

  async deleteAllDashboardsAccordingToTheStatus(idUser: number, status: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no existente en la aplicación" };
    }
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const listIdDashboards = [];
    const dashboards = await this.getAllDashboardsAccordingToTheStatus(idUser, status);
    if (dashboards.ok === true) {
      for (let i = 0; i < dashboards.datos.length; i++) {
        const dashboard: DashboardData = dashboards.datos[i];
        listIdDashboards.push(dashboard.id);
      }
      const responseDeletedAllDashboards = await this.dashboardRepository.deleteAllDashboardsAccordingToTheStatus(idUser, status);
      if (responseDeletedAllDashboards["affected"] === 0) {
        return { ok: false, message: `No tienes Tableros ${status === 1 ? "activos" : "inactivos"}`, status: 204 }
      }
      for (let j = 0; j < listIdDashboards.length; j++) {
        const id: number = listIdDashboards[j];
        await this.columnRepository.deleteAllColumnByIdDashboard(id);
      }
      return { ok: true, message: `Tableros ${status === 1 ? "activos" : "inactivos"} eliminados`, status: 200 };
    }
    return { ok: dashboards.ok, status: dashboards.status, message: dashboards.message };
  }

  async deleteAllDashboardsByIdUser(idUser: number) {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no existente en la aplicación" };
    }
    const listIdDashboards = [];
    const dashboardsByIdUser = await this.dashboardRepository.getAllDashboardByIdUser(idUser);
    for (let i = 0; i < dashboardsByIdUser.length; i++) {
      const dashboard = dashboardsByIdUser[i];
      listIdDashboards.push(dashboard.id);
    }
    const responseDeletedAllDashboards = await this.dashboardRepository.deleteAllDashboardsByIdUser(idUser);
    if (responseDeletedAllDashboards["affected"] === 0) {
      return { ok: false, message: "Actualmente no tienes Tableros", status: 204 };
    }
    for (let j = 0; j < listIdDashboards.length; j++) {
      const id = listIdDashboards[j];
      await this.columnRepository.deleteAllColumnByIdDashboard(id);
    }
    return { ok: true, status: 200, message: "Todos tus Tableros se eliminaron con exito" };
  }

  async deleteDashboardById(idDashboard: number) {
    const dashboardFound = await this.dashboardRepository.getDashboardById(idDashboard);
    if (!dashboardFound) {
      return { ok: false, message: "Tablero no existente", status: 404 };
    }
    const responseDeletedDashboard = await this.dashboardRepository.deleteDashboardById(idDashboard);
    if (responseDeletedDashboard["affected"] === 0) {
      return { ok: false, message: "No se pudo eliminar el Tablero", status: 204 };
    }
    await this.columnRepository.deleteAllColumnByIdDashboard(idDashboard);
    return { ok: true, status: 200, message: "Tablero eliminado con exito" };
  }

  async deleteAllColumnsAccordingToStatus(idDashboard: number, status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const responseDeletedAllColumns = await this.columnRepository.deleteAllColumnsAccordingToStatus(idDashboard, status);
    if (responseDeletedAllColumns["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudieron eliminar las columnas" };
    }
    return { ok: true, status: 200, message: "Columnas eliminadas con exito" };
  }

  async getAllColumnsAccordingToTheStatus(idDashboard: number, status: number) {
    if (status < 0 || status > 1) {
      return { ok: false, status: 203, message: "Valor de status incorrecto debe ser 0 ó 1 (0 desactivado y 1 activo)" };
    }
    const columns = await this.columnRepository.getAllColumnsAccordingToTheStatus(idDashboard, status);
    return { ok: true, status: 200, message: `Columnas encontradas en status ${status}`, datos: [...columns] };
  }

  async getAllColumns() {
    const columns = await this.columnRepository.getAllColumns();
    if (columns.length === 0) {
      return { ok: false, status: 204, message: "No hay columnas registradas en la aplicación" };
    }
    return { ok: true, status: 200, message: "Columnas encontradas", datos: [...columns] };
  }

  async changeColumnWidgetFirstTime(body: ChangeIdColumnOfTheWidgetFirstTimeData) {
    const columnDestination = await this.columnRepository.getColumnById(body.idColumn);
    if (!columnDestination) {
      return { ok: false, status: 404, message: "Columna de destino no encontrada", error: { message: "La columna no destino no existe" } };
    }
    const responseMovedWidget = await this.widgetRepository.changeColumnWidgetFirstTime(body);
    if (responseMovedWidget["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudo mover el widget a la columna de destino", error: { message: "se produjo un error a la hora de mover el widget" } };
    }
    const dashboardFound = await this.dashboardRepository.getDashboardById(columnDestination.dashboard_id);
    if (!dashboardFound) {
      return { ok: false, status: 404, message: "El Tablero de la columna de destino no existe", error: { message: "La columna de destino no tiene Tablero en la db" } };
    }
    const datos = await this.returnDataCompleteOneDashboard(dashboardFound);
    return { ok: true, status: 200, message: "Widget movido con exito", datos };
  }

  async deleteAllColumnByIdDashboard(idDashboard: number): Promise<any> {
    const responseDeletedAllColumns = await this.columnRepository.deleteAllColumnByIdDashboard(idDashboard);
    if (responseDeletedAllColumns["affected"] === 0) {
      return { ok: false, status: 204, message: "No se pudieron eliminar las columnas de este Tablero", error: { message: "Se produjo un error al eliminar todas las columnas del Tablero error de db" } }
    }
    return { ok: true, status: 200, message: "Columnas eliminadas con exito" };
  }

  async deleteColumnById(idColumn: number) {
    const columnFound = await this.columnRepository.getColumnById(idColumn);
    if (!columnFound) {
      return { ok: false, status: 404, message: "Columna no encontrada", error: { message: "La columna que se desea eliminar no existe en ningún Tablero " } }
    }
    const responseDeletedColumn = await this.columnRepository.deleteColumnById(idColumn);
    if (responseDeletedColumn["affected"] === 0) {
      return { ok: false, message: "No se pudo eliminar la columna", error: { message: "Se produjo un error al eliminar la columna" } };
    }
    const dashboard = await this.dashboardRepository.getDashboardById(columnFound.dashboard_id);
    if (!dashboard) {
      return { ok: false, message: "No existe el Tablero de esta columna", error: { message: "El Tablero de esta columna no existe en la aplicacion db" } }
    }

    return { ok: true, message: "Columna eliminada con exito" };
  }

  async changeStatusWidget(idWidget: number, newStatus: number): Promise<WidgetData | null> {
    return await this.widgetRepository.changeStatusWidget(idWidget, newStatus);
  }

  async enablebleWidgetById(idWidget: number) {
    const widgetDisabled = await this.widgetRepository.enablebleWidgetById(idWidget);
    if (!widgetDisabled) {
      return { ok: false, status: 404, message: "La columna que desea activar no existe", error: { message: "El widget que desea activar no existe en la base de datos" } }
    }
    return { ok: true, status: 200, message: "Widget activado con exito" };
  }

  async disableWidgetById(idWidget: number) {
    const widgetDisabled = await this.widgetRepository.disableWidgetById(idWidget);
    if (!widgetDisabled) {
      return { ok: false, status: 404, message: "La columna que desea desactivar no existe", error: { message: "El widget que desea desactivar no existe" } }
    }
    return { ok: true, status: 200, message: "Widget desactivado con exito" };
  }

  async getWidgetById(idWidget: number) {
    return await this.widgetRepository.getWidgetById(idWidget);
  }

  async getColumnById(idColumn: number) {
    const columnFound = await this.columnRepository.getColumnById(idColumn);
    if (!columnFound) {
      return { ok: false, message: "No se encontró la columna", status: 404, error: { message: "Esta columna no esta registrada en la base de datos" } }
    }
    return columnFound;
  }

  async changeColumnWidget(body: ChangeIdColumnOfTheWidgetData) {
    const widgetFound = await this.widgetRepository.getWidgetById(body.idWidget);
    if (!widgetFound) {
      return { ok: false, status: 404, message: "Este widget no existe", error: { message: "El widget de id de la columna actual no existe en la base de datos" } };
    }
    const columnDestination = await this.columnRepository.getColumnById(body.newIdColumn);
    if (!columnDestination) {
      return { ok: false, status: 404, message: "Columna de destino no encontrada", error: { message: "La columna de destino no encontrada en la base de datos" } };
    }
    const widgetChangeColumn = await this.widgetRepository.changeColumnWidget(body);
    await this.changeStatusWidget(widgetFound.id, 1);
    if (widgetChangeColumn.column_id != body.newIdColumn) {
      return { ok: false, status: 200, message: "No se pudo mover el widget", error: { message: "No se cambió el column_id en el widget" } };
    }
    const dashboardFound = await this.getDashboardById(columnDestination.dashboard_id);

    if (!dashboardFound) {
      return { ok: false, status: 404, message: "No existe un Tablero" }
    }
    const datos = await this.returnDataCompleteOneDashboard(dashboardFound);

    return { ok: true, message: "Widget movido con exito", status: 200, datos };

  }

  async getOnlyAllDashboard() {
    return this.dashboardRepository.getOnlyAllDashboard();
  }

  async getDashboardById(idDashboard: number) {
    return await this.dashboardRepository.getDashboardById(idDashboard);
  }

  async enableColumn(idColumn: number) {
    const columnDisabled = await this.columnRepository.enableColumn(idColumn);
    if (!columnDisabled) {
      return { ok: false, status: 404, message: "Esta columna no existe", error: { message: "Esta columna no esta registrada en la base de datos" } }
    }
    if (columnDisabled.status === 1) {
      return { ok: true, status: 200, message: "Columna habilitada con exito" }
    }
    return { ok: false, status: 204, message: "No se pudo desabilitar esta columna", error: { message: "no cambio el valor de status en la tabla columna" } };
  }

  async disableColumn(idColumn: number) {
    const columnDisabled = await this.columnRepository.disableColumn(idColumn);
    if (!columnDisabled) {
      return { ok: false, status: 404, message: "Esta columna no existe", error: { message: "Esta columna no esta registrada en la base de datos" } }
    }
    if (columnDisabled.status === 0) {
      return { ok: true, status: 200, message: "Columna desabilitada con exito" }
    }
    return { ok: false, status: 204, message: "No se pudo desabilitar esta columna", error: { message: "no cambio el valor de status en la tabla columna" } };
  }

  async getAllWidgets(): Promise<WidgetData[]> {
    return await this.widgetRepository.getAllWidgets();
  }

  async getWidgetByIdColumn(idColumn: number): Promise<WidgetData> {
    return await this.widgetRepository.getWidgetByIdColumn(idColumn);
  }

  async getAllWidgetByIdColumn(idColumn: number): Promise<WidgetData[]> {
    return await this.widgetRepository.getAllWidgetByIdColumn(idColumn);
  }

  encodeString(str: string): object {
    const encoder = new TextEncoder();
    return encoder.encode(str);
  }

  decodeString(data: any): any {
    const decoder = new TextDecoder();
    return decoder.decode(data);

  }

  async addWidget(widget: WidgetData) {
    // const encodeText=this.encodeString(JSON.stringify(widget));
    // console.log(encodeText);
    // const decodedText=this.decodeString(encodeText);
    // console.log(JSON.parse(decodedText));
    const columnFound = await this.columnRepository.getColumnById(widget.column_id);
    if (!columnFound) {
      return { ok: false, status: 404, message: "La columna no existe", error: { message: "Esta columna no existe" } }
    }
    const widgetCreated = await this.widgetRepository.addWidget(widget);
    if (!widgetCreated) {
      return { ok: false, message: "No se pudo agregar el widget a la columna", status: 204 };
    }
    return { ok: true, message: "Widget creado con exito", status: 200, datos: { ...widgetCreated } };
  }

  async getAllDataDashboards() {
    const listDashboards = await this.dashboardRepository.getAllDataDashboards();
    if (listDashboards.length === 0) {
      return { ok: false, status: 404, message: "No hay Tableros registrados", error: { message: "No se encontró ningún Tablero registrado" } };
    }
    return await this.returnDataCompleteDashboards(listDashboards);
  }

  async getAllDashboardByIdUser(idUser: number): Promise<any> {
    const userFound = await this.userRepository.findUserById(idUser);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Usuario no existente en la aplicación (db)" } }
    }
    const listDashboards = await this.dashboardRepository.getAllDashboardByIdUser(idUser);
    if (listDashboards.length === 0) {
      return { ok: false, status: 204, message: "Este usuario no tiene Tableros registrados", error: { message: "Este usuario no a creado ningún Tablero en la aplicación" } }
    }
    return await this.returnDataCompleteDashboards(listDashboards);
  }

  async createColumn(column: ColumnData) {
    const dashboardFound = await this.getDashboardById(column.dashboard_id);
    if (!dashboardFound) {
      return { ok: false, status: 404, message: "Debe de existir el Tablero para agregar esta columna", error: { message: "no existe un Tablero con ese dashboard_id" } };
    }
    const columnCreated = await this.columnRepository.createColumn(column);
    return { ok: true, status: 200, message: "Columna agregada con exito", datos: { ...columnCreated } };
  }

  async getAllColumnByIdDashboard(idDashboard: number) {
    const dashboardFound = await this.getDashboardById(idDashboard);
    if (!dashboardFound) {
      return { ok: false, status: 404, message: "Tablero no existente", error: { message: "No existe este Tablero no existe en la base de datos" } };
    }
    const columnsFound = await this.columnRepository.getAllColumnByIdDashboard(idDashboard);
    return { ok: true, status: 200, message: "Columnas encontradas", datos: [...columnsFound] };
  }

  async enableDashboard(idDashboard: number) {
    const dashboardDisabled = await this.dashboardRepository.enableDashboard(idDashboard);
    if (!dashboardDisabled) {
      return { ok: false, status: 404, message: "Este Tablero no existe", error: { message: "Este Tablero no existe en la base de datos" } }
    }
    const columnsDashboard = (await this.getAllColumnByIdDashboard(dashboardDisabled.id)).datos;
    for (let i = 0; i < columnsDashboard.length; i++) {
      const column: ColumnData = columnsDashboard[i];
      await this.enableColumn(column.id);
    }
    if (dashboardDisabled.status === 1) {
      return { ok: true, status: 200, message: "Tablero habilitado con exito" };
    }
    return { ok: false, status: 204, message: "Hubo un error al habilitar este Tablero", error: { message: "no cambió el status del este Tablero" } };
  }

  async disableDashboard(idDashboard: number) {
    const dashboardDisabled = await this.dashboardRepository.disableDashboard(idDashboard);
    if (!dashboardDisabled) {
      return { ok: false, status: 404, message: "Este Tablero no existe", error: { message: "Este Tablero no existe en la base de datos" } }
    }
    const columnsDashboard = (await this.getAllColumnByIdDashboard(dashboardDisabled.id)).datos;
    for (let i = 0; i < columnsDashboard.length; i++) {
      const column: ColumnData = columnsDashboard[i];
      await this.disableColumn(column.id);
    }
    if (dashboardDisabled.status === 0) {
      return { ok: true, status: 200, message: "Tablero desabilitado con exito" };
    }
    return { ok: false, status: 204, message: "Hubo un error al desabilitar este Tablero", error: { message: "no cambió el status del este Tablero" } };
  }

  async createDashboard(body: DashboardData) {
    const userFound = await this.userRepository.findUserById(body.user_id);
    if (!userFound) {
      return { ok: false, status: 404, message: "Usuario no registrado en la aplicación", error: { message: "Este usuario no existe en la aplicación db" } }
    }
    const dashboardSaved = await this.dashboardRepository.createDashboard(body);
    if (!dashboardSaved) {
      return { ok: false, status: 204, message: "No se pudo crear el Tablero", error: { message: "No se creo el Tablero en la base de datos" } };
    }
    const data = { dashboard: { ...dashboardSaved }, columns: {}, widgets: {}, columnOrder: [] };
    for (let i = 0; i < dashboardSaved.amount_column; i++) {
      await this.columnRepository.createColumn({ dashboard_id: dashboardSaved.id, title: `column` });
      data.columnOrder.push(`column-${i + 1}`);
    }
    const columnsByIdDashboard = await this.columnRepository.getAllColumnByIdDashboard(dashboardSaved.id);
    let listIdWidgets = [];
    let aux = 0;
    await Promise.all(columnsByIdDashboard.map(async (column: GetColumnData) => {
      const listWidgetsColumn = (await this.getAllWidgetByIdColumn(column.id)).filter((wid) => wid.status === 1);
      for (let j = 0; j < listWidgetsColumn.length; j++) {
        const widget: WidgetData = listWidgetsColumn[j];
        listIdWidgets.push(widget.id);
        data.widgets[`widget-${j + 1}`] = { ...widget };
      }
      aux++;
      column.id_widgets = listIdWidgets;
      listIdWidgets = [];
      data.columns[`column-${aux}`] = { ...column };
    }));
    return { ok: true, status: 200, message: "Tablero creado con exito", data };
  }

  async returnDataCompleteOneDashboard(dashboardFound: DashboardData) {

    let listIdWidgets = [];
    let widgets = [];
    let aux = 0;
    let index = 1;
    const dataFragment = { dashboard: {}, columns: {}, widgets: {}, columnOrder: [] };

    dataFragment.dashboard = { ...dashboardFound };
    const columnsByIdDashboard = await (await this.columnRepository.getAllColumnByIdDashboard(dashboardFound.id)).filter((col) => col.status === 1);

    for (let i = 0; i < columnsByIdDashboard.length; i++) {
      const column: GetColumnData = columnsByIdDashboard[i];
      const listWidgetsColumn = await (await this.getAllWidgetByIdColumn(column.id)).filter((wid) => wid.status === 1);

      for (let j = 0; j < listWidgetsColumn.length; j++) {
        const widget: WidgetData = listWidgetsColumn[j];
        listIdWidgets.push(index);
        widgets.push(widget);
        index++;
      }

      const ListWitgets = listIdWidgets.map(item => {
        return `widget-${item}`;
      });

      aux++;
      column.id_widgets = [...ListWitgets];
      listIdWidgets = [];
      dataFragment.columns[`column-${aux}`] = { ...column, id: `column-${aux}`, idRegister: column.id };
      dataFragment.columnOrder.push(`column-${aux}`);
    }
    for (let l = 0; l < widgets.length; l++) {
      const itemWidget: WidgetData = widgets[l];
      dataFragment.widgets[`widget-${l + 1}`] = { ...itemWidget, id: `widget-${l + 1}`, idRegister: itemWidget.id };
    }

    return dataFragment;
  }

  async returnDataCompleteDashboards(dashboards: DashboardData[]) {

    let listDataCompleteDashboards = [];
    let listIdWidgets = [];
    let widgets = [];
    let aux = 0;
    let index = 1;

    for (let i = 0; i < dashboards.length; i++) {
      const dataFragment = { dashboard: {}, columns: {}, widgets: {}, columnOrder: [] };

      const dashboard = dashboards[i];
      dataFragment.dashboard = { ...dashboard };
      const columnsByIdDashboard = await (await this.columnRepository.getAllColumnByIdDashboard(dashboard.id)).filter((col) => col.status === 1);

      for (let i = 0; i < columnsByIdDashboard.length; i++) {
        const column: GetColumnData = columnsByIdDashboard[i];
        const listWidgetsColumn = await (await this.getAllWidgetByIdColumn(column.id)).filter((wid) => wid.status === 1);

        for (let j = 0; j < listWidgetsColumn.length; j++) {
          const widget: WidgetData = listWidgetsColumn[j];
          listIdWidgets.push(index);
          widgets.push(widget);
          index++;
        }

        const listWitgets = listIdWidgets.map((item) => {
          return `widget-${item}`;
        });

        aux++;
        column.id_widgets = [...listWitgets];
        listIdWidgets = [];
        dataFragment.columns[`column-${aux}`] = { ...column, id: `column-${aux}`, idRegister: column.id };
        dataFragment.columnOrder.push(`column-${aux}`);
      }

      for (let l = 0; l < widgets.length; l++) {
        const itemWidget: WidgetData = widgets[l];
        dataFragment.widgets[`widget-${l + 1}`] = { ...itemWidget, id: `widget-${l + 1}`, idRegister: itemWidget.id };
      }

      listDataCompleteDashboards.push(dataFragment);
      aux = 0;
      widgets = [];
      index = 1;

    }

    return listDataCompleteDashboards;
  }

}