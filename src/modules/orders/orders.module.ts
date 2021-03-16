import { Module, HttpModule} from "@nestjs/common";
import { OrderService } from "./orders.service";
import { MongooseModule } from "@nestjs/mongoose";
import { OrderSchema } from "./orders.model";
import { OrderController } from "./orders.controller";
import { PaymentService } from "./payments.service";
import {ConfigModule} from "../config/config.module";
import { ScheduleModule } from "@nestjs/schedule";
import { CronService } from "./cronJob.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule,
    HttpModule,
    MongooseModule.forFeature([{ name: "Order", schema: OrderSchema }], "orders")
  ],
  providers: [OrderService, PaymentService, CronService],
  exports: [OrderService, PaymentService, CronService],
  controllers: [OrderController],
})
export class OrdersModule  {}
