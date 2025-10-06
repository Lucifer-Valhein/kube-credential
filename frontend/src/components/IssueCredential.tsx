import { useState } from "react";
import axios from "axios";

export default function IssueCredential() {
  const [credentialId, setCredentialId] = useState("cred-001");
  const [subject, setSubject] = useState("alice");
  const [role, setRole] = useState("admin");
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState("");

  async function handleIssue() {
    setError("");
    setResponse(null);
    try {
     // replace axios.post('/api-issue/issue', { ... })
const res = await axios.post('http://localhost:8080/issue', {
  credentialId,
  subject,
  data: { role }
});

      setResponse(res.data);
    } catch (e: any) {
      setError(e.response?.data?.message || "Request failed");
    }
  }

  return (
    <div>
      <h2>Issue Credential</h2>
      <input
        value={credentialId}
        onChange={(e) => setCredentialId(e.target.value)}
        placeholder="Credential ID"
      />{" "}
      <input
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Subject"
      />{" "}
      <input
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder="Role"
      />{" "}
      <button onClick={handleIssue}>Issue</button>

      {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}
