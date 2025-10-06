import type { Express, Request, Response } from "express";
import { z } from "zod";
import type { Credential, VerificationLog } from "./types.js";
import { verificationRepo } from "./repo/sqlite.js";

const credentialSchema = z.object({
  credentialId: z.string().min(1),
  subject: z.string().min(1),
  data: z.record(z.any()).default({})
});

export function registerRoutes(app: Express) {
  const repo = verificationRepo();
  const worker = process.env.POD_NAME || process.env.HOSTNAME || "worker-unknown";

  app.post("/verify", async (req: Request, res: Response) => {
    const parse = credentialSchema.safeParse(req.body);
    if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

    const { credentialId } = parse.data as Credential;
    const issued = await repo.getIssued(credentialId);

    if (!issued) return res.status(404).json({ valid: false, message: "credential not found" });

    const log: VerificationLog = {
      credentialId,
      verifiedAt: new Date().toISOString(),
      worker
    };
    await repo.logVerification(log);

    return res.json({
      valid: true,
      credentialId,
      issuedAt: issued.issuedAt,
      issuedBy: issued.worker,
      verifiedBy: worker,
      verifiedAt: log.verifiedAt
    });
  });
}
