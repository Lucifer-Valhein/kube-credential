export type Credential = {
  credentialId: string;
  subject: string;
  data: Record<string, unknown>;
};

export type IssuanceRecord = {
  credentialId: string;
  issuedAt: string;
  worker: string;
};

export type VerificationLog = {
  credentialId: string;
  verifiedAt: string;
  worker: string;
};
