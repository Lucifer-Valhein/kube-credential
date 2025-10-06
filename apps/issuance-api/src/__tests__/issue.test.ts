import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { createServer } from "../server.js";

// Use an in-memory SQLite DB so tests are isolated
process.env.SQLITE_PATH = ":memory:";
process.env.POD_NAME = "worker-test";

describe("POST /issue", () => {
  let app: ReturnType<typeof createServer>;

  beforeEach(() => {
    app = createServer();   // create fresh server for each test
  });

  it("should issue a new credential", async () => {
    const cred = { credentialId: "cred-A", subject: "alice", data: { role: "admin" } };

    const res = await request(app)
      .post("/issue")
      .send(cred)
      .expect(200);

    expect(res.body.message).toContain("credential issued by worker-test");
    expect(res.body.credentialId).toBe("cred-A");
    expect(res.body.worker).toBe("worker-test");
  });

  it("should return already issued if credential exists", async () => {
    const cred = { credentialId: "cred-B", subject: "bob", data: { role: "viewer" } };

    // First issue
    await request(app).post("/issue").send(cred).expect(200);

    // Issue again
    const res2 = await request(app)
      .post("/issue")
      .send(cred)
      .expect(200);

    expect(res2.body.message).toBe("credential already issued");
    expect(res2.body.credentialId).toBe("cred-B");
  });

  it("should fail validation for empty payload", async () => {
    const res = await request(app)
      .post("/issue")
      .send({})
      .expect(400);

    expect(res.body.error).toBeDefined();
  });
});
