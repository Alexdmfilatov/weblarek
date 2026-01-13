import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IFormState {
  valid: boolean;
  errors: string;
}

export class Form<T> extends Component<IFormState> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;

  constructor(container: HTMLFormElement, protected onSubmit: () => void, protected onChange: (field: keyof T, value: string) => void) {
    super(container);

    this.form = container;
    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
    this.errorsElement = ensureElement<HTMLElement>('.form__errors', this.form);

    this.form.addEventListener('input', (evt) => {
      const target = evt.target as HTMLInputElement;
      if (!target.name) return;
      this.onChange(target.name as keyof T, target.value);
    });

    this.form.addEventListener('submit', (evt) => {
      evt.preventDefault();
      this.onSubmit();
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}