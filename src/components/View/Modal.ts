import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface ModalData {
  content: HTMLElement;
}

export class Modal extends Component<ModalData> {
  protected closeButton: HTMLButtonElement;
  protected contentContainer: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    this.contentContainer = ensureElement<HTMLElement>('.modal__content', this.container);

    this.closeButton.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (evt) => {
      if (evt.target === this.container) {
        this.close();
      }
    });

    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentContainer.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add('modal_active');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    this.contentContainer.replaceChildren();
  }
}