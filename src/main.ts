import './scss/styles.scss';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { ApiService } from './components/Models/ApiService';
import { CatalogModel } from './components/Models/CatalogModel';
import { CartModel } from './components/Models/CartModel';
import { BuyerModel } from './components/Models/BuyerModel';

import { Header } from './components/View/Header';
import { Gallery } from './components/View/Gallery';
import { CardCatalog } from './components/View/CardCatalog';
import { CardPreview } from './components/View/CardPreview';
import { Basket } from './components/View/Basket';
import { CardBasket } from './components/View/CardBasket';
import { Modal } from './components/View/Modal';
import { OrderForm } from './components/View/OrderForm';
import { ContactsForm } from './components/View/ContactsForm';
import { Success } from './components/View/Success';

import { ensureElement } from './utils/utils';
import { API_URL, categoryMap } from './utils/constants';
import { IProduct, TPayment } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

function errorsToString(errors: Record<string, string>) {
  return Object.values(errors).filter(Boolean).join('\n');
}

function isValid(errors: Record<string, string>) {
  return Object.keys(errors).length === 0;
}

function pickErrors<T extends string>(
  errors: Record<string, string>,
  keys: readonly T[]
): Record<T, string> {
  const res = {} as Record<T, string>;
  keys.forEach((k) => {
    if (errors[k]) res[k] = errors[k] as any;
  });
  return res;
}

function cloneTemplate(selector: string) {
  const t = ensureElement<HTMLTemplateElement>(selector);
  return t.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

function renderCatalog(gallery: Gallery) {
  const products = catalogModel.getProducts();

  const cards = products.map((p) => {
    const card = new CardCatalog(cloneTemplate('#card-catalog'), () => {
      events.emit('catalog:item-select', { id: p.id });
    });

    return card.render({
      title: p.title,
      price: p.price,
      image: p.image,
      category: p.category as keyof typeof categoryMap,
    });
  });

  gallery.render({ catalog: cards });
}

function openPreview(modal: Modal, product: IProduct) {
  const preview = new CardPreview(cloneTemplate('#card-preview'), () => {
    events.emit('product:action', { id: product.id });
  });

  modal.content = preview.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category as keyof typeof categoryMap,
    description: product.description,
    inCart: cartModel.hasItem(product.id),
  });

  modal.open();
}

function openBasket(modal: Modal) {
  const basketView = new Basket(cloneTemplate('#basket'), () => {
    events.emit('basket:order');
  });

  const items = cartModel.getItems().map((item, index) => {
    const row = new CardBasket(cloneTemplate('#card-basket'), () => {
      events.emit('basket:item-remove', { id: item.id });
    });

    return row.render({
      title: item.title,
      price: item.price,
      index: index + 1,
    });
  });

  modal.content = basketView.render({
    items,
    total: cartModel.getTotal(),
  });

  modal.open();
}

let orderFormView: OrderForm | null = null;
let contactsFormView: ContactsForm | null = null;

function openOrder(modal: Modal) {
  const orderForm = new OrderForm(
    cloneTemplate('#order') as HTMLFormElement,
    () => events.emit('order:submit'),
    (field, value) => events.emit('order:change', { field, value })
  );

  orderFormView = orderForm;
  contactsFormView = null;

  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['payment', 'address'] as const);

  orderForm.payment = data.payment;
  orderForm.address = data.address;

  modal.content = orderForm.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openContacts(modal: Modal) {
  const contactsForm = new ContactsForm(
    cloneTemplate('#contacts') as HTMLFormElement,
    () => events.emit('contacts:submit'),
    (field, value) => events.emit('contacts:change', { field, value })
  );

  contactsFormView = contactsForm;
  orderFormView = null;

  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['email', 'phone'] as const);

  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  modal.content = contactsForm.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openSuccess(modal: Modal, total: number) {
  const success = new Success(cloneTemplate('#success'), () => {
    events.emit('success:close');
  });

  modal.content = success.render({ total });
  modal.open();
}

