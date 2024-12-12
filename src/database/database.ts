import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

const DATABASE_NAME = 'FinanceApp.db';

let database: SQLite.SQLiteDatabase | null = null;

export interface Transaction {
  id?: number;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  note?: string;
}

export interface Category {
  id?: number;
  name: string;
  type: 'income' | 'expense';
  icon: string;
  color?: string;
}

export const initDatabase = async () => {
  try {
    database = await SQLite.openDatabase({ 
      name: DATABASE_NAME, 
      location: 'default'
    });
    
    // Create transactions table
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        amount DECIMAL(10,2) NOT NULL,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        date TEXT NOT NULL,
        note TEXT
      );
    `);

    // Create categories table
    await database.executeSql(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        icon TEXT NOT NULL,
        color TEXT
      );
    `);

    // Insert default categories if none exist
    const [result] = await database.executeSql('SELECT COUNT(*) as count FROM categories');
    if (result.rows.item(0).count === 0) {
      const defaultCategories = [
        { name: 'Salary', type: 'income', icon: 'briefcase', color: '#00B894' },
        { name: 'Freelance', type: 'income', icon: 'laptop', color: '#00CEC9' },
        { name: 'Investments', type: 'income', icon: 'trending-up', color: '#6C5CE7' },
        { name: 'Food', type: 'expense', icon: 'coffee', color: '#FF7675' },
        { name: 'Transport', type: 'expense', icon: 'car', color: '#FAB1A0' },
        { name: 'Shopping', type: 'expense', icon: 'shopping-bag', color: '#FD79A8' },
        { name: 'Bills', type: 'expense', icon: 'file-text', color: '#636E72' },
        { name: 'Entertainment', type: 'expense', icon: 'film', color: '#E84393' },
      ];

      for (const category of defaultCategories) {
        await database.executeSql(
          'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)',
          [category.name, category.type, category.icon, category.color]
        );
      }
    }

    console.log('Database initialized successfully');
    return database;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

const getDatabase = async () => {
  if (database) {
    return database;
  }
  
  return await initDatabase();
};

export const getTransactions = async () => {
  try {
    const db = await getDatabase();
    const [results] = await db.executeSql(`
      SELECT t.*, c.icon, c.color 
      FROM transactions t
      LEFT JOIN categories c ON t.category = c.name
      ORDER BY date DESC
    `);
    return results.rows.raw();
  } catch (error) {
    console.error('Error getting transactions:', error);
    throw error;
  }
};

export const addTransaction = async (transaction: Transaction) => {
  try {
    const db = await getDatabase();
    const [result] = await db.executeSql(
      'INSERT INTO transactions (amount, type, category, date, note) VALUES (?, ?, ?, ?, ?)',
      [transaction.amount, transaction.type, transaction.category, transaction.date, transaction.note || '']
    );
    return result;
  } catch (error) {
    console.error('Error adding transaction:', error);
    throw error;
  }
};

export const deleteTransaction = async (id: number) => {
  try {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM transactions WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

export const getCategories = async (type?: 'income' | 'expense') => {
  try {
    const db = await getDatabase();
    const query = type 
      ? 'SELECT * FROM categories WHERE type = ? ORDER BY name'
      : 'SELECT * FROM categories ORDER BY type, name';
    const [results] = await db.executeSql(query, type ? [type] : []);
    return results.rows.raw();
  } catch (error) {
    console.error('Error getting categories:', error);
    throw error;
  }
};

export const addCategory = async (category: Category) => {
  try {
    const db = await getDatabase();
    const [result] = await db.executeSql(
      'INSERT INTO categories (name, type, icon, color) VALUES (?, ?, ?, ?)',
      [category.name, category.type, category.icon, category.color]
    );
    return result;
  } catch (error) {
    console.error('Error adding category:', error);
    throw error;
  }
};

export const deleteCategory = async (id: number) => {
  try {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM categories WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

export const clearDatabase = async () => {
  try {
    const db = await getDatabase();
    // Drop existing tables
    await db.executeSql('DROP TABLE IF EXISTS transactions');
    await db.executeSql('DROP TABLE IF EXISTS categories');
    
    // Close the database connection
    if (database) {
      await database.close();
      database = null;
    }
    
    // Reinitialize the database with empty tables
    await initDatabase();
    
    console.log('Database cleared successfully');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
};

export const getTransactionsByDateRange = async (startDate: string, endDate: string) => {
  try {
    const db = await getDatabase();
    const [results] = await db.executeSql(`
      SELECT t.*, c.icon, c.color 
      FROM transactions t
      LEFT JOIN categories c ON t.category = c.name
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
    `, [startDate, endDate]);
    return results.rows.raw();
  } catch (error) {
    console.error('Error getting transactions by date range:', error);
    throw error;
  }
};

export const getMonthlyTotals = async (year: number) => {
  try {
    const db = await getDatabase();
    const [results] = await db.executeSql(`
      SELECT 
        strftime('%m', date) as month,
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as expense
      FROM transactions
      WHERE strftime('%Y', date) = ?
      GROUP BY strftime('%m', date)
      ORDER BY month
    `, [year.toString()]);
    return results.rows.raw();
  } catch (error) {
    console.error('Error getting monthly totals:', error);
    throw error;
  }
};

export const getCategoryTotals = async (startDate: string, endDate: string) => {
  try {
    const db = await getDatabase();
    const [results] = await db.executeSql(`
      SELECT 
        t.type,
        t.category,
        c.color,
        SUM(t.amount) as total
      FROM transactions t
      LEFT JOIN categories c ON t.category = c.name
      WHERE date BETWEEN ? AND ?
      GROUP BY t.type, t.category
      ORDER BY t.type, total DESC
    `, [startDate, endDate]);
    return results.rows.raw();
  } catch (error) {
    console.error('Error getting category totals:', error);
    throw error;
  }
};
