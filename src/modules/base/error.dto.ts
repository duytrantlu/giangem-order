import {IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
export class ErrorDto {
  @ApiProperty()
  @IsString()
  statusCode: string;

  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsString()
  timestamp: string;

  @ApiProperty()
  @IsString()
  path: string;
}
