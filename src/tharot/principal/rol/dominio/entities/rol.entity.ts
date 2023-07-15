export interface rol {
  id?: number;
  name: string;
  level: number;
  status?: number;
}

export interface updateRol {
  name?: string;
  level?: number;
  status?: number;
}
