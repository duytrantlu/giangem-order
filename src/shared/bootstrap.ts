import {INestApplication, ValidationPipe} from "@nestjs/common";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as headers from "helmet";
import * as bodyParser from "body-parser";
import * as httpContext from "express-http-context";
import * as rateLimiter from "express-rate-limit";
import {CONFIG} from "../modules/config/config.provider";

export const initializeApp = (app: INestApplication) => {
  const config = app.get(CONFIG);
  app.enableCors();
  app.use(headers());
  app.use(bodyParser.json());
  app.use(rateLimiter({
    max: 100,
    timeWindow: 60000,
  }));
  app.use(httpContext.middleware);
  app.setGlobalPrefix(config.get("service.baseUrl"));
  app.useGlobalPipes(new ValidationPipe());
};

export const initializeSwagger = (app: INestApplication) => {
  const config = app.get(CONFIG);
  const options = new DocumentBuilder()
    .setTitle("API")
    .setDescription("API Description")
    .setVersion(config.get("service.apiVersion"))
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(config.get("service.docsBaseUrl"), app, document);
};

