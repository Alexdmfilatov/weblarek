import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CartModel {
  private items: IProduct[] = [];
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(product: IProduct): void {
    this.items.push(product);
    this.events?.emit("cart:changed", { items: this.items });
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.events?.emit("cart:changed", { items: this.items });
  }

  clear(): void {
    this.items = [];
    this.events?.emit("cart:changed", { items: this.items });
  }

  getTotal(): number {
    let total = 0;
    for (const item of this.items) {
      if (item.price !== null) {
        total += item.price;
      }
    }
    return total;
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    if (this.items.find((item) => item.id === id)) {
      return true;
    }
    return false;
  }
}