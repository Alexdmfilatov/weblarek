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

import { ensureElement, cloneTemplate } from './utils/utils';
import { API_URL, categoryMap } from './utils/constants';
import { TPayment } from './types';

const events = new EventEmitter();

const api = new Api(API_URL);
const apiService = new ApiService(api);

const catalogModel = new CatalogModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

function errorsToString(errors: Record<string, string>) {
  return Object.values(errors).filter(Boolean).join('; ');
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

const headerContainer = ensureElement<HTMLElement>('.header');
const galleryContainer = ensureElement<HTMLElement>('.gallery');
const modalContainer = ensureElement<HTMLElement>('.modal');

const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(modalContainer);

const basketView = new Basket(cloneTemplate('#basket'), () => {
  events.emit('basket:order');
});

const orderFormView = new OrderForm(
  cloneTemplate('#order') as HTMLFormElement,
  () => events.emit('order:submit'),
  (field, value) => events.emit('order:change', { field, value })
);

const contactsFormView = new ContactsForm(
  cloneTemplate('#contacts') as HTMLFormElement,
  () => events.emit('contacts:submit'),
  (field, value) => events.emit('contacts:change', { field, value })
);

const previewView = new CardPreview(cloneTemplate('#card-preview'), () => {
  events.emit('product:action');
});

const successView = new Success(cloneTemplate('#success'), () => {
  events.emit('success:close');
});

function renderCatalog() {
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

function renderBasket() {
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

  basketView.items = items;
  basketView.total = cartModel.getTotal();
}

function openBasket() {
  modal.content = basketView.render({
    items: [],
    total: cartModel.getTotal(),
  });

  renderBasket();
  modal.open();
}

function openPreview() {
  const product = catalogModel.getSelectedProduct();
  if (!product) return;

  const inCart = cartModel.hasItem(product.id);
  const isUnavailable = product.price === null;

  modal.content = previewView.render({
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category as keyof typeof categoryMap,
    description: product.description,
    buttonText: isUnavailable ? 'Недоступно' : inCart ? 'Удалить из корзины' : 'Купить',
    buttonDisabled: isUnavailable,
  });

  modal.open();
}

function openOrder() {
  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['payment', 'address'] as const);

  orderFormView.payment = data.payment;
  orderFormView.address = data.address;

  modal.content = orderFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openContacts() {
  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['email', 'phone'] as const);

  contactsFormView.email = data.email;
  contactsFormView.phone = data.phone;

  modal.content = contactsFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });

  modal.open();
}

function openSuccess(total: number) {
  modal.content = successView.render({ total });
  modal.open();
}

function updateOrderView() {
  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['payment', 'address'] as const);

  orderFormView.payment = data.payment;
  orderFormView.address = data.address;

  orderFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });
}

function updateContactsView() {
  const data = buyerModel.getData();
  const allErrors = buyerModel.validate();
  const stepErrors = pickErrors(allErrors, ['email', 'phone'] as const);

  contactsFormView.email = data.email;
  contactsFormView.phone = data.phone;

  contactsFormView.render({
    valid: isValid(stepErrors),
    errors: errorsToString(stepErrors),
  });
}

events.on('catalog:changed', () => {
  renderCatalog();
});

events.on('cart:changed', () => {
  header.render({ counter: cartModel.getCount() });
  renderBasket();
});

events.on('basket:open', () => {
  openBasket();
});

events.on<{ id: string }>('catalog:item-select', ({ id }) => {
  catalogModel.setSelectedProductById(id);
});

events.on('catalog:select', () => {
  openPreview();
});

events.on('product:action', () => {
  const product = catalogModel.getSelectedProduct();
  if (!product) return;

  if (cartModel.hasItem(product.id)) {
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
});

events.on('basket:order', () => {
  openOrder();
});

events.on<{ field: 'payment' | 'address'; value: string }>('order:change', ({ field, value }) => {
  if (field === 'payment') buyerModel.setField('payment', value as TPayment);
  else buyerModel.setField('address', value);
});

events.on('order:submit', () => {
  openContacts();
});

events.on<{ field: 'email' | 'phone'; value: string }>('contacts:change', ({ field, value }) => {
  buyerModel.setField(field, value);
});

events.on('buyer:change', () => {
  updateOrderView();
  updateContactsView();
});

events.on('contacts:submit', async () => {
  const data = buyerModel.getData();
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
    openSuccess(total);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    contactsFormView.render({
      valid: false,
      errors: msg,
    });
  }
});

events.on('success:close', () => {
  modal.close();
});

header.render({ counter: cartModel.getCount() });

apiService.fetchProducts().then((products) => {
  catalogModel.setProducts(products);
});
