import { productRepository, pool } from './repositories/product.repo';

async function runDemo() {
  console.log('--- SAVE ---');
  const created = await productRepository.save({ name: 'Apple', price: 10 });
  console.log('Inserted:', created);

  console.log('--- FIND ---');
  const all = await productRepository.find();
  console.log('All products:', all);

  console.log('--- UPDATE ---');
  const updated = await productRepository.update(created.id, { price: 25 });
  console.log('Updated:', updated);

  console.log('--- DELETE ---');
  await productRepository.delete(created.id);
  console.log(`Deleted product with id ${created.id}`);

  console.log('--- FIND ONE AFTER DELETE ---');
  const afterDelete = await productRepository.findOne(created.id);
  console.log('FindOne result:', afterDelete);

  await pool.end();
}

runDemo().catch(console.error);