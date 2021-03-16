import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

/**
 * App Controller
 */
@Controller()
@ApiBearerAuth()
export class AppController {
  @Get("hello")
  @ApiResponse({ status: 200, description: "Request Received" })
  @ApiResponse({ status: 400, description: "Request Failed" })
  getString(): string {
    return "hello world";
  }
}
