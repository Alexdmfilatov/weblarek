import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICardPreviewData extends ICardData {
  category: keyof typeof categoryMap;
  image: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;

  constructor(container: HTMLElement, protected onAction: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.descriptionElement = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonElement = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonElement.addEventListener('click', () => this.onAction());
  }

  set category(value: keyof typeof categoryMap) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value]}`;
  }

  set image(value: string) {
    const file = value.startsWith('/') ? value.slice(1) : value;

    const src = value.startsWith('http') ? value : `${CDN_URL}/${file}`;

    this.imageElement.src = src;
    this.imageElement.alt = this.titleElement.textContent ?? '';
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}
