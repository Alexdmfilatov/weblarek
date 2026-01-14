import { IProduct } from "../../types";
import { EventEmitter } from "../base/Events";

export class CatalogModel {
  private products: IProduct[] = [];
  private selectedProductId: string | null = null;
  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  setProducts(products: IProduct[]): void {
    this.products = products;
    this.events?.emit("catalog:changed"); // без данных
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((p) => p.id === id);
  }

  setSelectedProductById(id: string): void {
    this.selectedProductId = id;
    this.events?.emit("catalog:select"); // без данных
  }

  getSelectedProduct(): IProduct | null {
    if (!this.selectedProductId) return null;
    return this.getProductById(this.selectedProductId) ?? null;
  }

  clearSelected(): void {
    this.selectedProductId = null;
    this.events?.emit("catalog:select");
  }
}
