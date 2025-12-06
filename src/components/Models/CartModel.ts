import { IProduct } from "../../types";

export class CartModel {

  private items: IProduct[] = [];
// Массив товаров, добавленных в корзину.

// Методы класса:
  getItems(): IProduct[] {
    return this.items;
  }
// Возвращает массив товаров корзины.

  addItem(product: IProduct): void {
    this.items.push(product);
  }
// Добавляет товар в корзину.

  removeItem(product: IProduct): void {
    this.items = this.items.filter(item => item.id !== product.id);
  }
// Удаляет товар из корзины.

  clear(): void {
    this.items = [];
  }
// Полностью очищает корзину.

  getTotal(): number {
    let total = 0;
    for (const item of this.items) {
      if (item.price !== null) {
        total += item.price;
      } }
    return total;
  }
// Возвращает суммарную стоимость всех товаров.

getCount(): number {
    return this.items.length;
}
// Возвращает количество товаров.

hasItem(id: string): boolean {
    if (this.items.find(item => item.id === id)) {
      return true;
    }
    return false;
}
// Проверяет, есть ли товар с таким id.
}