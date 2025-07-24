// ✅ використовуємо require для сумісності
const { Pool } = require('pg');
import { Orm } from '../orm/orm';

export interface Product {
  id: number;
  name: string;
  price: number;
}

export const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'homework11',  // заміни на свою БД
  user: 'postgres',    // заміни на свого користувача
  password: 'SQLpassword'     // заміни на свій пароль
});

export const productRepository = new Orm<Product>('products', pool);