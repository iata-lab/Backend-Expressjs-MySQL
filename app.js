import express from 'express';
import initDbRouter from './routes/initDb.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';

const app = express();
app.use(express.json());

app.use('/init-db', initDbRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
