import { Injectable, Inject } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { Logger } from "winston";
import { OrderService } from "./orders.service";

@Injectable()
export class CronService {
  constructor(
    private readonly orderService: OrderService,
    @Inject("winston") private readonly logger: Logger
  ){}

  @Cron("*/10 * * * * *")
  async runEvery10Seconds() {
    const statusDelivery = await this.orderService.deliveryOrder() as any;
    if (statusDelivery.nModified !== 0) {
      this.logger.info(`Delivered success ${ statusDelivery.nModified } order.`);
    }
  }
}