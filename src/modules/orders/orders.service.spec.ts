import {Test, TestingModule} from '@nestjs/testing';
import { OrderService } from './orders.service';
import {ConfigModule} from '../config/config.module';
import {DatabaseModule} from '../database/database.module';
import {getModelToken, MongooseModule} from '@nestjs/mongoose';
import { HttpModule} from "@nestjs/common";
import {Model, Types} from 'mongoose';
import { IOrder, OrderSchema } from './orders.model';
import { PaymentService } from './payments.service';
import { ScheduleModule } from '@nestjs/schedule';



describe('Order Service', () => {
  let service: OrderService;
  let orderModel: Model<IOrder>;
  const mockedPaymentService = {
    checkoutOrder: jest.fn(),
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule,
        HttpModule,
        ScheduleModule.forRoot(),
        DatabaseModule,
        MongooseModule.forFeature(
          [{name: 'Order', schema: OrderSchema}],
          'orders',
        ),
      ],
      providers: [
        PaymentService,
        OrderService,
      ],
    }).overrideProvider(PaymentService)
    .useValue(mockedPaymentService)
    .compile();

    service = module.get<OrderService>(OrderService);

    orderModel = module.get(getModelToken('Order'));

    await orderModel.deleteMany({}).exec();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Orders', () => {
    describe('createOrder', () => {
      it('[Success-Expected] - Create new Order successfully', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2
        };
        await service.createOrder(data);
        const order = await (await orderModel.findOne({})).execPopulate();
        expect(order.customer).toBe(data.customer);
        done();
      });

      it('[Error-Expected] - Create new Order failed with empty productName', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: '',
          price: 1,
          quantity: 2,
          totalAmount: 2
        };
        try {
          await service.createOrder(data);  
        } catch (error) {
          expect(error.status).toBe(400);
          done(); 
        }
      });

      it('[Error-Expected] - Create new Order failed with price < 0', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'mockProductName',
          price: -1,
          quantity: 2,
          totalAmount: 2
        };
        try {
          await service.createOrder(data);  
        } catch (error) {
          expect(error.status).toBe(400);
          done(); 
        }
      });

      it('[Error-Expected] - Create new Order failed with quantity < 0', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'mockProductName',
          price: 1,
          quantity: -2,
          totalAmount: 2
        };
        try {
          await service.createOrder(data);  
        } catch (error) {
          expect(error.status).toBe(400);
          done(); 
        }
      });

      it('[Error-Expected] - Create new Order failed with totalAmount < 0', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'mockProductName',
          price: 1,
          quantity: 2,
          totalAmount: -2
        };
        try {
          await service.createOrder(data);  
        } catch (error) {
          expect(error.status).toBe(400);
          done(); 
        }
      });

      it('[Success-Expected] - Receive an Order by id', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        const orderFound = await service.detailOrderById(params);
        expect(orderFound._id.toString()).toBe(order._id.toString());
        done();
      });

      it('[Success-Expected] - Cancel an Order by id', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        const orderFound = await service.cancelOrder(params);
        expect(orderFound._id.toString()).toBe(order._id.toString());
        expect(orderFound.status).toBe('CANCELLED');
        done();
      });

      it('[Error-Expected] - Cancel an Order failed with id wrong', async (done) => {
        const params = {
          id: Types.ObjectId(),
          customer: 'mockCustomer'
        }
        try{
          await service.cancelOrder(params as any);
        } catch(err) {
          expect(err.status).toBe(404);
          done();
        }
      });

      it('[Error-Expected] - Cancel an Order failed with status DELIVERED', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2,
          status: 'DELIVERED'
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        try{
          await service.cancelOrder(params);
        } catch(err) {
          expect(err.status).toBe(400);
          done();
        }
      });

      it('[Success-Expected] - Receive status of Order by id', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2,
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        const orderFound = await service.checkOrderStatus(params);
        expect(orderFound.status).toBe('CREATED');
        done();
      });

      it('[Error-Expected] - Check status of Order not found', async (done) => {
        const params = {
          id: Types.ObjectId(),
          customer: 'mock Customer'
        }
        try {
          await service.checkOrderStatus(params as any);
        } catch(err) {
          expect(err.status).toBe(404);
          done();
        }
      });

      it('[Success-Expected] - Checkout order successfully', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2,
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        mockedPaymentService.checkoutOrder.mockImplementation(() => Promise.resolve({
          paymentId: 'mock payment id',
          status: 'CONFIRMED'
        }))
        const result = await service.checkoutOrder(params);
        expect(result.message).toBeDefined();
        done();
      });

      it('[Error-Expected] - Checkout order is rejected', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2,
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        mockedPaymentService.checkoutOrder.mockImplementation(() => Promise.resolve({
          paymentId: 'mock payment id',
          status: 'CANCELLED'
        }))
        try {
          await service.checkoutOrder(params);
        } catch(err) {
          expect(err.status).toBe(400);
          done();
        }
      });

      it('[Success-Expected] - Delevery Order', async (done) => {
        const data = {
          customer: 'mockUserName',
          productName: 'Mock productName',
          price: 1,
          quantity: 2,
          totalAmount: 2,
        };
        const order = await service.createOrder(data);
        const params = {
          id: order._id,
          customer: order.customer
        }
        mockedPaymentService.checkoutOrder.mockImplementation(() => Promise.resolve({
          paymentId: 'mock payment id',
          status: 'CONFIRMED'
        }))
        await service.checkoutOrder(params);
        const result = await service.deliveryOrder();
        expect(result.nModified).toBeGreaterThan(0);
        done();
      });

    })
  })  
});
