import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Create Products table
    await pool.query(`CREATE TABLE IF NOT EXISTS Products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      price DECIMAL(10,2) NOT NULL
    )`);

    // Create Categories table
    await pool.query(`CREATE TABLE IF NOT EXISTS Categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    )`);

    // Create ProductCategories table for many-to-many relationship
    await pool.query(`CREATE TABLE IF NOT EXISTS ProductCategories (
      product_id INT,
      category_id INT,
      PRIMARY KEY (product_id, category_id),
      FOREIGN KEY (product_id) REFERENCES Products(id) ON DELETE CASCADE,
      FOREIGN KEY (category_id) REFERENCES Categories(id) ON DELETE CASCADE
    )`);

    res.status(200).json({ message: 'Tables created successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create tables' });
  }
});

export default router;
