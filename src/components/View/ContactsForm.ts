import { ensureElement } from '../../utils/utils';
import { Form } from './Form';

export interface IContactsFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  constructor(
    container: HTMLFormElement,
    onSubmit: () => void,
    onChange: (field: keyof IContactsFormData, value: string) => void
  ) {
    super(container, onSubmit, onChange);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.form);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.form);

    this.emailInput.addEventListener('input', () => {
      this.onChange('email', this.emailInput.value);
    });

    this.phoneInput.addEventListener('input', () => {
      this.onChange('phone', this.phoneInput.value);
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
