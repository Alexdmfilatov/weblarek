import { IBuyer } from "../../types";
import { EventEmitter } from "../base/Events";

export class BuyerModel {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  private events?: EventEmitter;

  constructor(events?: EventEmitter) {
    this.events = events;
  }

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
    this.events?.emit("buyer:change", { field, value, data: this.data });
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
    this.events?.emit("buyer:clear");
  }

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!this.data.payment) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.data.email) {
      errors.email = "Укажите email";
    }
    if (!this.data.phone) {
      errors.phone = "Укажите телефон";
    }
    if (!this.data.address) {
      errors.address = "Укажите адрес доставки";
    }

    return errors;
  }
}