window.addEventListener('DOMContentLoaded', async () => {
  const headerContainer = ensureElement<HTMLElement>('.header');
  const galleryContainer = ensureElement<HTMLElement>('.gallery');
  const modalContainer = ensureElement<HTMLElement>('.modal');

  const header = new Header(events, headerContainer);
  const gallery = new Gallery(galleryContainer);
  const modal = new Modal(modalContainer);

  events.on('catalog:changed', () => {
    renderCatalog(gallery);
  });

  events.on('cart:changed', () => {
    header.render({ counter: cartModel.getCount() });
  });

  events.on('basket:open', () => {
    openBasket(modal);
  });

  events.on<{ id: string }>('catalog:item-select', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (!product) return;
    catalogModel.setSelectedProduct(product);
  });

  events.on<{ product: IProduct }>('catalog:select', ({ product }) => {
    openPreview(modal, product);
  });

  events.on<{ id: string }>('product:action', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (!product) return;

    if (cartModel.hasItem(id)) {
      cartModel.removeItem(product);
    } else {
      if (product.price !== null) cartModel.addItem(product);
    }

    modal.close();
  });

  events.on<{ id: string }>('basket:item-remove', ({ id }) => {
    const product = catalogModel.getProductById(id);
    if (!product) return;
    cartModel.removeItem(product);
    openBasket(modal);
  });

  events.on('basket:order', () => {
    openOrder(modal);
  });

  events.on<{ field: 'payment' | 'address'; value: string }>('order:change', ({ field, value }) => {
    if (field === 'payment') buyerModel.setField('payment', value as TPayment);
    else buyerModel.setField('address', value);

    const data = buyerModel.getData();
    if (orderFormView) {
      orderFormView.payment = data.payment;
      orderFormView.address = data.address;
    }

    const allErrors = buyerModel.validate();
    const stepErrors = pickErrors(allErrors, ['payment', 'address'] as const);

    orderFormView?.render({
      valid: isValid(stepErrors),
      errors: errorsToString(stepErrors),
    });
  });

  events.on('order:submit', () => {
    const allErrors = buyerModel.validate();
    const stepErrors = pickErrors(allErrors, ['payment', 'address'] as const);

    if (!isValid(stepErrors)) {
      orderFormView?.render({
        valid: false,
        errors: errorsToString(stepErrors),
      });
      return;
    }

    openContacts(modal);
  });

  events.on<{ field: 'email' | 'phone'; value: string }>('contacts:change', ({ field, value }) => {
    buyerModel.setField(field, value);

    const data = buyerModel.getData();
    if (contactsFormView) {
      contactsFormView.email = data.email;
      contactsFormView.phone = data.phone;
    }

    const allErrors = buyerModel.validate();
    const stepErrors = pickErrors(allErrors, ['email', 'phone'] as const);

    contactsFormView?.render({
      valid: isValid(stepErrors),
      errors: errorsToString(stepErrors),
    });
  });

  events.on('contacts:submit', async () => {
    const data = buyerModel.getData();
    const allErrors = buyerModel.validate();

    const orderErrors = pickErrors(allErrors, ['payment', 'address'] as const);
    const contactsErrors = pickErrors(allErrors, ['email', 'phone'] as const);

    if (!isValid(orderErrors)) {
      openOrder(modal);
      orderFormView?.render({
        valid: false,
        errors: errorsToString(orderErrors),
      });
      return;
    }

    if (!isValid(contactsErrors)) {
      contactsFormView?.render({
        valid: false,
        errors: errorsToString(contactsErrors),
      });
      return;
    }

    const total = cartModel.getTotal();

    const order = {
      ...data,
      total,
      items: cartModel.getItems().map((i) => i.id),
    };

    try {
      await apiService.sendOrder(order as any);
      cartModel.clear();
      buyerModel.clear();
      openSuccess(modal, total);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      contactsFormView?.render({
        valid: false,
        errors: msg,
      });
    }
  });

  events.on('success:close', () => {
    modal.close();
  });

  header.render({ counter: cartModel.getCount() });

  const products = await apiService.fetchProducts();
  catalogModel.setProducts(products);
});
