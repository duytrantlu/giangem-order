import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import * as httpContext from "express-http-context";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiServiceUnavailableResponse,
  ApiInternalServerErrorResponse,
  ApiBadRequestResponse,
} from "@nestjs/swagger";
import { OrderDto, OrderRequestDto } from "./payload/orders.dto";
import { ErrorDto } from "../base/error.dto";
import {OrderService} from "./orders.service";
import {roundNumber} from "./orders.utils";

/**
 * Order Controller
 */
@ApiBearerAuth()
@ApiTags("Orders")
@Controller("")
export class OrderController {
  /**
   * Constructor
   * @param orderService
   */
  constructor(private readonly orderService: OrderService) {}

  @Post("")
  @ApiOperation({
    operationId: "createOrder",
    description: "Create an order",
  })
  @ApiCreatedResponse({
    description: "The record has been successfully created",
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Something error in business",
    type: ErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Service Unavailable",
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error",
    type: ErrorDto,
  })
  async createOrder(
      @Body() orderDto: OrderRequestDto,
    ): Promise<OrderDto> {
    const orderBody = {
      customer: httpContext.get("username"),
      productName: orderDto?.productName?.trim(),
      price: roundNumber(Number(orderDto.price)),
      quantity: roundNumber(Number(orderDto.quantity)),
      totalAmount: roundNumber(Number(orderDto.quantity) * Number(orderDto.price))
    }
    return this.orderService.createOrder(orderBody);
  }

  @Get(":id")
  @ApiOperation({
    operationId: "detailOrderById",
    description: "get detail order by id",
  })
  @ApiOkResponse({
    description: "The record has been successfully received",
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Something error in business",
    type: ErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Service Unavailable",
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error",
    type: ErrorDto,
  })
  async detailOrderById(
      @Param("id") id: string,
    ): Promise<OrderDto> {
      const param = {
        id,
        customer: httpContext.get("username"),
      }
    return this.orderService.detailOrderById(param);
  }

  @Patch("cancel/:id")
  @ApiOperation({
    operationId: "cancelOrder",
    description: "cancel order",
  })
  @ApiOkResponse({
    description: "The record has been successfully updated",
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Something error in business",
    type: ErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Service Unavailable",
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error",
    type: ErrorDto,
  })
  async cancelOrder(
      @Param("id") id: string,
    ): Promise<OrderDto> {
    const param = {
      id,
      customer: httpContext.get("username"),
    }
    return this.orderService.cancelOrder(param);
  }

  @Get("status/:id")
  @ApiOperation({
    operationId: "checkOrderStatus",
    description: "check order status",
  })
  @ApiOkResponse({
    description: "The record has been successfully received",
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Something error in business",
    type: ErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Service Unavailable",
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error",
    type: ErrorDto,
  })
  async checkOrderStatus(
      @Param("id") id: string,
    ): Promise<any> {
    const param = {
      id,
      customer: httpContext.get("username"),
    }
    return this.orderService.checkOrderStatus(param);
  }

  @Get("checkout/:id")
  @ApiOperation({
    operationId: "checkoutOrder",
    description: "checkout order",
  })
  @ApiOkResponse({
    description: "The record has been successfully updated",
    type: OrderDto,
  })
  @ApiUnauthorizedResponse({
    description: "Unauthorized",
    type: ErrorDto,
  })
  @ApiBadRequestResponse({
    description: "Something error in business",
    type: ErrorDto,
  })
  @ApiServiceUnavailableResponse({
    description: "Service Unavailable",
    type: ErrorDto,
  })
  @ApiInternalServerErrorResponse({
    description: "Internal server Error",
    type: ErrorDto,
  })
  async checkoutOrder(
      @Param("id") id: string,
    ): Promise<any> {
    const param = {
      id,
      customer: httpContext.get("username"),
    }
    return this.orderService.checkoutOrder(param);
  }
}