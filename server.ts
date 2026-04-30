import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());

  // --- MySQL Connection Pool ---
  const mysqlUrl = process.env.MYSQL_URL;
  
  let pool: any;
  
  if (mysqlUrl) {
    console.log('Using MYSQL_URL for database connection');
    pool = mysql.createPool(mysqlUrl);
  } else {
    console.log('Using individual DB environment variables for database connection');
    pool = mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || 'sies',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'Store',
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  // --- Database Initialization ---
  async function initDb() {
    try {
      const connection = await pool.getConnection();
      console.log('Successfully connected to MySQL database');
      
      const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'Store';
      
      // Create Database if not exists (only if not using a prefixed URL which usually points to a DB)
      if (!process.env.MYSQL_URL) {
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
        await connection.query(`USE \`${dbName}\``);
      }

      // 1. Create Users Table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id)
        ) ENGINE=InnoDB
      `);

      // 2. Create Orders Table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS orders (
          id INT NOT NULL AUTO_INCREMENT,
          user_id INT NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'Pending',
          delivery_option VARCHAR(50),
          payment_option VARCHAR(50),
          address TEXT,
          note TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (id),
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
      `);

      // 3. Create Order Items Table
      await connection.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id INT NOT NULL AUTO_INCREMENT,
          order_id INT NOT NULL,
          product_id VARCHAR(50),
          product_name VARCHAR(255) NOT NULL,
          product_image TEXT,
          quantity INT NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          PRIMARY KEY (id),
          FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
        ) ENGINE=InnoDB
      `);

      // 4. Structural Verification (Silent fix for AUTO_INCREMENT and columns if tables existed)
      try {
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        await connection.query('ALTER TABLE users MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT').catch(() => {});
        await connection.query('ALTER TABLE orders MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT').catch(() => {});
        await connection.query('ALTER TABLE order_items MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT').catch(() => {});
        
        // Ensure product_image exists
        const [oiCols]: any = await connection.query('SHOW COLUMNS FROM order_items');
        if (!oiCols.some((c: any) => c.Field === 'product_image')) {
          await connection.query('ALTER TABLE order_items ADD COLUMN product_image TEXT AFTER product_name').catch(() => {});
        }

        // Ensure note exists in orders
        const [oCols]: any = await connection.query('SHOW COLUMNS FROM orders');
        if (!oCols.some((c: any) => c.Field === 'note')) {
          await connection.query('ALTER TABLE orders ADD COLUMN note TEXT AFTER address').catch(() => {});
        }

        // Ensure phone exists in users
        const [uCols]: any = await connection.query('SHOW COLUMNS FROM users');
        if (!uCols.some((c: any) => c.Field === 'phone')) {
          await connection.query('ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER password').catch(() => {});
        }
      } finally {
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');
      }

      console.log('Database and Tables ready');
      connection.release();
    } catch (error) {
      console.error('MySQL Initialization Error:', error);
      console.error('PRO TIP: If using Railway, make sure to set MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE, and MYSQLPORT in the Settings menu.');
    }
  }

  await initDb();

  // --- API Routes ---

  // 0. Google Login Sync Route
  app.post('/api/google-login', async (req: Request, res: Response) => {
    console.log('API: Google Login attempt', req.body.email);
    try {
      const { name, email } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required from Google account' });
      }

      // Check if user exists
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      let user = rows[0];

      if (!user) {
        // Create new user for this Google account
        // Since they use Google, we can set a long random string as password
        const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
        const [result]: any = await pool.query(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name || 'Google User', email, randomPassword]
        );
        
        const [newRows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        user = newRows[0];
      }

      console.log('API: Google Login success for', email, user ? 'User Found' : 'User NOT Found');
      if (!user) {
        return res.status(500).json({ error: 'User sync failed - could not find or create user' });
      }

      res.json({
        message: 'Google login successful!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Google Login Sync Error:', error);
      res.status(500).json({ error: 'Internal server error during Google login' });
    }
  });

  // 0b. Complete Google Profile Sync Route
  app.post('/api/complete-google-profile', async (req: Request, res: Response) => {
    console.log('API: Complete Profile attempt', req.body.email);
    try {
      const { email, name, phone, password } = req.body;

      if (!email || !phone || !password) {
        return res.status(400).json({ error: 'Phone and password are required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Check if user exists
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      let user = rows[0];

      if (user) {
        // Update existing user
        await pool.query(
          'UPDATE users SET name = ?, phone = ?, password = ? WHERE email = ?',
          [name, phone, hashedPassword, email]
        );
      } else {
        // Create new user (shouldn't really happen if UI flow is followed, but good for safety)
        await pool.query(
          'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, phone]
        );
      }

      // Get updated user details
      const [newRows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      user = newRows[0];

      if (!user) {
        console.error('API: Complete Profile - User not found after update', email);
        return res.status(404).json({ error: 'User not found after update' });
      }

      console.log('API: Complete Profile success for', email);
      res.json({
        message: 'Profile completed successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Complete Google Profile Error:', error);
      res.status(500).json({ error: 'Failed to complete Google profile' });
    }
  });

  // 1. Registration Route
  app.post('/api/register', async (req: Request, res: Response) => {
    try {
      const { name, email, password, confirmPassword, phone } = req.body;

      // Basic Validations
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      // Email Format Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Please enter a valid email address' });
      }

      // Password Length Validation
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' });
      }

      // Password Matching Validation
      if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
      }

      // Hash the password for security
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Store in MySQL
      try {
        await pool.query(
          'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
          [name, email, hashedPassword, phone || null]
        );
        res.status(201).json({ message: 'Registration successful! You can now login.' });
      } catch (dbError: any) {
        // Handle duplicate email error
        if (dbError.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'This email is already registered' });
        }
        throw dbError;
      }
    } catch (error) {
      console.error('Registration Error:', error);
      res.status(500).json({ error: 'Internal server error during registration' });
    }
  });

  // 2. Login Route
  app.post('/api/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      // Check if user exists in MySQL
      const [rows]: any = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
      const user = rows[0];

      if (!user) {
        return res.status(401).json({ error: 'Wrong email or user not found' });
      }

      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect password' });
      }

      // Success response (exclude password from response)
      res.json({ 
        message: 'Login successful!', 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email,
          phone: user.phone
        } 
      });
    } catch (error) {
      console.error('Login Error:', error);
      res.status(500).json({ error: 'Internal server error during login' });
    }
  });

  // 2b. Update Profile Info Route
  app.post('/api/update-profile', async (req: Request, res: Response) => {
    try {
      const { userId, name, phone } = req.body;

      if (!userId || !name) {
        return res.status(400).json({ error: 'User ID and name are required' });
      }

      // Update in SQL
      await pool.query(
        'UPDATE users SET name = ?, phone = ? WHERE id = ?',
        [name, phone || null, userId]
      );

      // Get updated user
      const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      const user = rows[0];

      res.json({
        message: 'Profile updated successfully!',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone
        }
      });
    } catch (error) {
      console.error('Update Profile Error:', error);
      res.status(500).json({ error: 'Failed to update profile info' });
    }
  });

  // 3. Change Password Route
  app.post('/api/change-password', async (req: Request, res: Response) => {
    try {
      const { userId, oldPassword, newPassword, confirmNewPassword } = req.body;

      if (!userId || !oldPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ error: 'New passwords do not match' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
      }

      // 1. Find user
      const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
      const user = rows[0];

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // 2. Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Incorrect current password' });
      }

      // 3. Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // 4. Update in SQL
      await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

      res.json({ message: 'Password updated successfully!' });
    } catch (error) {
      console.error('Change Password Error:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  });

  // 4. Place Order Route
  app.post('/api/orders', async (req: Request, res: Response) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const { userId, items, total, deliveryOption, paymentOption, address, note } = req.body;

      if (!userId || !items || items.length === 0) {
        return res.status(400).json({ error: 'Missing order details' });
      }

      // 1. Verify user exists
      const [userRows]: any = await connection.query('SELECT id FROM users WHERE id = ?', [userId]);
      if (userRows.length === 0) {
        await connection.rollback();
        return res.status(401).json({ error: 'User does not exist. Please logout and login again.' });
      }

      // 2. Insert into orders
      const [orderResult]: any = await connection.query(
        'INSERT INTO orders (user_id, total_price, delivery_option, payment_option, address, note) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, total, deliveryOption, paymentOption, address || null, note || null]
      );

      const orderId = orderResult.insertId;

      // 2. Insert items into order_items
      for (const item of items) {
        if (!item.product) continue;
        await connection.query(
          'INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, price) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.product.id || 'unknown', item.product.name || 'Unknown Product', item.product.image || '', item.quantity || 1, item.product.price || 0]
        );
      }

      await connection.commit();
      res.status(201).json({ message: 'Order placed successfully!', orderId: orderId });
    } catch (error: any) {
      await connection.rollback();
      console.error('Place Order Error:', error);
      res.status(500).json({ error: 'Failed to place order', details: error.message });
    } finally {
      connection.release();
    }
  });

  // 5. Get User Orders
  app.get('/api/orders/:userId', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      // Get orders with items (using a join or multiple queries)
      // For simplicity, we'll get orders first then fetch items per order or use a complex join
      const [orders]: any = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);

      const detailedOrders = [];

      for (const order of orders) {
        const [items]: any = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id]);
        detailedOrders.push({
          ...order,
          id: order.id.toString(),
          items: items.map((item: any) => ({
            product: {
              id: item.product_id,
              name: item.product_name,
              image: item.product_image,
              price: item.price
            },
            quantity: item.quantity
          })),
          total: order.total_price,
          date: order.created_at,
          deliveryOption: order.delivery_option,
          paymentOption: order.payment_option,
          address: order.address,
          note: order.note
        });
      }

      res.json(detailedOrders);
    } catch (error) {
      console.error('Fetch Orders Error:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  });

  // 6. Cancel Order
  app.delete('/api/orders/:orderId', async (req: Request, res: Response) => {
    try {
      const { orderId } = req.params;
      await pool.query('DELETE FROM orders WHERE id = ?', [orderId]);
      res.json({ message: 'Order deleted/cancelled successfully' });
    } catch (error) {
      console.error('Cancel Order Error:', error);
      res.status(500).json({ error: 'Failed to cancel order' });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', msg: 'Auth server is running' });
  });

  // --- Vite / Static Files Setup ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
