import Database from "better-sqlite3";
import type { IssuanceRecord } from "../types.js";

let db: Database.Database | null = null;

export function issuanceRepo() {
  if (!db) {
    // open DB file or create if not exists
    db = new Database(process.env.SQLITE_PATH || "./issuance.sqlite");
    db.exec(`CREATE TABLE IF NOT EXISTS issued (
      credentialId TEXT PRIMARY KEY,
      issuedAt TEXT NOT NULL,
      worker TEXT NOT NULL
    );`);
  }

  return {
    async get(credentialId: string): Promise<IssuanceRecord | null> {
      const row = db!.prepare("SELECT * FROM issued WHERE credentialId = ?").get(credentialId);
      return (row as IssuanceRecord) || null;
    },
    async put(record: IssuanceRecord): Promise<void> {
      db!.prepare(
        "INSERT OR IGNORE INTO issued (credentialId, issuedAt, worker) VALUES (?,?,?)"
      ).run(record.credentialId, record.issuedAt, record.worker);
    }
  };
}
