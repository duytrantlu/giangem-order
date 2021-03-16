import {Test, TestingModule} from '@nestjs/testing';
import {ConfigModule} from '../config/config.module';
import {CronService} from './cronJob.service';
import {OrderService} from './orders.service';
import * as winston from "winston";
import { CONFIG } from "../config/config.provider";
import { WinstonModule } from "../winston/winston.module";

describe('CronJob Service', () => {
  let service: CronService;
  const mockedOrderService = {
    deliveryOrder: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
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
        OrderService,
        CronService,
      ],
    }).overrideProvider(OrderService)
    .useValue(mockedOrderService)
    .compile();

    service = module.get<CronService>(CronService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('runEvery10Seconds', () => {
    it('[Success-Expected] - Call service order for update status', async (done)=> {
      mockedOrderService.deliveryOrder.mockImplementation(() => Promise.resolve({
        nModified: 1
      }));
      await service.runEvery10Seconds();
      expect(mockedOrderService.deliveryOrder).toHaveBeenCalled();
      done();
    })
  })
});
