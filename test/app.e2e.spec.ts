import * as request from "supertest";
import { Test, TestingModule } from "@nestjs/testing";
import { AppModule } from "../src/modules/app/app.module";
import { ValidationPipe } from "@nestjs/common";

describe("AppController (e2e)", () => {
  let app;
  let bearer = 'mock bears token';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it("/ (GET) should be work well", () => {
    return request(app.getHttpServer())
      .get("/hello")
      .set("Authorization", `Bearer ${bearer}`)
      .expect(200)
  });

  afterAll(async () => {
    await app.close();
  });
});
