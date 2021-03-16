

export interface IOrderStatus {
  status: string;
}

export interface ICheckOutResponse {
  message: string;
}

export interface IParamOrderCancel {
  customer: string;
  id: string;
}

export interface IParamOrderCheckStatus {
  customer: string;
  id: string;
}

export interface IParamOrderPayment {
  customer: string;
  id: string;
}


export interface IParamOrderCreate {
  customer: string;
  productName: string;
  price: number;
  quantity: number;
  totalAmount: number;
}