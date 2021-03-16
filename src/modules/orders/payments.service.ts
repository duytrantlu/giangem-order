
import {Inject, Injectable, InternalServerErrorException, HttpService} from "@nestjs/common";
import { Logger } from "winston";
import {IConfig} from "config";
import {CONFIG} from "../config/config.provider";

@Injectable()
export class PaymentService {
  constructor(
    @Inject("winston") private readonly logger: Logger,
    @Inject(CONFIG) private readonly config: IConfig,
    private readonly http: HttpService,
  ) {}

  async checkoutOrder(data: {
    customer: string,
    orderId: string,
    currency: string,
    totalAmount: number
  }) {
    try {
      const result = await this.http.post(`${this.config.get("internal.payment.baseUrl")}/checkout`, data,{
        headers: {
          authorization: `Bearer ${this.config.get("MOCK_TOKEN")}`,
        }
      }).toPromise();
      return result.data;
    } catch (error) {
      this.logger.error("Caught exception", {err: error});
      throw new InternalServerErrorException();
    }
  }
}
