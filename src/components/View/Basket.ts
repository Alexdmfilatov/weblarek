import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IBasketData {
  items: HTMLElement[];
  total: number;
}

export class Basket extends Component<IBasketData> {
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;
  protected orderButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected onOrder: () => void) {
    super(container);

    this.listElement = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalElement = ensureElement<HTMLElement>('.basket__price', this.container);
    this.orderButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.orderButton.addEventListener('click', () => this.onOrder());
  }

  set items(value: HTMLElement[]) {
    if (!value.length) {
      const empty = document.createElement('p');
      empty.textContent = 'Корзина пуста';
      this.listElement.replaceChildren(empty);
      this.orderButton.disabled = true;
      return;
    }

    this.listElement.replaceChildren(...value);
    this.orderButton.disabled = false;
  }

  set total(value: number) {
    this.totalElement.textContent = `${value} синапсов`;
  }
}
