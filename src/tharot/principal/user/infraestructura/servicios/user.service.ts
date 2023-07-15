import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../dominio/repository/user.repositoty';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User as userModel } from '../modelos/user.model';
import { AllInfoCustomerUserData, UserData } from '../../dominio/valueobject/user.value';
import { UpdateUserDto } from '../dtos/user.dto';
import { RolCasoUso } from '../../../rol/aplicacion/rol.casouso';
import { RolService } from '../../../rol/infraestructura/servicios/rol.service';

@Injectable()
export class UserService implements UserRepository {
  private rolCaseUse: RolCasoUso;
  constructor(
    @InjectRepository(userModel) private _user: Repository<userModel>, private rolService: RolService
  ) {
    this.rolCaseUse = new RolCasoUso(this.rolService);
  }

  async getAllUsersAccordingStatus(status: number): Promise<UserData[]> {
    return await this._user.find({where:{status:status}});
  }

  async getAllInfoCustomerByIdentityUser(body: AllInfoCustomerUserData): Promise<UserData | null> {
    return await this._user.findOne({ where: { identity: body.identityUser } });
  }

  async validateChangePassword(user: UserData) {
    if (!user) {
      return {
        message: "Este usuario no existe", ok: false, status: 404, error: { message: "Usuario no registrado en la base de datos" }
      }
    }
    if (user.change_password === 0) {
      return {
        message: "Este usuario no ha terminado la configuración de su cuenta ", ok: true, status: 200
      }
    }
    return {
      message: "Este usuario ya terminó la configuración de su cuenta", ok: false, status: 200
    }
  }

  async getAllUserByIdCustomer(customerId: number): Promise<UserData[]> {
    const listUser = await this._user.find({ where: { customer_id: customerId } });
    return listUser;
  }

  async decrementSessionUserActive(userId: number): Promise<any> {
    const userFound = await this._user.findOne({ where: { uid: userId } });
    if (!userFound) {
      return null;
    }
    if (userFound.session_active === 0) {
      return {
        msg: "Este usuario no tiene sesion por decrementar", ok: false
      };
    }

    const sessionActive = userFound.session_active;
    userFound.session_active = sessionActive - 1;
    const userSavingChange = await this._user.save(userFound);
    return userSavingChange;
  }

  async incrementSessionUserActive(userId: number): Promise<any> {
    const userFound = await this._user.findOne({ where: { uid: userId } });
    if (!userFound) {
      return null;
    }
    const sessionActive = userFound.session_active
    userFound.session_active = sessionActive + 1;
    const userSavingChange = await this._user.save(userFound);
    return userSavingChange;
  }

  async enableUser(identity: string): Promise<UserData> {
    const user = await this._user.findOne({ where: { identity: identity } });
    if (!user) {
      return null;
    }
    user.status = 1;
    return await this._user.save(user);
  }

  async saveChangesUser(user: UserData) {
    await this._user.save(user);
  }

  async changeStatusChangePassword(identity: string, changePass: number) {
    const userFound = await this._user.findOne({ where: { identity: identity } });
    userFound.change_password = changePass;
    const userSaving = await this._user.save(userFound);
    if (!userSaving) {
      return null;
    }
    return userSaving;
  }

  //obtiene todos los usuarios de la base de datos
  async findAllUser(): Promise<UserData[]> {
    const users = await this._user.find();
    if (users.length > 0) {
      return users;
    }
    return null;
  }

  //busca un usuario de la base de datos
  async findUserById(id: number): Promise<userModel> {
    const userDB = await this._user.findOne({ where: { uid: id } });
    return userDB;
  }

  async findUserByPhone(phone: string) {
    const userDB = await this._user.findOne({ where: { phone: phone } });
    return userDB;
  }

  async findUser(user_identity: string): Promise<userModel> {
    const userDB = await this._user.findOne({ where: { identity: user_identity } });
    return userDB;
  }
  //crea un usuario y los almacena de la base de datos
  async createUser(data: UserData): Promise<userModel | any> {
    const newUser = this._user.create(data);
    return await this._user.save(newUser);
  }

  async updateUser(uid: number, payload: UpdateUserDto): Promise<UserData | any> {
    const userFound = await this._user.findOne({ where: { uid } });
    if (!userFound) {
      return {
        message: "Usuario no encontrado", ok: false, data: userFound
      }
    }
    const rolUser = await this.rolCaseUse.getRol(userFound.rol_id);
    const data = { ...userFound, ...payload }
    await this._user.save(data);
    return { user: { ...data }, ok: true, msg: "Usuario editado con exito", rol_level: rolUser.datos.level };
  }

  async deleteUser(uid: number): Promise<UserData> {
    const user = await this._user.findOne({ where: { uid } });
    if (!user) {
      return null;
    }
    user.status = 0;
    return await this._user.save(user);
  }

  async countUser(): Promise<any> {
    return await this._user.count();
  }
}
