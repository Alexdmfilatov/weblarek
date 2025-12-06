import "./scss/styles.scss";

import { BuyerModel } from "./components/base/Models/BuyerModel";
import { CatalogModel } from "./components/base/Models/CatalogModel";
import { CartModel } from "./components/base/Models/CartModel";
import { apiProducts } from "./utils/data";
import { ApiService } from "./components/base/Models/ApiService";
import { Api } from "./components/base/Api";
import { API_URL } from "./utils/constants";

// Инициализация Api и ApiService
const api = new Api(API_URL);
const apiService = new ApiService(api);

const buyerModel = new BuyerModel();
const catalogModel = new CatalogModel();
const cartModel = new CartModel();

console.log("");
// Тестируем CatalogModel
console.log("Сохраняем массив товаров методом setProducts");
catalogModel.setProducts(apiProducts.items);
console.log("Возвращаем массив товаров методом getProducts");
console.log("Массив товаров из каталога:", catalogModel.getProducts());
console.log("Ищем товар по его ID методом getProductById");
catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390");
console.log(
  "Возвращаем товар для подробного отображения методом getProductById",
  catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")
);

console.log("");
// Тестируем BuyerModel
console.log("Сохраняем данные покупателя методом setField");
buyerModel.setField("email", "example@mail.ru");
buyerModel.setField("phone", "+1234567890");
buyerModel.setField("address", "Улица Пушкина, дом Колотушкина");
buyerModel.setField("payment", "card");
console.log("Возвращаем данные покупателя методом getData");
console.log("Данные покупателя:", buyerModel.getData());
console.log("Проверяем валидацию данных покупателя методом validate");
console.log("Ошибки валидации:", buyerModel.validate());
console.log("Очищаем данные покупателя методом clear");
buyerModel.clear();
console.log("Данные покупателя после очистки:", buyerModel.getData());
console.log("Проверяем валидацию данных покупателя методом validate");
console.log("Ошибки валидации:", buyerModel.validate());

console.log("");
// Тестируем CartModel
console.log("Добавляем товары в корзину методом addItem");
cartModel.addItem(
  catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Возвращаем товары из корзины методом getItems");
console.log("Товары в корзине:", cartModel.getItems());
console.log("Добавляем еще один товар в корзину методом addItem");
cartModel.addItem(
  catalogModel.getProductById("412bcf81-7e75-4e70-bdb9-d3c73c9803b7")
);
console.log("Товары в корзине:", cartModel.getItems());
console.log(
  "Общее количество товаров в корзине методом getCount:",
  cartModel.getCount()
);
console.log(
  "Общая стоимость товаров в корзине методом getTotal:",
  cartModel.getTotal()
);
console.log(
  "Проверяем наличие товара в корзине методом hasItem:",
  cartModel.hasItem("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Удаляем товар из корзины методом removeItem");
cartModel.removeItem(
  catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390")
);
console.log("Товары в корзине после удаления:", cartModel.getItems());
console.log("Очищаем корзину методом clear");
cartModel.clear();
console.log("Товары в корзине после очистки:", cartModel.getItems());

const catalogModelApi = new CatalogModel();
console.log("");
// Тестируем ApiService использует новый каталог catalogModelApi для текстирования
console.log("Получаем каталог товаров с сервера методом fetchProducts");

apiService
  .fetchProducts()
  .then((products) => {
    console.log("Товары, полученные с сервера:", products);
    catalogModelApi.setProducts(products);
    console.log("Каталог из catalogModelApi:", catalogModelApi.getProducts());
    console.log(
      "Сохраним первый элемент из каталога методом setSelectedProduct"
    );
    catalogModelApi.setSelectedProduct(catalogModelApi.getProducts()[0]);
    console.log("Выводим выбранный товар методом getSelectedProduct");
    console.log("Выбранный товар:", catalogModelApi.getSelectedProduct());
  })
  .catch((error) => {
    console.error("Ошибка при получении товаров с сервера:", error);
  });
