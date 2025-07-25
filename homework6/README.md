# Homework #6 – Advanced Nest-like Framework (DI, Modules, Pipes, Guards, Filters)

Цей проєкт — навчальне завдання: реалізація мінімального "Nest-like" фреймворку з власною системою декораторів, DI-контейнером, модулями, пайпами, гардами та фільтрами помилок.

## 📌 Вимоги
- Node.js (версія 18+)
- npm або yarn
- TypeScript (`ts-node` для запуску)

## 📦 Встановлення
1. Встановіть залежності:
```bash
npm install
```

2. Запустіть сервер:
```bash
npx ts-node src/main.ts
```

Сервер буде доступний за адресою:  
[http://localhost:3000](http://localhost:3000)

## 🧩 Основні можливості
✅ **IoC / DI**
- `@Injectable()` для сервісів
- `Container.resolve()` для отримання залежностей (singleton)

✅ **Модулі**
- `@Module({providers, controllers, imports})`
- `initModule(AppModule)` для побудови графа залежностей

✅ **HTTP Layer**
- `@Controller(prefix?)`
- `@Get`, `@Post` маршрути
- `@Param`, `@Query`, `@Body` параметрові декоратори

✅ **Pipes**
- `@UsePipe()` для обробки параметрів
- `ZodValidationPipe` для валідації даних

✅ **Guards**
- `@UseGuard()` для перевірки доступу перед виконанням хендлера
- `AuthGuard` для прикладу (потрібен заголовок `x-auth: secret123`)

✅ **Filters**
- `@UseFilter()` для перехоплення необроблених помилок
- `AllExceptionsFilter` для прикладу

✅ **Помилки**
- `HttpException` для коректних статусів та повідомлень

## 🚀 Маршрути для перевірки
| Method | Route | Опис |
|--------|-------|------|
| GET | `/api/hello` | Простий приклад |
| GET | `/api/user/:id?active=true` | Параметри та query |
| POST | `/api/echo` | Повертає тіло запиту |
| POST | `/api/create` | Перевіряє наявність `name` через пайп |
| POST | `/api/zod` | Zod-валідація тіла запиту |
| GET | `/api/secure` | Потребує guard (заголовок `x-auth: secret123`) |
| GET | `/api/boom` | Спеціально кидає помилку, обробляється фільтром |

## 🔧 Приклади curl
```bash
curl -X GET http://localhost:3000/api/hello
curl -X GET "http://localhost:3000/api/user/42?active=true"
curl -X POST http://localhost:3000/api/echo -H "Content-Type: application/json" -d '{"foo":"bar"}'
curl -X POST http://localhost:3000/api/create -H "Content-Type: application/json" -d '{"name":"Ivan"}'
curl -X POST http://localhost:3000/api/zod -H "Content-Type: application/json" -d '{"name":"Ivan","age":20}'
curl -X GET http://localhost:3000/api/secure -H "x-auth: secret123"
curl -X GET http://localhost:3000/api/boom
```

## 📂 Структура проєкту
```
src/
  app.controller.ts
  app.module.ts
  main.ts
  container.ts
  decorators/
    body.ts
    controller.ts
    injectable.ts
    module.ts
    params.ts
    routes.ts
    usePipe.ts
    useGuard.ts
    useFilter.ts
  filters/
    exceptionFilter.ts
  guards/
    canActivate.ts
  pipes/
    zodValidationPipe.ts
  hello.service.ts
```
