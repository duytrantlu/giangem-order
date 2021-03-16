import { NestFactory } from "@nestjs/core";
import { AppModule } from "./modules/app/app.module";
import {CONFIG} from "./modules/config/config.provider";
import {initializeApp, initializeSwagger} from "./shared/bootstrap";

(async () => {
  const app = await NestFactory.create(
    AppModule,
    {
      logger: console,
      cors: true
     },
  );
  const config = app.get(CONFIG);
  initializeApp(app)
  initializeSwagger(app)

  await app.listen(config.get("server.port"));
})();
