import { 
  IProduct, 
  IProductsResponse, 
  IOrderRequest, 
  IOrderResponse,
  IApi 
} from '../../types';

// Слой коммуникации — класс отвечает за работу с сервером
export class ApiService {
  private api: IApi;
  // хранит объект класса Api для использования его методов внутри класса.

  constructor(api: IApi) {
    this.api = api;
  }

  async fetchProducts(): Promise<IProduct[]> {
    // Выполняет GET-запрос на эндпоинт /product/
    const response = await this.api.get<IProductsResponse>('/product/');
    return response.items;
    // и возвращает массив товаров IProduct[].
  }

  async sendOrder(orderData: IOrderRequest): Promise<IOrderResponse> {
    // Принимает объект с данными покупателя и товарами,
    // выполняет POST-запрос на эндпоинт /order/
    return this.api.post<IOrderResponse>('/order/', orderData, 'POST');
    // и возвращает объект, полученный от сервера после успешной отправки заказа.
  }
}
