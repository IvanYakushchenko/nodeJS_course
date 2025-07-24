import type { Pool } from 'pg';
import SQL from 'sql-template-strings';

export class Orm<T extends { id: number }> {
  constructor(private table: string, private pool: Pool) {}

  async find(filters?: Partial<T>): Promise<T[]> {
    let baseQuery = `SELECT * FROM ${this.table}`;
    const conditions: string[] = [];
    const values: any[] = [];

    if (filters) {
      Object.entries(filters).forEach(([key, value], i) => {
        conditions.push(`${key} = $${i + 1}`);
        values.push(value);
      });
    }

    const queryText =
      conditions.length > 0
        ? `${baseQuery} WHERE ${conditions.join(' AND ')}`
        : baseQuery;

    const { rows } = await this.pool.query(queryText, values);
    return rows as T[];
  }

  async findOne(id: T['id']): Promise<T | null> {
    const { rows } = await this.pool.query(
      SQL`SELECT * FROM `.append(this.table).append(SQL` WHERE id = ${id} LIMIT 1`)
    );
    return rows[0] ?? null;
  }

  async save(entity: Omit<T, 'id'>): Promise<T> {
    const keys = Object.keys(entity);
    const values = Object.values(entity);
    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

    const text = `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
    const { rows } = await this.pool.query(text, values);
    return rows[0] as T;
  }

  async update(id: T['id'], patch: Partial<T>): Promise<T> {
    const keys = Object.keys(patch);
    if (keys.length === 0) throw new Error('Nothing to update');

    const setClauses = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(patch);
    values.push(id);

    const text = `UPDATE ${this.table} SET ${setClauses} WHERE id = $${
      keys.length + 1
    } RETURNING *`;
    const { rows } = await this.pool.query(text, values);
    return rows[0] as T;
  }

  async delete(id: T['id']): Promise<void> {
    await this.pool.query(
      SQL`DELETE FROM `.append(this.table).append(SQL` WHERE id = ${id}`)
    );
  }
}