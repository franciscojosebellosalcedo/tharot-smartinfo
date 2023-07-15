import { ChangeIdColumnOfTheWidgetData, ChangeIdColumnOfTheWidgetFirstTimeData, ColumnData, DashboardData, WidgetData } from "../valueObjet/dashboard.value";

export interface dashboardRepository{
    deleteDashboardById(idDashboard:number):Promise<any>;
    deleteAllDashboardsAccordingToTheStatus(idUser:number,status: number):Promise<any>;
    deleteAllDashboardsByIdUser(idUser:number):Promise<any>;

    getAllDashboardsAccordingToTheStatus(idUser:number, status:number):Promise<DashboardData[] | null>;
    getOnlyAllDashboard():Promise<DashboardData[] |null>;
    getAllDataDashboards():Promise<DashboardData[] |null>;
    getDashboardById(idDashboard:number):Promise<DashboardData | null>;
    getAllDashboardByIdUser(idUser:number):Promise<DashboardData[] | null>;

    createDashboard(body:DashboardData):Promise<DashboardData | null>;

    disableDashboard(idDashboard:number):Promise<DashboardData | null>;
    enableDashboard(idDashboard:number):Promise<DashboardData | null>;
}

export interface columnRepository{
    deleteAllColumnsAccordingToStatus(idDashboard:number,status: number):Promise<any>;
    deleteAllColumnByIdDashboard(idDashboard:number):Promise<any>;
    deleteColumnById(idColumn:number):Promise<any>;

    getAllColumnsAccordingToTheStatus(idDashboard:number,status:number):Promise<ColumnData[] | null>;
    getAllColumns():Promise<ColumnData[] | null>;
    getColumnById(idColumn:number):Promise<ColumnData | null>;
    getAllColumnByIdDashboard(idDashboard:number):Promise<ColumnData[] | null>;

    enableColumn(idColumn:number):Promise<ColumnData | null>;
    disableColumn(idColumn:number):Promise<ColumnData | null>;

    createColumn(column:ColumnData):Promise<ColumnData | null>;
}

export interface widgetRepository{
    deleteWidgetById(idWidget:number):Promise<any>;
    deleteAllWidgetAccordingToTheStatus(idColumn:number,status: number):Promise<any>;
    
    changeColumnWidgetFirstTime(body:ChangeIdColumnOfTheWidgetFirstTimeData):Promise<WidgetData|null>;
    changeColumnWidget(body:ChangeIdColumnOfTheWidgetData):Promise<WidgetData|null>;
    changeStatusWidget(idWidget:number,newStatus:number):Promise<WidgetData | null> ;
    
    addWidget(widget:WidgetData):Promise<WidgetData | null>;
    
    disableWidgetById(idWidget:number):Promise<WidgetData | null>;
    enablebleWidgetById(idWidget:number):Promise<WidgetData | null>;
    
    getAllWidgetAccordingToTheStatus(idColumn:number,status:number):Promise<WidgetData[] |null>;
    getWidgetById(idWidget:number):Promise<WidgetData | null>;
    getAllWidgets():Promise<WidgetData[]>;
    getWidgetByIdColumn(idColumn:number):Promise<WidgetData | null>;
    getAllWidgetByIdColumn(idColumn:number):Promise<WidgetData[] | null>;
}