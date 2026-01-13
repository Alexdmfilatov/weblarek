import { ensureElement } from '../../utils/utils';
import { Form } from './Form';
import { TPayment } from '../../types';

export interface IOrderFormData {
  payment: TPayment;
  address: string;
}

export class OrderForm extends Form<IOrderFormData> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: keyof IOrderFormData, value: string) => void
  ) {
    super(container, onSubmit, onChange);

    this.cardButton = ensureElement<HTMLButtonElement>('button[name="card"]', this.form);
    this.cashButton = ensureElement<HTMLButtonElement>('button[name="cash"]', this.form);
    this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.form);

    this.cardButton.addEventListener('click', () => {
      this.payment = 'card';
      this.onChange('payment', 'card');
    });

    this.cashButton.addEventListener('click', () => {
      this.payment = 'cash';
      this.onChange('payment', 'cash');
    });
  }

  set payment(value: TPayment | null) {
    this.cardButton.classList.toggle('button_alt-active', value === 'card');
    this.cashButton.classList.toggle('button_alt-active', value === 'cash');
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}
