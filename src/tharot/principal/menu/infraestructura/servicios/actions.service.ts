import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { actionsRepository } from "../../dominio/repository/actions.repository";
import { ActionsData, UpdateActionData } from "../../dominio/valueobject/actions.value";
import { ActionsModel } from "../modelo/actions.model";

@Injectable()
export class ActionsService implements actionsRepository {
  constructor(@InjectRepository(ActionsModel) private readonly _actions: Repository<ActionsModel>) {
  }

  async getAllActions(): Promise<ActionsData[]> {
    return await this._actions.find();
  }

  async getOneActionByIdActionByIdForm(idForm: number): Promise<ActionsData> {
    return await this._actions.findOne({ where: { id_form:idForm } });
  }

  async getOneActionByIdAction(idAction: number): Promise<ActionsData> {
    return await this._actions.findOne({ where: { id: idAction } });
  }
  
  async deleteAllAction(): Promise<ActionsData[]> {
    const actions = await this._actions.find();
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      await this.deleteAction(action.id);
    }
    return await this._actions.find();
  }

  async editAction(idAction: number, body: UpdateActionData): Promise<any> {
    return await this._actions.update({ id: idAction }, body);
  }

  async enableAction(idAction: number): Promise<ActionsData> {
    await this._actions.update({ id: idAction }, { status: 1 });
    return await this._actions.findOne({ where: { id: idAction } });
  }

  async disableAction(idAction: number): Promise<ActionsData> {
    await this._actions.update({ id: idAction }, { status: 0 });
    return await this._actions.findOne({ where: { id: idAction } });
  }

  async deleteAction(idAction: number): Promise<any> {
    return await this._actions.delete({ id: idAction });
  }

  async createAction(body: ActionsData): Promise<ActionsData> {
    const actionCreated = this._actions.create(body);
    return await this._actions.save(actionCreated);
  }


}