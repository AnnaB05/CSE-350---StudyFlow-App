import sqlite3 from 'sqlite3';
import {promisify} from 'util';

//database in local file so it's accessible on all machines
const DB_FILE = './studyflow.db';

const db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error('Failed to mount SQLite database pipeline:', err.message);
    } else {
        console.log(`Connected to localized database footprint at: ${DB_FILE}`);
    }
});

//covert standard callback methods to modern async/await style
export const dbRun = promisify(db.run.bind(db));
export const dbGet = promisify(db.get.bind(db));
export const dbAll = promisify(db.all.bind(db));

export async function initializeDatabaseSchema() {
  try {
    //create foundational user relational schema tracking credential matrices
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ SQLite schema verification sequence completed successfully.');
  } catch (error) {
    console.error('CRITICAL: Structural initialization migration crashed:', error);
  }
}

export default db;