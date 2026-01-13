import { Card, ICardData } from './Card';
import { ensureElement } from '../../utils/utils';
import { categoryMap, CDN_URL } from '../../utils/constants';

export interface ICardCatalogData extends ICardData {
  category: keyof typeof categoryMap;
  image: string;
}

export class CardCatalog extends Card<ICardCatalogData> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(container: HTMLElement, protected onSelect: () => void) {
    super(container);

    this.categoryElement = ensureElement<HTMLElement>('.card__category', this.container);
    this.imageElement = ensureElement<HTMLImageElement>('.card__image', this.container);

    this.container.addEventListener('click', () => {
      this.onSelect();
    });
  }

  set category(value: keyof typeof categoryMap) {
    this.categoryElement.textContent = value;
    this.categoryElement.className = `card__category ${categoryMap[value]}`;
  }

  set image(value: string) {
    const file = value.startsWith('/') ? value.slice(1) : value;

    const src = value.startsWith('http')
      ? value
      : `${CDN_URL}/${file}`;

    this.imageElement.src = src;
    this.imageElement.alt = this.titleElement.textContent ?? '';
  }
}
