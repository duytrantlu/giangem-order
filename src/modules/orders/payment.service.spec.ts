import {Test, TestingModule} from '@nestjs/testing';
import {ConfigModule} from '../config/config.module';
import { HttpModule} from "@nestjs/common";
import { PaymentService } from './payments.service';
import * as winston from "winston";
import { CONFIG } from "../config/config.provider";
import { WinstonModule } from "../winston/winston.module";

describe('Payment Service', () => {
  let service: PaymentService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
        WinstonModule.forRootAsync({
          imports: [ConfigModule],
          inject: [CONFIG],
          useFactory: () => {
            return {
              level: process.env.NODE_ENV !== 'production' ? 'debug' : 'info',
              format: winston.format.json(),
              defaultMeta: { service: "orders-service" },
              transports: [
                new winston.transports.Console({
                  format: winston.format.simple(),
                }),
              ],
            }
          },
        }),
      ],
      providers: [
        PaymentService,
      ],
    })
    .compile();

    service = module.get<PaymentService>(PaymentService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkoutOrder', () => {
    it('[Error-Expected] - Request checkout failed', async (done) => {
      try {
        const data = {
          customer: "string",
          orderId: "string",
          currency: "string",
          totalAmount: 20
        }
        await service.checkoutOrder(data);
      } catch (error) {
        expect(error.status).toBe(500);
        done();
      }
    })
  })
});
