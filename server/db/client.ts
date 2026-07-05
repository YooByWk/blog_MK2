import { Database } from "@db/sqlite";

const db = new Database("blog.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content_raw TEXT NOT NULL,
    content_html TEXT NOT NULL,
    thumbnail_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("DB Init Success: posts table ready.");

export { db };