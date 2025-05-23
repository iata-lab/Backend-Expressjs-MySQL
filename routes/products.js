import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// Add a new product
router.post('/', async (req, res) => {
  const { name, price } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  try {
    const [result] = await pool.query('INSERT INTO Products (name, price) VALUES (?, ?)', [name, price]);
    res.status(201).json({ id: result.insertId, name, price });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update a product by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;
  if (!name && price == null) {
    return res.status(400).json({ error: 'At least one of name or price is required' });
  }
  try {
    const fields = [];
    const values = [];
    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (price != null) {
      fields.push('price = ?');
      values.push(price);
    }
    values.push(id);
    const [result] = await pool.query(`UPDATE Products SET ${fields.join(', ')} WHERE id = ?`, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const [products] = await pool.query('SELECT * FROM Products');
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get a product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await pool.query('SELECT * FROM Products WHERE id = ?', [id]);
    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(products[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Get all products with their categories
router.get('/with-categories/all', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.id AS product_id, p.name AS product_name, p.price, 
             c.id AS category_id, c.name AS category_name
      FROM Products p
      LEFT JOIN ProductCategories pc ON p.id = pc.product_id
      LEFT JOIN Categories c ON pc.category_id = c.id
    `);
    // Group by product
    const products = {};
    rows.forEach(row => {
      if (!products[row.product_id]) {
        products[row.product_id] = {
          id: row.product_id,
          name: row.product_name,
          price: row.price,
          categories: []
        };
      }
      if (row.category_id) {
        products[row.product_id].categories.push({
          id: row.category_id,
          name: row.category_name
        });
      }
    });
    res.json(Object.values(products));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch products with categories' });
  }
});

// Associate a product with a category
router.post('/:id/categories', async (req, res) => {
  const { id } = req.params;
  const { category_id } = req.body;
  if (!category_id) {
    return res.status(400).json({ error: 'category_id is required' });
  }
  try {
    await pool.query('INSERT INTO ProductCategories (product_id, category_id) VALUES (?, ?)', [id, category_id]);
    res.status(201).json({ message: 'Product associated with category' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to associate product with category' });
  }
});

export default router;
