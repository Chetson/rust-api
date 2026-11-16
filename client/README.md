# Rust Server Shop — клиент

SPA магазина внутриигровых товаров для серверов Rust: вход через Steam, выбор
сервера, витрина и карточка товара, баланс и покупки, административная часть
для управления каталогом.

Клиент к API на Laravel, который лежит в корне этого репозитория.

## Стек

- React 18 + Vite
- React Router 6 (вложенные роуты + защита по ролям)
- axios (интерцепторы: Bearer-токен, обработка 401)
- React Bootstrap + Bootstrap 5, SCSS
- Heroicons, query-string

## Структура

```
src/
├── main.jsx                 # точка входа: BrowserRouter + AuthProvider
├── App.jsx                  # роутинг: витрина, авторизация, админка
├── axios.js                 # инстанс axios: baseURL, токен, обработка 401
├── context/AuthProvider.jsx # состояние авторизации, login/logout, баланс
├── hooks/useAuth.js
├── layouts/                 # Public / Auth / Empty / Admin
├── components/
│   ├── common/              # витрина, карточка товара, навигация, статистика
│   ├── admin/               # CRUD: серверы, товары, категории, типы,
│   │                        #       наборы, команды, библиотека предметов
│   ├── Homepage.jsx
│   ├── Items.jsx
│   ├── RequireAuth.jsx
│   └── ...
├── helpers/index.js         # расчёт цены со скидкой и персональной скидкой
└── scss/                    # тема магазина, стили админки
```

## Как устроена авторизация

1. `/auth/login` редиректит на `steamcommunity.com/openid/login`
   с `return_to` на `/auth/signin`.
2. Steam возвращает пользователя обратно с параметрами OpenID.
3. `Signin` отправляет их на `POST /api/steam/signin` и получает токен.
4. Токен кладётся в `localStorage`, `axios`-интерцептор добавляет
   `Authorization: Bearer …` к каждому запросу.
5. При 401 токен стирается и пользователь возвращается на главную.
6. `RequireAuth` проверяет abilities токена: `user` — личный кабинет,
   `admin` — раздел `/admin`.

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

Переменные окружения:

| Переменная | Назначение |
|---|---|
| `VITE_API_BASE_URL` | адрес Laravel API, без слэша в конце |
| `VITE_BASE_URL` | адрес клиента, со слэшем — нужен для возврата после Steam |
| `VITE_STORAGE_URL` | откуда грузить иконки предметов (`/storage`) |

Сборка: `npm run build` → `dist/`.

## Совместимость с API

Клиент писался первым, против первой итерации API. Потом API был переписан
(сервисный слой, контроллеры на одно действие — см. корень репозитория), и два
контракта разошлись:

| Клиент | API в корне |
|---|---|
| `POST /api/steam/signin` | `POST /api/steam/login` |
| `GET /api/products/{serverId}` | `GET /api/products?server_id=…&category=…` |

Остальные вызовы совпадают. Чтобы поднять пару локально, поправьте эти два
места в `src/context/AuthProvider.jsx` и `src/components/Items.jsx` либо
возьмите API из первой версии.

## Что бы я сделал иначе сегодня

- **Токен в `localStorage`** — уязвим к XSS. Перевёл бы на httpOnly-cookie
  с CSRF-защитой.
- **Запросы прямо в компонентах.** Вынес бы в отдельный слой `api/`
  и подключил React Query — сейчас каждый экран сам управляет
  `loading/error` через `useState`.
- **TypeScript.** Типы ответов API описаны только в голове: `product.type.slug`,
  `setData`, `permission` — всё проверяется в рантайме.
- **`alert()`** для результата покупки — заменил бы на тосты.
- **Тесты** на расчёт цены (`helpers/index.js`) — там скидки, проценты
  и округление, то есть самое вероятное место для ошибки в деньгах.

## Лицензия

Apache License 2.0 — см. `LICENSE`.
