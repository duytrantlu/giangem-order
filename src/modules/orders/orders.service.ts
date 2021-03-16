import { IParamOrderCreate, IOrderStatus, ICheckOutResponse } from "./payload/orders.interface";
import * as moment from "moment";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IOrder } from "./orders.model";
import { NotFoundException, BadRequestException, ConflictException } from "@nestjs/common";
import { Message } from "./message";
import { ORDER_STATUS } from "./enum/orders.enum";
import { PaymentService } from "./payments.service";

export class OrderService {
  constructor(
    @InjectModel("Order") private readonly orderModel: Model<IOrder>,
    private readonly paymentService: PaymentService,
  ){}
  async createOrder(orderBody: IParamOrderCreate): Promise<IOrder> {
    this._validateOrder(orderBody);
    const createdOrder = new this.orderModel(orderBody)
    return createdOrder.save();
  }

  private _validateOrder(orderBody: IParamOrderCreate) {

    if (orderBody.price < 0) {
      throw new BadRequestException(Message.mustBeGreaterThan("price", 0));
    }
    if (orderBody.quantity < 0) {
      throw new BadRequestException(Message.mustBeGreaterThan("quantity", 0));
    }
    if (orderBody.totalAmount < 0){
      throw new BadRequestException(Message.cannotCancel("amount", 0));
    }
    if (!orderBody?.productName?.length) {
      throw new BadRequestException(Message.notEmpty("productName"));
    }
  }

  async detailOrderById(param: {id: string, customer: string}): Promise<IOrder> {
    const condition: {[key: string]: any} = {
      _id: param.id,
      customer: param.customer
    }
    return this.orderModel.findOne(condition);
  }

  async cancelOrder(param: {id: string, customer: string}): Promise<IOrder> {
    const condition: {[key: string]: any} = {
      _id: param.id,
      customer: param.customer
    }
    const orderFound = await this.orderModel.findOne(condition);

    if (!orderFound) {
      throw new NotFoundException(Message.notFound(param.id));
    }
    if (orderFound.status === ORDER_STATUS.DELIVERED) {
      throw new BadRequestException(Message.cannotCancel(param.id, orderFound.status));
    }
    orderFound.status = ORDER_STATUS.CANCELLED;
    return orderFound.save();
  }

  async checkOrderStatus(param: {id: string, customer: string}): Promise<IOrderStatus> {
    const condition: {[key: string]: any} = {
      _id: param.id,
      customer: param.customer
    }
    const orderFound = await this.orderModel.findOne(condition);
    if (!orderFound) {
      throw new NotFoundException(Message.notFound(param.id));
    }
    return { status: orderFound.status };
  }

  async checkoutOrder(param: {id: string, customer: string}): Promise<ICheckOutResponse>{
    const condition: {[key: string]: any} = {
      _id: param.id,
      customer: param.customer
    }
    const orderFound = await this.orderModel.findOne(condition);
    if (!orderFound) {
      throw new NotFoundException(Message.notFound(param.id));
    }
    if (orderFound.status !== ORDER_STATUS.CREATED) {
      throw new ConflictException(Message.cannotCheckout(param.id));
    }
    const paymentCheckout = await this.paymentService.checkoutOrder({
        customer: orderFound.customer,
        orderId: orderFound._id,
        currency: orderFound.currency,
        totalAmount: orderFound.totalAmount
      });
    orderFound.paymentId = paymentCheckout._id;
    orderFound.status = paymentCheckout.status === ORDER_STATUS.CONFIRMED ? ORDER_STATUS.CONFIRMED : ORDER_STATUS.CANCELLED;
    await orderFound.save();
    if (paymentCheckout.status !== ORDER_STATUS.CONFIRMED) {
      throw new BadRequestException(Message.rejectPayment(orderFound._id));
    }
    return { message: Message.paymentComplete(orderFound._id) };
  }

  async deliveryOrder() {
    return this.orderModel.updateMany(
      {
        status: ORDER_STATUS.CONFIRMED,
        updatedDate: {
           $lte: moment().toDate()
        }
      },
      {
        $set: { status: ORDER_STATUS.DELIVERED }
      });
    }
}