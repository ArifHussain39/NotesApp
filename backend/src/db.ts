import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:local.db',
});

export const initDB = async () => {
  // Create users table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // Create notes table
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed default user if not exists
  const user = await client.execute({
    sql: 'SELECT * FROM users WHERE email = ?',
    args: ['user@example.com']
  });

  if (user.rows.length === 0) {
    await client.execute({
      sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      args: ['John Doe', 'user@example.com', 'password123']
    });
    console.log('✅ Seeded default user: user@example.com / password123');
  }
};

export default client;
