# Rust Server Shop — API магазина для игрового сервера

Бэкенд-API магазина внутриигровых товаров для серверов Rust: авторизация через Steam,
каталог товаров и наборов, баланс игрока, пополнение через ЮKassa с вебхуками,
покупка предметов с записью в историю и административная часть для управления каталогом.

Проект писался в 2023 году как боевой бэкенд, а не как учебный: здесь есть
интеграция с платёжным провайдером, обработка колбеков, выдача товаров игрокам
и CRUD-админка на 40+ эндпоинтов.

## Клиент

SPA на React 18 + Vite лежит в `client/`: Steam-логин, витрина, карточка товара,
баланс и покупки, админка каталога. Запуск, структура и известные расхождения
с API — в [client/README.md](client/README.md).

## Стек

- PHP 8.0, Laravel 9, Laravel Sanctum (токены для SPA)
- MySQL
- ЮKassa SDK (`yoomoney/yookassa-sdk-php`): создание платежа, capture, обработка нотификаций
- Steam OpenID — авторизация игроков
- DiDOM — парсинг каталога предметов

## Архитектура

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Admin/Product/       # CRUD товаров: Index / Store / Update / Destroy / Preset
│   │   ├── Auth/                # Steam-логин, логаут
│   │   ├── Store/
│   │   │   ├── Goods/           # витрина: список и карточка товара
│   │   │   └── Purchase/        # покупка и история покупок
│   │   └── Transaction/         # создание платежа, список, callback от ЮKassa
│   ├── Requests/                # валидация вынесена из контроллеров
│   └── Resources/               # сериализация ответов API
├── Services/
│   ├── Auth/                    # Steam-авторизация, выпуск токена
│   ├── Store/Product/           # PurchaseService: расчёт цены и выдача товара
│   ├── Steam/                   # работа с профилем Steam
│   └── Transaction/             # ЮKassa: платёж, capture, обработка нотификаций
├── Enums/                       # статусы транзакций
└── Models/                      # Server, Product, Item, Set, Command, Property, Transaction…
```

Ключевые решения:

- **Контроллеры на одно действие.** `StoreController`, `PurchaseController`,
  `CallbackController` — каждый отвечает за один сценарий и не разрастается
  в «толстый» контроллер на 20 методов.
- **Бизнес-логика в сервисах.** Расчёт цены со скидками и выдача предметов живут
  в `PurchaseService`, работа с платежами — в `Services\Transaction\Service`.
  Контроллер только принимает валидированный запрос и отдаёт ответ.
- **Валидация — в FormRequest**, ответы — в API Resources, статусы — в enum.

## Как устроена оплата

1. Игрок запрашивает пополнение: `POST /api/profile/transaction` с суммой.
2. Создаётся запись `Transaction` со статусом `pending`, в ЮKassa уходит запрос
   на платёж с `metadata` (`transaction_id`, `user_id`) и `capture: false`.
3. Игрок уходит на страницу подтверждения ЮKassa и возвращается на фронтенд.
4. ЮKassa присылает нотификацию на `POST /api/yookassa/transactions/callback`.
   Сервис определяет тип события, при `waiting_for_capture` подтверждает платёж
   (`capturePayment`), при `succeeded` зачисляет средства на баланс
   с учётом бонусных коэффициентов из `payment_sales`.
5. Покупка списывает баланс, создаёт `Property` (купленный предмет) и запись
   в `property_history`; для расходуемых типов предметов `returnable = false`.

## Основные эндпоинты

| Метод | Путь | Назначение |
|---|---|---|
| POST | `/api/steam/login` | вход через Steam, выдача Sanctum-токена |
| GET | `/api/servers` | список серверов |
| GET | `/api/products` | товары сервера |
| GET | `/api/product/{id}` | карточка товара |
| POST | `/api/product/purchase` | покупка товара |
| GET | `/api/product/purchase/history` | история покупок |
| GET | `/api/profile/transactions` | список транзакций |
| POST | `/api/profile/transaction` | создание платежа |
| POST | `/api/yookassa/transactions/callback` | вебхук ЮKassa |
| GET/POST/PUT/DELETE | `/api/admin/*` | управление серверами, товарами, категориями, наборами, командами |

Полный список — в `routes/api.php`. Административные маршруты закрыты
middleware `auth:sanctum`, права проверяются через abilities токена.

## Запуск локально

```bash
composer install
cp .env.example .env
php artisan key:generate

# укажите доступы к MySQL, Steam и ЮKassa в .env
php artisan migrate
php artisan serve
```

Для проверки оплаты нужен публичный HTTPS-адрес (ngrok или аналог) —
ЮKassa должна достучаться до `/api/yookassa/transactions/callback`.

## Что бы я сделал иначе сегодня

Код 2023 года, и за это время я бы переписал несколько мест:

- **Идемпотентность вебхука.** Сейчас повторный колбек с тем же платежом
  зачислит баланс ещё раз. Нужен уникальный индекс по `payment_id` и проверка,
  что транзакция ещё не в статусе `confirmed`, — плюс `DB::transaction()`
  с `lockForUpdate()` на строке пользователя.
- **Проверка источника нотификации.** Стоит добавить allowlist IP ЮKassa
  и rate limiting на вебхук.
- **DTO вместо массивов.** `['error' => ...]` на границе сервисов — это ручной
  контракт, который ломается молча. Заменил бы на исключения и value objects.
- **Тесты.** Сейчас в проекте дефолтные тесты Laravel. Первым делом покрыл бы
  расчёт цены и сценарии колбека — это самое дорогое место по последствиям ошибки.
- **Статический анализ.** `declare(strict_types=1)` и PHPStan уровня 8.
- **Разделение прав.** Abilities в токене — рабочее решение, но политики
  и отдельный guard для админки читались бы явнее.

## Лицензия

Apache License 2.0 — см. `LICENSE`.

Товарные знаки и ассеты игры Rust принадлежат их правообладателям;
изображения предметов в репозитории не публикуются.
