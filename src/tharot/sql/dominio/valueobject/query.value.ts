import { CamposTable } from "../entities/query.entity";
export class CreateEntity implements CamposTable {
  name: string;
  format: string;
  required: number;
  unique: number;
  max_length: number;
  constructor({
    format,
    required,
    unique,
    max_length,
  }: {
    name: string;
    format: string;
    required: number;
    unique: number;
    max_length: number;
  }) {
    this.format = format;
    this.required = required;
    this.unique = unique;
    this.max_length = max_length;
  }
}
