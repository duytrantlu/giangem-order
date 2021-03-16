import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsNotEmpty, IsDefined, IsString, IsNumber } from "class-validator";

export class OrderDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  customer: string;

  @ApiProperty()
  productName: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  @IsOptional()
  currency?: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  paymentId?: string;

  @ApiProperty()
  status?: string;
}

export class OrderRequestDto {
  @ApiProperty({
    required: true
  })
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  productName: string;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  quantity: number;
}