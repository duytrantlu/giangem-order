import {Inject, Injectable, NestMiddleware, UnauthorizedException} from "@nestjs/common";
import * as express from "express";
import * as httpContext from "express-http-context";
import { Logger } from "winston";
import * as jwt from "jsonwebtoken";
import { IConfig } from "config";
import { CONFIG } from "../config/config.provider";

@Injectable()
export class Authentication implements NestMiddleware {

  constructor(
    @Inject("winston") private readonly logger: Logger,
    @Inject(CONFIG) private readonly config: IConfig,
    ){}

  async use(req: express.Request, res: express.Response, next: (...args: any) => void) {
    const bearsToken = req?.headers?.authorization || this.config.get("MOCK_TOKEN");
    if (!bearsToken) {
      return next(new UnauthorizedException());
    }

    const payload = this.getTokenPayload(bearsToken);
    if (!payload) {
      return next(new UnauthorizedException());
    }
    const {username} = payload;

    if (username) {
      httpContext.set("username", username);
    }

    httpContext.set("user", payload);
    next();
  }

  private getTokenPayload(bearsToken: string): any {

    const [, payload] = bearsToken.split(" ");
    if (!payload) {
      return null;
    }
    const decoded = jwt.verify(payload, this.config.get("WEBTOKEN_SECRET_KEY"));
    try {
      return decoded;
    } catch (err) {
      this.logger.error("Failed to decode bears token payload", {err});
    }
  }
}
