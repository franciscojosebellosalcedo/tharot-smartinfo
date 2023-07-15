export interface dashboardEntity{
    id?:number;
    user_id:number;
    distribution:string;
    amount_column:number;
    status?:number
}

export interface columnEntity{
    id?: number;
    dashboard_id?:number;
    title: string;
    status?:number;
}

export interface widgetEntity{
    id?:number;
    column_id:number;
    title:string;
    content:string;
    data:string;
    status?:number;
}