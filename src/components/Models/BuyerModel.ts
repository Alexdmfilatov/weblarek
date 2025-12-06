import  { IBuyer } from "../../types";

export class BuyerModel {
  
  private data: IBuyer = {
  payment: null,
  email: '',
  phone: '',
  address: ''
}

// Методы класса:

  setField<K extends keyof IBuyer>(field: K, value: IBuyer[K]): void {
    this.data[field] = value;
  }
// Сохраняет одно поле без удаления других.

  getData(): IBuyer {
    return this.data;
  }
// Возвращает все данные покупателя.

  clear(): void {
    this.data = {
      payment: null,
      email: '',
      phone: '',
      address: ''
    }
  }
// Очищает все поля.

  validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!this.data.payment) {
      errors.payment = 'Не выбран вид оплаты';
    }
    if (!this.data.email) {
      errors.email = 'Укажите email';
    }
    if (!this.data.phone) {
      errors.phone = 'Укажите телефон';
    } 
    if (!this.data.address) {
      errors.address = 'Укажите адрес доставки';
    }
    return errors;
  }
// Возвращает объект ошибок.
}