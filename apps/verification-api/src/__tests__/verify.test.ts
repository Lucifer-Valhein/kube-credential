import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import { createServer } from "../server.js";
import Database from "better-sqlite3";
import fs from "fs";

const TEST_DB = "./test-verification.sqlite";
process.env.SQLITE_PATH = TEST_DB;
process.env.POD_NAME = "worker-test-verify";

let db: Database.Database;

beforeEach(() => {
  // Close previous db if open
  if (db) {
    try { db.close(); } catch {}
  }

  // Delete the old file (after closing)
  if (fs.existsSync(TEST_DB)) {
    try { fs.unlinkSync(TEST_DB); } catch {}
  }

  // Create fresh db file
  db = new Database(TEST_DB);

  db.exec(`CREATE TABLE IF NOT EXISTS issued (
      credentialId TEXT PRIMARY KEY,
      issuedAt TEXT NOT NULL,
      worker TEXT NOT NULL
    );`);

  db.exec(`CREATE TABLE IF NOT EXISTS verifications (
      credentialId TEXT NOT NULL,
      verifiedAt TEXT NOT NULL,
      worker TEXT NOT NULL
    );`);
});

afterEach(() => {
  if (db) {
    try { db.close(); } catch {}
  }
  if (fs.existsSync(TEST_DB)) {
    try { fs.unlinkSync(TEST_DB); } catch {}
  }
});

describe("POST /verify", () => {
  it("should return valid=true for an issued credential", async () => {
    const issuedAt = new Date().toISOString();
    db.prepare("INSERT INTO issued (credentialId, issuedAt, worker) VALUES (?,?,?)")
      .run("cred-T1", issuedAt, "worker-seed");

    const app = createServer();

    const res = await request(app)
      .post("/verify")
      .send({ credentialId: "cred-T1", subject: "alice", data: {} })
      .expect(200);

    expect(res.body.valid).toBe(true);
    expect(res.body.credentialId).toBe("cred-T1");
    expect(res.body.issuedBy).toBe("worker-seed");
    expect(res.body.verifiedBy).toBe("worker-test-verify");
  });

  it("should return 404 for non-existent credential", async () => {
    const app = createServer();

    const res = await request(app)
      .post("/verify")
      .send({ credentialId: "non-existent", subject: "bob", data: {} })
      .expect(404);

    expect(res.body.valid).toBe(false);
    expect(res.body.message).toContain("not found");
  });

  it("should fail validation for missing fields", async () => {
    const app = createServer();

    const res = await request(app)
      .post("/verify")
      .send({})
      .expect(400);

    expect(res.body.error).toBeDefined();
  });
});
