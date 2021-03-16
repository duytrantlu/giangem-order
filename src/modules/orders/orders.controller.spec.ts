import {Test, TestingModule} from '@nestjs/testing';
import {OrderController} from './orders.controller';
import {OrderService} from './orders.service';

describe('Order Controller', () => {
  let controller: OrderController;
  const mockedOrderService = {
    createOrder: jest.fn(),
    detailOrderById: jest.fn(),
    cancelOrder: jest.fn(),
    checkOrderStatus: jest.fn(),
    checkoutOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
      controllers: [OrderController],
    })
      .overrideProvider(OrderService)
      .useValue(mockedOrderService)
      .compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Orders', () => {
    it('[Success-Expected] - Create new order', async (done) => {
      const data = {
        productName: 'Mock productName',
        price: 1,
        quantity: 2,
      }
      mockedOrderService.createOrder.mockImplementation(() => Promise.resolve({
        ...data,
        _id: 'mock mongoId',
        status: 'CREATED'
      }));
      const result = await controller.createOrder(data);
      expect(mockedOrderService.createOrder).toHaveBeenCalled();
      expect(result.price).toBe(data.price);
      done();
    });

    it('[Success-Expected] - Receive an Order', async (done) => {
      const data = {
        productName: 'Mock productName',
        price: 1,
        quantity: 2,
      };
      const mockId = 'mockId';
      mockedOrderService.detailOrderById.mockImplementation(() => Promise.resolve({
        ...data,
        _id: mockId,
        status: 'CREATED'
      }));
      const result = await controller.detailOrderById(mockId);
      expect(mockedOrderService.detailOrderById).toHaveBeenCalled();
      expect(result._id).toBe(mockId);
      done();
    });

    it('[Success-Expected] - Cancel an Order', async (done) => {
      const data = {
        productName: 'Mock productName',
        price: 1,
        quantity: 2,
      };
      const mockId = 'mockId';
      const mockStatus = 'CANCELLED';
      mockedOrderService.cancelOrder.mockImplementation(() => Promise.resolve({
        ...data,
        _id: mockId,
        status: mockStatus
      }));
      const result = await controller.cancelOrder(mockId);
      expect(mockedOrderService.cancelOrder).toHaveBeenCalled();
      expect(result.status).toBe(mockStatus);
      done();
    });

    it('[Success-Expected] - Receive status of Order', async (done) => {
      const mockId = 'mockId';
      const mockStatus = 'CANCELLED';
      mockedOrderService.checkOrderStatus.mockImplementation(() => Promise.resolve({status: mockStatus}));
      const result = await controller.checkOrderStatus(mockId);
      expect(mockedOrderService.checkOrderStatus).toHaveBeenCalled();
      expect(result.status).toBe(mockStatus);
      done();
    });

    it('[Success-Expected] - Checkout an Order', async (done) => {
      const data = {
        productName: 'Mock productName',
        price: 1,
        quantity: 2,
      };
      const mockId = 'mockId';
      const mockMessage = 'Success';
      mockedOrderService.checkoutOrder.mockImplementation(() => Promise.resolve({
        message: mockMessage
      }));
      const result = await controller.checkoutOrder(mockId);
      expect(mockedOrderService.checkoutOrder).toHaveBeenCalled();
      expect(result.message).toBe(mockMessage);
      done();
    });
  })
});
