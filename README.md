# Описание

Проект построен в виде монорепозитория в который входят пакеты `backend`, `frontend` и `types` (общие типы для проекта)
В качестве методологии организации файловой структуры используется [feature-sliced](https://feature-sliced.design/). Основой данной методологии служат три базовых концепции: `слои`, `слайсы` и `сегменты`.
![feature-sliced-scheme](https://feature-sliced.design/assets/images/visual_schema-ca092cc631de8c129dfb48174d0a927a.jpg)

Верхний уровень представляют слои. Любой верхний слой может зависеть от нижележащего, но не наоборот. Например слой `app` может импортировать все остальные слои, т.к. находится на верхнем уровне иерархии. В то же время слой `shared` не может импортировать ничего за рамками слайса.
Более подробно c методологией можно ознакомиться по [ссылке](https://feature-sliced.design/).

## Технологический стэк

- `Node.js` `16.13.2`
- Бэкенд:
  - `fastify` (http-server)
  - `socket.io` (websockets)
  - `typescript`
- Фронтенд:
  - ***
- Пакетный менеджер: `pnpm` `6.11.0`

## Инициализация проекта

В `packages/backend` переименовать `.env.example` в `.env`

## Старт проекта

```sh
# В консоли запустить установку зависимостей и старт проекта
pnpm i
pnpm dev
```

## Создание нового пакета для frontend в packages

> Проверена работа и с [create-vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project) и с [CRA](https://create-react-app.dev/docs/getting-started/).
> `HMR` работает в обоих вариантах.
> Основное условие для стабильной работы использовать для установки [pnpm](https://pnpm.io/).
> Сайт [pnpm](https://pnpm.io/) доступен `VPN-only` из РФ. Для остальных стран свободно.

1. Создать в `packages/frontend` проект. Для этого из корня репозитория запускаем `pnpm create vite packages/frontend --template=react-ts`
2. Выполнить условия тестового задания.

> Для того чтобы найти команды запуска/остановки эмуляции анализа нужно обратить внимание на строки `59, 60, 67` в `packages/backend/src/index.ts`.
> Для работы с websocket на фронтенде нужно установить `socket.io` и использовать согласно [документации](https://socket.io/docs/v4/client-api/)
