import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ISuccessData {
  total: number;
}

export class Success extends Component<ISuccessData> {
  protected descriptionElement: HTMLElement;
  protected closeButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected onClose: () => void) {
    super(container);

    this.descriptionElement = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.closeButton.addEventListener('click', () => this.onClose());
  }

  set total(value: number) {
    this.descriptionElement.textContent = `Списано ${value} синапсов`;
  }
}
