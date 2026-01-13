import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketData {
  title: string;
  price: number | null;
  index: number;
}

export class CardBasket extends Component<ICardBasketData> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.titleElement = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceElement = ensureElement<HTMLElement>('.card__price', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>(
      '.basket__item-delete',
      this.container
    );

    this.deleteButton.addEventListener('click', () => this.onDelete());
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value === null ? 'Бесценно' : `${value} синапсов`;
  }
}