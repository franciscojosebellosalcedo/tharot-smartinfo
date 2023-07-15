import { v4 as uuid } from "uuid";
export class SessionData {
  id?: number;
  user_id?: string;
  token: string;
  date_login?: Date;
  date_logout?: Date;
  ip_device: string;
  name_device: string;
  name_country: string;
  city: string;
  region: string;
  status?: number;

  constructor(
    { user_id, token,ip_device,name_device,name_country,city,region }: { user_id?: string, token: string,ip_device:string,name_device:string,name_country:string,city:string,region:string }
  ) {
    this.id = uuid();
    this.user_id = user_id;
    this.token = token;
    this.date_login = new Date();
    this.date_logout = null;
    this.city=city;
    this.name_device=name_device;
    this.ip_device=ip_device;
    this.region=region;
    this.name_country=name_country;
    this.status = 0;
  }

}
export class MaxSessionUserData {
  email: string;
  constructor({ email }: { email: string }) {
    this.email = email;
  }
}
export class VerifyNewSessionData {
  ip_device: string;
  constructor({ ip_device }: { ip_device: string }) {
    this.ip_device = ip_device;
  }
}