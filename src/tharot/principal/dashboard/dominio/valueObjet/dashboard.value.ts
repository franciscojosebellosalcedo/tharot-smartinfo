import { columnEntity, dashboardEntity, widgetEntity } from "../entities/dashboard.entity";
import { v4 as uuid } from "uuid";


export class GetColumnData implements columnEntity {
  id?: number;
  dashboard_id?: number;
  title: string;
  status?: number;
  widgets?: WidgetData[]
  id_widgets?: string[]

  constructor({
    dashboard_id,
    title,
    widgets,
    id_widgets
  }: {
    dashboard_id?: number;
    title: string;
    widgets?: WidgetData[]
    id_widgets?: string[]
  }) {
    this.dashboard_id = dashboard_id;
    this.title = title;
    this.widgets = widgets;
    this.id_widgets = id_widgets;
  }
}

export class ColumnData implements columnEntity {
  id?: number;
  dashboard_id?: number;
  title: string;
  status?: number;

  constructor({
    dashboard_id,
    title
  }: {
    dashboard_id?: number;
    title: string;
  }) {
    this.id = uuid();
    this.dashboard_id = dashboard_id;
    this.title = title;
    this.status = 1;
  }

}
export class DashboardData implements dashboardEntity {
  id?: number;
  user_id: number;
  distribution: string;
  amount_column: number;
  status?: number;
  columns?: GetColumnData[]
  constructor({
    user_id,
    distribution,
    columns,
    amount_column
  }: {
    user_id: number;
    distribution: string;
    amount_column: number;
    columns?: GetColumnData[];
  }) {
    this.id = uuid();
    this.user_id = user_id;
    this.distribution = distribution;
    this.columns = columns;
    this.amount_column = amount_column;
    this.status = 1;
  }

}

export class ChangeIdColumnOfTheWidgetFirstTimeData {
  idWidget: number;
  idColumn: number;
  constructor({
    idWidget,
    idColumn
  }: {
   
    idWidget: number;
    idColumn: number;
  }) {
    this.idWidget=idWidget;
    this.idColumn = idColumn;
  }
}

export class ChangeIdColumnOfTheWidgetData {
  idWidget: number;
  currentIdColumn: number;
  newIdColumn: number;
  constructor({
    idWidget,
    currentIdColumn,
    newIdColumn
  }: {
    currentIdColumn: number;
    idWidget: number;
    newIdColumn: number;
  }) {
    this.currentIdColumn = currentIdColumn;
    this.idWidget=idWidget;
    this.newIdColumn = newIdColumn;
  }
}
export class WidgetData {
  id?: number;
  column_id?: number;
  title: string;
  content: string;
  data: string;
  status?: number;

  constructor({
    column_id,
    title,
    content,
    data
  }: {
    column_id?: number;
    title: string;
    content: string;
    data: string;
  }) {
    this.id = uuid();
    this.column_id = column_id;
    this.title = title;
    this.content = content;
    this.data = data;
    this.status = 1;
  }
}