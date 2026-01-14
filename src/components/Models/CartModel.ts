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
    this.events?.emit("cart:changed");
  }

  removeItem(product: IProduct): void {
    this.items = this.items.filter((item) => item.id !== product.id);
    this.events?.emit("cart:changed");
  }

  clear(): void {
    this.items = [];
    this.events?.emit("cart:changed");
  }

  getTotal(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
