import Database from "better-sqlite3";
import type { IssuanceRecord, VerificationLog } from "../types.js";

let db: Database.Database | null = null;

export function verificationRepo() {
  if (!db) {
    db = new Database(process.env.SQLITE_PATH || "./verification.sqlite");

    // table to hold issued creds (synced or shared for demo)
    db.exec(`CREATE TABLE IF NOT EXISTS issued (
      credentialId TEXT PRIMARY KEY,
      issuedAt TEXT NOT NULL,
      worker TEXT NOT NULL
    );`);

    // table to log verifications
    db.exec(`CREATE TABLE IF NOT EXISTS verifications (
      credentialId TEXT NOT NULL,
      verifiedAt TEXT NOT NULL,
      worker TEXT NOT NULL
    );`);
  }

  return {
    async getIssued(credentialId: string): Promise<IssuanceRecord | null> {
      const row = db!.prepare("SELECT * FROM issued WHERE credentialId = ?").get(credentialId);
      return (row as IssuanceRecord) || null;
    },
    async logVerification(log: VerificationLog): Promise<void> {
      db!.prepare(
        "INSERT INTO verifications (credentialId, verifiedAt, worker) VALUES (?,?,?)"
      ).run(log.credentialId, log.verifiedAt, log.worker);
    }
  };
}
