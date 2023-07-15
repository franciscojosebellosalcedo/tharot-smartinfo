import { Injectable } from '@nestjs/common';
//src/tharot/principal/user/infraestructura/servicios/user.service
import { MethodService } from '../../../auth-method/infraestructura/servicios/method.service';
import { McService } from '../../../method-customer/infraestructura/servicios/mc.service';
import { CustomersCaseUse } from '../../aplicacion/customers.case.use';
import { CustomersService } from '../servicios/customer.service';

@Injectable()
export class CustomerSeedService {
  private customerCaseUse: CustomersCaseUse
  constructor(
    private readonly customersService: CustomersService,

    private methodsService: MethodService,
    private mcService: McService
  ) {
    this.customerCaseUse = new CustomersCaseUse(this.customersService, this.methodsService, this.mcService);
  }
  async run() {
    const n = await this.customersService.countCustomer();
    if (n == 0) {
      await this.customersService.createCustomer({
        id : 1,
        nit: "",
        name : "",
        address: "",
        phone : "",
        email : "",
        status : 1,
        methods : [1, 2]
      })
      /*const user = await this.customerCaseUse.createCustomer(
        {
          logo:  Buffer.from("hola mund"),
          nit: "83007845055-8",
          name: "Smartinfo",
          address: "Direccion de rrueba",
          phone: "00000000",
          email: "smartinfo@smartinfo.com.co",
          methods: [1],
        }        
      )*/
    }
  }
}

