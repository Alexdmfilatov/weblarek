import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';

export interface ICardBasketData extends ICardData {
  index: number;
}

export class CardBasket extends Card<ICardBasketData> {
  protected indexElement: HTMLElement;
  protected deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    this.deleteButton.addEventListener('click', () => this.onDelete());
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
