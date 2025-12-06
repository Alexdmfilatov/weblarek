import { IProduct } from "../../../types";
export class CatalogModel {
  
  private products: IProduct[]= [];
// Хранит все товары, полученные с сервера.
  private selectedProduct: IProduct | null = null;
// Хранит товар, выбранный пользователем для подробного просмотра.

// Методы класса:
  setProducts(products: IProduct[]): void {
    this.products = products;
  }
// Сохраняет массив товаров.

  getProducts(): IProduct[] {
    return this.products;
  }
// Возвращает массив товаров каталога.

  getProductById(id: string): IProduct | undefined {
    return this.products.find(product => product.id === id);
  }
// Ищет товар по id.

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }
// Сохраняет выбранный товар.

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
// Возвращает товар для подробного отображения.

}