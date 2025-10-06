import type { Express, Request, Response } from "express";
import { z } from "zod";
import type { Credential, IssuanceRecord } from "./types.js";
import { issuanceRepo } from "./repo/sqlite.js";

const credentialSchema = z.object({
  credentialId: z.string().min(1),
  subject: z.string().min(1),
  data: z.record(z.any()).default({})
});

export function registerRoutes(app: Express) {
  const repo = issuanceRepo();
  const worker = process.env.POD_NAME || process.env.HOSTNAME || "worker-unknown";

  app.post("/issue", async (req: Request, res: Response) => {
    const parse = credentialSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const { credentialId } = parse.data as Credential;

    const existing = await repo.get(credentialId);
    if (existing) {
      return res.json({ message: "credential already issued", ...existing });
    }

    const record: IssuanceRecord = {
      credentialId,
      issuedAt: new Date().toISOString(),
      worker
    };

    try {
      await repo.put(record);
      return res.json({ message: `credential issued by ${worker}`, ...record });
    } catch {
      const after = await repo.get(credentialId);
      if (after) return res.json({ message: "credential already issued", ...after });
      return res.status(500).json({ error: "failed to issue" });
    }
  });
}
