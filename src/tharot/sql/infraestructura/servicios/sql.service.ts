import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { CampoData } from '../../../formularios/form/dominio/valueobject/campo.value';
import { DataSource } from 'typeorm';
import { EntityRepo } from '../../dominio/repository/query.repository';

@Injectable()
export class SqlService implements EntityRepo {
  constructor(@InjectDataSource() private dataSource: DataSource) { }

  async getOneRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any> {
    const sql=`select * from ${nameTable} where id=${idRegister}`;
    return await this.dataSource.query(sql);
  }

  async updateRegisterTableByNameById(idRegister: number, nameTable: string,data:object): Promise<any> {
    let sql=`update ${nameTable} set  `;
    const keys = Object.keys(data);
    const aux=keys.length-1;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i].toLowerCase();
      let lineValueSql=`${key}='${data[key]}' ,`;
      if(aux===i){
        lineValueSql=`${key}='${data[key]}' where id=${idRegister}`;
      }
      sql=sql+lineValueSql;
    }
    const resultSql=await this.dataSource.query(sql);
    const sqlSecundary=`select * from ${nameTable} where id=${idRegister}`;
    const registerFound=await this.dataSource.query(sqlSecundary);
    const [,affect]=resultSql;
    return {affect,registerFound};
  }

  async enabledRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any> {
    const sqlDelete = `update ${nameTable} set status=1 where id = ${idRegister}`;
    const [, responseDelete] = await this.dataSource.query(sqlDelete);
    const sqlFoundRegister = `select * from ${nameTable} where id = ${idRegister}`;
    const [registerFound] = await this.dataSource.query(sqlFoundRegister);
    return { responseDelete, registerFound };
  }

  async deleteRegisterTableByNameById(idRegister: number, nameTable: string): Promise<any> {
    const sqlDelete = `update ${nameTable} set status=0 where id = ${idRegister}`;
    const [, responseDelete] = await this.dataSource.query(sqlDelete);
    const sqlFoundRegister = `select * from ${nameTable} where id = ${idRegister}`;
    const [registerFound] = await this.dataSource.query(sqlFoundRegister);
    return { responseDelete, registerFound };
  }

  async createTable(nameTable: string, campos: CampoData[]): Promise<any> {
    //sql está almacenando el string (texto) de la consulta para crear una tabla dinamica (este es solo el string inicial de toda la consulta)
    
    let sql = `create table ${nameTable} (id   SERIAL PRIMARY KEY , status int2 not null default(1), `;
    const n_campos = campos.length - 1;
    //se recorre el array campos para ir creando la consulta sql
    campos.map((ca, i) => {
      //condicionamos si la posicion en cada vuelta si es igual a n_campos, si es así no le colocara la ultima coma de cada linea del campo
      if (i == n_campos) {
        let lineCampo = ` ${ca.name_bd}  ${ca.format}(${ca.max_length}) ${ca.unique === 1 ? "unique" : ""} ${ca.required === 1 ? "not null" : ""}  `;
        //en cada vuelta le concatenamos cada lineCampo para que vaya construyendo toda la consulta sql
        sql = sql + lineCampo;
      } else {
        let lineCampo = `${ca.name_bd}  ${ca.format}(${ca.max_length}) ${ca.unique === 1 ? "unique" : ""} ${ca.required === 1 ? "not null" : ""}, `;
        //le concatenamos a sql cada lineCampo para que construye toda la consulta sql
        sql = sql + lineCampo;
      }
    });
    sql = sql + ")";  
    
    return await this.dataSource.query(sql);
  }

  async getAllDataTableByIdForm(form: any): Promise<any[]> {
    const sql = `select * from ${form.table_db}`;
    const allData = await this.dataSource.query(sql);
    if (allData.length === 0) {
      return null;
    }
    return allData;
  }

  async insertDataTable(nameTable: string, data: []): Promise<any> {
    try {
      let sql = `insert into ${nameTable} (`;
      let listValue = "";
      let listkey = "";
      for (let y = 0; y < data.length; y++) {
        const listFields = Object.keys(data[y]);
        const aux = data.length - 1;
        for (let i = 0; i < listFields.length; i++) {
          const field = listFields[i];
          if (y === aux) {
            listkey = listkey + `${field}) values (`;
            break;
          }
          listkey = listkey + `${field},`;
        }
        for (let i = 0; i < listFields.length; i++) {
          const key = listFields[i];
          const valueField = data[y][key];
          if (y === aux) {
            listValue = listValue + `'${valueField}')`;
            break;
          }
          listValue = listValue + `'${valueField}',`;
        }
      }
      sql += listkey + listValue;
      
      await this.dataSource.query(sql);
      return {
        message: "Datos guardados con exito", ok: true, status: 200
      };
    } catch (err) {
      console.log(err);      
      return {
        message: "Hubo un problema, no se pudo agregar el registro", status: 204, error: { message: err.message }, ok: false
      }
    }

  }
}
