# 🧪 ACID Lab (PostgreSQL + NestJS/TypeORM)

Цей проєкт демонструє принципи **ACID** у PostgreSQL, реалізовані через NestJS + TypeORM.

---

## 📌 Структура завдань

✅ **Рівень 1. Atomic transfer**  
✅ **Рівень 2. Read Committed vs Read Uncommitted**  
✅ **Рівень 3. Serializable + retry logic**

---

## ⚙️ Підготовка

1. Створи базу `acid_lab` у PostgreSQL.
2. У корені створи файл `.env`:
   ```env
   DATABASE_URL=postgresql://postgres:password@localhost:5432/acid_lab
   ```
   (підстав свої дані для доступу)
3. Встанови залежності:
   ```bash
   npm install
   ```
4. Запусти NestJS:
   ```bash
   npm run start:dev
   ```

---

## ▶️ Рівень 1 – Atomic Transfer (Транзакція + Consistency)

### 📌 Завдання
- Таблиці:  
  **accounts(id UUID, balance NUMERIC)**  
  **movements(id UUID, from_id UUID, to_id UUID, amount NUMERIC, created_at TIMESTAMP)**

- Реалізовано сервіс `TransferService.transfer(fromId, toId, amount)`:
  - Обидва баланси змінюються **тільки разом**.
  - CHECK (balance >= 0) + FK обмеження забезпечують **консистентність**.

### 🚀 Тестування
Створи рахунки:
```sql
INSERT INTO accounts (id, balance) VALUES (gen_random_uuid(), 100), (gen_random_uuid(), 50);
```

Виконай запит:
```http
POST /transfer
Content-Type: application/json

{
  "fromId": "<UUID_першого_рахунку>",
  "toId": "<UUID_другого_рахунку>",
  "amount": 30
}
```

✅ **Очікування:**  
- 201 Created  
- JSON з деталями руху коштів  
- Баланси змінені атомарно  
- Якщо спробувати зняти більше, ніж на балансі → 400 і БД не змінена.

---

## ▶️ Рівень 2 – Read Committed vs Read Uncommitted

### 📌 Завдання
- Таблиця: **posts(id UUID, title TEXT, draft BOOLEAN)**  
- Запускаємо паралельно:
  - **writer.js:**  
    ```
    BEGIN;
    UPDATE posts SET title='Temp' WHERE id=$1;
    pg_sleep(5);
    COMMIT;
    ```
  - **reader.js:** 3 рази читає title під час сну writer.

### 🚀 Тестування
1. Створи запис:
```sql
INSERT INTO posts (title) VALUES ('Original Title') RETURNING *;
```
2. Скопіюй `id` поста.
3. Запусти:
```bash
npm run demo:iso -- <ID_поста>
```

✅ **Очікування:**  
- У звичайному READ COMMITTED ти бачиш старе значення до COMMIT.
- У режимі з `LOCK TABLE ... IN SHARE MODE` (емуляція READ UNCOMMITTED) можна побачити змінене значення одразу після коміту.
- Логи з часовими мітками дають зрозуміти, що відбувається.

> 📌 **Чому емулюємо RU?**  
> PostgreSQL не підтримує справжній READ UNCOMMITTED — він поводиться як READ COMMITTED.  
> Тому використовуємо `SET TRANSACTION READ ONLY` + `LOCK TABLE ... IN SHARE MODE`.

---

## ▶️ Рівень 3 – Serializable + Retry Logic

### 📌 Завдання
- Таблиця: **discounts(code TEXT PK, percent INT)**  
- Одночасно 5 клієнтів роблять:
```http
POST /discounts
Content-Type: application/json

{
  "code": "SPRING30",
  "percent": 30
}
```

У сервісі `createWithRetry`:
1. Транзакція з рівнем **SERIALIZABLE**.
2. Якщо `code` існує — повернути.
3. Якщо помилка `40001` (serialization failure) — до 3 повторів:
   - Back‑off: 100 мс → 200 мс → 400 мс.

### 🚀 Тестування
Запусти сервер:
```bash
npm run start:dev
```

У новому терміналі:
```bash
node test_race.js
```

✅ **Очікування:**
- У таблиці лише один запис `SPRING30`:
```sql
SELECT COUNT(*) FROM discounts WHERE code='SPRING30'; -- 1
```
- У логах сервера є:
```
retry #1 after error 40001
```
- У результатах клієнтів усі відповіді успішні:
```
[Response 1] { success: true, data: { code: 'SPRING30', percent: 30 } }
...
```

---

## 📁 Структура проєкту

```
homework12/
├─ src/
│  ├─ accounts/
│  ├─ discounts/
│  ├─ main.ts
├─ scripts/
│  ├─ writer.js
│  ├─ reader.js
│  ├─ demo_iso.sh
├─ test_race.js
├─ package.json
├─ .env
└─ README.md
```

---

