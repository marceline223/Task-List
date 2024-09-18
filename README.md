# Список задач TaskList

## Описание

Небольшое SPA - приложение, позволяющее вести список дел с подзадачами, вносить правки, отменять действия и возвращать их.
Первичные данные получаются из Apollo Mocking, далее записи сохраняются в localStorage.

По кнопке "добавить" создается новое шаблонное задание, после чего может редактироваться.

## Инструкция по разворачиванию:

### Сервер
- перейти в ./server и вызвать
`npm install`
- вызвать
`node server.mjs`
или использовать скрипт в package.json 
`start:server`


### Клиент
- перейти в ./client и вызвать
`npm install`
- вызвать
`vue-cli-service serve`
или использовать скрипт в package.json 
`start:client`
